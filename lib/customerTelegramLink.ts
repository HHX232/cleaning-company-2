"use server";

import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getBotUsername, isTelegramConfigured } from "@/lib/telegram";

// Guest, phone-keyed Telegram opt-in — offered right after an order is
// placed, so the customer can get status-change notifications without an
// account (see PhoneTelegramLink in prisma/schema.prisma).
export async function generateCustomerTelegramLinkToken(
  phone: string,
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { ok: false, message: "Нет номера телефона." };
  }
  if (!isTelegramConfigured()) {
    return { ok: false, message: "Бот не настроен." };
  }

  const username = await getBotUsername();
  if (!username) {
    return { ok: false, message: "Не удалось связаться с Telegram." };
  }

  const token = crypto.randomBytes(16).toString("hex");
  await prisma.phoneTelegramLink.upsert({
    where: { phone: trimmed },
    update: { linkToken: token },
    create: { phone: trimmed, linkToken: token },
  });

  // Telegram's deep-link start payload only allows [A-Za-z0-9_-] — a colon
  // (as in "cust:token") gets silently dropped, so the bot opens with no
  // payload at all. Underscore is the safe separator.
  return { ok: true, url: `https://t.me/${username}?start=cust_${token}` };
}
