"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@prisma/client";
import {
  buildTimelineSteps,
  deriveStatus,
  formatRuDate,
  kindPresentationFor,
  statusPresentation,
  timelineSegments,
} from "@/lib/orderStatus";
import { cancelMyOrder } from "@/lib/orderActions";
import { toast } from "sonner";

export default function OrdersList({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [canceling, setCanceling] = useState<string | null>(null);

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleCancel(id: string) {
    setCanceling(id);
    const toastId = toast.loading("Отменяем заказ…");
    const result = await cancelMyOrder(id);
    setCanceling(null);

    if (!result.ok) {
      toast.error(result.message, { id: toastId });
      return;
    }
    toast.success(result.message, { id: toastId });
    router.refresh();
  }

  if (orders.length === 0) {
    return <p className="text-sm text-muted">Заказов пока нет.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((o) => {
        const status = deriveStatus(o);
        const presentation = statusPresentation[status];
        const kind = kindPresentationFor(o.kind);
        const isOpen = !!expanded[o.id];

        return (
          <div key={o.id} className="overflow-hidden rounded-2xl border border-border bg-bg">
            <button
              type="button"
              onClick={() => toggle(o.id)}
              className="flex w-full flex-wrap items-center gap-3 px-4 py-4 text-left hover:brightness-95 sm:gap-4.5 sm:px-5.5"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kind.iconBgClass}`}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={kind.iconColorClass}
                  stroke="currentColor"
                >
                  <path d={kind.iconPath} />
                </svg>
              </div>

              <div className="min-w-40 flex-1">
                <div className="text-sm font-bold text-ink">{o.title}</div>
                <div className="mt-0.5 text-xs text-muted">
                  {formatRuDate(o.date)} · {o.address}
                </div>
              </div>

              <div className="flex w-22.5 items-center gap-0.5">
                {timelineSegments(status).map((seg, i) => (
                  <div key={i} className={`h-1.25 flex-1 rounded-full ${seg.filled ? "bg-primary" : "bg-border"}`} />
                ))}
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap ${presentation.bgClass} ${presentation.textClass}`}
              >
                {presentation.label}
              </span>

              <span className="w-20 text-right text-sm font-bold text-ink">{o.price} руб.</span>
              <span className="w-4 text-center text-base text-muted">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div className="grid grid-cols-2 gap-4 px-5.5 pb-5.5 sm:pl-21.5 lg:grid-cols-4">
                {buildTimelineSteps(o).map((step, i) => (
                  <div key={i}>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className={`h-2.25 w-2.25 shrink-0 rounded-full ${step.dotClass}`} />
                      <span className="text-xs font-bold text-ink">{step.label}</span>
                    </div>
                    <div className="pl-4.25 text-[11px] text-muted">{step.time}</div>
                  </div>
                ))}
                <div className="col-span-2 flex flex-wrap items-center gap-5 border-t border-border pt-3.5 text-[13px] text-muted lg:col-span-4">
                  <span>Услуга: {o.serviceDetail}</span>
                  <span>Бригада: {o.staff}</span>
                  <span>Оплата: {o.payment}</span>
                  {(status === "scheduled" || status === "progress") && (
                    <button
                      type="button"
                      onClick={() => handleCancel(o.id)}
                      disabled={canceling === o.id}
                      className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-[#b23434] hover:bg-surface disabled:opacity-60"
                    >
                      Отменить заказ
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
