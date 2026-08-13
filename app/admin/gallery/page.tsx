import { prisma } from "@/lib/prisma";
import AdminForm from "@/components/admin/AdminForm";
import ImageUploadRow from "@/components/admin/ImageUploadRow";
import { createGalleryItem, deleteGalleryItem, updateGalleryItem } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Примеры работ</h1>
      <p className="mb-6 text-sm text-muted">
        Блоки «до/после» в разделе «Примеры работ» на главной. Можно добавлять и удалять блоки — на странице они
        автоматически перестраиваются в 1 колонку на телефоне и 2 на десктопе. «Подписи» — по одной на строку.
        «Порядок» — сортировка (меньше — выше).
      </p>

      <div className="mb-8 flex flex-col gap-4">
        {items.length === 0 && <p className="text-sm text-muted">Пока нет блоков.</p>}
        {items.map((item) => {
          const meta = ((item.meta as string[] | null) ?? []).join("\n");
          return (
            <div key={item.id} className="rounded-xl border border-border bg-surface p-4">
              <AdminForm action={updateGalleryItem.bind(null, item.id)} className="mb-3 flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_90px]">
                  <label className={labelClass}>
                    Заголовок
                    <input type="text" name="title" defaultValue={item.title} required className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Порядок
                    <input type="number" name="order" defaultValue={item.order} className={inputClass} />
                  </label>
                </div>
                <label className={labelClass}>
                  Подписи (по одной на строку, например «⏱ Сроки: 2 часа»)
                  <textarea name="meta" defaultValue={meta} rows={3} className={inputClass} />
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                    Сохранить
                  </button>
                  <button
                    type="submit"
                    formAction={deleteGalleryItem.bind(null, item.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-[#b23434] hover:bg-bg"
                  >
                    Удалить блок
                  </button>
                </div>
              </AdminForm>

              <div className="flex flex-col gap-3 border-t border-border pt-3">
                <ImageUploadRow
                  imgKey={`gallery-${item.id}-before`}
                  label="Фото «до»"
                  currentSrc={item.beforeUrl ?? undefined}
                  redirectTo="/admin/gallery"
                  targetTable="galleryItem"
                  targetId={item.id}
                  targetField="beforeUrl"
                />
                <ImageUploadRow
                  imgKey={`gallery-${item.id}-after`}
                  label="Фото «после»"
                  currentSrc={item.afterUrl ?? undefined}
                  redirectTo="/admin/gallery"
                  targetTable="galleryItem"
                  targetId={item.id}
                  targetField="afterUrl"
                />
              </div>
            </div>
          );
        })}
      </div>

      <details className="rounded-lg border border-border bg-surface p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink">+ Новый блок</summary>
        <AdminForm action={createGalleryItem} className="mt-3 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_90px]">
            <label className={labelClass}>
              Заголовок
              <input type="text" name="title" placeholder="Уборка кухни в запущенной квартире" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Порядок
              <input type="number" name="order" placeholder="0" defaultValue={0} className={inputClass} />
            </label>
          </div>
          <label className={labelClass}>
            Подписи (по одной на строку)
            <textarea name="meta" rows={3} placeholder="⏱ Сроки: 2 часа&#10;↔ Площадь: 14 м2&#10;🏷 Тип: генеральная уборка" className={inputClass} />
          </label>
          <div>
            <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
              Создать блок
            </button>
          </div>
        </AdminForm>
        <p className="mt-2 text-[11px] text-muted">Фото «до/после» можно загрузить после создания блока.</p>
      </details>
    </div>
  );
}
