import { prisma } from "@/lib/prisma";
import { createPromo, deletePromo, updatePromo } from "./actions";

export default async function AdminPromosPage() {
  const promos = await prisma.promo.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Наши акции</h1>

      <div className="mb-2 hidden gap-2 px-4 text-[11px] font-bold text-muted uppercase sm:grid sm:grid-cols-[100px_1fr_2fr_70px_auto]">
        <span>Значок</span>
        <span>Заголовок</span>
        <span>Текст</span>
        <span>Порядок</span>
        <span></span>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        {promos.length === 0 && <p className="text-sm text-muted">Пока нет акций.</p>}
        {promos.map((promo) => (
          <form
            key={promo.id}
            action={updatePromo.bind(null, promo.id)}
            className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[100px_1fr_2fr_70px_auto]"
          >
            <input
              type="text"
              name="badge"
              defaultValue={promo.badge}
              required
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <input
              type="text"
              name="title"
              defaultValue={promo.title}
              required
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <input
              type="text"
              name="text"
              defaultValue={promo.text}
              required
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <input
              type="number"
              name="order"
              defaultValue={promo.order}
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                Сохранить
              </button>
              <button
                type="submit"
                formAction={deletePromo.bind(null, promo.id)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-bg"
              >
                Удалить
              </button>
            </div>
          </form>
        ))}
      </div>

      <details className="rounded-lg border border-border bg-surface p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink">+ Новая акция</summary>
        <form action={createPromo} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[100px_1fr_2fr_70px_auto]">
          <input
            type="text"
            name="badge"
            placeholder="-10%"
            required
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <input
            type="text"
            name="title"
            placeholder="Заголовок"
            required
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <input
            type="text"
            name="text"
            placeholder="Текст акции"
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
        </form>
      </details>
    </div>
  );
}
