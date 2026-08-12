-- CreateTable
CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'about',
    "eyebrow" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "missionTitle" TEXT NOT NULL,
    "missionText1" TEXT NOT NULL,
    "missionText2" TEXT NOT NULL,
    "values" JSONB NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
