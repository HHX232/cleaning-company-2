import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type GuaranteeItem = { title: string; text: string };

export type GuaranteesContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  items: GuaranteeItem[];
  ctaTitle: string;
  ctaText: string;
};

// Shown when no GuaranteesPage row exists yet; also seeded into the DB so
// the admin has editable content out of the box. Matches the copy that used
// to be hardcoded in app/nashi-garantii/page.tsx.
export const GUARANTEES_DEFAULTS: GuaranteesContent = {
  eyebrow: "Наши гарантии",
  heading: "Мы отвечаем за результат",
  lead: "Заказывая уборку у нас, вы получаете не только чистоту, но и спокойствие. Каждый заказ подкреплён понятными гарантиями — вот что мы обещаем и всегда выполняем.",
  items: [
    {
      title: "Гарантия качества",
      text: "Если результат вас не устроил, мы бесплатно вернёмся и переделаем работу. Ваша удовлетворённость — главный критерий приёмки.",
    },
    {
      title: "Фиксированная цена",
      text: "Стоимость согласовывается до начала уборки и не меняется по ходу работ. Вы платите ровно столько, о чём договорились.",
    },
    {
      title: "Сохранность имущества",
      text: "Наши клинеры аккуратно обращаются с мебелью, техникой и покрытиями. Мы несём ответственность за сохранность ваших вещей.",
    },
    {
      title: "Безопасные средства",
      text: "Используем сертифицированную профессиональную химию, безопасную для детей, аллергиков и домашних животных.",
    },
    {
      title: "Конфиденциальность",
      text: "Всё, что мы видим на объекте, остаётся между нами. Особенно при деликатных заказах — работаем тактично и без огласки.",
    },
    {
      title: "Соблюдение сроков",
      text: "Приезжаем в согласованное время и укладываемся в оговорённый срок. Ценим ваше время так же, как своё.",
    },
  ],
  ctaTitle: "Закажите уборку с гарантией",
  ctaText: "Оставьте заявку — и мы возьмём на себя всю ответственность за чистоту вашего объекта.",
};

export const getGuaranteesContent = unstable_cache(
  async (): Promise<GuaranteesContent> => {
    const row = await prisma.guaranteesPage.findUnique({ where: { id: "guarantees" } });
    if (!row) return GUARANTEES_DEFAULTS;
    return {
      eyebrow: row.eyebrow,
      heading: row.heading,
      lead: row.lead,
      items: (row.items as GuaranteeItem[] | null) ?? [],
      ctaTitle: row.ctaTitle,
      ctaText: row.ctaText,
    };
  },
  ["guarantees-content"],
  { revalidate: 600 },
);
