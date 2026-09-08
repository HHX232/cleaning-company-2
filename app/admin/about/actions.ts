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

export async function updateAbout(formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    eyebrow: s("eyebrow"),
    heading: s("heading"),
    lead: s("lead"),
    stats: parseRepeater(formData, "stats", ["value", "label"]),
    missionTitle: s("missionTitle"),
    missionText1: s("missionText1"),
    missionText2: s("missionText2"),
    values: parseRepeater(formData, "values", ["title", "text"]),
    ctaTitle: s("ctaTitle"),
    ctaText: s("ctaText"),
  };

  await prisma.aboutPage.upsert({
    where: { id: "about" },
    update: data,
    create: { id: "about", ...data },
  });

  revalidatePath("/admin/about");
  revalidatePath("/o-kompanii");
}
