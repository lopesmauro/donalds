"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  canAccessRestaurant,
  destroySession,
  getUserRestaurantId,
  hashPassword,
  requireAdmin,
  requireUser,
} from "@/lib/auth";
import { db } from "@/lib/prisma";

const getRequiredString = (formData: FormData, field: string) => {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) {
    throw new Error(`Campo obrigatório: ${field}`);
  }

  return value;
};

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const logout = async () => {
  await destroySession();

  redirect("/admin/login");
};

export const createCategory = async (formData: FormData) => {
  const user = await requireUser();

  const name = getRequiredString(formData, "name");
  const scopedRestaurantId = getUserRestaurantId(user);
  const restaurantId = scopedRestaurantId ?? getRequiredString(formData, "restaurantId");
  const restaurant = await db.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurante não encontrado");
  }

  if (!canAccessRestaurant(user, restaurant.id)) {
    throw new Error("Você não tem acesso a esse restaurante");
  }

  await db.menuCategory.create({
    data: {
      name,
      restaurantId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/categorias");
  revalidatePath(`/${restaurant.slug}`);
  revalidatePath(`/${restaurant.slug}/menu`);
  redirect("/admin/categorias?toast=category_created");
};

export const createRestaurant = async (formData: FormData) => {
  await requireAdmin();

  const name = getRequiredString(formData, "name");
  const slug = normalizeSlug(getRequiredString(formData, "slug"));
  const description = getRequiredString(formData, "description");
  const avatarImageUrl = getRequiredString(formData, "avatarImageUrl");
  const coverImageUrl = getRequiredString(formData, "coverImageUrl");

  if (!slug) {
    throw new Error("Slug inválido");
  }

  await db.restaurant.create({
    data: {
      name,
      slug,
      description,
      avatarImageUrl,
      coverImageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/restaurante");
  redirect("/admin/restaurante?toast=restaurant_created");
};

export const createProduct = async (formData: FormData) => {
  const user = await requireUser();

  const name = getRequiredString(formData, "name");
  const description = getRequiredString(formData, "description");
  const imageUrl = getRequiredString(formData, "imageUrl");
  const menuCategoryId = getRequiredString(formData, "menuCategoryId");
  const priceValue = Number(String(formData.get("price") ?? "").replace(",", "."));
  const ingredients = String(formData.get("ingredients") ?? "")
    .split(/\r?\n|,/)
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);

  if (!Number.isFinite(priceValue) || priceValue <= 0) {
    throw new Error("Preço inválido");
  }

  const category = await db.menuCategory.findFirst({
    where: {
      id: menuCategoryId,
    },
    include: {
      restaurant: true,
    },
  });

  if (!category) {
    throw new Error("Categoria não encontrada para esse restaurante");
  }

  if (!canAccessRestaurant(user, category.restaurantId)) {
    throw new Error("Você não tem acesso a esse restaurante");
  }

  await db.product.create({
    data: {
      name,
      description,
      price: priceValue,
      imageUrl,
      ingredients,
      restaurantId: category.restaurantId,
      menuCategoryId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/produtos");
  revalidatePath(`/${category.restaurant.slug}/menu`);
  redirect("/admin/produtos?toast=product_created");
};

export const updateRestaurant = async (formData: FormData) => {
  const user = await requireUser();

  const id = getRequiredString(formData, "id");
  const name = getRequiredString(formData, "name");
  const slug = normalizeSlug(getRequiredString(formData, "slug"));
  const description = getRequiredString(formData, "description");
  const avatarImageUrl = getRequiredString(formData, "avatarImageUrl");
  const coverImageUrl = getRequiredString(formData, "coverImageUrl");

  if (!slug) {
    throw new Error("Slug inválido");
  }

  const currentRestaurant = await db.restaurant.findUnique({
    where: {
      id,
    },
  });

  if (!currentRestaurant) {
    throw new Error("Restaurante não encontrado");
  }

  if (!canAccessRestaurant(user, currentRestaurant.id)) {
    throw new Error("Você não tem acesso a esse restaurante");
  }

  const restaurantWithSlug = await db.restaurant.findUnique({
    where: {
      slug,
    },
  });

  if (restaurantWithSlug && restaurantWithSlug.id !== id) {
    throw new Error("Esse slug já está em uso");
  }

  await db.restaurant.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
      description,
      avatarImageUrl,
      coverImageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/restaurante");
  revalidatePath(`/${currentRestaurant.slug}`);
  revalidatePath(`/${currentRestaurant.slug}/menu`);
  revalidatePath(`/${slug}`);
  revalidatePath(`/${slug}/menu`);
  redirect("/admin/restaurante?toast=restaurant_updated");
};

export const createUser = async (formData: FormData) => {
  await requireAdmin();

  const name = getRequiredString(formData, "name");
  const email = getRequiredString(formData, "email").toLowerCase();
  const password = getRequiredString(formData, "password");
  const role = getRequiredString(formData, "role");
  const restaurantId = String(formData.get("restaurantId") ?? "").trim();

  if (!["ADMIN", "OWNER"].includes(role)) {
    throw new Error("Tipo de usuário inválido");
  }

  if (role === "OWNER" && !restaurantId) {
    throw new Error("Owner precisa estar vinculado a um restaurante");
  }

  await db.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role: role as "ADMIN" | "OWNER",
      restaurantId: role === "OWNER" ? restaurantId : null,
    },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?toast=user_created");
};
