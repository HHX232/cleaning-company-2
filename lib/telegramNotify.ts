import { prisma } from "@/lib/prisma";
import { sendMessage, isTelegramConfigured } from "@/lib/telegram";

// Pushes a message to every admin who has linked their Telegram account
// (User.telegramChatId, set via /profile's "Подключить Telegram" flow).
// Never throws — a Telegram outage or misconfiguration must never break the
// order/chat/callback creation flow that triggered the notification.
export async function notifyAdmins(text: string): Promise<void> {
  if (!isTelegramConfigured()) return;

  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN", telegramChatId: { not: null } },
      select: { telegramChatId: true },
    });
    await Promise.all(
      admins.map((a) => sendMessage(a.telegramChatId as string, text).catch((err) => console.error("notifyAdmins send failed:", err))),
    );
  } catch (err) {
    console.error("notifyAdmins failed:", err);
  }
}

export function siteUrl(path: string): string {
  const base = process.env.SITE_URL?.trim() || "http://localhost:3000";
  return `${base}${path}`;
}
