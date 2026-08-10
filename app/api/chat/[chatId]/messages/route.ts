import { prisma } from "@/lib/prisma";
import { DEMO_BOT_REPLIES, loadChatForViewer } from "@/lib/chat";
import { deriveStatus } from "@/lib/orderStatus";
import { notifyAdmins, siteUrl } from "@/lib/telegramNotify";

type RouteParams = {
  params: Promise<{ chatId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { chatId } = await params;
  const result = await loadChatForViewer(chatId);
  if ("error" in result) return new Response(null, { status: result.error });

  const { chat, isAdmin, isOwner } = result;
  // An admin viewing their OWN chat (e.g. their own /profile demo chat) is
  // acting as the customer, not as support — only a non-owner admin counts
  // as "the admin" here. Without this, an admin account's own chat would
  // never mark messages read correctly and would never trigger bot replies
  // (see the sender check in POST below).
  const actingAsAdmin = isAdmin && !isOwner;

  // Viewing the chat implicitly reads the other party's messages.
  if (actingAsAdmin) {
    await prisma.chatMessage.updateMany({
      where: { chatId: chat.id, sender: "USER", readByAdmin: false },
      data: { readByAdmin: true },
    });
  } else {
    await prisma.chatMessage.updateMany({
      where: { chatId: chat.id, sender: { not: "USER" }, readByUser: false },
      data: { readByUser: true },
    });
  }

  const messages = await prisma.chatMessage.findMany({
    where: { chatId: chat.id },
    orderBy: { createdAt: "asc" },
    include: { order: true },
  });

  const dto = messages.map(({ order, ...m }) => ({
    ...m,
    order: order
      ? {
          id: order.id,
          title: order.title,
          price: order.price,
          date: order.date,
          address: order.address,
          serviceDetail: order.serviceDetail,
          staff: order.staff,
          status: deriveStatus(order),
        }
      : null,
  }));

  return Response.json({ messages: dto });
}

export async function POST(request: Request, { params }: RouteParams) {
  const { chatId } = await params;
  const result = await loadChatForViewer(chatId);
  if ("error" in result) return new Response(null, { status: result.error });

  const { chat, isAdmin, isOwner } = result;
  const actingAsAdmin = isAdmin && !isOwner;

  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) return new Response("Message text required", { status: 400 });

  const sender = actingAsAdmin ? "ADMIN" : "USER";
  const message = await prisma.chatMessage.create({
    data: {
      chatId: chat.id,
      sender,
      text,
      readByUser: sender === "USER",
      readByAdmin: sender === "ADMIN",
    },
  });

  await prisma.chat.update({ where: { id: chat.id }, data: { updatedAt: new Date() } });

  // Demo chats are private latency-testing sandboxes, not real support
  // requests (same exclusion the admin inbox already applies), so only a
  // real incoming customer message pages the admin.
  if (!chat.isDemo && sender === "USER") {
    notifyAdmins(`💬 <b>Новое сообщение в чате</b>\n${text}\n\n${siteUrl(`/chat/${chat.id}`)}`);
  }

  // Demo chats auto-reply so latency is observable without a second
  // session — this only works because the app runs as a persistent Node
  // process (next dev / next start), not on serverless/edge, where the
  // function instance could be frozen before the timeout fires.
  if (chat.isDemo && sender === "USER") {
    const delayMs = 2000 + Math.random() * 2000;
    setTimeout(() => {
      const reply = DEMO_BOT_REPLIES[Math.floor(Math.random() * DEMO_BOT_REPLIES.length)];
      prisma.chatMessage
        .create({ data: { chatId: chat.id, sender: "BOT", text: reply, readByUser: false, readByAdmin: true } })
        .then(() => prisma.chat.update({ where: { id: chat.id }, data: { updatedAt: new Date() } }))
        .catch((err) => console.error("Demo bot reply failed:", err));
    }, delayMs);
  }

  return Response.json({ message });
}
