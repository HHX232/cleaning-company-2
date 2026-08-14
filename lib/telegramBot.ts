import { prisma } from "@/lib/prisma";
import { deriveStatus, formatRuDate, statusPresentation } from "@/lib/orderStatus";
import { notifyAdmin } from "@/lib/telegramNotify";
import { answerCallbackQuery, getUpdates, isTelegramConfigured, sendMessage, type TelegramUpdate } from "@/lib/telegram";

type ConversationState = "awaiting_status_phone" | "awaiting_callback_phone";

// Per-Telegram-chat conversation state — in-memory only, matching the same
// persistent-Node-process assumption already relied on for the demo chat
// bot's setTimeout reply (app/api/chat/[chatId]/messages/route.ts). Resets
// on server restart, which is an acceptable trade-off for a small-business
// bot with short-lived phone-entry conversations.
const conversationState = new Map<number, ConversationState>();

const MENU_KEYBOARD = [
  [{ text: "📋 Статус моих уборок", callback_data: "status" }],
  [{ text: "📞 Оставить заявку на звонок", callback_data: "callback" }],
];

const ADMIN_TEST_KEYBOARD = [
  [{ text: "🧪 Тест: заявка на уборку", callback_data: "test_order" }],
  [{ text: "🧪 Тест: сообщение в чате", callback_data: "test_message" }],
  [{ text: "🧪 Тест: заявка на звонок", callback_data: "test_callback" }],
];

function normalizeDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

async function isLinkedAdmin(chatId: number): Promise<boolean> {
  const settings = await prisma.adminSettings.findUnique({ where: { id: "admin" } });
  return settings?.telegramChatId === String(chatId);
}

async function sendMenu(chatId: number) {
  const keyboard = (await isLinkedAdmin(chatId)) ? [...MENU_KEYBOARD, ...ADMIN_TEST_KEYBOARD] : MENU_KEYBOARD;
  await sendMessage(chatId, "Здравствуйте! Чем могу помочь?", { inlineKeyboard: keyboard });
}

type AdminTestKind = "test_order" | "test_message" | "test_callback";

async function handleAdminTest(chatId: number, kind: AdminTestKind) {
  if (!(await isLinkedAdmin(chatId))) return;

  const texts: Record<AdminTestKind, string> = {
    test_order: "🧪 <b>ТЕСТ: новая заявка на уборку</b>\nГенеральная уборка — 4200 руб.\n7 августа, 14:00\nул. Примерная 12",
    test_message: "🧪 <b>ТЕСТ: новое сообщение в чате</b>\nЗдравствуйте, подскажите пожалуйста стоимость уборки офиса",
    test_callback: "🧪 <b>ТЕСТ: заявка на звонок</b>\n+375291234567",
  };
  await notifyAdmin(texts[kind]);
  await sendMessage(chatId, "Тестовое уведомление отправлено всем подключённым админам ✅");
}

async function handleStartToken(chatId: number, rawToken: string) {
  if (rawToken.startsWith("admin:")) {
    const token = rawToken.slice("admin:".length);
    const settings = await prisma.adminSettings.findFirst({ where: { telegramLinkToken: token } });
    if (!settings) {
      await sendMessage(chatId, "Ссылка недействительна или уже использована.");
      return;
    }
    await prisma.adminSettings.update({
      where: { id: settings.id },
      data: { telegramChatId: String(chatId), telegramLinkToken: null },
    });
    await sendMessage(chatId, "✅ Аккаунт подключён! Теперь сюда будут приходить заявки на уборку и звонки.");
    return;
  }

  if (rawToken.startsWith("cust:")) {
    const token = rawToken.slice("cust:".length);
    const link = await prisma.phoneTelegramLink.findFirst({ where: { linkToken: token } });
    if (!link) {
      await sendMessage(chatId, "Ссылка недействительна или уже использована.");
      return;
    }
    await prisma.phoneTelegramLink.update({
      where: { phone: link.phone },
      data: { chatId: String(chatId), linkToken: null },
    });
    await sendMessage(chatId, "✅ Готово! Теперь сюда будут приходить уведомления о статусе ваших заказов.");
    return;
  }

  await sendMessage(chatId, "Ссылка недействительна.");
}

