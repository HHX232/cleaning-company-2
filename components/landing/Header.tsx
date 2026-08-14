"use client";

import Image from "next/image";
import Link from "next/link";
import { company, contactLinks } from "@/lib/content";
import { TelegramIcon, ViberIcon, WhatsAppIcon } from "@/components/ui/MessengerIcons";
import { useContactModal } from "./ContactModalProvider";

type HeaderProps = {
  tagline?: string;
};

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
          <a href={`mailto:${company.email}`} className="block text-muted hover:text-primary">
            {company.email}
          </a>
        </div>

        <button
          type="button"
          onClick={openContactModal}
          className="cursor-pointer rounded-[10px] bg-primary px-4 py-2.5 text-sm font-bold whitespace-nowrap text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] active:translate-y-0 active:scale-[0.98] sm:px-6.5 sm:py-3.5"
        >
          Заказать звонок
        </button>
      </div>
    </header>
  );
}
