import { getAboutContent } from "@/lib/aboutData";
import AdminForm from "@/components/admin/AdminForm";
import Repeater from "@/components/admin/Repeater";
import { updateAbout } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default async function AdminAboutPage() {
  const about = await getAboutContent();

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Страница «О компании»</h1>
      <p className="mb-6 text-sm text-muted">
        Контент страницы{" "}
        <a href="/o-kompanii" target="_blank" rel="noopener noreferrer" className="underline">
          /o-kompanii
        </a>
        .
      </p>

      <AdminForm action={updateAbout} className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
        <label className={labelClass}>
          Надзаголовок (eyebrow)
          <input type="text" name="eyebrow" defaultValue={about.eyebrow} className={inputClass} />
        </label>
        <label className={labelClass}>
          Заголовок (H1)
          <input type="text" name="heading" defaultValue={about.heading} className={inputClass} />
        </label>
        <label className={labelClass}>
          Вводный абзац
          <textarea name="lead" defaultValue={about.lead} rows={3} className={inputClass} />
        </label>

        <label className={labelClass}>
          Статистика
          <Repeater
            name="stats"
            fields={[
              { name: "value", label: "Значение", placeholder: "15 лет" },
              { name: "label", label: "Подпись", placeholder: "на рынке клининга Беларуси" },
            ]}
            initialItems={about.stats}
            addLabel="+ Добавить показатель"
          />
        </label>

        <label className={labelClass}>
          Заголовок блока «Миссия»
          <input type="text" name="missionTitle" defaultValue={about.missionTitle} className={inputClass} />
        </label>
        <label className={labelClass}>
          Миссия — абзац 1
          <textarea name="missionText1" defaultValue={about.missionText1} rows={3} className={inputClass} />
        </label>
        <label className={labelClass}>
          Миссия — абзац 2
          <textarea name="missionText2" defaultValue={about.missionText2} rows={3} className={inputClass} />
        </label>

        <label className={labelClass}>
          Ценности
          <Repeater
            name="values"
            fields={[
              { name: "title", label: "Заголовок" },
              { name: "text", label: "Текст", type: "textarea" },
            ]}
            initialItems={about.values}
            addLabel="+ Добавить ценность"
          />
        </label>

        <label className={labelClass}>
          CTA — заголовок
          <input type="text" name="ctaTitle" defaultValue={about.ctaTitle} className={inputClass} />
        </label>
        <label className={labelClass}>
          CTA — текст
          <textarea name="ctaText" defaultValue={about.ctaText} rows={2} className={inputClass} />
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
