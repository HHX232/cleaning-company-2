"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateTelegramLinkToken } from "@/lib/telegramLink";

export default function TelegramLinkButton() {
  const router = useRouter();
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    const toastId = toast.loading("Готовим ссылку на бота…");
    const result = await generateTelegramLinkToken();
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      toast.error(result.message, { id: toastId });
      return;
    }
    setUrl(result.url);
    toast.success("Ссылка готова — открываем Telegram", { id: toastId });
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-bold text-ink transition-colors hover:border-primary disabled:opacity-60"
      >
        {loading ? "…" : "Подключить Telegram"}
      </button>
      {url && (
        <button type="button" onClick={() => router.refresh()} className="text-[13px] font-bold text-primary">
          Я нажал(а) /start в боте — обновить
        </button>
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
