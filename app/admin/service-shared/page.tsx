import { getServiceSharedContent } from "@/lib/serviceSharedData";
import { prisma } from "@/lib/prisma";
import { imageUrl } from "@/lib/imageStorage";
import { midBannerStaffDefault } from "@/lib/homeImageDefaults";
import AdminForm from "@/components/admin/AdminForm";
import ImageUploadRow from "@/components/admin/ImageUploadRow";
import Repeater from "@/components/admin/Repeater";
import { updateServiceShared } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";
const sectionClass = "rounded-lg border border-border";
const sectionHeaderClass = "cursor-pointer px-3 py-2.5 text-sm font-extrabold text-ink";
const sectionBodyClass = "flex flex-col gap-4 border-t border-border p-3";

export default async function AdminServiceSharedPage() {
  const [shared, staffImage] = await Promise.all([
    getServiceSharedContent(),
    prisma.siteImage.findUnique({ where: { key: "svc-mid-banner-staff" } }),
  ]);

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Общий контент страниц услуг</h1>
      <p className="mb-6 text-sm text-muted">
        Этот текст показывается одинаково на всех ~65 страницах вида /uborka-kvartir-... Что отличается на каждой
        странице — редактируется в «Страницы услуг».
      </p>

      <div className="mb-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-extrabold text-ink">Фото сотрудника в среднем баннере</h2>
        <ImageUploadRow
          imgKey="svc-mid-banner-staff"
          label="Фото сотрудника"
          currentSrc={staffImage ? imageUrl("svc-mid-banner-staff", staffImage.updatedAt) : midBannerStaffDefault}
          redirectTo="/admin/service-shared"
        />
      </div>

      <AdminForm action={updateServiceShared} className="flex flex-col gap-3">
        <label className={labelClass}>
          Текст кнопки в hero (на каждой странице услуги)
          <input type="text" name="heroCtaLabel" defaultValue={shared.heroCtaLabel} className={inputClass} />
        </label>

        <details open className={sectionClass}>
          <summary className={sectionHeaderClass}>Шаги процесса</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Ровно 4 шага
              <Repeater
                name="processSteps"
                fields={[
                  { name: "num", label: "Номер", placeholder: "01" },
                  { name: "title", label: "Заголовок" },
                  { name: "text", label: "Текст", type: "textarea" },
                ]}
                initialItems={shared.processSteps}
                fixed
              />
            </label>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>Средний CTA-баннер</summary>
          <div className={sectionBodyClass}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Имя сотрудника на бейдже
                <input type="text" name="midBannerStaffName" defaultValue={shared.midBannerStaffName} className={inputClass} />
              </label>
              <label className={labelClass}>
                Текст кнопки
                <input type="text" name="midBannerCtaLabel" defaultValue={shared.midBannerCtaLabel} className={inputClass} />
              </label>
            </div>
            <label className={labelClass}>
              Должности сотрудника
              <Repeater
                name="midBannerStaffRoles"
                fields={[{ name: "value", label: "Должность", placeholder: "Специалист по клинингу" }]}
                initialItems={shared.midBannerStaffRoles.map((value) => ({ value }))}
                addLabel="+ Добавить должность"
              />
            </label>
            <label className={labelClass}>
              Заголовок баннера
              <input type="text" name="midBannerTitle" defaultValue={shared.midBannerTitle} className={inputClass} />
            </label>
            <label className={labelClass}>
              Абзацы — ровно 3
              <Repeater
                name="midBannerParagraphs"
                fields={[{ name: "value", label: "Абзац", type: "textarea", rows: 2 }]}
                initialItems={shared.midBannerParagraphs.map((value) => ({ value }))}
                fixed
              />
            </label>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>«Как заказать уборку»</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Заголовок
              <input type="text" name="howToOrderTitle" defaultValue={shared.howToOrderTitle} className={inputClass} />
            </label>
            <label className={labelClass}>
              Вводный абзац
              <textarea name="howToOrderIntro" defaultValue={shared.howToOrderIntro} rows={4} className={inputClass} />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className={labelClass}>
                Заключение — начало
                <input type="text" name="howToOrderOutroLead" defaultValue={shared.howToOrderOutroLead} className={inputClass} />
              </label>
              <label className={labelClass}>
                Заключение — выделенное
                <input type="text" name="howToOrderOutroBold" defaultValue={shared.howToOrderOutroBold} className={inputClass} />
              </label>
              <label className={labelClass}>
                Заключение — окончание
                <input type="text" name="howToOrderOutroTail" defaultValue={shared.howToOrderOutroTail} className={inputClass} />
              </label>
            </div>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>Блок «Наша команда»</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Заголовок
              <input type="text" name="teamTitle" defaultValue={shared.teamTitle} className={inputClass} />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Подзаголовок, строка 1
                <input type="text" name="teamSubtitle1" defaultValue={shared.teamSubtitle1} className={inputClass} />
              </label>
              <label className={labelClass}>
                Подзаголовок, строка 2
                <input type="text" name="teamSubtitle2" defaultValue={shared.teamSubtitle2} className={inputClass} />
              </label>
            </div>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>Заголовки остальных секций</summary>
          <div className={sectionBodyClass}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className={labelClass}>
                Калькулятор
                <input type="text" name="calculatorTitle" defaultValue={shared.calculatorTitle} className={inputClass} />
              </label>
              <label className={labelClass}>
                Отзывы
                <input type="text" name="reviewsTitle" defaultValue={shared.reviewsTitle} className={inputClass} />
              </label>
              <label className={labelClass}>
                Галерея «Примеры работ»
                <input type="text" name="galleryTitle" defaultValue={shared.galleryTitle} className={inputClass} />
              </label>
            </div>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>FAQ на страницах услуг</summary>
          <div className={sectionBodyClass}>
            <Repeater
              name="serviceFaq"
              fields={[
                { name: "question", label: "Вопрос" },
                { name: "answer", label: "Ответ", type: "textarea" },
              ]}
              initialItems={shared.serviceFaq}
              addLabel="+ Добавить вопрос"
            />
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>SEO-текст (блок «Читать полностью»)</summary>
          <div className={sectionBodyClass}>
            <Repeater
              name="seoText"
              fields={[{ name: "value", label: "Абзац", type: "textarea", rows: 4 }]}
              initialItems={shared.seoText.map((value) => ({ value }))}
              addLabel="+ Добавить абзац"
            />
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>Блок консультации</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Надзаголовок
              <input type="text" name="consultationEyebrow" defaultValue={shared.consultationEyebrow} className={inputClass} />
            </label>
            <label className={labelClass}>
              Заголовок
              <input type="text" name="consultationTitle" defaultValue={shared.consultationTitle} className={inputClass} />
            </label>
            <label className={labelClass}>
              Подзаголовок
              <input type="text" name="consultationSubtitle" defaultValue={shared.consultationSubtitle} className={inputClass} />
            </label>
            <label className={labelClass}>
              Пункты списка
              <Repeater
                name="consultationPerks"
                fields={[{ name: "value", label: "Пункт" }]}
                initialItems={shared.consultationPerks.map((value) => ({ value }))}
                addLabel="+ Добавить пункт"
              />
            </label>
            <label className={labelClass}>
              Текст кнопки
              <input type="text" name="consultationCtaLabel" defaultValue={shared.consultationCtaLabel} className={inputClass} />
            </label>
          </div>
        </details>

        <div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary">
            Сохранить всё
          </button>
        </div>
      </AdminForm>
    </div>
  );
}
