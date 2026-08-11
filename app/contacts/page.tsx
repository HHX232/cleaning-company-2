import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import OrderButton from "@/components/landing/OrderButton";
import { TelegramIcon, ViberIcon, WhatsAppIcon } from "@/components/ui/MessengerIcons";
import { company, contactLinks, feedbackEmail } from "@/lib/content";

export const metadata: Metadata = {
  title: `Контакты — ${company.name}`,
  description:
    "Свяжитесь с нами: телефон, WhatsApp, Viber, Telegram и электронная почта. Работаем в Минске и по всей Беларуси круглосуточно, без выходных.",
  alternates: { canonical: "/contacts" },
};

const phoneHref = `tel:+${company.phone.replace(/\D/g, "")}`;

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />

      <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-200">
          <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:text-sm">
            Контакты
          </div>
          <h1 className="mb-4 text-2xl font-extrabold text-ink sm:text-[34px] sm:leading-tight">
            Свяжитесь с нами удобным способом
          </h1>
          <p className="max-w-160 text-sm leading-relaxed text-muted sm:text-base">
            Позвоните, напишите в мессенджер или оставьте заявку — ответим быстро и поможем подобрать услугу.
            Мы на связи круглосуточно.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-260 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-1.5 text-xs font-bold text-muted uppercase">Телефон</div>
            <a href={phoneHref} className="text-lg font-extrabold text-ink transition-colors hover:text-primary sm:text-xl">
              {company.phone}
            </a>
            <p className="mt-1.5 text-[13px] leading-snug text-muted">
              Звоните в любое время — принимаем заявки 24/7.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-1.5 text-xs font-bold text-muted uppercase">Электронная почта</div>
            <a href={contactLinks.email} className="text-lg font-extrabold break-all text-ink transition-colors hover:text-primary sm:text-xl">
              {feedbackEmail}
            </a>
            <p className="mt-1.5 text-[13px] leading-snug text-muted">
              Для заявок, вопросов и коммерческих предложений.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-1.5 text-xs font-bold text-muted uppercase">Режим работы</div>
            <div className="text-lg font-extrabold text-ink sm:text-xl">Круглосуточно, 7 дней в неделю</div>
            <p className="mt-1.5 text-[13px] leading-snug text-muted">
              Выезжаем в том числе ночью, в выходные и праздники.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-1.5 text-xs font-bold text-muted uppercase">Зона обслуживания</div>
            <div className="text-lg font-extrabold text-ink sm:text-xl">{company.city} и вся Беларусь</div>
            <p className="mt-1.5 text-[13px] leading-snug text-muted">
              Работаем по городу, области и в других городах страны.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-260">
          <h2 className="mb-4 text-lg font-extrabold text-ink sm:text-xl">Напишите в мессенджер</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={contactLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-bg"
            >
              <WhatsAppIcon className="h-6 w-6" />
              WhatsApp
            </a>
            <a
              href={contactLinks.viber}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-bg"
            >
              <ViberIcon className="h-6 w-6" />
              Viber
            </a>
            <a
              href={contactLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-bg"
            >
              <TelegramIcon className="h-6 w-6" />
              Telegram
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10">
        <div className="mx-auto flex max-w-200 flex-col items-center gap-4 rounded-[22px] bg-dark px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">Оставьте заявку на обратный звонок</h2>
          <p className="max-w-140 text-sm leading-relaxed text-[#d6d6d6] sm:text-[15px]">
            Укажите номер — перезвоним, ответим на вопросы и рассчитаем стоимость уборки.
          </p>
          <OrderButton className="mt-1 cursor-pointer rounded-[11px] bg-primary px-8 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] sm:text-base">
            Заказать звонок
          </OrderButton>
        </div>
      </section>

      <Footer id="order" />
    </div>
  );
}
