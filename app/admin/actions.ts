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

export async function updateHomeContent(formData: FormData) {
  await requireAdmin();
  const s = (k: string) => String(formData.get(k) ?? "").trim();

  const data = {
    heroEyebrow: s("heroEyebrow"),
    heroTitleMain: s("heroTitleMain"),
    heroTitleHighlight: s("heroTitleHighlight"),
    heroTitleSuffix: s("heroTitleSuffix"),
    heroSubtitle: s("heroSubtitle"),
    heroCtaPrimary: s("heroCtaPrimary"),
    heroCtaSecondary: s("heroCtaSecondary"),
    heroServices: parseRepeaterStrings(formData, "heroServices").map((label) => ({ label })),
    heroStats: parseRepeater(formData, "heroStats", ["value", "label"]),
    reasons: parseRepeater(formData, "reasons", ["tag", "title", "text"]),
    reasonsSectionTitle: s("reasonsSectionTitle"),
    specialistsTitle: s("specialistsTitle"),
    calculatorTitle: s("calculatorTitle"),
    reviewsTitle: s("reviewsTitle"),
    galleryTitle: s("galleryTitle"),
    promotionsTitle: s("promotionsTitle"),
    servicesTitle: s("servicesTitle"),
    pricesTitle: s("pricesTitle"),
    howItWorksTitle: s("howItWorksTitle"),
    howItWorksLead: s("howItWorksLead"),
    howItWorks: parseRepeater(formData, "howItWorks", ["icon", "title", "text"]),
    serviceGuaranteesTitle: s("serviceGuaranteesTitle"),
    serviceGuarantees: parseRepeater(formData, "serviceGuarantees", ["icon", "title", "text"]),
    faqSectionTitle: s("faqSectionTitle"),
    faqItems: parseRepeater(formData, "faqItems", ["question", "answer"]),
    ctaBannerTitle: s("ctaBannerTitle"),
    ctaBannerCtaLabel: s("ctaBannerCtaLabel"),
    ctaBannerParagraphs: parseRepeaterStrings(formData, "ctaBannerParagraphs"),
  };

  await prisma.homeContent.upsert({
    where: { id: "home" },
    update: data,
    create: { id: "home", ...data },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}
