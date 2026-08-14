"use client";

import Link from "next/link";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useContactModal } from "./ContactModalProvider";

export type ServiceBlockData = {
  slotId: string;
  title: string;
  columns: number;
  items: string[];
};

type ServicesDetailProps = {
  bigServices: ServiceBlockData[];
  smallServices: ServiceBlockData[];
  imageSrcBySlot?: Record<string, string>;
};

// Caps a block's checklist to 10 real items, plus an 11th "и другое" line
// when there's more — an admin-editable list (see /admin/services) can grow
// past what looks good in a card.
const MAX_CHECKLIST_ITEMS = 10;
function displayItems(items: string[]): string[] {
  if (items.length <= MAX_CHECKLIST_ITEMS) return items;
  return [...items.slice(0, MAX_CHECKLIST_ITEMS), "и другое"];
}

export default function ServicesDetail({ bigServices, smallServices, imageSrcBySlot = {} }: ServicesDetailProps) {
  const openContactModal = useContactModal();

  // The big-service row is admin-editable in count, so the column layout adapts:
  // one block goes full width, exactly two keep the designed asymmetric hero
  // look, three or more fall back to even pairs.
  const bigGridClass =
    bigServices.length === 1
      ? "grid-cols-1"
      : bigServices.length === 2
        ? "grid-cols-1 lg:grid-cols-[1.4fr_1fr]"
        : "grid-cols-1 sm:grid-cols-2";

  return (
    <section id="catalog" className="px-4 pt-6 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">
        <Link href="/#calculator" className="transition-colors hover:text-primary">
          Наши услуги
        </Link>
      </h2>

      {bigServices.length > 0 && (
      <div className={`mx-auto mb-5 grid max-w-[1200px] gap-5 ${bigGridClass}`}>
        {bigServices.map((svc) => (
          <div key={svc.slotId} className="relative min-h-64 overflow-hidden rounded-[18px] bg-dark sm:min-h-[300px]">
            <ImagePlaceholder
              label={`Фото услуги: ${svc.title}`}
              src={imageSrcBySlot[svc.slotId]}
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--color-dark)_0%,var(--color-hero-fade)_55%,transparent_100%)]" />
            <div className="relative px-5 py-5 sm:px-7 sm:py-6.5">
              <h3 className="mb-3 text-lg font-extrabold text-white sm:mb-4 sm:text-[22px]">{svc.title}</h3>
              {(() => {
                const items = displayItems(svc.items);
                const renderItem = (it: string) => (
                  <div key={it} className="flex items-start gap-2 text-[13px] leading-snug text-[#f0f0f0] sm:text-sm">
                    <span className="font-extrabold text-primary">✓</span>
                    {it}
                  </div>
                );
                if (svc.columns !== 2) {
                  return <div className="mb-4 flex flex-col gap-1.5 sm:mb-5">{items.map(renderItem)}</div>;
                }
                // Two independent columns (not one interleaved grid) so a
                // longer, wrapping item on one side doesn't stretch the row
                // and misalign the other column's checkmarks.
                const half = Math.ceil(items.length / 2);
                return (
                  <div className="mb-4 grid grid-cols-2 gap-x-4 sm:mb-5 sm:gap-x-5.5">
                    <div className="flex flex-col gap-1.5">{items.slice(0, half).map(renderItem)}</div>
                    <div className="flex flex-col gap-1.5">{items.slice(half).map(renderItem)}</div>
                  </div>
                );
              })()}
              <button
                type="button"
                onClick={openContactModal}
                className="inline-block cursor-pointer rounded-[9px] bg-primary px-5.5 py-2.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98]"
              >
                Вызвать клининг
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {smallServices.length > 0 && (
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {smallServices.map((svc) => (
          <div key={svc.slotId} className="relative min-h-60 overflow-hidden rounded-[18px] bg-dark sm:min-h-[270px]">
            <ImagePlaceholder
              label={`Фото услуги: ${svc.title}`}
              src={imageSrcBySlot[svc.slotId]}
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--color-dark)_0%,var(--color-hero-fade)_40%,transparent_100%)]" />
            <div className="relative px-5 py-5 sm:px-6 sm:py-5.5">
              <h3 className="mb-3 text-base font-extrabold text-white sm:mb-3.5 sm:text-[19px]">{svc.title}</h3>
              <div className="mb-4 flex flex-col gap-1.5 sm:mb-4.5">
                {displayItems(svc.items).map((it) => (
                  <div key={it} className="flex items-start gap-2 text-[13px] leading-snug text-[#f0f0f0]">
                    <span className="font-extrabold text-primary">✓</span>
                    {it}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={openContactModal}
                className="inline-block cursor-pointer rounded-[9px] bg-primary px-5 py-2.5 text-[13px] font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98]"
              >
                Вызвать клининг
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}
