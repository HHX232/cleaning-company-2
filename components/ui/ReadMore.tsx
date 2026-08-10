"use client";

import { useState } from "react";

type ReadMoreProps = {
  children: React.ReactNode;
  collapsedHeight?: number;
};

export default function ReadMore({ children, collapsedHeight = 56 }: ReadMoreProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: open ? 2000 : collapsedHeight }}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 text-sm font-bold text-primary transition-colors duration-150 hover:text-primary-dark"
      >
        {open ? "Скрыть" : "Подробнее"}
      </button>
    </div>
  );
}
