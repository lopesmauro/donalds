"use server";

import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/prisma";

export const login = async (formData: FormData) => {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/admin/login?error=1");
  }

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    redirect("/admin/login?error=1");
  }

  await createSession({
    userId: user.id,
    email: user.email,
  });

  redirect("/admin");
};
