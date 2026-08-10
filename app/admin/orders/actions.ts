"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderKind } from "@/lib/dbEnums";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createOrder(formData: FormData) {
  await requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const kind = String(formData.get("kind") ?? "") as OrderKind;
  const title = String(formData.get("title") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "");
  const timeStr = String(formData.get("time") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const serviceDetail = String(formData.get("serviceDetail") ?? "").trim();
  const staff = String(formData.get("staff") ?? "").trim();
  const payment = String(formData.get("payment") ?? "").trim();

  if (!userId || !title || !dateStr) return;

  const date = new Date(`${dateStr}T${timeStr || "00:00"}`);

  await prisma.order.create({
    data: { userId, kind, title, date, address, price, serviceDetail, staff, payment },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/profile");
}

const advanceFields = {
  assign: "assignedAt",
  complete: "completedAt",
  pay: "paidAt",
  cancel: "canceledAt",
} as const;

export async function advanceOrderStatus(orderId: string, action: keyof typeof advanceFields) {
  await requireAdmin();

  await prisma.order.update({
    where: { id: orderId },
    data: { [advanceFields[action]]: new Date() },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/profile");
}

export async function updateOrderSchedule(orderId: string, formData: FormData) {
  await requireAdmin();

  const dateStr = String(formData.get("date") ?? "");
  const timeStr = String(formData.get("time") ?? "");
  if (!dateStr) return;

  const date = new Date(`${dateStr}T${timeStr || "00:00"}`);
  if (Number.isNaN(date.getTime())) return;

  await prisma.order.update({ where: { id: orderId }, data: { date } });
  revalidatePath("/admin/orders");
  revalidatePath("/profile");
}

export async function deleteOrder(orderId: string) {
  await requireAdmin();
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
  revalidatePath("/profile");
}
