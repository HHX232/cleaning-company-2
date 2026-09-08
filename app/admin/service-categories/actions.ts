"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function updateServiceCategory(id: string, formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();
  const href = s("href");

  await prisma.serviceCategoryPage.update({
    where: { id },
    data: {
      label: s("label"),
      title: s("title"),
      eyebrow: s("eyebrow"),
      lead: s("lead"),
      href,
    },
  });

  revalidatePath("/admin/service-categories");
  revalidatePath(href);
}

export async function updateServiceHubShared(formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    sectionTitle: s("sectionTitle"),
    emptyText: s("emptyText"),
    ctaTitle: s("ctaTitle"),
    ctaText: s("ctaText"),
  };

  await prisma.serviceHubShared.upsert({
    where: { id: "service-hub" },
    update: data,
    create: { id: "service-hub", ...data },
  });

  revalidatePath("/admin/service-categories");
  revalidatePath("/uborka-kvartir");
  revalidatePath("/uborka-domov");
  revalidatePath("/uborka-kommercheskih-pomeshhenij");
  revalidatePath("/speczuborka");
  revalidatePath("/mojka-okon");
}
