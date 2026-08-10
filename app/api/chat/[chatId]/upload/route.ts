import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { loadChatForViewer } from "@/lib/chat";
import { putChatAttachment } from "@/lib/chatAttachments";
import { notifyAdmins, siteUrl } from "@/lib/telegramNotify";

type RouteParams = {
  params: Promise<{ chatId: string }>;
};

// Kept modest on purpose — the app targets a tiny 1GB box and each upload is
// buffered in memory before going to S3.
const MAX_SIZE_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request, { params }: RouteParams) {
  const { chatId } = await params;
  const result = await loadChatForViewer(chatId);
  if ("error" in result) return new Response(null, { status: result.error });

  const { chat, isAdmin, isOwner } = result;
  const actingAsAdmin = isAdmin && !isOwner;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return new Response("No file", { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return new Response("File too large (max 15MB)", { status: 400 });
  }

  const attachmentKey = randomUUID();
  const mimeType = file.type || "application/octet-stream";
  const buffer = Buffer.from(await file.arrayBuffer());
  await putChatAttachment(chat.id, attachmentKey, buffer, mimeType);

  const sender = actingAsAdmin ? "ADMIN" : "USER";
  const message = await prisma.chatMessage.create({
    data: {
      chatId: chat.id,
      sender,
      kind: "FILE",
      text: file.name,
      attachmentKey,
      attachmentName: file.name,
      attachmentType: mimeType,
      readByUser: sender === "USER",
      readByAdmin: sender === "ADMIN",
    },
  });

  await prisma.chat.update({ where: { id: chat.id }, data: { updatedAt: new Date() } });

  if (!chat.isDemo && sender === "USER") {
    notifyAdmins(`📎 <b>Новый файл в чате</b>\n${file.name}\n\n${siteUrl(`/chat/${chat.id}`)}`);
  }

  return Response.json({ message });
}
