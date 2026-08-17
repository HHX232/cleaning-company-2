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

// The server's network path to api.telegram.org has shown intermittent
// ETIMEDOUT/abort failures in production. A single lost order/callback
// notification with no retry means it's gone for good, so this retries a
// few times on network-level failure (fetch throwing) — an HTTP-level
// error response from Telegram (bad chat id, etc.) is not retried since
// trying again won't fix it.
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

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(apiUrl("sendMessage"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        console.error("Telegram sendMessage failed:", res.status, await res.text().catch(() => ""));
      }
      return;
    } catch (err) {
      console.error(`Telegram sendMessage network error (attempt ${attempt}/${maxAttempts}):`, err);
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
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

export async function getUpdates(offset: number, timeoutSec = 15): Promise<TelegramUpdate[]> {
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
