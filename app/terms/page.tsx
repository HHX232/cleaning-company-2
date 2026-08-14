import type { Metadata } from "next";
import type { ReactNode } from "react";
import { company, contactLinks, feedbackEmail } from "@/lib/content";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: `Пользовательское соглашение — ${company.name}`,
};

const linkClass = "underline hover:text-ink";
const phoneHref = `tel:+${company.phone.replace(/\D/g, "")}`;

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "1. Общие положения",
    body: `Настоящее пользовательское соглашение регулирует условия использования сайта ${company.name} (далее — «Сайт») и оказания клининговых услуг. Оставляя заявку, регистрируя личный кабинет или иным образом используя Сайт, вы подтверждаете, что ознакомлены и согласны с условиями настоящего соглашения.`,
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
  {
    title: "7. Контакты",
    body: (
      <>
        По всем вопросам, связанным с настоящим соглашением, вы можете связаться с нами по адресу{" "}
        <a href={contactLinks.email} className={linkClass}>
          {feedbackEmail}
        </a>{" "}
        или по телефону{" "}
        <a href={phoneHref} className={linkClass}>
          {company.phone}
        </a>
        .
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />
      <div className="mx-auto max-w-180 px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink sm:text-[28px]">Пользовательское соглашение</h1>
        <p className="mb-8 text-sm text-muted">Действует с 10 августа 2026 года</p>

        <div className="flex flex-col gap-6">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-2 text-base font-extrabold text-ink sm:text-lg">{s.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer id="order" />
    </div>
  );
}
