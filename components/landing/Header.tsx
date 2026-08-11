"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { company, contactLinks } from "@/lib/content";
import { TelegramIcon, ViberIcon, WhatsAppIcon } from "@/components/ui/MessengerIcons";
import { useContactModal } from "./ContactModalProvider";

const UNREAD_POLL_INTERVAL_MS = 9000;

type HeaderProps = {
  tagline?: string;
};

function ProfilePreview() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;
    async function poll() {
      // Skip polling while the tab is backgrounded; refresh when it returns.
      if (document.visibilityState === "hidden") return;
      const res = await fetch("/api/chat/unread-count");
      if (!res.ok || cancelled) return;
      const data: { count: number } = await res.json();
      if (!cancelled) setUnreadCount(data.count);
    }

    poll();
    const interval = setInterval(poll, UNREAD_POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [session]);

  if (status === "loading") return null;

  if (!session) {
    return (
      <Link
        href="/login"
        className="rounded-[10px] border border-border px-4 py-2.5 text-sm font-bold whitespace-nowrap text-ink transition-colors hover:bg-surface"
      >
        Войти
      </Link>
    );
  }

  const email = session.user.email ?? "";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary sm:h-11.5 sm:w-11.5"
      >
        {email.charAt(0).toUpperCase()}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-bg bg-[#d94b4b] px-1 text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Закрыть меню профиля"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-border bg-surface p-3 shadow-lg">
            <div className="mb-2 truncate text-sm font-semibold text-ink">{email}</div>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="mb-1.5 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-center text-sm font-semibold text-ink hover:bg-bg"
            >
              Личный кабинет
              {unreadCount > 0 && (
                <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#d94b4b] px-1 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/" })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm font-semibold text-ink hover:bg-bg"
            >
              Выйти
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Header({ tagline = company.tagline }: HeaderProps) {
  const openContactModal = useContactModal();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-385 flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:gap-6 sm:px-6 sm:py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3.5">
          <Image
            src="/images/logos/specializirovanny-cleaning-logo-green (4).svg"
            alt={company.name}
            width={80}
            height={80}
            className="h-16 w-16 shrink-0 rounded-xl object-contain sm:h-20 sm:w-20"
          />
          <div>
            <div className="text-sm leading-tight font-extrabold tracking-tight text-ink sm:text-base">
              {company.name}
            </div>
            <div className="text-xs leading-tight text-muted">{tagline}</div>
          </div>
        </Link>

        <div className="hidden min-w-40 text-[13px] leading-snug text-muted md:block">Работаем по всей Беларуси</div>

        <div className="hidden items-center gap-2.5 lg:flex">
          <a
            href={contactLinks.viber}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Viber"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 hover:scale-105"
          >
            <ViberIcon className="h-6 w-6" />
          </a>
          <a
            href={contactLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 hover:scale-105"
          >
            <WhatsAppIcon className="h-6 w-6" />
          </a>
          <a
            href={contactLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 hover:scale-105"
          >
            <TelegramIcon className="h-6 w-6" />
          </a>
        </div>

        <div className="hidden text-sm leading-relaxed sm:block">
          <a href={`tel:+${company.phone.replace(/\D/g, "")}`} className="block font-bold text-ink hover:text-primary">
            {company.phone}
          </a>
          <div className="text-muted">{company.email}</div>
        </div>

        <button
          type="button"
          onClick={openContactModal}
          className="cursor-pointer rounded-[10px] bg-primary px-4 py-2.5 text-sm font-bold whitespace-nowrap text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] active:translate-y-0 active:scale-[0.98] sm:px-6.5 sm:py-3.5"
        >
          Заказать звонок
        </button>

        <ProfilePreview />
      </div>
    </header>
  );
}
