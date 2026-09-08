"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseRepeater } from "@/lib/adminForm";
import { serializeLegalSections } from "@/lib/legalData";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function updateLegalPage(page: "privacy" | "terms", formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const sections = parseRepeater(formData, "sections", ["title", "body"]).map((r) => ({
    title: r.title,
    body: r.body,
  }));

  const data = {
    heading: s("heading"),
    effectiveDate: s("effectiveDate"),
    sectionsText: serializeLegalSections(sections),
  };

  await prisma.legalPage.upsert({
    where: { id: page },
    update: data,
    create: { id: page, ...data },
  });

  revalidatePath("/admin/legal");
  revalidatePath(`/${page}`);
}
