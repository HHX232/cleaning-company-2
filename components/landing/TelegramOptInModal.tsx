"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateCustomerTelegramLinkToken } from "@/lib/customerTelegramLink";

type TelegramOptInModalProps = {
  open: boolean;
  phone: string;
  onClose: () => void;
};

export default function TelegramOptInModal({ open, phone, onClose }: TelegramOptInModalProps) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleConnect() {
    setPending(true);
    const id = toast.loading("Готовим ссылку на бота…");
    const result = await generateCustomerTelegramLinkToken(phone);
    setPending(false);
    if (!result.ok) {
      toast.error(result.message, { id });
      return;
    }
    toast.success("Открываем Telegram…", { id });
    window.open(result.url, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-bg p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface"
        >
          ✕
        </button>

        <h3 className="mb-2 text-center text-lg font-extrabold text-ink">Заявка отправлена!</h3>
        <p className="mb-6 text-center text-sm text-muted">
          Хотите получать уведомления о статусе заказа в Telegram?
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleConnect}
            disabled={pending}
            className="rounded-full bg-primary py-3 text-sm font-bold tracking-wide text-on-primary uppercase transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Подключить Telegram
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
          >
            Не сейчас
          </button>
        </div>
      </div>
    </div>
  );
}
