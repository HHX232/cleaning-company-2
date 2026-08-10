"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CalculatorField } from "@/lib/dbEnums";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createOption(formData: FormData) {
  await requireAdmin();

  const field = String(formData.get("field") ?? "") as CalculatorField;
  const key = String(formData.get("key") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const value = Number(formData.get("value") ?? 0);
  const order = Number(formData.get("order") ?? 0);

  if (!field || !key || !label || Number.isNaN(value)) return;

  await prisma.calculatorOption.create({ data: { field, key, label, value, order } });
  revalidatePath("/admin/calculator");
  revalidatePath("/");
}

export async function updateOption(id: string, formData: FormData) {
  await requireAdmin();

  const label = String(formData.get("label") ?? "").trim();
  const value = Number(formData.get("value") ?? 0);
  const order = Number(formData.get("order") ?? 0);

  if (!label || Number.isNaN(value)) return;

  await prisma.calculatorOption.update({ where: { id }, data: { label, value, order } });
  revalidatePath("/admin/calculator");
  revalidatePath("/");
}

export async function deleteOption(id: string) {
  await requireAdmin();
  await prisma.calculatorOption.delete({ where: { id } });
  revalidatePath("/admin/calculator");
  revalidatePath("/");
}
