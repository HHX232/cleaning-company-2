/*
  Warnings:

  - Added the required column `ctaBannerParagraphs` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ctaBannerTitle` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faqItems` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `howItWorks` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceGuarantees` to the `HomeContent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ServiceCategoryPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceHubShared" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'service-hub',
    "sectionTitle" TEXT NOT NULL,
    "emptyText" TEXT NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceSharedContent" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'service-shared',
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
    "serviceFaq" JSONB NOT NULL,
    "seoText" JSONB NOT NULL,
    "consultationEyebrow" TEXT NOT NULL,
    "consultationTitle" TEXT NOT NULL,
    "consultationSubtitle" TEXT NOT NULL,
    "consultationPerks" JSONB NOT NULL,
    "consultationCtaLabel" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

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
    "howItWorks" JSONB NOT NULL,
    "serviceGuarantees" JSONB NOT NULL,
    "faqItems" JSONB NOT NULL,
    "ctaBannerTitle" TEXT NOT NULL,
    "ctaBannerParagraphs" JSONB NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_HomeContent" ("heroCtaPrimary", "heroCtaSecondary", "heroEyebrow", "heroServices", "heroStats", "heroSubtitle", "heroTitleHighlight", "heroTitleMain", "heroTitleSuffix", "id", "reasons", "updatedAt") SELECT "heroCtaPrimary", "heroCtaSecondary", "heroEyebrow", "heroServices", "heroStats", "heroSubtitle", "heroTitleHighlight", "heroTitleMain", "heroTitleSuffix", "id", "reasons", "updatedAt" FROM "HomeContent";
DROP TABLE "HomeContent";
ALTER TABLE "new_HomeContent" RENAME TO "HomeContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategoryPage_slug_key" ON "ServiceCategoryPage"("slug");
