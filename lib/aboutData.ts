import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type AboutStat = { value: string; label: string };
export type AboutValue = { title: string; text: string };

export type AboutContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  stats: AboutStat[];
  missionTitle: string;
  missionText1: string;
  missionText2: string;
  values: AboutValue[];
  ctaTitle: string;
  ctaText: string;
};

// Shown when no AboutPage row exists yet; also seeded into the DB so the
// admin has editable content out of the box.
export const ABOUT_DEFAULTS: AboutContent = {
  eyebrow: "О компании",
  heading: "Специализированный-клининг — чистота, которой можно доверять",
  lead: "Мы — команда профессионалов, которая берёт на себя уборку любой сложности: от поддерживающей уборки квартиры до восстановления помещений после пожара, потопа и других происшествий. Работаем в Минске и по всей Беларуси, на связи 24 часа в сутки 7 дней в неделю.",
  stats: [
    { value: "8 лет", label: "на рынке клининга Беларуси" },
    { value: "12 000+", label: "выполненных уборок" },
    { value: "40+", label: "клинеров в штате" },
    { value: "4.9 / 5", label: "средняя оценка клиентов" },
  ],
  missionTitle: "Наша миссия",
  missionText1:
    "Мы верим, что чистота — это не роскошь, а комфорт, доступный каждому. Наша задача — освободить вас от бесконечной уборки и вернуть время на то, что действительно важно: семью, работу и отдых.",
  missionText2:
    "Поэтому мы беремся и за простые, и за самые сложные задачи, от которых отказываются другие. У нас собственная профессиональная техника, сертифицированная химия и обученная команда, которая знает, как справиться с любым загрязнением быстро и без вреда для здоровья.",
  values: [
    { title: "Честность", text: "Называем итоговую цену до начала работ и не добавляем скрытых доплат по ходу уборки." },
    { title: "Ответственность", text: "Отвечаем за результат: если что-то сделано не идеально — переделываем бесплатно." },
    { title: "Забота", text: "Используем безопасные средства, бережно относимся к вашим вещам, мебели и покрытиям." },
    { title: "Скорость", text: "На связи круглосуточно и выезжаем в день обращения — даже на срочные и экстренные заказы." },
  ],
  ctaTitle: "Готовы доверить нам уборку?",
  ctaText: "Оставьте заявку — рассчитаем стоимость и подберём удобное время выезда бригады.",
};

export const getAboutContent = unstable_cache(
  async (): Promise<AboutContent> => {
    const row = await prisma.aboutPage.findUnique({ where: { id: "about" } });
    if (!row) return ABOUT_DEFAULTS;
    return {
      eyebrow: row.eyebrow,
      heading: row.heading,
      lead: row.lead,
      stats: (row.stats as AboutStat[] | null) ?? [],
      missionTitle: row.missionTitle,
      missionText1: row.missionText1,
      missionText2: row.missionText2,
      values: (row.values as AboutValue[] | null) ?? [],
      ctaTitle: row.ctaTitle,
      ctaText: row.ctaText,
    };
  },
  ["about-content"],
  { revalidate: 600 },
);
