"use client";

import { useState } from "react";
import { contactLinks } from "@/lib/content";
import { TelegramIcon, ViberIcon, WhatsAppIcon } from "@/components/ui/MessengerIcons";

const messengerItems = [
  { key: "whatsapp", label: "WhatsApp", href: contactLinks.whatsapp, icon: <WhatsAppIcon className="h-7 w-7" /> },
  { key: "viber", label: "Viber", href: contactLinks.viber, icon: <ViberIcon className="h-7 w-7" /> },
  { key: "telegram", label: "Telegram", href: contactLinks.telegram, icon: <TelegramIcon className="h-7 w-7" /> },
];

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  const itemLabelClass =
    "rounded-full bg-black/80 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-lg";
  const messengerIconClass =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-150 hover:scale-105";

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {open &&
        messengerItems.map((item, i) => {
          const isExternal = item.href.startsWith("http") || item.href.startsWith("viber:");
          return (
            <a
              key={item.key}
              href={item.href}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center gap-3 opacity-0 transition-all duration-200 ease-out"
              style={{ animation: `fab-item-in 200ms ease-out ${i * 40}ms forwards` }}
            >
              <span className={itemLabelClass}>{item.label}</span>
              <span className={messengerIconClass}>{item.icon}</span>
            </a>
          );
        })}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Скрыть контакты" : "Показать контакты"}
        aria-expanded={open}
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)] active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-6 w-6 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" fill="currentColor" stroke="none" />
          )}
        </svg>
      </button>
    </div>
  );
}
