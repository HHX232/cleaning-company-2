import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type Advantage = { icon: string; title: string; text: string };

export type WhyUsPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  advantages: Advantage[];
};

// Shown when no WhyUsPage row exists yet; also seeded into the DB so the
// admin has editable content out of the box. Matches the copy that used to
// be hardcoded in lib/content.ts's `whyChooseUs` export.
export const WHY_US_PAGE_DEFAULTS: WhyUsPageContent = {
  eyebrow: "Почему выбирают нас",
  title: "8 причин доверить уборку нам",
  description:
    "Мы делаем клининг простым и предсказуемым: честная цена, быстрый выезд и результат, за который не стыдно. Вот почему нам доверяют тысячи клиентов по всей Беларуси.",
  advantages: [
    { icon: "🕒", title: "Работаем 24/7", text: "Принимаем заявки и выезжаем круглосуточно — даже ночью, в выходные и праздники." },
    { icon: "₽", title: "Честная цена", text: "Фиксируем стоимость до начала работ. Никаких скрытых доплат «по факту»." },
    { icon: "⚡", title: "Выезд в день обращения", text: "Срочно нужна уборка? Приедем сегодня и приведём объект в порядок под ключ." },
    { icon: "🧪", title: "Своя химия и техника", text: "Профессиональные моющие пылесосы, парогенераторы и сертифицированные средства." },
    { icon: "👷", title: "Опытная команда", text: "Обученные клинеры со стажем, которые знают, как справиться с любым загрязнением." },
    { icon: "🛡️", title: "Гарантия результата", text: "Не устроил результат? Вернёмся и переделаем бесплатно — без лишних вопросов." },
    { icon: "🌍", title: "По всей Беларуси", text: "Работаем в Минске и выезжаем в область и другие города страны." },
    { icon: "🤝", title: "Берёмся за сложное", text: "Убираем то, за что не берутся другие: после пожара, потопа, запущенные помещения." },
  ],
};

export const getWhyUsPageContent = unstable_cache(
  async (): Promise<WhyUsPageContent> => {
    const row = await prisma.whyUsPage.findUnique({ where: { id: "why-us" } });
    if (!row) return WHY_US_PAGE_DEFAULTS;
    return {
      eyebrow: row.eyebrow,
      title: row.title,
      description: row.description,
      advantages: (row.advantages as Advantage[] | null) ?? [],
    };
  },
  ["why-us-page-content"],
  { revalidate: 600 },
);
