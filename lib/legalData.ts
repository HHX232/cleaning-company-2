import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type LegalSection = { title: string; body: string };

export type LegalPageContent = {
  heading: string;
  effectiveDate: string;
  sections: LegalSection[];
};

// Each section is a "### Title" line followed by its body text, blocks
// separated by a blank line — lets an admin add/remove sections just by
// adding/removing "### " blocks in one textarea, same spirit as the
// pipe-joined lists used elsewhere (see lib/aboutData.ts).
export function parseLegalSections(raw: string): LegalSection[] {
  return raw
    .split(/\n(?=###\s+)/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [firstLine, ...rest] = block.split("\n");
      return { title: firstLine.replace(/^###\s+/, "").trim(), body: rest.join("\n").trim() };
    });
}

export function serializeLegalSections(sections: LegalSection[]): string {
  return sections.map((s) => `### ${s.title}\n${s.body}`).join("\n\n");
}

// Shown when no LegalPage row exists yet for this id; also seeded into the
// DB so the admin has editable content out of the box. The final "Контакты"
// section on each public page is appended separately with live phone/email
// links (lib/content.ts), not part of this editable text.
export const LEGAL_DEFAULTS: Record<"privacy" | "terms", LegalPageContent> = {
  privacy: {
    heading: "Политика конфиденциальности",
    effectiveDate: "Действует с 7 августа 2026 года",
    sections: [
      {
        title: "1. Общие положения",
        body: "Настоящая политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта (далее — «Компания»). Используя сайт, оставляя заявку или регистрируя личный кабинет, вы подтверждаете согласие с условиями настоящей политики.",
      },
      {
        title: "2. Какие данные мы собираем",
        body: "Мы можем собирать: имя, номер телефона, адрес объекта уборки, адрес электронной почты, а также сообщения, которые вы отправляете через форму заявки, калькулятор стоимости или чат с менеджером.",
      },
      {
        title: "3. Цели обработки данных",
        body: "Персональные данные используются для обработки заявок на уборку, связи с клиентом, подтверждения деталей заказа, информирования о статусе выполнения работ и улучшения качества сервиса. Данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством.",
      },
      {
        title: "4. Хранение данных",
        body: "Данные хранятся в защищённой базе данных Компании в течение срока, необходимого для оказания услуг и выполнения обязательств, либо до момента отзыва согласия пользователем.",
      },
      {
        title: "5. Права пользователя",
        body: "Вы вправе в любой момент запросить уточнение, исправление или удаление своих персональных данных, а также отозвать согласие на их обработку, написав на электронную почту, указанную ниже.",
      },
    ],
  },
  terms: {
    heading: "Пользовательское соглашение",
    effectiveDate: "Действует с 10 августа 2026 года",
    sections: [
      {
        title: "1. Общие положения",
        body: "Настоящее пользовательское соглашение регулирует условия использования сайта (далее — «Сайт») и оказания клининговых услуг. Оставляя заявку, регистрируя личный кабинет или иным образом используя Сайт, вы подтверждаете, что ознакомлены и согласны с условиями настоящего соглашения.",
      },
      {
        title: "2. Порядок оформления заявки",
        body: "Заявка на уборку оформляется через калькулятор стоимости, форму обратной связи, чат с менеджером или по телефону. Итоговая стоимость и сроки подтверждаются менеджером после уточнения деталей и могут отличаться от предварительного расчёта калькулятора в зависимости от фактического объёма работ.",
      },
      {
        title: "3. Права и обязанности сторон",
        body: "Компания обязуется оказать услуги в согласованные сроки и надлежащего качества. Клиент обязуется предоставить достоверные контактные данные и обеспечить доступ к объекту уборки в согласованное время. Стороны вправе отменить или перенести заявку, предупредив об этом заранее.",
      },
      {
        title: "4. Оплата",
        body: "Оплата производится после приёмки выполненных работ, если иное не согласовано сторонами отдельно. Способ оплаты клиент выбирает самостоятельно из доступных на сайте вариантов.",
      },
      {
        title: "5. Ответственность",
        body: "Компания несёт ответственность за качество оказанных услуг в соответствии с законодательством. Компания не несёт ответственности за ущерб, возникший по вине клиента (недостоверные данные, отсутствие доступа к объекту, форс-мажорные обстоятельства).",
      },
      {
        title: "6. Изменение условий",
        body: "Компания вправе в одностороннем порядке изменять условия настоящего соглашения. Актуальная версия всегда доступна на этой странице.",
      },
    ],
  },
};

export const getLegalContent = unstable_cache(
  async (page: "privacy" | "terms"): Promise<LegalPageContent> => {
    const row = await prisma.legalPage.findUnique({ where: { id: page } });
    if (!row) return LEGAL_DEFAULTS[page];
    return {
      heading: row.heading,
      effectiveDate: row.effectiveDate,
      sections: parseLegalSections(row.sectionsText),
    };
  },
  ["legal-content"],
  { revalidate: 600 },
);
