/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailVerification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Chat_userId_isDemo_key";

-- DropIndex
DROP INDEX "EmailVerification_email_key";

-- DropIndex
DROP INDEX "User_telegramLinkToken_key";

-- DropIndex
DROP INDEX "User_telegramChatId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Chat";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ChatMessage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EmailVerification";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PhoneTelegramLink" (
    "phone" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT,
    "linkToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdminSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'admin',
    "telegramChatId" TEXT,
    "telegramLinkToken" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "address" TEXT,
    "price" INTEGER NOT NULL,
    "serviceDetail" TEXT NOT NULL,
    "staff" TEXT NOT NULL,
    "payment" TEXT NOT NULL,
    "acceptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedAt" DATETIME,
    "completedAt" DATETIME,
    "paidAt" DATETIME,
    "canceledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("acceptedAt", "address", "assignedAt", "canceledAt", "completedAt", "createdAt", "date", "id", "kind", "paidAt", "payment", "price", "serviceDetail", "staff", "title", "updatedAt") SELECT "acceptedAt", "address", "assignedAt", "canceledAt", "completedAt", "createdAt", "date", "id", "kind", "paidAt", "payment", "price", "serviceDetail", "staff", "title", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PhoneTelegramLink_chatId_key" ON "PhoneTelegramLink"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "PhoneTelegramLink_linkToken_key" ON "PhoneTelegramLink"("linkToken");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSettings_telegramChatId_key" ON "AdminSettings"("telegramChatId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSettings_telegramLinkToken_key" ON "AdminSettings"("telegramLinkToken");
