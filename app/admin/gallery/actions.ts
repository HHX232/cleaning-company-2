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

function parseMeta(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function createGalleryItem(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const meta = parseMeta(String(formData.get("meta") ?? ""));
  const order = Number(formData.get("order") ?? 0);
  if (!title) return;

  await prisma.galleryItem.create({ data: { title, meta, order } });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function updateGalleryItem(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const meta = parseMeta(String(formData.get("meta") ?? ""));
  const order = Number(formData.get("order") ?? 0);
  if (!title) return;

  await prisma.galleryItem.update({ where: { id }, data: { title, meta, order } });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function deleteGalleryItem(id: string) {
  await requireAdmin();
  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
