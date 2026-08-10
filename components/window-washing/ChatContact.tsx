"use client";

import { chatPreview } from "@/lib/windowWashingContent";
import { useContactModal } from "@/components/landing/ContactModalProvider";

export default function ChatContact() {
  const openContactModal = useContactModal();

  return (
    <section className="px-4 pb-8 sm:px-6 sm:pb-10 lg:px-10">
      <div className="mx-auto grid max-w-300 grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative flex flex-col justify-center overflow-hidden rounded-[22px] bg-dark p-7 sm:p-10">
          <div className="pointer-events-none absolute top-[-60px] right-[-60px] h-55 w-55 rounded-full bg-primary opacity-[0.18]" />
          <div className="relative mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase">
            Быстрее, чем звонок
          </div>
          <h2 className="relative mb-3.5 text-xl leading-tight font-extrabold text-white sm:text-2xl">
            Оформите заявку прямо в чате
          </h2>
          <p className="relative mb-6 max-w-100 text-sm leading-relaxed text-[#cfe0d2]">
            Опишите задачу, пришлите фото витрины — ответим и рассчитаем стоимость в течение 15 минут.
          </p>
          <button
            type="button"
            onClick={openContactModal}
            className="relative inline-flex w-fit items-center gap-2.5 rounded-[11px] bg-primary px-7 py-3.5 text-sm font-extrabold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98]"
          >
            Написать в чат
            <svg
              width={17}
              height={17}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col justify-center gap-2.5 rounded-[22px] border border-border bg-surface p-6">
          {chatPreview.map((m, i) => (
            <div key={i} className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                  m.from === "client" ? "bg-primary text-on-primary" : "bg-bg text-ink"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
