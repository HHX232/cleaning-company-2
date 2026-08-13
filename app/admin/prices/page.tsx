import { prisma } from "@/lib/prisma";
import AdminForm from "@/components/admin/AdminForm";
import { priceTabs } from "@/lib/content";
import { createPriceRow, deletePriceRow, updatePriceRow } from "./actions";

const gridCols = "sm:grid-cols-[130px_1fr_130px_70px_auto]";

function TabSelect({ name, defaultValue }: { name: string; defaultValue: string }) {
  return (
    <select name={name} defaultValue={defaultValue} className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink">
      {priceTabs.map((t) => (
        <option key={t.id} value={t.id}>
          {t.label}
        </option>
      ))}
    </select>
  );
}

export default async function AdminPricesPage() {
  const rows = await prisma.priceRow.findMany({ orderBy: [{ tab: "asc" }, { order: "asc" }] });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Цены на клининг</h1>
      <p className="mb-6 text-sm text-muted">
        Таблица цен в блоке «Цены на клининг» на главной. «Порядок» — число для сортировки строк внутри категории
        (меньше — выше).
      </p>

      <div className={`mb-2 hidden gap-2 px-4 text-[11px] font-bold text-muted uppercase sm:grid ${gridCols}`}>
        <span>Категория</span>
        <span>Название</span>
        <span>Цена</span>
        <span>Порядок</span>
        <span></span>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        {rows.length === 0 && <p className="text-sm text-muted">Пока нет строк с ценами.</p>}
        {rows.map((row) => (
          <AdminForm
            key={row.id}
            action={updatePriceRow.bind(null, row.id)}
            className={`grid grid-cols-1 gap-2 rounded-xl border border-border bg-surface p-4 ${gridCols}`}
          >
            <TabSelect name="tab" defaultValue={row.tab} />
            <input
              type="text"
              name="name"
              defaultValue={row.name}
              required
              title="Название услуги"
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <input
              type="text"
              name="price"
              defaultValue={row.price}
              required
              title="Цена (текст, например «от 100 руб.»)"
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <input
              type="number"
              name="order"
              defaultValue={row.order}
              title="Порядок сортировки"
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                Сохранить
              </button>
              <button
                type="submit"
                formAction={deletePriceRow.bind(null, row.id)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-bg"
              >
                Удалить
              </button>
            </div>
          </AdminForm>
        ))}
      </div>

      <details className="rounded-lg border border-border bg-surface p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink">+ Новая строка</summary>
        <AdminForm action={createPriceRow} className={`mt-3 grid grid-cols-1 gap-2 ${gridCols}`}>
          <TabSelect name="tab" defaultValue="flats" />
          <input
            type="text"
            name="name"
            placeholder="Генеральная"
            required
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <input
            type="text"
            name="price"
            placeholder="от 100 руб."
            required
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <input
            type="number"
            name="order"
            placeholder="0"
            defaultValue={0}
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
            Создать
          </button>
        </AdminForm>
      </details>
    </div>
  );
}
