"use client";

import { useState } from "react";
import AdminForm from "@/components/admin/AdminForm";
import type { Order } from "@prisma/client";
import { formatRuDate, formatRuDateTime } from "@/lib/orderStatus";

type OrderRowProps = {
  order: Order;
  kindLabel: string;
  statusLabel: string;
  statusBgClass: string;
  statusTextClass: string;
  kindOptions: { value: string; label: string }[];
  advance: { action: "assign" | "complete" | "pay"; label: string } | null;
  needsPayment: boolean;
  canCancel: boolean;
  advanceOrderStatus: (orderId: string, action: "assign" | "complete" | "pay" | "cancel") => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  updateOrderFull: (orderId: string, formData: FormData) => Promise<void>;
};

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}
function toTimeInputValue(date: Date) {
  return date.toISOString().slice(11, 16);
}
function toDateTimeLocalValue(date: Date | null) {
  return date ? date.toISOString().slice(0, 16) : "";
}

const field = "rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink";
const lbl = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default function OrderRow({
  order,
  kindLabel,
  statusLabel,
  statusBgClass,
  statusTextClass,
  kindOptions,
  advance,
  needsPayment,
  canCancel,
  advanceOrderStatus,
  deleteOrder,
  updateOrderFull,
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
          <AdminForm action={updateOrderFull.bind(null, order.id)} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className={lbl}>
                Тип уборки
                <select name="kind" defaultValue={order.kind} className={field}>
                  {kindOptions.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={lbl}>
                Название
                <input type="text" name="title" defaultValue={order.title} required className={field} />
              </label>
              <label className={lbl}>
                Дата уборки
                <input type="date" name="date" defaultValue={toDateInputValue(order.date)} className={field} />
              </label>
              <label className={lbl}>
                Время уборки
                <input type="time" name="time" defaultValue={toTimeInputValue(order.date)} className={field} />
              </label>
              <label className={lbl}>
                Адрес
                <input type="text" name="address" defaultValue={order.address} className={field} />
              </label>
              <label className={lbl}>
                Цена, руб.
                <input type="number" name="price" defaultValue={order.price} className={field} />
              </label>
              <label className={lbl}>
                Детали услуги
                <input type="text" name="serviceDetail" defaultValue={order.serviceDetail} className={field} />
              </label>
              <label className={lbl}>
                Бригада
                <input type="text" name="staff" defaultValue={order.staff} className={field} />
              </label>
              <label className={lbl}>
                Оплата
                <input type="text" name="payment" defaultValue={order.payment} className={field} />
              </label>
            </div>

            <div className="border-t border-border pt-2">
              <p className="mb-2 text-[11px] font-bold text-muted">
                Статус зависит от дат ниже. Очистите поле, чтобы вернуть заказ на предыдущий статус. Принят:{" "}
                {formatRuDateTime(order.acceptedAt)}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className={lbl}>
                  Назначен (бригада)
                  <input type="datetime-local" name="assignedAt" defaultValue={toDateTimeLocalValue(order.assignedAt)} className={field} />
                </label>
                <label className={lbl}>
                  Выполнен
                  <input type="datetime-local" name="completedAt" defaultValue={toDateTimeLocalValue(order.completedAt)} className={field} />
                </label>
                <label className={lbl}>
                  Оплачен
                  <input type="datetime-local" name="paidAt" defaultValue={toDateTimeLocalValue(order.paidAt)} className={field} />
                </label>
                <label className={lbl}>
                  Отменён
                  <input type="datetime-local" name="canceledAt" defaultValue={toDateTimeLocalValue(order.canceledAt)} className={field} />
                </label>
              </div>
            </div>

            <div>
              <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                Сохранить заказ
              </button>
            </div>
          </AdminForm>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2">
            <span className="text-[11px] font-bold text-muted">Быстро:</span>
            {advance && (
              <AdminForm action={advanceOrderStatus.bind(null, order.id, advance.action)}>
                <button type="submit" className="rounded-lg border border-border px-2.5 py-1 font-semibold text-ink hover:bg-surface">
                  {advance.label}
                </button>
              </AdminForm>
            )}
            {needsPayment && (
              <AdminForm action={advanceOrderStatus.bind(null, order.id, "pay")}>
                <button type="submit" className="rounded-lg border border-border px-2.5 py-1 font-semibold text-ink hover:bg-surface">
                  Отметить оплаченным
                </button>
              </AdminForm>
            )}
            {canCancel && (
              <AdminForm action={advanceOrderStatus.bind(null, order.id, "cancel")}>
                <button type="submit" className="rounded-lg border border-border px-2.5 py-1 font-semibold text-[#b23434] hover:bg-surface">
                  Отменить
                </button>
              </AdminForm>
            )}
            <AdminForm action={deleteOrder.bind(null, order.id)}>
              <button type="submit" className="rounded-lg border border-border px-2.5 py-1 font-semibold text-muted hover:bg-surface">
                Удалить
              </button>
            </AdminForm>
          </div>
        </div>
      )}
    </div>
  );
}
