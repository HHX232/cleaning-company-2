// Fixed registry of every DB-backed image slot on the homepage. Single
// source of truth for both app/page.tsx (which keys to fetch) and the
// admin dashboard (which upload rows to render).
export const homeImageSlots = [
  { key: "hero-home", section: "Главный экран (Hero)", label: "Фоновое фото" },
  { key: "why-us-reason1", section: "Причины заказать уборку", label: "Фото 1 (крупное)" },
  { key: "why-us-reason2", section: "Причины заказать уборку", label: "Фото 2" },
  { key: "svc-incidents", section: "Наши услуги", label: "Уборка после происшествий" },
  { key: "svc-windows", section: "Наши услуги", label: "Мойка окон" },
  { key: "svc-flats", section: "Наши услуги", label: "Уборка квартир" },
  { key: "svc-houses", section: "Наши услуги", label: "Уборка домов" },
  { key: "svc-rooms", section: "Наши услуги", label: "Уборка помещений" },
  { key: "staff-1", section: "Наша команда", label: "Клинер-универсал" },
  { key: "staff-2", section: "Наша команда", label: "Бригадир" },
  { key: "staff-3", section: "Наша команда", label: "Специалист по спецуборке" },
  { key: "staff-4", section: "Наша команда", label: "Менеджер по заявкам" },
  { key: "cta-banner-home", section: "CTA-баннер", label: "Фото сотрудника компании" },
] as const;

export type HomeImageSlotKey = (typeof homeImageSlots)[number]["key"];
