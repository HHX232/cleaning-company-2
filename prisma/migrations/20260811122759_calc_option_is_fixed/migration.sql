-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CalculatorOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "field" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "isFixed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CalculatorOption" ("createdAt", "field", "id", "key", "label", "order", "updatedAt", "value") SELECT "createdAt", "field", "id", "key", "label", "order", "updatedAt", "value" FROM "CalculatorOption";
DROP TABLE "CalculatorOption";
ALTER TABLE "new_CalculatorOption" RENAME TO "CalculatorOption";
CREATE UNIQUE INDEX "CalculatorOption_field_key_key" ON "CalculatorOption"("field", "key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
