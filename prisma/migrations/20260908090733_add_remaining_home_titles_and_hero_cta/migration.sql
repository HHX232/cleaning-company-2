/*
  Warnings:

  - Added the required column `pricesTitle` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `promotionsTitle` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicesTitle` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heroCtaLabel` to the `ServiceSharedContent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HomeContent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'home',
    "heroEyebrow" TEXT NOT NULL,
    "heroTitleMain" TEXT NOT NULL,
    "heroTitleHighlight" TEXT NOT NULL,
    "heroTitleSuffix" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroCtaPrimary" TEXT NOT NULL,
    "heroCtaSecondary" TEXT NOT NULL,
    "heroServices" JSONB NOT NULL,
    "heroStats" JSONB NOT NULL,
    "reasons" JSONB NOT NULL,
    "reasonsSectionTitle" TEXT NOT NULL,
    "specialistsTitle" TEXT NOT NULL,
    "calculatorTitle" TEXT NOT NULL,
    "reviewsTitle" TEXT NOT NULL,
    "galleryTitle" TEXT NOT NULL,
    "promotionsTitle" TEXT NOT NULL,
    "servicesTitle" TEXT NOT NULL,
    "pricesTitle" TEXT NOT NULL,
    "howItWorksTitle" TEXT NOT NULL,
    "howItWorksLead" TEXT NOT NULL,
    "howItWorks" JSONB NOT NULL,
    "serviceGuaranteesTitle" TEXT NOT NULL,
    "serviceGuarantees" JSONB NOT NULL,
    "faqSectionTitle" TEXT NOT NULL,
    "faqItems" JSONB NOT NULL,
    "ctaBannerTitle" TEXT NOT NULL,
    "ctaBannerCtaLabel" TEXT NOT NULL,
    "ctaBannerParagraphs" JSONB NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_HomeContent" ("calculatorTitle", "ctaBannerCtaLabel", "ctaBannerParagraphs", "ctaBannerTitle", "faqItems", "faqSectionTitle", "galleryTitle", "heroCtaPrimary", "heroCtaSecondary", "heroEyebrow", "heroServices", "heroStats", "heroSubtitle", "heroTitleHighlight", "heroTitleMain", "heroTitleSuffix", "howItWorks", "howItWorksLead", "howItWorksTitle", "id", "reasons", "reasonsSectionTitle", "reviewsTitle", "serviceGuarantees", "serviceGuaranteesTitle", "specialistsTitle", "updatedAt") SELECT "calculatorTitle", "ctaBannerCtaLabel", "ctaBannerParagraphs", "ctaBannerTitle", "faqItems", "faqSectionTitle", "galleryTitle", "heroCtaPrimary", "heroCtaSecondary", "heroEyebrow", "heroServices", "heroStats", "heroSubtitle", "heroTitleHighlight", "heroTitleMain", "heroTitleSuffix", "howItWorks", "howItWorksLead", "howItWorksTitle", "id", "reasons", "reasonsSectionTitle", "reviewsTitle", "serviceGuarantees", "serviceGuaranteesTitle", "specialistsTitle", "updatedAt" FROM "HomeContent";
DROP TABLE "HomeContent";
ALTER TABLE "new_HomeContent" RENAME TO "HomeContent";
CREATE TABLE "new_ServiceSharedContent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'service-shared',
    "heroCtaLabel" TEXT NOT NULL,
    "processSteps" JSONB NOT NULL,
    "midBannerStaffName" TEXT NOT NULL,
    "midBannerStaffRoles" JSONB NOT NULL,
    "midBannerTitle" TEXT NOT NULL,
    "midBannerParagraphs" JSONB NOT NULL,
    "midBannerCtaLabel" TEXT NOT NULL,
    "howToOrderTitle" TEXT NOT NULL,
    "howToOrderIntro" TEXT NOT NULL,
    "howToOrderOutroLead" TEXT NOT NULL,
    "howToOrderOutroBold" TEXT NOT NULL,
    "howToOrderOutroTail" TEXT NOT NULL,
    "teamTitle" TEXT NOT NULL,
    "teamSubtitle1" TEXT NOT NULL,
    "teamSubtitle2" TEXT NOT NULL,
    "calculatorTitle" TEXT NOT NULL,
    "reviewsTitle" TEXT NOT NULL,
    "galleryTitle" TEXT NOT NULL,
    "serviceFaq" JSONB NOT NULL,
    "seoText" JSONB NOT NULL,
    "consultationEyebrow" TEXT NOT NULL,
    "consultationTitle" TEXT NOT NULL,
    "consultationSubtitle" TEXT NOT NULL,
    "consultationPerks" JSONB NOT NULL,
    "consultationCtaLabel" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ServiceSharedContent" ("calculatorTitle", "consultationCtaLabel", "consultationEyebrow", "consultationPerks", "consultationSubtitle", "consultationTitle", "galleryTitle", "howToOrderIntro", "howToOrderOutroBold", "howToOrderOutroLead", "howToOrderOutroTail", "howToOrderTitle", "id", "midBannerCtaLabel", "midBannerParagraphs", "midBannerStaffName", "midBannerStaffRoles", "midBannerTitle", "processSteps", "reviewsTitle", "seoText", "serviceFaq", "teamSubtitle1", "teamSubtitle2", "teamTitle", "updatedAt") SELECT "calculatorTitle", "consultationCtaLabel", "consultationEyebrow", "consultationPerks", "consultationSubtitle", "consultationTitle", "galleryTitle", "howToOrderIntro", "howToOrderOutroBold", "howToOrderOutroLead", "howToOrderOutroTail", "howToOrderTitle", "id", "midBannerCtaLabel", "midBannerParagraphs", "midBannerStaffName", "midBannerStaffRoles", "midBannerTitle", "processSteps", "reviewsTitle", "seoText", "serviceFaq", "teamSubtitle1", "teamSubtitle2", "teamTitle", "updatedAt" FROM "ServiceSharedContent";
DROP TABLE "ServiceSharedContent";
ALTER TABLE "new_ServiceSharedContent" RENAME TO "ServiceSharedContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
