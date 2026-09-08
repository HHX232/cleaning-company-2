import { getAllServiceCategories, getServiceHubShared } from "@/lib/serviceCategoriesData";
import AdminForm from "@/components/admin/AdminForm";
import { updateServiceCategory, updateServiceHubShared } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default async function AdminServiceCategoriesPage() {
  const [categories, hub] = await Promise.all([getAllServiceCategories(), getServiceHubShared()]);

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Хаб-страницы категорий услуг</h1>
      <p className="mb-6 text-sm text-muted">
        Страницы вида /uborka-kvartir, /uborka-domov, /uborka-kommercheskih-pomeshhenij, /speczuborka, /mojka-okon —
        список услуг на них подтягивается автоматически из «Страниц услуг», здесь только собственный текст каждой
        категории.
      </p>

      <div className="mb-10 flex flex-col gap-4">
        {categories.map((cat) => (
          <AdminForm
            key={cat.slug}
            action={updateServiceCategory.bind(null, cat.id)}
            className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4"
          >
            <div className="text-xs font-bold text-muted">
              {cat.href} (
              <a href={cat.href} target="_blank" rel="noopener noreferrer" className="underline">
                открыть
              </a>
              )
            </div>
            <input type="hidden" name="href" value={cat.href} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Заголовок в хлебных крошках
                <input type="text" name="label" defaultValue={cat.label} className={inputClass} />
              </label>
              <label className={labelClass}>
                Надзаголовок (eyebrow)
                <input type="text" name="eyebrow" defaultValue={cat.eyebrow} className={inputClass} />
              </label>
            </div>
            <label className={labelClass}>
              Заголовок (H1)
              <input type="text" name="title" defaultValue={cat.title} className={inputClass} />
            </label>
            <label className={labelClass}>
              Вводный текст
              <textarea name="lead" defaultValue={cat.lead} rows={2} className={inputClass} />
            </label>
            <div>
              <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                Сохранить
              </button>
            </div>
          </AdminForm>
        ))}
      </div>

      <h2 className="mb-2 text-base font-extrabold text-ink">Общий текст для всех 5 страниц</h2>
      <AdminForm
        action={updateServiceHubShared}
        className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4"
      >
        <label className={labelClass}>
          Заголовок списка услуг
          <input type="text" name="sectionTitle" defaultValue={hub.sectionTitle} className={inputClass} />
        </label>
        <label className={labelClass}>
          Текст, когда услуг пока нет
          <input type="text" name="emptyText" defaultValue={hub.emptyText} className={inputClass} />
        </label>
        <label className={labelClass}>
          CTA — заголовок
          <input type="text" name="ctaTitle" defaultValue={hub.ctaTitle} className={inputClass} />
        </label>
        <label className={labelClass}>
          CTA — текст
          <textarea name="ctaText" defaultValue={hub.ctaText} rows={2} className={inputClass} />
        </label>
        <div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary">
            Сохранить
          </button>
        </div>
      </AdminForm>
    </div>
  );
}
