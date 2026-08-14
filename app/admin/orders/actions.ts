"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { OrderKind } from "@/lib/dbEnums";
import { deriveStatus } from "@/lib/orderStatus";
import { notifyCustomer } from "@/lib/telegramNotify";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createOrder(formData: FormData) {
  await requireAdmin();

  const phone = String(formData.get("phone") ?? "").trim();
  const kind = String(formData.get("kind") ?? "") as OrderKind;
  const title = String(formData.get("title") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "");
  const timeStr = String(formData.get("time") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const serviceDetail = String(formData.get("serviceDetail") ?? "").trim();
  const staff = String(formData.get("staff") ?? "").trim();
  const payment = String(formData.get("payment") ?? "").trim();

  if (!phone || !title || !dateStr) return;

  const date = new Date(`${dateStr}T${timeStr || "00:00"}`);

  await prisma.order.create({
    data: { phone, kind, title, date, address: address || null, price, serviceDetail, staff, payment },
  });

  revalidatePath("/admin/orders");
}

const advanceFields = {
  assign: "assignedAt",
  complete: "completedAt",
  pay: "paidAt",
  cancel: "canceledAt",
} as const;

const advanceStatusText: Record<keyof typeof advanceFields, string> = {
  assign: "Бригада назначена на ваш заказ",
  complete: "Ваш заказ выполнен",
  pay: "Оплата вашего заказа подтверждена",
  cancel: "Ваш заказ отменён",
};

export async function advanceOrderStatus(orderId: string, action: keyof typeof advanceFields) {
  await requireAdmin();

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { [advanceFields[action]]: new Date() },
  });

  revalidatePath("/admin/orders");
  notifyCustomer(order.phone, `📋 <b>${order.title}</b>\n${advanceStatusText[action]}.`);
}

// datetime-local value ("YYYY-MM-DDTHH:mm") → Date, or null when cleared.
function parseDateTimeLocal(raw: FormDataEntryValue | null): Date | null {
  const v = String(raw ?? "").trim();
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Full edit of an order — every field plus the four status timestamps
// (assigned/completed/paid/canceled), which the derived status reads from.
// Clearing a timestamp field moves the order back to the earlier status.
export async function updateOrderFull(orderId: string, formData: FormData) {
  await requireAdmin();

  const phone = String(formData.get("phone") ?? "").trim();
  const kind = String(formData.get("kind") ?? "") as OrderKind;
  const title = String(formData.get("title") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "");
  const timeStr = String(formData.get("time") ?? "");
  const address = String(formData.get("address") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const serviceDetail = String(formData.get("serviceDetail") ?? "").trim();
  const staff = String(formData.get("staff") ?? "").trim();
  const payment = String(formData.get("payment") ?? "").trim();

  if (!phone || !title || !dateStr) return;
  const date = new Date(`${dateStr}T${timeStr || "00:00"}`);
  if (Number.isNaN(date.getTime())) return;

  const before = await prisma.order.findUnique({ where: { id: orderId } });
  if (!before) return;
  const statusBefore = deriveStatus(before);

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      phone,
      kind,
      title,
      date,
      address: address || null,
      price: Number.isNaN(price) ? 0 : price,
      serviceDetail,
      staff,
      payment,
      assignedAt: parseDateTimeLocal(formData.get("assignedAt")),
      completedAt: parseDateTimeLocal(formData.get("completedAt")),
      paidAt: parseDateTimeLocal(formData.get("paidAt")),
      canceledAt: parseDateTimeLocal(formData.get("canceledAt")),
    },
  });

  revalidatePath("/admin/orders");

  const statusAfter = deriveStatus(order);
  if (statusAfter !== statusBefore) {
    notifyCustomer(order.phone, `📋 <b>${order.title}</b>\nСтатус заказа обновлён.`);
  }
}

export async function deleteOrder(orderId: string) {
  await requireAdmin();
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
}
