"use client";

import { company } from "@/lib/content";
import { useContactModal } from "@/components/landing/ContactModalProvider";

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function ContactCards() {
  const openContactModal = useContactModal();

  const cardClass =
    "rounded-2xl border border-border bg-surface p-6 text-center transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.1)]";

  return (
    <section className="px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-14 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">Свяжитесь с нами</h2>
      <div className="mx-auto grid max-w-300 grid-cols-2 gap-4 sm:gap-4.5 lg:grid-cols-4">
        <div className={cardClass}>
          <svg {...iconProps} className="mx-auto mb-3 text-primary">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <div className="mb-1 text-sm font-bold text-ink">Позвонить</div>
          <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="text-[13px] font-bold text-primary">
            {company.phone}
          </a>
        </div>

        <button type="button" onClick={openContactModal} className={cardClass}>
          <svg {...iconProps} className="mx-auto mb-3 text-primary">
            <path d="M4 4h16v12H8l-4 4z" />
          </svg>
          <div className="mb-1 text-sm font-bold text-ink">Написать в чат</div>
          <span className="text-[13px] font-bold text-primary">Открыть чат</span>
        </button>

        <div className={cardClass}>
          <svg {...iconProps} className="mx-auto mb-3 text-primary">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <div className="mb-1 text-sm font-bold text-ink">Написать на почту</div>
          <a href={`mailto:${company.email}`} className="text-[13px] font-bold text-primary">
            {company.email}
          </a>
        </div>

        <div className={cardClass}>
          <svg {...iconProps} className="mx-auto mb-3 text-primary">
            <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div className="mb-1 text-sm font-bold text-ink">Работаем по всей РБ</div>
          <span className="text-[13px] text-muted">{company.city} и другие города</span>
        </div>
      </div>
    </section>
  );
}
