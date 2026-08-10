import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteChatButton from "@/components/admin/DeleteChatButton";
import { deleteChat } from "./actions";

export default async function AdminChatsPage() {
  const chats = await prisma.chat.findMany({
    where: { isDemo: false },
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: { where: { sender: "USER", readByAdmin: false } } } },
    },
  });

  return (
    <div className="mx-auto max-w-160">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Чаты</h1>

      {chats.length === 0 && <p className="text-sm text-muted">Пока нет обращений.</p>}

      {chats.length > 0 && (
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
          {chats.map((chat, i) => {
            const last = chat.messages[0];
            const unread = chat._count.messages;
            const prefix = last?.sender === "ADMIN" ? "Вы: " : "";
            const preview = !last
              ? "Сообщений пока нет"
              : last.kind === "ORDER"
                ? `${prefix}📋 ${last.text}`
                : last.kind === "FILE"
                  ? `${prefix}📎 ${last.text}`
                  : `${prefix}${last.text}`;

            return (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg ${
                  i !== 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                  {chat.user.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-ink">{chat.user.email}</div>
                  <div className="truncate text-xs text-muted">{preview}</div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {last && (
                    <span className="text-[11px] text-muted">
                      {new Date(last.createdAt).toLocaleString("ru-RU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                  {unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d94b4b] px-1.5 text-[11px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </div>
                <DeleteChatButton chatId={chat.id} email={chat.user.email} deleteChat={deleteChat} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
