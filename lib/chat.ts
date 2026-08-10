import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Shared auth gate for the chat routes: only the chat's own owner or any
// admin may read/write it. isOwner vs isAdmin is kept separate because an
// admin viewing their OWN chat acts as the customer, not as support.
export async function loadChatForViewer(chatId: string) {
  const session = await auth();
  if (!session?.user.id) return { error: 401 as const };

  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) return { error: 404 as const };

  const isAdmin = session.user.role === "ADMIN";
  const isOwner = chat.userId === session.user.id;
  if (!isOwner && !isAdmin) return { error: 403 as const };

  return { chat, isAdmin, isOwner };
}

const DEMO_GREETING =
  "Привет! Это демо-чат с автоответом — просто напишите что-нибудь, ответ придёт через пару секунд. Так можно проверить, с какой задержкой работает поллинг.";

export const DEMO_BOT_REPLIES = [
  "Спасибо за сообщение! Это автоответ для проверки задержки — реальный менеджер отвечает в общем чате.",
  "Получил ваше сообщение. Тут всё работает через обычный опрос сервера, без вебсокетов — задержка в пару секунд это нормально.",
  "Ответ сгенерирован автоматически, просто чтобы показать, как быстро долетают новые сообщения при поллинге.",
];

export async function getOrCreateChat(userId: string, isDemo: boolean) {
  const existing = await prisma.chat.findUnique({ where: { userId_isDemo: { userId, isDemo } } });
  if (existing) return existing;

  const chat = await prisma.chat.create({ data: { userId, isDemo } });

  if (isDemo) {
    await prisma.chatMessage.create({
      data: { chatId: chat.id, sender: "BOT", text: DEMO_GREETING, readByUser: false, readByAdmin: true },
    });
  }

  return chat;
}

export async function getUnreadCountForUser(userId: string) {
  return prisma.chatMessage.count({
    where: { chat: { userId }, sender: { not: "USER" }, readByUser: false },
  });
}

export async function getUnreadCountForAdmin() {
  return prisma.chatMessage.count({
    where: { chat: { isDemo: false }, sender: "USER", readByAdmin: false },
  });
}