async function handleStatusPhone(chatId: number, phoneText: string) {
  const digits = normalizeDigits(phoneText);
  conversationState.delete(chatId);

  if (digits.length < 5) {
    await sendMessage(chatId, "Похоже, это не номер телефона. Нажмите /start и попробуйте ещё раз.");
    return;
  }

  const candidates = await prisma.order.findMany({ select: { phone: true }, distinct: ["phone"] });
  const match = candidates.find((o) => normalizeDigits(o.phone) === digits);
  if (!match) {
    await sendMessage(chatId, "Не нашли заказов с таким номером телефона. Проверьте номер или оставьте заявку на сайте.");
    return;
  }

  const orders = await prisma.order.findMany({ where: { phone: match.phone }, orderBy: { date: "desc" } });
  if (orders.length === 0) {
    await sendMessage(chatId, "Заказов пока нет.");
    return;
  }

  const lines = orders.map((o) => {
    const status = deriveStatus(o);
    return `• ${o.title} — ${statusPresentation[status].label}\n  ${formatRuDate(o.date, false)}, ${o.price} руб.`;
  });
  await sendMessage(chatId, `Ваши заказы:\n\n${lines.join("\n\n")}`);
}

async function handleCallbackPhone(chatId: number, phoneText: string) {
  const trimmed = phoneText.trim();
  conversationState.delete(chatId);

  await prisma.callbackRequest.create({
    data: { phone: trimmed, source: "telegram", telegramChatId: String(chatId) },
  });
  notifyAdmin(`📞 <b>Заявка на звонок (Telegram)</b>\n${trimmed}`);
  await sendMessage(chatId, "Спасибо! Заявка принята, мы вам перезвоним.");
}

async function processUpdate(update: TelegramUpdate) {
  if (update.callback_query) {
    const chatId = update.callback_query.message?.chat.id;
    if (chatId == null) return;
    await answerCallbackQuery(update.callback_query.id);

    const data = update.callback_query.data;
    if (data === "status") {
      conversationState.set(chatId, "awaiting_status_phone");
      await sendMessage(chatId, "Введите номер телефона, который вы указывали при заказе:");
    } else if (data === "callback") {
      conversationState.set(chatId, "awaiting_callback_phone");
      await sendMessage(chatId, "Введите номер телефона для связи:");
    } else if (data === "test_order" || data === "test_message" || data === "test_callback") {
      await handleAdminTest(chatId, data);
    }
    return;
  }

  const message = update.message;
  if (!message?.text) return;
  const chatId = message.chat.id;
  const text = message.text.trim();

  if (text.startsWith("/start")) {
    const token = text.split(" ")[1];
    if (token) {
      await handleStartToken(chatId, token);
    } else {
      await sendMenu(chatId);
    }
    return;
  }

  const state = conversationState.get(chatId);
  if (state === "awaiting_status_phone") {
    await handleStatusPhone(chatId, text);
    return;
  }
  if (state === "awaiting_callback_phone") {
    await handleCallbackPhone(chatId, text);
    return;
  }

  await sendMenu(chatId);
}

let started = false;

export function startTelegramBot(): void {
  if (started || !isTelegramConfigured()) return;
  started = true;

  let offset = 0;
  (async () => {
    console.log("Telegram bot polling started");
    while (true) {
      try {
        const updates = await getUpdates(offset);
        for (const update of updates) {
          offset = update.update_id + 1;
          await processUpdate(update).catch((err) => console.error("Telegram update handling failed:", err));
        }
      } catch (err) {
        console.error("Telegram getUpdates failed:", err);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  })();
}
