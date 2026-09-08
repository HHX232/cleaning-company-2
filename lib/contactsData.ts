import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ContactsContent = {
  eyebrow: string;
  heading: string;
  lead: string;
  hoursValue: string;
  hoursText: string;
  areaText: string;
  phoneNote: string;
  emailNote: string;
  messengersHeading: string;
  ctaTitle: string;
  ctaText: string;
};

// Shown when no ContactsPage row exists yet; also seeded into the DB so the
// admin has editable content out of the box. Matches the copy that used to
// be hardcoded in app/contacts/page.tsx.
export const CONTACTS_DEFAULTS: ContactsContent = {
  eyebrow: "Контакты",
  heading: "Свяжитесь с нами удобным способом",
  lead: "Позвоните, напишите в мессенджер или оставьте заявку — ответим быстро и поможем подобрать услугу. Мы на связи круглосуточно.",
  hoursValue: "Круглосуточно, 7 дней в неделю",
  hoursText: "Выезжаем в том числе ночью, в выходные и праздники.",
  areaText: "Работаем по городу, области и в других городах страны.",
  phoneNote: "Звоните в любое время — принимаем заявки 24/7.",
  emailNote: "Для заявок, вопросов и коммерческих предложений.",
  messengersHeading: "Напишите в мессенджер",
  ctaTitle: "Оставьте заявку на обратный звонок",
  ctaText: "Укажите номер — перезвоним, ответим на вопросы и рассчитаем стоимость уборки.",
};

export const getContactsContent = unstable_cache(
  async (): Promise<ContactsContent> => {
    const row = await prisma.contactsPage.findUnique({ where: { id: "contacts" } });
    if (!row) return CONTACTS_DEFAULTS;
    return {
      eyebrow: row.eyebrow,
      heading: row.heading,
      lead: row.lead,
      hoursValue: row.hoursValue,
      hoursText: row.hoursText,
      areaText: row.areaText,
      phoneNote: row.phoneNote,
      emailNote: row.emailNote,
      messengersHeading: row.messengersHeading,
      ctaTitle: row.ctaTitle,
      ctaText: row.ctaText,
    };
  },
  ["contacts-content"],
  { revalidate: 600 },
);
