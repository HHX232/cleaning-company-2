"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBotUsername, isTelegramConfigured } from "@/lib/telegram";

export async function generateTelegramLinkToken(): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
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

  return { ok: true, url: `https://t.me/${username}?start=admin:${token}` };
}

export async function disconnectTelegram(): Promise<void> {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return;

  await prisma.adminSettings.upsert({
    where: { id: "admin" },
    update: { telegramChatId: null, telegramLinkToken: null },
    create: { id: "admin" },
  });
  revalidatePath("/admin/settings");
}
