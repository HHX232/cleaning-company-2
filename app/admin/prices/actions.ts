"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { priceTabs } from "@/lib/content";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

const validTabs = new Set(priceTabs.map((t) => t.id));

function normalizeTab(raw: FormDataEntryValue | null): string {
  const tab = String(raw ?? "");
  return validTabs.has(tab as (typeof priceTabs)[number]["id"]) ? tab : "flats";
}

export async function createPriceRow(formData: FormData) {
  await requireAdmin();
  const tab = normalizeTab(formData.get("tab"));
  const name = String(formData.get("name") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  if (!name || !price) return;

  await prisma.priceRow.create({ data: { tab, name, price, order } });
  revalidatePath("/admin/prices");
  revalidatePath("/");
}

export async function updatePriceRow(id: string, formData: FormData) {
  await requireAdmin();
  const tab = normalizeTab(formData.get("tab"));
  const name = String(formData.get("name") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);
  if (!name || !price) return;

  await prisma.priceRow.update({ where: { id }, data: { tab, name, price, order } });
  revalidatePath("/admin/prices");
  revalidatePath("/");
}

export async function deletePriceRow(id: string) {
  await requireAdmin();
  await prisma.priceRow.delete({ where: { id } });
  revalidatePath("/admin/prices");
  revalidatePath("/");
}
