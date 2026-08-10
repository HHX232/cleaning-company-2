"use client";

import { useState } from "react";

export type FaqItem = { question: string; answer: string };

type FaqProps = {
  title: string;
  items: readonly FaqItem[];
  defaultOpenIndex?: number | null;
};

export default function Faq({ title, items, defaultOpenIndex = null }: FaqProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(defaultOpenIndex);

  return (
    <section className="bg-surface px-4 pt-6 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">{title}</h2>
      <div className="mx-auto flex max-w-[840px] flex-col gap-3">
        {items.map((q, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={q.question} className="overflow-hidden rounded-xl border border-border bg-bg">
              <div
                onClick={() => setOpenIdx((cur) => (cur === idx ? null : idx))}
                className="flex cursor-pointer items-center justify-between gap-3 px-4 py-4 transition-colors duration-200 hover:bg-surface sm:gap-4 sm:px-5.5 sm:py-4.5"
              >
                <span className="text-sm font-bold text-ink sm:text-[15px]">
                  {String(idx + 1).padStart(2, "0")}&nbsp;&nbsp;{q.question}
                </span>
                <span
                  className={`shrink-0 text-xl font-bold text-primary transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </div>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 text-sm leading-relaxed text-muted sm:px-5.5 sm:pb-5">{q.answer}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
