-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GalleryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "beforeUrl" TEXT,
    "afterUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GalleryItem" ("afterUrl", "beforeUrl", "createdAt", "id", "meta", "order", "title", "updatedAt") SELECT "afterUrl", "beforeUrl", "createdAt", "id", "meta", "order", "title", "updatedAt" FROM "GalleryItem";
DROP TABLE "GalleryItem";
ALTER TABLE "new_GalleryItem" RENAME TO "GalleryItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
