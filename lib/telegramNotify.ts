import { prisma } from "@/lib/prisma";
import { sendMessage, isTelegramConfigured } from "@/lib/telegram";

// Pushes a message to the admin's linked Telegram chat (AdminSettings
// singleton, set via /admin/settings's "Подключить Telegram" flow). Never
// throws — a Telegram outage or misconfiguration must never break the
// order/callback creation flow that triggered the notification.
export async function notifyAdmin(text: string): Promise<void> {
  if (!isTelegramConfigured()) return;

  try {
    const settings = await prisma.adminSettings.findUnique({ where: { id: "admin" } });
    if (!settings?.telegramChatId) return;
    await sendMessage(settings.telegramChatId, text).catch((err) => console.error("notifyAdmin send failed:", err));
  } catch (err) {
    console.error("notifyAdmin failed:", err);
  }
}

// Pushes an order-status update to a guest's linked Telegram chat
// (PhoneTelegramLink, opted into after placing an order), if any.
export async function notifyCustomer(phone: string, text: string): Promise<void> {
  if (!isTelegramConfigured()) return;

  try {
    const link = await prisma.phoneTelegramLink.findUnique({ where: { phone } });
    if (!link?.chatId) return;
    await sendMessage(link.chatId, text).catch((err) => console.error("notifyCustomer send failed:", err));
  } catch (err) {
    console.error("notifyCustomer failed:", err);
  }
}

export function siteUrl(path: string): string {
  const base = process.env.SITE_URL?.trim() || "http://localhost:3000";
  return `${base}${path}`;
}
