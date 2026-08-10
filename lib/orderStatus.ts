import type { Order } from "@prisma/client";
import type { OrderKind } from "@/lib/dbEnums";

export type OrderStatus = "scheduled" | "progress" | "done" | "canceled";

export function deriveStatus(order: Pick<Order, "canceledAt" | "completedAt" | "assignedAt">): OrderStatus {
  if (order.canceledAt) return "canceled";
  if (order.completedAt) return "done";
  if (order.assignedAt) return "progress";
  return "scheduled";
}

export const statusPresentation: Record<
  OrderStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  done: { label: "Выполнено", bgClass: "bg-[rgba(47,158,91,0.14)]", textClass: "text-primary-dark" },
  progress: { label: "В процессе выполнения", bgClass: "bg-[rgba(47,111,237,0.14)]", textClass: "text-info" },
  scheduled: { label: "Ожидает", bgClass: "bg-[rgba(201,162,74,0.16)]", textClass: "text-[#8a6a1e]" },
  canceled: { label: "Отменено", bgClass: "bg-[rgba(217,75,75,0.14)]", textClass: "text-[#b23434]" },
};

const TIMELINE_FILL: Record<OrderStatus, number> = {
  scheduled: 0,
  progress: 2,
  done: 4,
  canceled: 1,
};

export function timelineSegments(status: OrderStatus): { filled: boolean }[] {
  const filled = TIMELINE_FILL[status];
  return [0, 1, 2, 3].map((i) => ({ filled: i < filled }));
}

export const kindPresentation: Record<OrderKind, { label: string; iconPath: string; iconBgClass: string; iconColorClass: string }> = {
  GENERAL: {
    label: "Генеральная уборка",
    iconPath: "M4 4h16v16H4z M8 8h8v8H8z",
    iconBgClass: "bg-[rgba(47,158,91,0.12)]",
    iconColorClass: "text-primary",
  },
  WINDOWS: {
    label: "Мойка окон",
    iconPath: "M12 3v18M3 12h18",
    iconBgClass: "bg-[rgba(47,158,91,0.12)]",
    iconColorClass: "text-primary",
  },
  RENOVATION: {
    label: "Уборка после ремонта",
    iconPath: "M14.7 6.3l3 3L9 18H6v-3z",
    iconBgClass: "bg-[rgba(201,162,74,0.14)]",
    iconColorClass: "text-[#8a6a1e]",
  },
  SUPPORT: {
    label: "Поддерживающая уборка",
    iconPath: "M4 4h16v16H4z M8 8h8v8H8z",
    iconBgClass: "bg-[rgba(47,158,91,0.12)]",
    iconColorClass: "text-primary",
  },
  // Created from the homepage calculator (lib/orderCreation.ts).
  STANDARD: {
    label: "Без происшествий",
    iconPath: "M4 4h16v16H4z M8 8h8v8H8z",
    iconBgClass: "bg-[rgba(47,158,91,0.12)]",
    iconColorClass: "text-primary",
  },
  DEATH: {
    label: "После смерти",
    iconPath: "M12 3l8 4.5v9L12 21l-8-4.5v-9z",
    iconBgClass: "bg-[rgba(217,75,75,0.12)]",
    iconColorClass: "text-[#b23434]",
  },
  FLOOD: {
    label: "После потопа",
    iconPath: "M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z",
    iconBgClass: "bg-[rgba(47,111,237,0.12)]",
    iconColorClass: "text-info",
  },
  FIRE: {
    label: "После пожара",
    iconPath: "M12 2c1 4-3 5-3 8a3 3 0 0 0 6 0c1 1 1.5 2.5 1.5 4a4.5 4.5 0 0 1-9 0C7.5 9 12 6 12 2z",
    iconBgClass: "bg-[rgba(201,162,74,0.14)]",
    iconColorClass: "text-[#8a6a1e]",
  },
};

// order.kind is a plain string column now (SQLite), so look it up defensively
// with a STANDARD fallback rather than indexing kindPresentation directly.
export function kindPresentationFor(kind: string) {
  return kindPresentation[kind as OrderKind] ?? kindPresentation.STANDARD;
}

type TimelineStep = { label: string; time: string; dotClass: string };

const RU_MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export function formatRuDate(date: Date, withYear = true): string {
  const day = date.getDate();
  const month = RU_MONTHS[date.getMonth()];
  return withYear ? `${day} ${month} ${date.getFullYear()}` : `${day} ${month}`;
}

export function formatRuDateTime(date: Date): string {
  const time = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  return `${formatRuDate(date, false)}, ${time}`;
}

export function buildTimelineSteps(order: Order): TimelineStep[] {
  const status = deriveStatus(order);

  if (status === "canceled") {
    return [
      { label: "Заявка принята", time: formatRuDateTime(order.acceptedAt), dotClass: "bg-primary" },
      { label: "Отменена клиентом", time: formatRuDateTime(order.canceledAt!), dotClass: "bg-[#b23434]" },
      { label: "Уборка выполнена", time: "—", dotClass: "bg-border" },
      { label: "Оплата", time: "—", dotClass: "bg-border" },
    ];
  }

  return [
    { label: "Заявка принята", time: formatRuDateTime(order.acceptedAt), dotClass: "bg-primary" },
    {
      label: "Бригада назначена",
      time: order.assignedAt ? formatRuDateTime(order.assignedAt) : "ожидается",
      dotClass: order.assignedAt ? "bg-primary" : "bg-border",
    },
    {
      label: "Уборка выполнена",
      time: order.completedAt ? formatRuDateTime(order.completedAt) : "ожидается",
      dotClass: order.completedAt ? "bg-primary" : "bg-border",
    },
    {
      label: "Оплата получена",
      time: order.paidAt ? formatRuDateTime(order.paidAt) : "ожидается",
      dotClass: order.paidAt ? "bg-primary" : "bg-border",
    },
  ];
}
