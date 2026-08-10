"use client";

import { useState } from "react";
import type { Order } from "@prisma/client";
import { formatRuDate, formatRuDateTime } from "@/lib/orderStatus";

type OrderRowProps = {
  order: Order;
  kindLabel: string;
  statusLabel: string;
  statusBgClass: string;
  statusTextClass: string;
  advance: { action: "assign" | "complete" | "pay"; label: string } | null;
  needsPayment: boolean;
  canCancel: boolean;
  advanceOrderStatus: (orderId: string, action: "assign" | "complete" | "pay" | "cancel") => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  updateOrderSchedule: (orderId: string, formData: FormData) => Promise<void>;
};

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toTimeInputValue(date: Date) {
  return date.toISOString().slice(11, 16);
}

export default function OrderRow({
  order,
  kindLabel,
  statusLabel,
  statusBgClass,
  statusTextClass,
  advance,
  needsPayment,
  canCancel,
  advanceOrderStatus,
  deleteOrder,
  updateOrderSchedule,
}: OrderRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-wrap items-center gap-3 px-3 py-2.5 text-left text-xs hover:bg-surface"
      >
        <span className="font-bold text-ink">{order.title}</span>
        <span className="text-muted">{kindLabel}</span>
        <span className="text-muted">{formatRuDate(order.date)}</span>
        <span className={`rounded-full px-2.5 py-1 font-bold ${statusBgClass} ${statusTextClass}`}>{statusLabel}</span>
        <span className="font-bold text-ink">{order.price} руб.</span>
        <span className="ml-auto text-muted">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-3 border-t border-border px-3 py-3 text-xs">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <span>
              <span className="text-muted">Адрес: </span>
              <span className="text-ink">{order.address}</span>
            </span>
            <span>
              <span className="text-muted">Услуга: </span>
              <span className="text-ink">{order.serviceDetail}</span>
            </span>
            <span>
              <span className="text-muted">Бригада: </span>
              <span className="text-ink">{order.staff}</span>
            </span>
            <span>
              <span className="text-muted">Оплата: </span>
              <span className="text-ink">{order.payment}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-2 text-muted">
            <span>Принят: {formatRuDateTime(order.acceptedAt)}</span>
            <span>Назначен: {order.assignedAt ? formatRuDateTime(order.assignedAt) : "—"}</span>
            <span>Выполнен: {order.completedAt ? formatRuDateTime(order.completedAt) : "—"}</span>
            <span>Оплачен: {order.paidAt ? formatRuDateTime(order.paidAt) : "—"}</span>
            <span>Отменён: {order.canceledAt ? formatRuDateTime(order.canceledAt) : "—"}</span>
          </div>

          <form
            action={updateOrderSchedule.bind(null, order.id)}
            className="flex flex-wrap items-center gap-2 border-t border-border pt-2"
          >
            <label className="text-muted">Дата и время уборки:</label>
            <input
              type="date"
              name="date"
              defaultValue={toDateInputValue(order.date)}
              className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink"
            />
            <input
              type="time"
              name="time"
              defaultValue={toTimeInputValue(order.date)}
              className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink"
            />
            <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
              Сохранить
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2">
            {advance && (
              <form action={advanceOrderStatus.bind(null, order.id, advance.action)}>
                <button type="submit" className="rounded-lg border border-border px-2.5 py-1 font-semibold text-ink hover:bg-surface">
                  {advance.label}
                </button>
              </form>
            )}
            {needsPayment && (
              <form action={advanceOrderStatus.bind(null, order.id, "pay")}>
                <button type="submit" className="rounded-lg border border-border px-2.5 py-1 font-semibold text-ink hover:bg-surface">
                  Отметить оплаченным
                </button>
              </form>
            )}
            {canCancel && (
              <form action={advanceOrderStatus.bind(null, order.id, "cancel")}>
                <button type="submit" className="rounded-lg border border-border px-2.5 py-1 font-semibold text-[#b23434] hover:bg-surface">
                  Отменить
                </button>
              </form>
            )}
            <form action={deleteOrder.bind(null, order.id)}>
              <button type="submit" className="rounded-lg border border-border px-2.5 py-1 font-semibold text-muted hover:bg-surface">
                Удалить
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
