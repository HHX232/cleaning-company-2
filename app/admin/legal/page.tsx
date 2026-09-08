import { getLegalContent } from "@/lib/legalData";
import AdminForm from "@/components/admin/AdminForm";
import Repeater from "@/components/admin/Repeater";
import { updateLegalPage } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default async function AdminLegalPage() {
  const [privacy, terms] = await Promise.all([getLegalContent("privacy"), getLegalContent("terms")]);

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Юридические документы</h1>
      <p className="mb-6 text-sm text-muted">
        Раздел «Контакты» в конце каждой страницы формируется отдельно (телефон и почта берутся из общих настроек
        сайта) и не редактируется здесь.
      </p>

      <details open className="mb-6 rounded-lg border border-border">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-extrabold text-ink">
          Политика конфиденциальности (
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            /privacy
          </a>
          )
        </summary>
        <AdminForm
          action={updateLegalPage.bind(null, "privacy")}
          className="flex flex-col gap-4 border-t border-border p-3"
        >
          <label className={labelClass}>
            Заголовок (H1)
            <input type="text" name="heading" defaultValue={privacy.heading} className={inputClass} />
          </label>
          <label className={labelClass}>
            Дата вступления в силу
            <input type="text" name="effectiveDate" defaultValue={privacy.effectiveDate} className={inputClass} />
          </label>
          <label className={labelClass}>
            Разделы
            <Repeater
              name="sections"
              fields={[
                { name: "title", label: "Заголовок раздела" },
                { name: "body", label: "Текст раздела", type: "textarea", rows: 4 },
              ]}
              initialItems={privacy.sections}
              addLabel="+ Добавить раздел"
            />
          </label>
          <div>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary">
              Сохранить
            </button>
          </div>
        </AdminForm>
      </details>

      <details className="rounded-lg border border-border">
        <summary className="cursor-pointer px-3 py-2.5 text-sm font-extrabold text-ink">
          Пользовательское соглашение (
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">
            /terms
          </a>
          )
        </summary>
        <AdminForm
          action={updateLegalPage.bind(null, "terms")}
          className="flex flex-col gap-4 border-t border-border p-3"
        >
          <label className={labelClass}>
            Заголовок (H1)
            <input type="text" name="heading" defaultValue={terms.heading} className={inputClass} />
          </label>
          <label className={labelClass}>
            Дата вступления в силу
            <input type="text" name="effectiveDate" defaultValue={terms.effectiveDate} className={inputClass} />
          </label>
          <label className={labelClass}>
            Разделы
            <Repeater
              name="sections"
              fields={[
                { name: "title", label: "Заголовок раздела" },
                { name: "body", label: "Текст раздела", type: "textarea", rows: 4 },
              ]}
              initialItems={terms.sections}
              addLabel="+ Добавить раздел"
            />
          </label>
          <div>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary">
              Сохранить
            </button>
          </div>
        </AdminForm>
      </details>
    </div>
  );
}
