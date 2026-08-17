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

function parseTags(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function readFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    heroDescription: String(formData.get("heroDescription") ?? "").trim(),
    breadcrumbCategoryLabel: String(formData.get("breadcrumbCategoryLabel") ?? "").trim(),
    breadcrumbCategoryHref: String(formData.get("breadcrumbCategoryHref") ?? "").trim(),
    featureTags: parseTags(String(formData.get("featureTags") ?? "")),
    showFeaturesBlock: formData.get("showFeaturesBlock") === "on",
    showProcessSteps: formData.get("showProcessSteps") === "on",
    showMidBanner: formData.get("showMidBanner") === "on",
    aboutText: String(formData.get("aboutText") ?? "").trim(),
    includesText: String(formData.get("includesText") ?? "").trim(),
  };
}

export async function createServicePage(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || fields.title);
  if (!slug || !fields.title || !fields.breadcrumbCategoryLabel || !fields.breadcrumbCategoryHref) return;

  const exists = await prisma.servicePage.findUnique({ where: { slug } });
  if (exists) return;

  await prisma.servicePage.create({
    data: {
      slug,
      title: fields.title,
      heroDescription: fields.heroDescription || undefined,
      breadcrumbCategoryLabel: fields.breadcrumbCategoryLabel,
      breadcrumbCategoryHref: fields.breadcrumbCategoryHref,
      featureTags: fields.featureTags,
      showFeaturesBlock: fields.showFeaturesBlock,
      showProcessSteps: fields.showProcessSteps,
      showMidBanner: fields.showMidBanner,
      aboutText: fields.aboutText || null,
      includesText: fields.includesText || null,
    },
  });

  revalidatePath("/admin/service-pages");
  revalidatePath(`/${slug}`);
}

export async function updateServicePage(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  if (!fields.title || !fields.breadcrumbCategoryLabel || !fields.breadcrumbCategoryHref) return;

  const page = await prisma.servicePage.update({
    where: { id },
    data: {
      title: fields.title,
      heroDescription: fields.heroDescription || undefined,
      breadcrumbCategoryLabel: fields.breadcrumbCategoryLabel,
      breadcrumbCategoryHref: fields.breadcrumbCategoryHref,
      featureTags: fields.featureTags,
      showFeaturesBlock: fields.showFeaturesBlock,
      showProcessSteps: fields.showProcessSteps,
      showMidBanner: fields.showMidBanner,
      aboutText: fields.aboutText || null,
      includesText: fields.includesText || null,
    },
  });

  revalidatePath("/admin/service-pages");
  revalidatePath(`/${page.slug}`);
}

export async function deleteServicePage(id: string) {
  await requireAdmin();
  const page = await prisma.servicePage.delete({ where: { id } });
  revalidatePath("/admin/service-pages");
  revalidatePath(`/${page.slug}`);
}
