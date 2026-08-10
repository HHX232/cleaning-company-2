"use client";

import { useState } from "react";
import { priceData, priceTabs, PriceTabId } from "@/lib/content";

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<PriceTabId>("flats");

  return (
    <section id="prices" className="px-4 pt-6 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">
        Цены на клининг в Минске
      </h2>
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 lg:grid-cols-[220px_1fr] lg:gap-5">
        <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 sm:pb-0 lg:sticky lg:top-6 lg:h-fit lg:flex-col lg:self-start lg:overflow-visible">
          {priceTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="cursor-pointer rounded-[10px] p-4 text-center text-sm font-bold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: isActive ? "var(--color-primary)" : "var(--color-surface)",
                  color: isActive ? "var(--color-on-primary)" : "var(--color-ink)",
                }}
              >
                {tab.label}
              </div>
            );
          })}
        </div>
        <div className="overflow-hidden rounded-[14px] border border-border">
          {priceData[activeTab].map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-border px-4 py-4 sm:grid-cols-[1fr_130px_auto] sm:gap-4 sm:px-6 sm:py-4.5"
            >
              <span className="text-sm font-semibold text-ink sm:text-[15px]">{row.name}</span>
              <span className="hidden text-sm text-muted sm:block">{row.price}</span>
              <a
                href="#order"
                className="col-start-2 row-start-1 justify-self-end rounded-lg bg-primary px-3.5 py-2 text-xs font-bold whitespace-nowrap text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-[0.98] sm:col-start-3 sm:row-start-auto sm:justify-self-auto sm:px-4.5 sm:py-2.5 sm:text-[13px]"
              >
                подробнее
              </a>
              <span className="col-span-2 text-xs text-muted sm:hidden">{row.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
