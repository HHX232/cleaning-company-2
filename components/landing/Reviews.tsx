"use client";

import { useState } from "react";

const PER_PAGE = 3;

export type ReviewItem = { id: string; stars: number; text: string; service: string };

export default function Reviews({ reviews }: { reviews: ReviewItem[] }) {
  const [page, setPage] = useState(0);

  if (reviews.length === 0) return null;

  const pageCount = Math.ceil(reviews.length / PER_PAGE);

  const prev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
  const next = () => setPage((p) => (p + 1) % pageCount);

  return (
    <section id="reviews" className="bg-surface px-4 pt-6 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">Отзывы клиентов</h2>
      <div className="mx-auto flex max-w-300 items-center gap-2 sm:gap-4">
        {pageCount > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Предыдущие отзывы"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-xl font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary active:translate-y-0 sm:h-11 sm:w-11"
          >
            ‹
          </button>
        )}

        <div className="flex-1 overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {Array.from({ length: pageCount }).map((_, p) => (
              <div key={p} className="grid w-full shrink-0 grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                {reviews.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE).map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border bg-bg p-5 sm:p-7">
                    <div className="mb-3 text-base tracking-[2px] text-primary">
                      {"★".repeat(r.stars)}
                      {"☆".repeat(Math.max(0, 5 - r.stars))}
                    </div>
                    <p className="mb-4 font-mono text-sm leading-relaxed text-muted">{r.text}</p>
                    <div className="text-sm font-bold text-ink">{r.service}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {pageCount > 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Следующие отзывы"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-xl font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary active:translate-y-0 sm:h-11 sm:w-11"
          >
            ›
          </button>
        )}
      </div>

      {pageCount > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: pageCount }).map((_, p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-label={`Страница отзывов ${p + 1}`}
              className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                p === page ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
