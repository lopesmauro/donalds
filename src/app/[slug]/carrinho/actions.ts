"use server";

import { revalidatePath } from "next/cache";
import { ConsumptionMethod, PaymentMethod } from "@prisma/client";
import { db } from "@/lib/prisma";

interface CheckoutItem {
  id: string;
  quantity: number;
}

interface CreateOrderInput {
  slug: string;
  customerName: string;
  customerPhone: string;
  customerDocument?: string;
  consumptionMethod: ConsumptionMethod;
  paymentMethod: PaymentMethod;
  changeFor?: number | null;
  notes?: string;
  items: CheckoutItem[];
}

const validConsumptionMethods: ConsumptionMethod[] = ["DINE_IN", "TAKEAWAY"];
const validPaymentMethods: PaymentMethod[] = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "PIX",
  "CASH",
];

export const createOrder = async (input: CreateOrderInput) => {
  const fail = (error: string) => ({
    success: false as const,
    error,
  });

  const customerName = input.customerName.trim();
  const customerPhone = input.customerPhone.trim();

  if (!customerName || !customerPhone) {
    return fail("Preencha nome e telefone.");
  }

  if (!validConsumptionMethods.includes(input.consumptionMethod)) {
    return fail("Método de consumo inválido.");
  }

  if (!validPaymentMethods.includes(input.paymentMethod)) {
    return fail("Método de pagamento inválido.");
  }

  const items = input.items.filter((item) => item.quantity > 0);

  if (items.length === 0) {
    return fail("O carrinho está vazio.");
  }

  const restaurant = await db.restaurant.findUnique({
    where: {
      slug: input.slug,
    },
  });

  if (!restaurant) {
    return fail("Restaurante não encontrado.");
  }

  const productIds = Array.from(new Set(items.map((item) => item.id)));
  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
      restaurantId: restaurant.id,
    },
  });

  if (products.length !== productIds.length) {
    return fail("Algum produto do carrinho não está mais disponível para esse restaurante.");
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const orderProducts = items.map((item) => {
    const product = productsById.get(item.id);

    if (!product) {
      return null;
    }

    return {
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    };
  }).filter((item) => item !== null);

  if (orderProducts.length !== items.length) {
    return fail("Algum produto do carrinho não está mais disponível.");
  }

  const total = orderProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = await db.order.create({
    data: {
      total,
      status: "PENDING",
      consumptionMethod: input.consumptionMethod,
      paymentMethod: input.paymentMethod,
      customerName,
      customerPhone,
      customerDocument: input.customerDocument?.trim() || null,
      changeFor: input.paymentMethod === "CASH" ? input.changeFor ?? null : null,
      notes: input.notes?.trim() || null,
      restaurantId: restaurant.id,
      orderProducts: {
        createMany: {
          data: orderProducts,
        },
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");

  return {
    success: true as const,
    orderId: order.id,
  };
};
