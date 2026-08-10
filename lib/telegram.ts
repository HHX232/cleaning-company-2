// Thin wrappers around the raw Telegram Bot API (https://core.telegram.org/bots/api).
// No SDK dependency — the API is plain HTTPS+JSON, matching this project's
// preference for avoiding dependencies where a few fetch calls suffice.

export type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    data?: string;
    message?: { chat: { id: number } };
  };
};

export type TelegramMessage = {
  message_id: number;
  chat: { id: number };
  text?: string;
};

function botToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || null;
}

function apiUrl(method: string): string {
  return `https://api.telegram.org/bot${botToken()}/${method}`;
}

export function isTelegramConfigured(): boolean {
  return botToken() !== null;
}

type InlineKeyboard = { text: string; callback_data: string }[][];

export async function sendMessage(
  chatId: string | number,
  text: string,
  opts?: { inlineKeyboard?: InlineKeyboard },
): Promise<void> {
  if (!isTelegramConfigured()) return;

  const body: Record<string, unknown> = { chat_id: chatId, text, parse_mode: "HTML" };
  if (opts?.inlineKeyboard) {
    body.reply_markup = { inline_keyboard: opts.inlineKeyboard };
  }

  const res = await fetch(apiUrl("sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error("Telegram sendMessage failed:", res.status, await res.text().catch(() => ""));
  }
}

export async function answerCallbackQuery(callbackQueryId: string): Promise<void> {
  if (!isTelegramConfigured()) return;
  await fetch(apiUrl("answerCallbackQuery"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  }).catch(() => {});
}

let cachedBotUsername: string | null = null;

export async function getBotUsername(): Promise<string | null> {
  if (cachedBotUsername) return cachedBotUsername;
  if (!isTelegramConfigured()) return null;

  const res = await fetch(apiUrl("getMe"));
  if (!res.ok) return null;
  const data = await res.json();
  cachedBotUsername = data?.result?.username ?? null;
  return cachedBotUsername;
}

export async function getUpdates(offset: number, timeoutSec = 30): Promise<TelegramUpdate[]> {
  if (!isTelegramConfigured()) return [];

  const res = await fetch(apiUrl("getUpdates"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ offset, timeout: timeoutSec }),
    signal: AbortSignal.timeout((timeoutSec + 10) * 1000),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.result ?? [];
}
