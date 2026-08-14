import { prisma } from "@/lib/prisma";
import AdminForm from "@/components/admin/AdminForm";
import { deriveStatus, kindPresentationFor, statusPresentation } from "@/lib/orderStatus";
import { advanceOrderStatus, createOrder, deleteOrder, updateOrderFull } from "./actions";
import OrderRow from "@/components/admin/OrderRow";

const kindOptions: { value: string; label: string }[] = [
  { value: "GENERAL", label: "Генеральная уборка" },
  { value: "WINDOWS", label: "Мойка окон" },
  { value: "RENOVATION", label: "Уборка после ремонта" },
  { value: "SUPPORT", label: "Поддерживающая уборка" },
  { value: "STANDARD", label: "Без происшествий" },
  { value: "DEATH", label: "После смерти" },
  { value: "FLOOD", label: "После потопа" },
  { value: "FIRE", label: "После пожара" },
];

const nextAction: Record<string, { action: "assign" | "complete" | "pay"; label: string } | null> = {
  scheduled: { action: "assign", label: "Назначить бригаду" },
  progress: { action: "complete", label: "Отметить выполненным" },
  done: null,
  canceled: null,
};

function newOrderForm(phone?: string) {
  return (
    <AdminForm action={createOrder} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      <input
        type="text"
        name="phone"
        placeholder="Телефон"
        defaultValue={phone}
        required
        className="col-span-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink sm:col-span-1"
      />
      <input
        type="text"
        name="title"
        placeholder="Название"
        required
        className="col-span-2 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink sm:col-span-1"
      />
      <select name="kind" required className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink">
        {kindOptions.map((k) => (
          <option key={k.value} value={k.value}>
            {k.label}
          </option>
        ))}
      </select>
      <input type="date" name="date" required className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink" />
      <input type="time" name="time" className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink" />
      <input
        type="text"
        name="address"
        placeholder="Адрес (необязательно)"
        className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink"
      />
      <input
        type="number"
        name="price"
        placeholder="Цена, руб."
        required
        className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink"
      />
      <input
        type="text"
        name="serviceDetail"
        placeholder="Детали услуги"
        required
        className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink"
      />
      <input
        type="text"
        name="staff"
        placeholder="Бригада"
        required
        className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink"
      />
      <input
        type="text"
        name="payment"
        placeholder="Оплата"
        required
        className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-ink"
      />
      <button
        type="submit"
        className="col-span-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary sm:col-span-1"
      >
        Создать
      </button>
    </AdminForm>
  );
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { date: "desc" } });

  const groups = new Map<string, typeof orders>();
  for (const order of orders) {
    groups.set(order.phone, [...(groups.get(order.phone) ?? []), order]);
  }
  const phoneGroups = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="mx-auto max-w-250">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Заказы</h1>

      {phoneGroups.length === 0 && <p className="text-sm text-muted">Пока нет заказов.</p>}

      <div className="flex flex-col gap-6">
        {phoneGroups.map(([phone, orders]) => (
          <div key={phone} className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-bold text-ink">{phone}</div>
            </div>

            <div className="mb-4 flex flex-col gap-2">
              {orders.map((order) => {
                const status = deriveStatus(order);
                const presentation = statusPresentation[status];
                const kind = kindPresentationFor(order.kind);
                const advance = nextAction[status];
                const needsPayment = status === "done" && !order.paidAt;
                const canCancel = status === "scheduled" || status === "progress";

                return (
                  <OrderRow
                    key={order.id}
                    order={order}
                    kindLabel={kind.label}
                    statusLabel={presentation.label}
                    statusBgClass={presentation.bgClass}
                    statusTextClass={presentation.textClass}
                    kindOptions={kindOptions}
                    advance={advance}
                    needsPayment={needsPayment}
                    canCancel={canCancel}
                    advanceOrderStatus={advanceOrderStatus}
                    deleteOrder={deleteOrder}
                    updateOrderFull={updateOrderFull}
                  />
                );
              })}
            </div>

            <details className="rounded-lg border border-border bg-bg p-3">
              <summary className="cursor-pointer text-xs font-bold text-ink">+ Новый заказ</summary>
              {newOrderForm(phone)}
            </details>
          </div>
        ))}
      </div>

      <details className="mt-6 rounded-lg border border-border bg-bg p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink">+ Новый заказ (новый номер)</summary>
        {newOrderForm()}
      </details>
    </div>
  );
}
