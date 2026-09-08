"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseRepeater } from "@/lib/adminForm";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function updateGuarantees(formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    eyebrow: s("eyebrow"),
    heading: s("heading"),
    lead: s("lead"),
    items: parseRepeater(formData, "items", ["title", "text"]),
    ctaTitle: s("ctaTitle"),
    ctaText: s("ctaText"),
  };

  await prisma.guaranteesPage.upsert({
    where: { id: "guarantees" },
    update: data,
    create: { id: "guarantees", ...data },
  });

  revalidatePath("/admin/guarantees");
  revalidatePath("/nashi-garantii");
}
