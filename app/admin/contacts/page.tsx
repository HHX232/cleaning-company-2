import { getContactsContent } from "@/lib/contactsData";
import AdminForm from "@/components/admin/AdminForm";
import { updateContacts } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default async function AdminContactsPage() {
  const content = await getContactsContent();

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Страница «Контакты»</h1>
      <p className="mb-6 text-sm text-muted">
        Контент страницы{" "}
        <a href="/contacts" target="_blank" rel="noopener noreferrer" className="underline">
          /contacts
        </a>
        . Сам телефон и почта редактируются отдельно разработчиком (используются на всём сайте) — здесь только
        заголовки и пояснительный текст карточек.
      </p>

      <AdminForm action={updateContacts} className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
        <label className={labelClass}>
          Надзаголовок (eyebrow)
          <input type="text" name="eyebrow" defaultValue={content.eyebrow} className={inputClass} />
        </label>
        <label className={labelClass}>
          Заголовок (H1)
          <input type="text" name="heading" defaultValue={content.heading} className={inputClass} />
        </label>
        <label className={labelClass}>
          Вводный абзац
          <textarea name="lead" defaultValue={content.lead} rows={3} className={inputClass} />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className={labelClass}>
            Пояснение под телефоном
            <input type="text" name="phoneNote" defaultValue={content.phoneNote} className={inputClass} />
          </label>
          <label className={labelClass}>
            Пояснение под почтой
            <input type="text" name="emailNote" defaultValue={content.emailNote} className={inputClass} />
          </label>
          <label className={labelClass}>
            Режим работы — значение
            <input type="text" name="hoursValue" defaultValue={content.hoursValue} className={inputClass} />
          </label>
          <label className={labelClass}>
            Режим работы — пояснение
            <input type="text" name="hoursText" defaultValue={content.hoursText} className={inputClass} />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Зона обслуживания — пояснение
            <input type="text" name="areaText" defaultValue={content.areaText} className={inputClass} />
          </label>
        </div>

        <label className={labelClass}>
          Заголовок блока с мессенджерами
          <input type="text" name="messengersHeading" defaultValue={content.messengersHeading} className={inputClass} />
        </label>

        <label className={labelClass}>
          CTA — заголовок
          <input type="text" name="ctaTitle" defaultValue={content.ctaTitle} className={inputClass} />
        </label>
        <label className={labelClass}>
          CTA — текст
          <textarea name="ctaText" defaultValue={content.ctaText} rows={2} className={inputClass} />
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
