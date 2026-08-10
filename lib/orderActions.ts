"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deriveStatus } from "@/lib/orderStatus";

export async function cancelMyOrder(orderId: string) {
  const session = await auth();
  if (!session?.user.id) {
    return { ok: false, message: "Требуется вход в аккаунт." };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) {
    return { ok: false, message: "Заказ не найден." };
  }

  const status = deriveStatus(order);
  if (status !== "scheduled" && status !== "progress") {
    return { ok: false, message: "Этот заказ уже нельзя отменить." };
  }

  await prisma.order.update({ where: { id: orderId }, data: { canceledAt: new Date() } });
  revalidatePath("/profile");

  return { ok: true, message: "Заказ отменён." };
}
