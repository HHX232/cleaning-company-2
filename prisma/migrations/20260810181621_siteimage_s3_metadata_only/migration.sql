-- Drop SiteImage.data: image bytes now live in S3 (see lib/imageStorage.ts).
-- SQLite column drop via table rebuild (Prisma's standard approach).
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteImage" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "mimeType" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteImage" ("key", "mimeType", "updatedAt") SELECT "key", "mimeType", "updatedAt" FROM "SiteImage";
DROP TABLE "SiteImage";
ALTER TABLE "new_SiteImage" RENAME TO "SiteImage";
PRAGMA foreign_keys=ON;
