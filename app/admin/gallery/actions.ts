"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

function parseMeta(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseCategory(raw: string): string {
  return raw === "windows" ? "windows" : "general";
}

export async function createGalleryItem(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const meta = parseMeta(String(formData.get("meta") ?? ""));
  const category = parseCategory(String(formData.get("category") ?? ""));
  const order = Number(formData.get("order") ?? 0);
  if (!title) return;

  await prisma.galleryItem.create({ data: { title, meta, category, order } });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function updateGalleryItem(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const meta = parseMeta(String(formData.get("meta") ?? ""));
  const category = parseCategory(String(formData.get("category") ?? ""));
  const order = Number(formData.get("order") ?? 0);
  if (!title) return;

  await prisma.galleryItem.update({ where: { id }, data: { title, meta, category, order } });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function deleteGalleryItem(id: string) {
  await requireAdmin();
  await prisma.galleryItem.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
