"use client";

import { useEffect, useRef, useState } from "react";
import type { CalculatorOptionsByField } from "@/lib/calculator";
import OrderPreviewCard, { type OrderPreviewDto } from "./OrderPreviewCard";
import ChatOrderCalculator from "./ChatOrderCalculator";

type ChatMessageDto = {
  id: string;
  sender: "USER" | "ADMIN" | "BOT";
  kind: "TEXT" | "ORDER" | "FILE";
  text: string;
  order: OrderPreviewDto | null;
  attachmentName: string | null;
  attachmentType: string | null;
  createdAt: string;
};

const POLL_INTERVAL_MS = 2500;

const senderLabel: Record<ChatMessageDto["sender"], string> = {
  USER: "Клиент",
  ADMIN: "Менеджер",
  BOT: "Автоответчик",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatRoom({
  chatId,
  viewerRole,
  title,
  calculatorOptions,
}: {
  chatId: string;
  viewerRole: "USER" | "ADMIN";
  title: string;
  calculatorOptions?: CalculatorOptionsByField;
}) {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showOrderDraft, setShowOrderDraft] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canOrder = viewerRole === "USER" && !!calculatorOptions;

  async function fetchMessages() {
    const res = await fetch(`/api/chat/${chatId}/messages`);
    if (!res.ok) return;
    const data: { messages: ChatMessageDto[] } = await res.json();
    setMessages(data.messages);
    setLoaded(true);
  }

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      // Don't hit the server for a backgrounded tab — refresh on return.
      if (document.visibilityState === "hidden") return;
      const res = await fetch(`/api/chat/${chatId}/messages`);
      if (!res.ok || cancelled) return;
      const data: { messages: ChatMessageDto[] } = await res.json();
      if (cancelled) return;
      setMessages(data.messages);
      setLoaded(true);
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setInput("");
    const res = await fetch(`/api/chat/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setSending(false);
    if (res.ok) await fetchMessages();
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file || uploading) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/chat/${chatId}/upload`, { method: "POST", body: form });
    setUploading(false);
    if (res.ok) await fetchMessages();
  }

  function attachmentUrl(messageId: string) {
    return `/api/chat/${chatId}/attachment/${messageId}`;
  }

  return (
    <div className="flex h-full min-h-[70vh] w-full flex-col bg-surface">
      <div className="shrink-0 border-b border-border bg-dark px-5 py-4 sm:px-8">
        <div className="text-[15px] font-extrabold text-white">{title}</div>
      </div>

      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto bg-surface px-4 py-5 sm:px-8">
        <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col gap-3">
          {!loaded && <p className="text-center text-sm text-muted">Загрузка…</p>}
          {loaded && messages.length === 0 && (
            <p className="text-center text-sm text-muted">Сообщений пока нет — напишите первым.</p>
          )}
          {messages.map((m) => {
            const isOwn = m.sender === viewerRole;

            if (m.kind === "ORDER") {
              return (
                <div key={m.id} className={`flex min-w-0 ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className="min-w-0 w-full max-w-105 rounded-2xl border border-border bg-bg px-4 py-3.5 text-ink sm:max-w-115">
                    {!isOwn && (
                      <div className="mb-1.5 text-[11px] font-bold opacity-60">{senderLabel[m.sender]}</div>
                    )}
                    <OrderPreviewCard order={m.order} />
                    <div className="mt-1.5 text-right text-[10px] text-muted">{formatTime(m.createdAt)}</div>
                  </div>
                </div>
              );
            }

            if (m.kind === "FILE") {
              const url = attachmentUrl(m.id);
              const type = m.attachmentType ?? "";
              return (
                <div key={m.id} className={`flex min-w-0 ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`min-w-0 max-w-[78%] overflow-hidden rounded-2xl ${
                      isOwn ? "bg-primary text-on-primary" : "border border-border bg-bg text-ink"
                    }`}
                  >
                    {!isOwn && (
                      <div className="px-3 pt-2 text-[11px] font-bold opacity-60">{senderLabel[m.sender]}</div>
                    )}
                    <div className="p-1.5">
                      {type.startsWith("image/") ? (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={m.attachmentName ?? "изображение"}
                            className="max-h-80 w-full rounded-xl object-cover"
                          />
                        </a>
                      ) : type.startsWith("video/") ? (
                        <video src={url} controls className="max-h-80 w-full rounded-xl" />
                      ) : (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold underline-offset-2 hover:underline"
                        >
                          <span>📎</span>
                          <span className="min-w-0 truncate">{m.attachmentName ?? "Файл"}</span>
                        </a>
                      )}
                    </div>
                    <div className={`px-3 pb-2 text-right text-[10px] ${isOwn ? "text-on-primary/70" : "text-muted"}`}>
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={m.id} className={`flex min-w-0 ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`min-w-0 max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line wrap-break-word ${
                    isOwn ? "bg-primary text-on-primary" : "border border-border bg-bg text-ink"
                  }`}
                >
                  {!isOwn && (
                    <div className="mb-1 text-[11px] font-bold opacity-60">{senderLabel[m.sender]}</div>
                  )}
                  {m.text}
                  <div className={`mt-1 text-right text-[10px] ${isOwn ? "text-on-primary/70" : "text-muted"}`}>
                    {formatTime(m.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
          {showOrderDraft && calculatorOptions && (
            <div className="flex min-w-0 justify-end">
              <ChatOrderCalculator
                chatId={chatId}
                options={calculatorOptions}
                onCancel={() => setShowOrderDraft(false)}
                onCreated={() => {
                  setShowOrderDraft(false);
                  fetchMessages();
                }}
              />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSend} className="shrink-0 border-t border-border bg-bg px-4 py-3.5 sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2.5">
          {canOrder && (
            <button
              type="button"
              onClick={() => setShowOrderDraft((v) => !v)}
              aria-label="Сделать заказ"
              className={`flex h-10.5 shrink-0 items-center gap-1 rounded-full border px-4 text-[13px] font-bold whitespace-nowrap transition-colors ${
                showOrderDraft
                  ? "border-primary bg-primary text-on-primary"
                  : "border-border bg-surface text-ink hover:border-primary"
              }`}
            >
              Сделать заказ +
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            aria-label="Прикрепить файл"
            title="Прикрепить файл"
            className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-lg text-ink transition-colors hover:border-primary disabled:opacity-50"
          >
            {uploading ? "…" : "📎"}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Написать сообщение…"
            className="flex-1 rounded-[20px] border border-border bg-surface px-3.5 py-3 text-sm text-ink outline-none"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-on-primary disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}
