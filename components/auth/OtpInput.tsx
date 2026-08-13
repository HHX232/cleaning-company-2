"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  length?: number;
  disabled?: boolean;
};

// Six-box one-time-code input: auto-advances on type, backspaces to the
// previous box when empty, and accepts a pasted code across all boxes.
export default function OtpInput({ value, onChange, onComplete, length = 6, disabled }: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const focus = (i: number) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, i))];
    el?.focus();
    el?.select();
  };

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
    return clean;
  };

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const arr = value.padEnd(length).split("").map((c) => (c === " " ? "" : c));
    arr[i] = digit;
    commit(arr.join(""));
    focus(i + 1);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = value.padEnd(length).split("").map((c) => (c === " " ? "" : c));
      if (arr[i]) {
        arr[i] = "";
        onChange(arr.join("").replace(/\s/g, ""));
      } else if (i > 0) {
        arr[i - 1] = "";
        onChange(arr.join("").replace(/\s/g, ""));
        focus(i - 1);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focus(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focus(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const next = commit(e.clipboardData.getData("text"));
    focus(Math.min(next.length, length - 1));
  };

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          autoFocus={i === 0}
          className="h-12 w-full rounded-lg border border-border bg-bg text-center text-lg font-bold text-ink outline-none transition-colors focus:border-primary disabled:opacity-60 sm:h-14"
        />
      ))}
    </div>
  );
}
