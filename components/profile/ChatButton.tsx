import Link from "next/link";

type ChatButtonProps = {
  chatId: string;
  label?: string;
  unreadCount?: number;
};

export default function ChatButton({ chatId, label = "Чат с менеджером", unreadCount = 0 }: ChatButtonProps) {
  return (
    <Link
      href={`/chat/${chatId}`}
      className="relative flex items-center gap-2 rounded-[10px] border border-border bg-bg px-4 py-2.5 text-[13px] font-bold text-ink"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v12H8l-4 4z" />
      </svg>
      {label}
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#d94b4b] px-1 text-[10px] font-bold text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
