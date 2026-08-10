import { prisma } from "@/lib/prisma";
import { deriveStatus, kindPresentationFor, statusPresentation } from "@/lib/orderStatus";
import { advanceOrderStatus, createOrder, deleteOrder, updateOrderSchedule } from "./actions";
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

export default async function AdminOrdersPage() {
  const customers = await prisma.user.findMany({
    // Include BANNED so a banned customer's existing orders (e.g. still
    // "в процессе") stay manageable here — banning only blocks their own
    // future sign-ins/orders, not admin's ability to finish work already
    // in flight. ADMIN accounts don't place customer orders, excluded.
    where: { role: { in: ["USER", "BANNED"] } },
    include: { orders: { orderBy: { date: "desc" } } },
    orderBy: { email: "asc" },
  });

  return (
    <div className="mx-auto max-w-250">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Заказы</h1>

      {customers.length === 0 && <p className="text-sm text-muted">Пока нет зарегистрированных клиентов.</p>}

      <div className="flex flex-col gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-bold text-ink">{customer.email}</div>
            </div>

            <div className="mb-4 flex flex-col gap-2">
              {customer.orders.length === 0 && <p className="text-xs text-muted">Заказов ещё нет.</p>}
              {customer.orders.map((order) => {
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
                    advance={advance}
                    needsPayment={needsPayment}
                    canCancel={canCancel}
                    advanceOrderStatus={advanceOrderStatus}
                    deleteOrder={deleteOrder}
                    updateOrderSchedule={updateOrderSchedule}
                  />
                );
              })}
            </div>

            <details className="rounded-lg border border-border bg-bg p-3">
              <summary className="cursor-pointer text-xs font-bold text-ink">+ Новый заказ</summary>
              <form action={createOrder} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <input type="hidden" name="userId" value={customer.id} />
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
                  placeholder="Адрес"
                  required
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
              </form>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
