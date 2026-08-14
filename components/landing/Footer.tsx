import Image from "next/image";
import Link from "next/link";
import { company, contactLinks, feedbackEmail } from "@/lib/content";
import { TelegramIcon, ViberIcon, WhatsAppIcon } from "@/components/ui/MessengerIcons";

const serviceLinks = [
  { label: "Уборка квартир", href: "/#catalog" },
  { label: "Уборка домов", href: "/#catalog" },
  { label: "Уборка помещений", href: "/#catalog" },
  { label: "Мойка окон", href: "/#catalog" },
  { label: "Спецуборка", href: "/#catalog" },
];
const companyLinks = [
  { label: "О компании", href: "/o-kompanii" },
  { label: "Почему выбирают нас", href: "/pochemu-vybirayut-nas" },
  { label: "Наши гарантии", href: "/nashi-garantii" },
  { label: "Цены", href: "/#prices" },
  { label: "Контакты", href: "/contacts" },
];

type FooterProps = {
  /** Anchor id CTAs across the page scroll to. Omit when the page has its own contact section. */
  id?: string;
};

export default function Footer({ id }: FooterProps) {
  return (
    <footer id={id} className="bg-dark px-4 pt-10 pb-6 text-[#f0f0f0] sm:px-6 sm:pt-12 sm:pb-7 lg:px-10">
      <div className="mx-auto mb-8 grid max-w-[1200px] grid-cols-2 gap-6 sm:gap-9 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-3.5 flex items-center gap-3">
            <Image
              src="/images/logos/specializirovanny-cleaning-logo-green (4).svg"
              alt={company.name}
              width={96}
              height={96}
              className="h-24 w-24 shrink-0 rounded-xl object-contain sm:h-16 sm:w-16"
            />
            <span className="hidden text-[15px] leading-tight font-extrabold text-white sm:inline">
              {company.name}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-[#b8b8b8]">
            Клининговая компания полного цикла. Работаем по всей Беларуси, на связи 24/7.
          </p>
        </div>
        <div>
          <div className="mb-3.5 text-sm font-bold text-white">Услуги</div>
          <div className="flex flex-col gap-2.5 text-[13px] text-[#b8b8b8]">
            {serviceLinks.map((s) => (
              <a key={s.label} href={s.href} className="transition-colors hover:text-white">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-3.5 text-sm font-bold text-white">Компания</div>
          <div className="flex flex-col gap-2.5 text-[13px] text-[#b8b8b8]">
            {companyLinks.map((c) =>
              c.href ? (
                <a key={c.label} href={c.href} className="transition-colors hover:text-white">
                  {c.label}
                </a>
              ) : (
                <span key={c.label}>{c.label}</span>
              ),
            )}
          </div>
        </div>
        <div>
          <div className="mb-3.5 text-sm font-bold text-white">Контакты</div>
          <div className="flex flex-col gap-2.5 text-[13px] text-[#b8b8b8]">
            <a href={`tel:+${company.phone.replace(/\D/g, "")}`} className="transition-colors hover:text-white">
              {company.phone}
            </a>
            <span>{company.city}, работаем по всей Беларуси</span>
            <a href={contactLinks.email} className="transition-colors hover:text-white">
              {feedbackEmail}
            </a>
          </div>
          <div className="mt-4 flex items-center gap-2.5">
            <a
              href={contactLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href={contactLinks.viber}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Viber"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <ViberIcon className="h-5 w-5" />
            </a>
            <a
              href={contactLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <TelegramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-2 border-t border-white/[0.12] pt-5 text-xs text-[#8a8a8a]">
        <span>© 2026 {company.name}. Все права защищены.</span>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/privacy" className="transition-colors hover:text-white">
            Политика конфиденциальности
          </Link>
          <Link href="/terms" className="transition-colors hover:text-white">
            Пользовательское соглашение
          </Link>
        </div>
      </div>
    </footer>
  );
}
