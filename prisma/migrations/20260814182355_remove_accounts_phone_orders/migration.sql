DROP INDEX IF EXISTS "Chat_userId_isDemo_key";
DROP INDEX IF EXISTS "EmailVerification_email_key";
DROP INDEX IF EXISTS "User_telegramLinkToken_key";
DROP INDEX IF EXISTS "User_telegramChatId_key";
DROP INDEX IF EXISTS "User_email_key";

PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "Chat";
PRAGMA foreign_keys=on;

PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "ChatMessage";
PRAGMA foreign_keys=on;

PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "EmailVerification";
PRAGMA foreign_keys=on;

PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "User";
PRAGMA foreign_keys=on;

CREATE TABLE "PhoneTelegramLink" (
    "phone" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT,
    "linkToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "AdminSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'admin',
    "telegramChatId" TEXT,
    "telegramLinkToken" TEXT,
    "updatedAt" DATETIME NOT NULL
);

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL DEFAULT '',
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
DROP TABLE IF EXISTS "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

CREATE UNIQUE INDEX "PhoneTelegramLink_chatId_key" ON "PhoneTelegramLink"("chatId");
CREATE UNIQUE INDEX "PhoneTelegramLink_linkToken_key" ON "PhoneTelegramLink"("linkToken");
CREATE UNIQUE INDEX "AdminSettings_telegramChatId_key" ON "AdminSettings"("telegramChatId");
CREATE UNIQUE INDEX "AdminSettings_telegramLinkToken_key" ON "AdminSettings"("telegramLinkToken");