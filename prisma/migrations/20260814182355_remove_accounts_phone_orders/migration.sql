-- Удаление старых индексов, если они существуют
DROP INDEX IF EXISTS "Chat_userId_isDemo_key";
DROP INDEX IF EXISTS "EmailVerification_email_key";
DROP INDEX IF EXISTS "User_telegramLinkToken_key";
DROP INDEX IF EXISTS "User_telegramChatId_key";
DROP INDEX IF EXISTS "User_email_key";

-- Удаление старых таблиц, если они существуют
PRAGMA foreign_keys=off;
DROP TABLE IF EXISTS "Chat";
DROP TABLE IF EXISTS "ChatMessage";
DROP TABLE IF EXISTS "EmailVerification";
DROP TABLE IF EXISTS "User";
PRAGMA foreign_keys=on;

-- Создание новых таблиц, если их нет
CREATE TABLE IF NOT EXISTS "PhoneTelegramLink" (
    "phone" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT,
    "linkToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "AdminSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'admin',
    "telegramChatId" TEXT,
    "telegramLinkToken" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- Создание индексов для новых таблиц, если их нет
CREATE UNIQUE INDEX IF NOT EXISTS "PhoneTelegramLink_chatId_key" ON "PhoneTelegramLink"("chatId");
CREATE UNIQUE INDEX IF NOT EXISTS "PhoneTelegramLink_linkToken_key" ON "PhoneTelegramLink"("linkToken");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminSettings_telegramChatId_key" ON "AdminSettings"("telegramChatId");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminSettings_telegramLinkToken_key" ON "AdminSettings"("telegramLinkToken");