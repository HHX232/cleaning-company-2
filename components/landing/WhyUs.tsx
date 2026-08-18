"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { whyUsReasons } from "@/lib/content";

type WhyUsProps = {
  slideSrcs: (string | undefined)[];
};

const AUTOPLAY_MS = 6000;
const PAUSE_AFTER_INTERACTION_MS = 9000;

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function WhyUs({ slideSrcs }: WhyUsProps) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastInteraction = useRef(0);
  const count = whyUsReasons.length;

  // Scroll only the horizontal track, never the page: scrollIntoView() also
  // nudges vertical scroll to reveal the target, which yanks the whole page
  // back up to this section on every autoplay tick if the user has scrolled
  // past it. getBoundingClientRect() deltas stay purely horizontal.
  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;
    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    track.scrollTo({ left: track.scrollLeft + (slideRect.left - trackRect.left), behavior: "smooth" });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const next = (index + count) % count;
      lastInteraction.current = Date.now();
      setActive(next);
      scrollToIndex(next);
    },
    [count, scrollToIndex],
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - lastInteraction.current < PAUSE_AFTER_INTERACTION_MS) return;
      setActive((current) => {
        const next = (current + 1) % count;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, scrollToIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const index = slideRefs.current.indexOf(mostVisible.target as HTMLDivElement);
        if (index !== -1) setActive(index);
      },
      { root: track, threshold: [0.6] },
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="px-4 pt-8 pb-8 sm:px-6 sm:pt-10 sm:pb-10 lg:px-10">
      <div className="mx-auto mb-5 flex max-w-300 flex-wrap items-end justify-between gap-3 sm:mb-7">
        <h2 className="text-2xl font-extrabold text-ink sm:text-[30px]">Причины заказать уборку</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Предыдущая причина"
            onClick={() => goTo(active - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors duration-150 hover:border-primary hover:text-primary"
          >
            <ArrowIcon className="rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Следующая причина"
            onClick={() => goTo(active + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors duration-150 hover:border-primary hover:text-primary"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onPointerDown={() => {
          lastInteraction.current = Date.now();
        }}
        className="mx-auto flex max-w-300 snap-x snap-mandatory gap-4 overflow-x-auto pb-1 scrollbar-none touch-pan-x"
      >
        {whyUsReasons.map((reason, i) => (
          <div
            key={reason.title}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="relative min-h-80 w-full shrink-0 snap-start overflow-hidden rounded-3xl bg-dark sm:min-h-96 lg:min-h-115 lg:w-[calc(50%-8px)]"
          >
            <ImagePlaceholder label={`Фото: ${reason.tag}`} src={slideSrcs[i]} className="absolute inset-0" />
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,18,13,0.96)_0%,rgba(8,18,13,0.82)_32%,rgba(8,18,13,0.4)_60%,rgba(8,18,13,0.18)_100%)]" />
            <div className="relative flex h-full max-w-115 flex-col justify-end p-6 sm:p-10">
              <span className="mb-3 inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary sm:text-sm">
                {reason.tag}
              </span>
              <h3 className="mb-2 text-xl leading-tight font-extrabold text-white sm:text-2xl lg:text-[28px]">
                {reason.title}
              </h3>
              <p className="max-w-100 text-sm leading-relaxed text-white/85 sm:text-base">{reason.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-300 items-center gap-2">
        {whyUsReasons.map((reason, i) => (
          <button
            key={reason.title}
            type="button"
            aria-label={`Причина ${i + 1}: ${reason.title}`}
            aria-current={active === i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-200 ${
              active === i ? "w-7 bg-primary" : "w-2 bg-border hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
