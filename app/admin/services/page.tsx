import { prisma } from "@/lib/prisma";
import AdminForm from "@/components/admin/AdminForm";
import { createServiceBlock, deleteServiceBlock, updateServiceBlock } from "./actions";

export default async function AdminServicesPage() {
  const blocks = await prisma.serviceBlock.findMany({ orderBy: [{ size: "asc" }, { order: "asc" }] });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Наши услуги</h1>
      <p className="mb-6 text-sm text-muted">
        Блоки-карточки в разделе «Наши услуги» на главной. Пункты списка — по одному на строку. «Порядок» — число для
        сортировки блоков. На главной показывается максимум 10 пунктов + строка «и другое».
      </p>

      <div className="mb-6 flex flex-col gap-3">
        {blocks.length === 0 && <p className="text-sm text-muted">Пока нет блоков услуг.</p>}
        {blocks.map((block) => {
          const items = (block.items as string[] | null) ?? [];
          return (
          <AdminForm
            key={block.id}
            action={updateServiceBlock.bind(null, block.id)}
            className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-bg px-2.5 py-1 text-[10px] font-bold text-muted uppercase">
                {block.size === "BIG" ? "Крупный блок" : "Маленький блок"}
              </span>
              <input
                type="text"
                name="title"
                defaultValue={block.title}
                required
                className="flex-1 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
              />
              {block.size === "BIG" && (
                <select
                  name="columns"
                  defaultValue={block.columns}
                  className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
                >
                  <option value={1}>1 колонка</option>
                  <option value={2}>2 колонки</option>
                </select>
              )}
              {block.size !== "BIG" && <input type="hidden" name="columns" value={1} />}
              <input
                type="number"
                name="order"
                defaultValue={block.order}
                title="Порядок"
                className="w-16 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
              />
            </div>
            <textarea
              name="items"
              defaultValue={items.join("\n")}
              required
              rows={Math.max(3, items.length)}
              placeholder="По одному пункту на строку"
              className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                Сохранить
              </button>
              <button
                type="submit"
                formAction={deleteServiceBlock.bind(null, block.id)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-bg"
              >
                Удалить
              </button>
            </div>
          </AdminForm>
          );
        })}
      </div>

      <details className="rounded-lg border border-border bg-surface p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink">+ Новый блок услуги</summary>
        <AdminForm action={createServiceBlock} className="mt-3 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <select name="size" defaultValue="SMALL" className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink">
              <option value="BIG">Крупный блок</option>
              <option value="SMALL">Маленький блок</option>
            </select>
            <input
              type="text"
              name="title"
              placeholder="Название"
              required
              className="flex-1 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
            <select name="columns" defaultValue={1} className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink">
              <option value={1}>1 колонка</option>
              <option value={2}>2 колонки</option>
            </select>
            <input
              type="number"
              name="order"
              placeholder="0"
              defaultValue={0}
              className="w-16 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
            />
          </div>
          <textarea
            name="items"
            required
            rows={4}
            placeholder="По одному пункту на строку"
            className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
          />
          <button type="submit" className="w-fit rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
            Создать
          </button>
        </AdminForm>
      </details>
    </div>
  );
}
