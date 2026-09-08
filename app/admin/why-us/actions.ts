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

export async function updateWhyUsPage(formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    eyebrow: s("eyebrow"),
    title: s("title"),
    description: s("description"),
    advantages: parseRepeater(formData, "advantages", ["icon", "title", "text"]),
  };

  await prisma.whyUsPage.upsert({
    where: { id: "why-us" },
    update: data,
    create: { id: "why-us", ...data },
  });

  revalidatePath("/admin/why-us");
  revalidatePath("/");
  revalidatePath("/pochemu-vybirayut-nas");
}
