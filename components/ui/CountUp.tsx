"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1300;

// Splits a stat string into an animatable single number plus surrounding text:
// "500+" -> {prefix:"", num:500, suffix:"+"}, "5 лет" -> {"",5," лет"}.
// Strings with zero or multiple number runs (e.g. "24/7") return null and are
// shown static — animating "1/7 → 24/7" would read as a fraction.
function parse(value: string): { prefix: string; num: number; suffix: string } | null {
  const runs = value.match(/\d+/g);
  if (!runs || runs.length !== 1) return null;
  const idx = value.indexOf(runs[0]);
  return { prefix: value.slice(0, idx), num: Number(runs[0]), suffix: value.slice(idx + runs[0].length) };
}

export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Initial render (SSR + first client paint) shows the final value, so there's
  // no hydration mismatch and no-JS users still see the real number.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const parsed = parse(value);
    const el = ref.current;
    if (!parsed || !el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let started = false;
    const animate = () => {
      const startTime = performance.now();
      const from = 1;
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / DURATION);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const current = Math.round(from + (parsed.num - from) * eased);
        setDisplay(`${parsed.prefix}${current}${parsed.suffix}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            animate();
            obs.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
