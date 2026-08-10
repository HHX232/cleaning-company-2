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

function clampStars(value: number) {
  return Math.min(5, Math.max(1, Math.round(value)));
}

export async function createReview(formData: FormData) {
  await requireAdmin();

  const stars = clampStars(Number(formData.get("stars") ?? 5));
  const text = String(formData.get("text") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  if (!text || !service) return;

  await prisma.review.create({ data: { stars, text, service, order } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function updateReview(id: string, formData: FormData) {
  await requireAdmin();

  const stars = clampStars(Number(formData.get("stars") ?? 5));
  const text = String(formData.get("text") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  if (!text || !service) return;

  await prisma.review.update({ where: { id }, data: { stars, text, service, order } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
