import { getAboutContent } from "@/lib/aboutData";
import AdminForm from "@/components/admin/AdminForm";
import { updateAbout } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default async function AdminAboutPage() {
  const about = await getAboutContent();

  const statsText = about.stats.map((s) => `${s.value} | ${s.label}`).join("\n");
  const valuesText = about.values.map((v) => `${v.title} | ${v.text}`).join("\n");

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Страница «О компании»</h1>
      <p className="mb-6 text-sm text-muted">
        Контент страницы{" "}
        <a href="/o-kompanii" target="_blank" rel="noopener noreferrer" className="underline">
          /o-kompanii
        </a>
        . В блоках-списках каждая строка — отдельный элемент в формате «слева | справа».
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
          Статистика — по строке на элемент, формат «значение | подпись»
          <textarea name="stats" defaultValue={statsText} rows={4} className={`${inputClass} font-mono`} />
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
          Ценности — по строке на карточку, формат «заголовок | текст»
          <textarea name="values" defaultValue={valuesText} rows={5} className={`${inputClass} font-mono`} />
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
