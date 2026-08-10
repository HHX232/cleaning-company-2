"use client";

import { useState } from "react";

export default function DeleteChatButton({
  chatId,
  email,
  deleteChat,
}: {
  chatId: string;
  email: string;
  deleteChat: (chatId: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    await deleteChat(chatId);
    setPending(false);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Удалить чат"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-[rgba(217,75,75,0.12)] hover:text-[#b23434]"
      >
        🗑
      </button>

      {open && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <div
            className="w-full max-w-105 rounded-2xl bg-bg p-6 shadow-2xl"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <h3 className="mb-2 text-center text-lg font-extrabold text-ink">Удалить чат?</h3>
            <p className="mb-6 text-center text-sm text-muted">
              Переписка с {email} будет удалена без возможности восстановления.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-bold text-ink transition-colors hover:bg-surface"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleConfirm();
                }}
                disabled={pending}
                className="flex-1 rounded-full bg-[#d94b4b] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#b23434] disabled:opacity-60"
              >
                {pending ? "…" : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
