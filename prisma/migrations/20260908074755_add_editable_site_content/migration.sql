-- CreateTable
CREATE TABLE "HomeContent" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GuaranteesPage" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'guarantees',
    "eyebrow" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WhyUsPage" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'why-us',
    "eyebrow" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "advantages" JSONB NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactsPage" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'contacts',
    "eyebrow" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "lead" TEXT NOT NULL,
    "hoursValue" TEXT NOT NULL,
    "hoursText" TEXT NOT NULL,
    "areaText" TEXT NOT NULL,
    "phoneNote" TEXT NOT NULL,
    "emailNote" TEXT NOT NULL,
    "messengersHeading" TEXT NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LegalPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "heading" TEXT NOT NULL,
    "effectiveDate" TEXT NOT NULL,
    "sectionsText" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
