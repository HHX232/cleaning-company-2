import { prisma } from "@/lib/prisma";
import { imageUrl } from "@/lib/imageStorage";
import { homeImageSlots } from "@/lib/homeImageSlots";
import { getHomeContent } from "@/lib/homeContentData";
import ImageUploadRow from "@/components/admin/ImageUploadRow";
import AdminForm from "@/components/admin/AdminForm";
import Repeater from "@/components/admin/Repeater";
import { updateHomeContent } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-sm text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";
const sectionClass = "rounded-lg border border-border";
const sectionHeaderClass = "cursor-pointer px-3 py-2.5 text-sm font-extrabold text-ink";
const sectionBodyClass = "flex flex-col gap-4 border-t border-border p-3";

export default async function AdminHomePage() {
  const [images, home] = await Promise.all([
    prisma.siteImage.findMany({ where: { key: { in: homeImageSlots.map((s) => s.key) } } }),
    getHomeContent(),
  ]);
  const imageByKey = new Map(images.map((img) => [img.key, img]));
  const sections = Array.from(new Set(homeImageSlots.map((s) => s.section)));

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Главная страница</h1>
      <p className="mb-6 text-sm text-muted">
        Весь текст главной страницы, разбитый по блокам сверху вниз. Фото — в конце страницы.
      </p>

      <AdminForm action={updateHomeContent} className="mb-10 flex flex-col gap-3">
        <details open className={sectionClass}>
          <summary className={sectionHeaderClass}>Hero-баннер</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Надзаголовок над заголовком (eyebrow)
              <input type="text" name="heroEyebrow" defaultValue={home.heroEyebrow} className={inputClass} />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className={labelClass}>
                Заголовок, строка 1
                <input type="text" name="heroTitleMain" defaultValue={home.heroTitleMain} className={inputClass} />
              </label>
              <label className={labelClass}>
                Заголовок, выделенное слово
                <input
                  type="text"
                  name="heroTitleHighlight"
                  defaultValue={home.heroTitleHighlight}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Заголовок, окончание
                <input type="text" name="heroTitleSuffix" defaultValue={home.heroTitleSuffix} className={inputClass} />
              </label>
            </div>
            <label className={labelClass}>
              Подзаголовок
              <textarea name="heroSubtitle" defaultValue={home.heroSubtitle} rows={2} className={inputClass} />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Текст кнопки «Заказать уборку»
                <input type="text" name="heroCtaPrimary" defaultValue={home.heroCtaPrimary} className={inputClass} />
              </label>
              <label className={labelClass}>
                Текст ссылки «Смотреть услуги»
                <input type="text" name="heroCtaSecondary" defaultValue={home.heroCtaSecondary} className={inputClass} />
              </label>
            </div>
            <label className={labelClass}>
              Бейджи услуг
              <Repeater
                name="heroServices"
                fields={[{ name: "value", label: "Бейдж", placeholder: "Мойка окон и витрин" }]}
                initialItems={home.heroServices.map((s) => ({ value: s.label }))}
                addLabel="+ Добавить бейдж"
              />
            </label>
            <label className={labelClass}>
              Статистика под баннером
              <Repeater
                name="heroStats"
                fields={[
                  { name: "value", label: "Значение", placeholder: "1000+" },
                  { name: "label", label: "Подпись", placeholder: "уборок выполнено" },
                ]}
                initialItems={home.heroStats}
                addLabel="+ Добавить показатель"
              />
            </label>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>Карусель «Причины заказать уборку»</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Заголовок секции
              <input type="text" name="reasonsSectionTitle" defaultValue={home.reasonsSectionTitle} className={inputClass} />
            </label>
            <label className={labelClass}>
              Слайды — ровно 5, каждый привязан к своей фотографии по порядку (фото — в разделе «Причины заказать
              уборку» ниже)
              <Repeater
                name="reasons"
                fields={[
                  { name: "tag", label: "Тег", placeholder: "Пунктуальность" },
                  { name: "title", label: "Заголовок" },
                  { name: "text", label: "Текст", type: "textarea" },
                ]}
                initialItems={home.reasons}
                fixed
              />
            </label>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>Заголовки остальных секций</summary>
          <div className={sectionBodyClass}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                «Наши специалисты»
                <input type="text" name="specialistsTitle" defaultValue={home.specialistsTitle} className={inputClass} />
              </label>
              <label className={labelClass}>
                Калькулятор
                <input type="text" name="calculatorTitle" defaultValue={home.calculatorTitle} className={inputClass} />
              </label>
              <label className={labelClass}>
                Отзывы
                <input type="text" name="reviewsTitle" defaultValue={home.reviewsTitle} className={inputClass} />
              </label>
              <label className={labelClass}>
                Галерея «Примеры работ»
                <input type="text" name="galleryTitle" defaultValue={home.galleryTitle} className={inputClass} />
              </label>
              <label className={labelClass}>
                «Наши акции»
                <input type="text" name="promotionsTitle" defaultValue={home.promotionsTitle} className={inputClass} />
              </label>
              <label className={labelClass}>
                «Наши услуги»
                <input type="text" name="servicesTitle" defaultValue={home.servicesTitle} className={inputClass} />
              </label>
              <label className={labelClass}>
                «Цены на клининг»
                <input type="text" name="pricesTitle" defaultValue={home.pricesTitle} className={inputClass} />
              </label>
            </div>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>Блок «Простой и понятный процесс»</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Заголовок
              <input type="text" name="howItWorksTitle" defaultValue={home.howItWorksTitle} className={inputClass} />
            </label>
            <label className={labelClass}>
              Подзаголовок
              <textarea name="howItWorksLead" defaultValue={home.howItWorksLead} rows={2} className={inputClass} />
            </label>
            <label className={labelClass}>
              Шаги — иконка задаётся одним словом: phone, calendar, bag, camera или badge
              <Repeater
                name="howItWorks"
                fields={[
                  { name: "icon", label: "Иконка", placeholder: "phone" },
                  { name: "title", label: "Заголовок" },
                  { name: "text", label: "Текст", type: "textarea" },
                ]}
                initialItems={home.howItWorks}
                addLabel="+ Добавить шаг"
              />
            </label>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>Блок «Уборка с понятными условиями»</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Заголовок
              <input
                type="text"
                name="serviceGuaranteesTitle"
                defaultValue={home.serviceGuaranteesTitle}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Карточки — иконка задаётся одним словом: clock, trophy, shield, wallet или heart
              <Repeater
                name="serviceGuarantees"
                fields={[
                  { name: "icon", label: "Иконка", placeholder: "clock" },
                  { name: "title", label: "Заголовок" },
                  { name: "text", label: "Текст", type: "textarea" },
                ]}
                initialItems={home.serviceGuarantees}
                addLabel="+ Добавить карточку"
              />
            </label>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>FAQ на главной</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Заголовок блока
              <input type="text" name="faqSectionTitle" defaultValue={home.faqSectionTitle} className={inputClass} />
            </label>
            <label className={labelClass}>
              Вопросы
              <Repeater
                name="faqItems"
                fields={[
                  { name: "question", label: "Вопрос" },
                  { name: "answer", label: "Ответ", type: "textarea" },
                ]}
                initialItems={home.faqItems}
                addLabel="+ Добавить вопрос"
              />
            </label>
          </div>
        </details>

        <details className={sectionClass}>
          <summary className={sectionHeaderClass}>Нижний CTA-баннер</summary>
          <div className={sectionBodyClass}>
            <label className={labelClass}>
              Заголовок
              <input type="text" name="ctaBannerTitle" defaultValue={home.ctaBannerTitle} className={inputClass} />
            </label>
            <label className={labelClass}>
              Текст кнопки
              <input type="text" name="ctaBannerCtaLabel" defaultValue={home.ctaBannerCtaLabel} className={inputClass} />
            </label>
            <label className={labelClass}>
              Абзацы — ровно 3, оформление у каждого разное
              <Repeater
                name="ctaBannerParagraphs"
                fields={[{ name: "value", label: "Абзац", type: "textarea", rows: 2 }]}
                initialItems={home.ctaBannerParagraphs.map((value) => ({ value }))}
                fixed
              />
            </label>
          </div>
        </details>

        <div>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-on-primary">
            Сохранить всё
          </button>
        </div>
      </AdminForm>

      <h2 className="mb-4 text-lg font-extrabold text-ink">Фото на главной странице</h2>
      {sections.map((section) => (
        <div key={section} className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-muted uppercase">{section}</h2>
          <div className="flex flex-col gap-3">
            {homeImageSlots
              .filter((slot) => slot.section === section)
              .map((slot) => {
                const img = imageByKey.get(slot.key);
                return (
                  <ImageUploadRow
                    key={slot.key}
                    imgKey={slot.key}
                    label={slot.label}
                    currentSrc={img ? imageUrl(slot.key, img.updatedAt) : undefined}
                    redirectTo="/admin"
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
