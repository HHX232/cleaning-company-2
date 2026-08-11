import { prisma } from "@/lib/prisma";
import ImageUploadRow from "@/components/admin/ImageUploadRow";
import { createServicePage, deleteServicePage, updateServicePage } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";
const checkClass = "flex items-center gap-2 text-xs font-semibold text-ink";

export default async function AdminServicePagesPage() {
  const pages = await prisma.servicePage.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Страницы услуг</h1>
      <p className="mb-6 text-sm text-muted">
        Каждая страница услуги (например, /generalnaya-uborka). Можно создавать новые, редактировать и удалять.
      </p>

      <div className="mb-8 flex flex-col gap-5">
        {pages.length === 0 && <p className="text-sm text-muted">Пока нет страниц услуг.</p>}
        {pages.map((p) => {
          const tags = ((p.featureTags as string[] | null) ?? []).join("\n");
          return (
            <div key={p.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-bold text-ink">{p.title}</span>
                <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary">
                  /{p.slug} ↗
                </a>
              </div>

              <form action={updateServicePage.bind(null, p.id)} className="mb-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className={labelClass}>
                    Заголовок (H1)
                    <input type="text" name="title" defaultValue={p.title} required className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Описание в хиро-блоке
                    <input type="text" name="heroDescription" defaultValue={p.heroDescription} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Категория (хлебные крошки)
                    <input
                      type="text"
                      name="breadcrumbCategoryLabel"
                      defaultValue={p.breadcrumbCategoryLabel}
                      required
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    Ссылка категории
                    <input
                      type="text"
                      name="breadcrumbCategoryHref"
                      defaultValue={p.breadcrumbCategoryHref}
                      required
                      className={inputClass}
                    />
                  </label>
                </div>
                <label className={labelClass}>
                  Теги «Справимся с задачами» (по одному на строку)
                  <textarea name="featureTags" defaultValue={tags} rows={4} className={inputClass} />
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className={checkClass}>
                    <input type="checkbox" name="showFeaturesBlock" defaultChecked={p.showFeaturesBlock} className="accent-primary" />
                    Показывать блок тегов
                  </label>
                  <label className={checkClass}>
                    <input type="checkbox" name="showProcessSteps" defaultChecked={p.showProcessSteps} className="accent-primary" />
                    Показывать шаги «Как заказать»
                  </label>
                  <label className={checkClass}>
                    <input type="checkbox" name="showMidBanner" defaultChecked={p.showMidBanner} className="accent-primary" />
                    Показывать баннер посередине
                  </label>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                    Сохранить
                  </button>
                  <button
                    type="submit"
                    formAction={deleteServicePage.bind(null, p.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-bg"
                  >
                    Удалить страницу
                  </button>
                </div>
              </form>

              <div className="flex flex-col gap-3 border-t border-border pt-3">
                <ImageUploadRow
                  imgKey={`service-page-hero-${p.id}`}
                  label="Фото в хиро-блоке"
                  currentSrc={p.heroImageUrl ?? undefined}
                  redirectTo="/admin/service-pages"
                  targetTable="servicePage"
                  targetId={p.id}
                  targetField="heroImageUrl"
                />
                <ImageUploadRow
                  imgKey={`service-page-consultation-${p.id}`}
                  label="Фото в блоке консультации"
                  currentSrc={p.consultationImageUrl ?? undefined}
                  redirectTo="/admin/service-pages"
                  targetTable="servicePage"
                  targetId={p.id}
                  targetField="consultationImageUrl"
                />
              </div>
            </div>
          );
        })}
      </div>

      <details className="rounded-lg border border-border bg-surface p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink">+ Новая страница услуги</summary>
        <form action={createServicePage} className="mt-3 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className={labelClass}>
              Заголовок (H1)
              <input type="text" name="title" placeholder="Уборка после ремонта" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Адрес страницы (slug) — латиницей, можно оставить пустым
              <input type="text" name="slug" placeholder="uborka-posle-remonta" className={inputClass} />
            </label>
            <label className={labelClass}>
              Категория (хлебные крошки)
              <input type="text" name="breadcrumbCategoryLabel" placeholder="Уборка квартир в Минcке" required className={inputClass} />
            </label>
            <label className={labelClass}>
              Ссылка категории
              <input type="text" name="breadcrumbCategoryHref" placeholder="/uborka-kvartir" required className={inputClass} />
            </label>
          </div>
          <label className={labelClass}>
            Описание в хиро-блоке (необязательно)
            <input type="text" name="heroDescription" className={inputClass} />
          </label>
          <label className={labelClass}>
            Теги «Справимся с задачами» (по одному на строку)
            <textarea name="featureTags" rows={4} className={inputClass} />
          </label>
          <div className="flex flex-wrap gap-4">
            <label className={checkClass}>
              <input type="checkbox" name="showFeaturesBlock" defaultChecked className="accent-primary" />
              Показывать блок тегов
            </label>
            <label className={checkClass}>
              <input type="checkbox" name="showProcessSteps" defaultChecked className="accent-primary" />
              Показывать шаги «Как заказать»
            </label>
            <label className={checkClass}>
              <input type="checkbox" name="showMidBanner" className="accent-primary" />
              Показывать баннер посередине
            </label>
          </div>
          <div>
            <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
              Создать страницу
            </button>
          </div>
        </form>
        <p className="mt-2 text-[11px] text-muted">Фото можно загрузить после создания страницы.</p>
      </details>
    </div>
  );
}
