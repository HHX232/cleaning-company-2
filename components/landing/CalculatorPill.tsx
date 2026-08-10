"use client";

type PillProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Pill({ active, onClick, children, className = "" }: PillProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border border-border font-bold transition-all duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${className}`}
      style={{
        background: active ? "var(--color-primary)" : "var(--color-bg)",
        color: active ? "var(--color-on-primary)" : "var(--color-ink)",
      }}
    >
      {children}
    </div>
  );
}

export function EmptyGroupNotice() {
  return <p className="text-xs text-muted">Опции временно недоступны</p>;
}
