"use client";

import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { contactLinks } from "@/lib/content";
import { consultationCta } from "@/lib/serviceCategoryContent";
import { useContactModal } from "@/components/landing/ContactModalProvider";
import { TelegramIcon, ViberIcon, WhatsAppIcon } from "@/components/ui/MessengerIcons";

const messengers = [
  { key: "telegram", label: "Telegram", href: contactLinks.telegram, icon: <TelegramIcon className="h-7 w-7" /> },
  { key: "viber", label: "Viber", href: contactLinks.viber, icon: <ViberIcon className="h-7 w-7" /> },
  { key: "whatsapp", label: "WhatsApp", href: contactLinks.whatsapp, icon: <WhatsAppIcon className="h-7 w-7" /> },
];

type ConsultationCtaProps = {
  imageUrl?: string | null;
};

export default function ConsultationCta({ imageUrl }: ConsultationCtaProps) {
  const openContactModal = useContactModal();

  return (
    <section className="px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-14 lg:px-10">
      <div className="relative mx-auto min-h-88 max-w-300 overflow-hidden rounded-3xl sm:min-h-100">
        <ImagePlaceholder label="Фото: клинеры за работой" src={imageUrl ?? undefined} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(21,35,24,0.9)_0%,rgba(21,35,24,0.6)_50%,rgba(21,35,24,0.15)_100%)]" />

        <div className="relative flex h-full max-w-140 flex-col justify-center p-7 sm:p-11">
          <div className="mb-2 text-sm font-bold text-primary">{consultationCta.eyebrow}</div>
          <h2 className="mb-4 text-2xl leading-tight font-extrabold text-white sm:text-[32px]">
            {consultationCta.title}
          </h2>
          <p className="mb-3 text-sm font-semibold text-white/90">{consultationCta.subtitle}</p>
          <ul className="mb-7 flex flex-col gap-2 border-l-2 border-primary pl-4 text-sm leading-relaxed text-white/90">
            {consultationCta.perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={openContactModal}
              className="rounded-[10px] bg-primary px-7 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98]"
            >
              {consultationCta.ctaLabel}
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
      </div>
    </section>
  );
}
