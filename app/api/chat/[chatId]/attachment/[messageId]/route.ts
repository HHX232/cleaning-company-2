import { prisma } from "@/lib/prisma";
import { loadChatForViewer } from "@/lib/chat";
import { getChatAttachment } from "@/lib/chatAttachments";

type RouteParams = {
  params: Promise<{ chatId: string; messageId: string }>;
};

// Auth-gated attachment serve: only the chat's participants (owner or admin)
// can fetch a file, and only files that belong to this chat.
export async function GET(_request: Request, { params }: RouteParams) {
  const { chatId, messageId } = await params;
  const result = await loadChatForViewer(chatId);
  if ("error" in result) return new Response(null, { status: result.error });

  const message = await prisma.chatMessage.findUnique({ where: { id: messageId } });
  if (!message || message.chatId !== result.chat.id || !message.attachmentKey) {
    return new Response(null, { status: 404 });
  }

  const file = await getChatAttachment(result.chat.id, message.attachmentKey);
  if (!file) return new Response(null, { status: 404 });

  const filename = message.attachmentName ?? "file";
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": message.attachmentType ?? file.mimeType,
      "Cache-Control": "private, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
