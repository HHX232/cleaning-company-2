"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBotUsername, isTelegramConfigured } from "@/lib/telegram";

export async function generateTelegramLinkToken(): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Требуются права администратора." };
  }
  if (!isTelegramConfigured()) {
    return { ok: false, message: "Бот не настроен." };
  }

  const username = await getBotUsername();
  if (!username) {
    return { ok: false, message: "Не удалось связаться с Telegram." };
  }

  const token = crypto.randomBytes(16).toString("hex");
  await prisma.adminSettings.upsert({
    where: { id: "admin" },
    update: { telegramLinkToken: token },
    create: { id: "admin", telegramLinkToken: token },
  });

  // Telegram's deep-link start payload only allows [A-Za-z0-9_-] — a colon
  // (as in "admin:token") gets silently dropped, so the bot opens with no
  // payload at all. Underscore is the safe separator.
  return { ok: true, url: `https://t.me/${username}?start=admin_${token}` };
}

export async function disconnectTelegram(): Promise<void> {
  if (!(await isAdminAuthenticated())) return;

  await prisma.adminSettings.upsert({
    where: { id: "admin" },
    update: { telegramChatId: null, telegramLinkToken: null },
    create: { id: "admin" },
  });
  revalidatePath("/admin/settings");
}
