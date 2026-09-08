import { getGuaranteesContent } from "@/lib/guaranteesData";
import AdminForm from "@/components/admin/AdminForm";
import Repeater from "@/components/admin/Repeater";
import { updateGuarantees } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default async function AdminGuaranteesPage() {
  const content = await getGuaranteesContent();

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Страница «Наши гарантии»</h1>
      <p className="mb-6 text-sm text-muted">
        Контент страницы{" "}
        <a href="/nashi-garantii" target="_blank" rel="noopener noreferrer" className="underline">
          /nashi-garantii
        </a>
        .
      </p>

      <AdminForm action={updateGuarantees} className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
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
        <label className={labelClass}>
          Карточки гарантий
          <Repeater
            name="items"
            fields={[
              { name: "title", label: "Заголовок" },
              { name: "text", label: "Текст", type: "textarea" },
            ]}
            initialItems={content.items}
            addLabel="+ Добавить карточку"
          />
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
