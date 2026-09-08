/*
  Warnings:

  - Added the required column `ctaBannerCtaLabel` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faqSectionTitle` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `howItWorksLead` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `howItWorksTitle` to the `HomeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceGuaranteesTitle` to the `HomeContent` table without a default value. This is not possible if the table is not empty.

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
INSERT INTO "new_HomeContent" ("ctaBannerParagraphs", "ctaBannerTitle", "faqItems", "heroCtaPrimary", "heroCtaSecondary", "heroEyebrow", "heroServices", "heroStats", "heroSubtitle", "heroTitleHighlight", "heroTitleMain", "heroTitleSuffix", "howItWorks", "id", "reasons", "serviceGuarantees", "updatedAt") SELECT "ctaBannerParagraphs", "ctaBannerTitle", "faqItems", "heroCtaPrimary", "heroCtaSecondary", "heroEyebrow", "heroServices", "heroStats", "heroSubtitle", "heroTitleHighlight", "heroTitleMain", "heroTitleSuffix", "howItWorks", "id", "reasons", "serviceGuarantees", "updatedAt" FROM "HomeContent";
DROP TABLE "HomeContent";
ALTER TABLE "new_HomeContent" RENAME TO "HomeContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
