import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./prisma";

const SESSION_COOKIE_NAME = "donalds_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  email: string;
  expiresAt: number;
};

const getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is required");
  }

  return secret;
};

const sign = (payload: string) =>
  crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${hash}`;
};

export const verifyPassword = (password: string, passwordHash: string) => {
  const [algorithm, salt, storedHash] = passwordHash.split(":");

  if (algorithm !== "scrypt" || !salt || !storedHash) {
    return false;
  }

  const hash = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(storedHash, "hex");

  return hash.length === stored.length && crypto.timingSafeEqual(hash, stored);
};

export const createSession = async (payload: Omit<SessionPayload, "expiresAt">) => {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const sessionPayload = Buffer.from(
    JSON.stringify({ ...payload, expiresAt }),
  ).toString("base64url");
  const token = `${sessionPayload}.${sign(sessionPayload)}`;
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
};

export const destroySession = async () => {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
};

export const getSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || signature !== sign(payload)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

export const requireAdmin = async () => {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return user;
};

export const requireUser = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  if (!user) {
    redirect("/admin/login");
  }

  return user;
};

export const getUserRestaurantId = (user: Awaited<ReturnType<typeof requireUser>>) => {
  if (user.role === "ADMIN") {
    return null;
  }

  if (!user.restaurantId) {
    redirect("/admin/login");
  }

  return user.restaurantId;
};

export const canAccessRestaurant = (
  user: Awaited<ReturnType<typeof requireUser>>,
  restaurantId: string,
) => user.role === "ADMIN" || user.restaurantId === restaurantId;
