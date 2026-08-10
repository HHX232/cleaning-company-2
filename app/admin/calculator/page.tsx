import { prisma } from "@/lib/prisma";
import type { CalculatorField } from "@/lib/dbEnums";
import { createOption, deleteOption, updateOption } from "./actions";

const fieldMeta: Record<CalculatorField, { title: string; valueHint: string }> = {
  OBJECT_TYPE: { title: "Тип объекта", valueHint: "множитель цены" },
  DIRT: { title: "Состояние помещения", valueHint: "множитель цены" },
  BUILDING_TYPE: { title: "Тип здания", valueHint: "множитель цены" },
  REGION: { title: "Область", valueHint: "множитель цены" },
  URGENCY: { title: "Срочность", valueHint: "множитель цены" },
  STAFF: { title: "Бригада", valueHint: "делитель времени" },
  EXTRA: { title: "Дополнительные услуги", valueHint: "цена, руб." },
};

const fieldOrder: CalculatorField[] = [
  "OBJECT_TYPE",
  "DIRT",
  "BUILDING_TYPE",
  "REGION",
  "URGENCY",
  "STAFF",
  "EXTRA",
];

export default async function AdminCalculatorPage() {
  const allOptions = await prisma.calculatorOption.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Калькулятор стоимости</h1>

      <div className="flex flex-col gap-8">
        {fieldOrder.map((field) => {
          const options = allOptions.filter((o) => o.field === field);
          const meta = fieldMeta[field];

          return (
            <div key={field}>
              <h2 className="mb-1 text-sm font-extrabold text-ink">{meta.title}</h2>
              <p className="mb-3 text-xs text-muted">Значение — {meta.valueHint}</p>

              <div className="mb-2 hidden gap-2 px-3 text-[11px] font-bold text-muted uppercase sm:grid sm:grid-cols-[100px_1fr_100px_70px_auto]">
                <span>Ключ</span>
                <span>Название</span>
                <span>Значение</span>
                <span>Порядок</span>
                <span></span>
              </div>

              <div className="mb-3 flex flex-col gap-2">
                {options.length === 0 && <p className="text-xs text-muted">Нет опций.</p>}
                {options.map((option) => (
                  <form
                    key={option.id}
                    action={updateOption.bind(null, option.id)}
                    className="grid grid-cols-1 items-center gap-2 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[100px_1fr_100px_70px_auto]"
                  >
                    <span className="truncate rounded-lg bg-bg px-2.5 py-1.5 text-xs text-muted">{option.key}</span>
                    <input
                      type="text"
                      name="label"
                      defaultValue={option.label}
                      required
                      className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
                    />
                    <input
                      type="number"
                      step="0.01"
                      name="value"
                      defaultValue={option.value}
                      required
                      className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
                    />
                    <input
                      type="number"
                      name="order"
                      defaultValue={option.order}
                      title="Порядок"
                      className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                        Сохранить
                      </button>
                      <button
                        type="submit"
                        formAction={deleteOption.bind(null, option.id)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-bg"
                      >
                        Удалить
                      </button>
                    </div>
                  </form>
                ))}
              </div>

              <details className="rounded-lg border border-border bg-surface p-3">
                <summary className="cursor-pointer text-xs font-bold text-ink">+ Новая опция</summary>
                <form
                  action={createOption}
                  className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[100px_1fr_100px_70px_auto]"
                >
                  <input type="hidden" name="field" value={field} />
                  <input
                    type="text"
                    name="key"
                    placeholder="ключ (en)"
                    required
                    className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
                  />
                  <input
                    type="text"
                    name="label"
                    placeholder="Название"
                    required
                    className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="value"
                    placeholder="Значение"
                    required
                    className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
                  />
                  <input
                    type="number"
                    name="order"
                    placeholder="0"
                    defaultValue={0}
                    className="rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink"
                  />
                  <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                    Создать
                  </button>
                </form>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
