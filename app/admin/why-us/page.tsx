import { getWhyUsPageContent } from "@/lib/whyUsPageData";
import AdminForm from "@/components/admin/AdminForm";
import Repeater from "@/components/admin/Repeater";
import { updateWhyUsPage } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default async function AdminWhyUsPage() {
  const content = await getWhyUsPageContent();

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Блок «Почему выбирают нас»</h1>
      <p className="mb-6 text-sm text-muted">
        Показывается на главной странице и на{" "}
        <a href="/pochemu-vybirayut-nas" target="_blank" rel="noopener noreferrer" className="underline">
          /pochemu-vybirayut-nas
        </a>
        .
      </p>

      <AdminForm action={updateWhyUsPage} className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
        <label className={labelClass}>
          Надзаголовок (eyebrow)
          <input type="text" name="eyebrow" defaultValue={content.eyebrow} className={inputClass} />
        </label>
        <label className={labelClass}>
          Заголовок
          <input type="text" name="title" defaultValue={content.title} className={inputClass} />
        </label>
        <label className={labelClass}>
          Описание
          <textarea name="description" defaultValue={content.description} rows={3} className={inputClass} />
        </label>
        <label className={labelClass}>
          Причины — иконка задаётся эмодзи
          <Repeater
            name="advantages"
            fields={[
              { name: "icon", label: "Иконка (эмодзи)", placeholder: "🕒" },
              { name: "title", label: "Заголовок" },
              { name: "text", label: "Текст", type: "textarea" },
            ]}
            initialItems={content.advantages}
            addLabel="+ Добавить причину"
          />
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
