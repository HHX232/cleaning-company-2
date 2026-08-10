"use client";

import { useCallback, useRef, useState } from "react";
import ImagePlaceholder from "./ImagePlaceholder";

type BeforeAfterSliderProps = {
  beforeLabel: string;
  afterLabel: string;
  beforeSrc?: string;
  afterSrc?: string;
  className?: string;
};

export default function BeforeAfterSlider({
  beforeLabel,
  afterLabel,
  beforeSrc,
  afterSrc,
  className = "",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(50);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };
  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={`relative touch-none overflow-hidden select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="absolute inset-0">
        <ImagePlaceholder label={afterLabel} src={afterSrc} />
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <ImagePlaceholder label={beforeLabel} src={beforeSrc} />
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 rounded-[6px] bg-black/55 px-3 py-1.5 text-xs font-bold text-white">
        До
      </div>
      <div className="pointer-events-none absolute right-3 bottom-3 rounded-[6px] bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
        После
      </div>

      <div
        className="pointer-events-none absolute top-0 bottom-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
        style={{ left: `${position}%` }}
      />
      <div
        className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-ink shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
      >
        <span className="text-xs leading-none">↔</span>
      </div>
    </div>
  );
}
