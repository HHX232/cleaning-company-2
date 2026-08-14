import type { Metadata } from "next";
import type { ReactNode } from "react";
import { company, contactLinks, feedbackEmail } from "@/lib/content";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: `Политика конфиденциальности — ${company.name}`,
};

const linkClass = "underline hover:text-ink";
const phoneHref = `tel:+${company.phone.replace(/\D/g, "")}`;

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "1. Общие положения",
    body: `Настоящая политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта ${company.name} (далее — «Компания»). Используя сайт, оставляя заявку или регистрируя личный кабинет, вы подтверждаете согласие с условиями настоящей политики.`,
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
  {
    title: "6. Контакты",
    body: (
      <>
        По всем вопросам, связанным с обработкой персональных данных, вы можете связаться с нами по адресу{" "}
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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />
      <div className="mx-auto max-w-180 px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink sm:text-[28px]">Политика конфиденциальности</h1>
        <p className="mb-8 text-sm text-muted">Действует с 7 августа 2026 года</p>

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
