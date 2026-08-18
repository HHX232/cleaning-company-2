// Fixed registry of every DB-backed image slot on the homepage. Single
// source of truth for both app/page.tsx (which keys to fetch) and the
// admin dashboard (which upload rows to render).
export const homeImageSlots = [
  { key: "hero-home", section: "Главный экран (Hero)", label: "Фоновое фото" },
  { key: "why-us-reason1", section: "Причины заказать уборку", label: "Слайд 1: Пунктуальность" },
  { key: "why-us-reason2", section: "Причины заказать уборку", label: "Слайд 2: Оборудование" },
  { key: "why-us-reason3", section: "Причины заказать уборку", label: "Слайд 3: Доверие" },
  { key: "why-us-reason4", section: "Причины заказать уборку", label: "Слайд 4: Спецподготовка" },
  { key: "why-us-reason5", section: "Причины заказать уборку", label: "Слайд 5: Масштаб" },
  { key: "svc-incidents", section: "Наши услуги", label: "Уборка после происшествий" },
  { key: "svc-windows", section: "Наши услуги", label: "Мойка окон" },
  { key: "svc-flats", section: "Наши услуги", label: "Уборка квартир" },
  { key: "svc-houses", section: "Наши услуги", label: "Уборка домов" },
  { key: "svc-rooms", section: "Наши услуги", label: "Уборка помещений" },
  { key: "cta-banner-home", section: "CTA-баннер", label: "Фото сотрудника компании" },
] as const;

export type HomeImageSlotKey = (typeof homeImageSlots)[number]["key"];
