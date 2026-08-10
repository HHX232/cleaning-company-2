"use client";

import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { contactLinks } from "@/lib/content";
import { officeMidBanner } from "@/lib/serviceCategoryContent";
import { useContactModal } from "@/components/landing/ContactModalProvider";
import { TelegramIcon, ViberIcon, WhatsAppIcon } from "@/components/ui/MessengerIcons";

const messengers = [
  { key: "telegram", label: "Telegram", href: contactLinks.telegram, icon: <TelegramIcon className="h-7 w-7" /> },
  { key: "viber", label: "Viber", href: contactLinks.viber, icon: <ViberIcon className="h-7 w-7" /> },
  { key: "whatsapp", label: "WhatsApp", href: contactLinks.whatsapp, icon: <WhatsAppIcon className="h-7 w-7" /> },
];

export default function MidPageCta() {
  const openContactModal = useContactModal();
  const { staffBadge, title, paragraphs, ctaLabel } = officeMidBanner;

  return (
    <section className="px-4 pt-10 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <div className="relative mx-auto max-w-300 overflow-hidden rounded-3xl bg-dark p-7 sm:p-11">
        <div className="pointer-events-none absolute top-[-60px] right-[-60px] h-55 w-55 rounded-full bg-primary opacity-[0.18]" />

        <div className="relative mb-5 flex items-center gap-3 lg:hidden">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
            <ImagePlaceholder label={`Фото: ${staffBadge.name}`} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{staffBadge.name}</div>
            <div className="text-xs text-[#cfe0d2]">{staffBadge.roles.join(" · ")}</div>
          </div>
        </div>

        <h2 className="relative mb-4 max-w-160 text-xl leading-tight font-extrabold text-white sm:text-2xl">
          {title}
        </h2>
        <div className="relative mb-6 flex max-w-160 flex-col gap-3 text-sm leading-relaxed text-[#cfe0d2]">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <div className="relative flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={openContactModal}
            className="rounded-[10px] bg-primary px-7 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98]"
          >
            {ctaLabel}
          </button>
          <div className="flex items-center gap-3">
            {messengers.map((m) => (
              <a
                key={m.key}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={m.label}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-150 hover:scale-105"
              >
                {m.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
