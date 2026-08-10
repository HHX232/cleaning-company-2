"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ServiceBlockSize } from "@/lib/dbEnums";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

function parseItems(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function createServiceBlock(formData: FormData) {
  await requireAdmin();

  const size = String(formData.get("size") ?? "SMALL") as ServiceBlockSize;
  const title = String(formData.get("title") ?? "").trim();
  const columns = Number(formData.get("columns") ?? 1);
  const order = Number(formData.get("order") ?? 0);
  const items = parseItems(String(formData.get("items") ?? ""));

  if (!title || items.length === 0) return;

  await prisma.serviceBlock.create({
    data: { size, title, columns, order, items, slotId: randomUUID() },
  });

  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function updateServiceBlock(id: string, formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const columns = Number(formData.get("columns") ?? 1);
  const order = Number(formData.get("order") ?? 0);
  const items = parseItems(String(formData.get("items") ?? ""));

  if (!title || items.length === 0) return;

  await prisma.serviceBlock.update({ where: { id }, data: { title, columns, order, items } });
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function deleteServiceBlock(id: string) {
  await requireAdmin();
  await prisma.serviceBlock.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/");
}
