"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createPromo(formData: FormData) {
  await requireAdmin();

  const badge = String(formData.get("badge") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  if (!badge || !title || !text) return;

  await prisma.promo.create({ data: { badge, title, text, order } });
  revalidatePath("/admin/promos");
  revalidatePath("/");
}

export async function updatePromo(id: string, formData: FormData) {
  await requireAdmin();

  const badge = String(formData.get("badge") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  if (!badge || !title || !text) return;

  await prisma.promo.update({ where: { id }, data: { badge, title, text, order } });
  revalidatePath("/admin/promos");
  revalidatePath("/");
}

export async function deletePromo(id: string) {
  await requireAdmin();
  await prisma.promo.delete({ where: { id } });
  revalidatePath("/admin/promos");
  revalidatePath("/");
}
