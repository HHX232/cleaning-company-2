"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseRepeater, parseRepeaterStrings } from "@/lib/adminForm";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function updateServiceShared(formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    heroCtaLabel: s("heroCtaLabel"),
    processSteps: parseRepeater(formData, "processSteps", ["num", "title", "text"]),
    midBannerStaffName: s("midBannerStaffName"),
    midBannerStaffRoles: parseRepeaterStrings(formData, "midBannerStaffRoles"),
    midBannerTitle: s("midBannerTitle"),
    midBannerParagraphs: parseRepeaterStrings(formData, "midBannerParagraphs"),
    midBannerCtaLabel: s("midBannerCtaLabel"),
    howToOrderTitle: s("howToOrderTitle"),
    howToOrderIntro: s("howToOrderIntro"),
    howToOrderOutroLead: s("howToOrderOutroLead"),
    howToOrderOutroBold: s("howToOrderOutroBold"),
    howToOrderOutroTail: s("howToOrderOutroTail"),
    teamTitle: s("teamTitle"),
    teamSubtitle1: s("teamSubtitle1"),
    teamSubtitle2: s("teamSubtitle2"),
    calculatorTitle: s("calculatorTitle"),
    reviewsTitle: s("reviewsTitle"),
    galleryTitle: s("galleryTitle"),
    serviceFaq: parseRepeater(formData, "serviceFaq", ["question", "answer"]),
    seoText: parseRepeaterStrings(formData, "seoText"),
    consultationEyebrow: s("consultationEyebrow"),
    consultationTitle: s("consultationTitle"),
    consultationSubtitle: s("consultationSubtitle"),
    consultationPerks: parseRepeaterStrings(formData, "consultationPerks"),
    consultationCtaLabel: s("consultationCtaLabel"),
  };

  await prisma.serviceSharedContent.upsert({
    where: { id: "service-shared" },
    update: data,
    create: { id: "service-shared", ...data },
  });

  revalidatePath("/admin/service-shared");
  revalidatePath("/[slug]", "page");
}
