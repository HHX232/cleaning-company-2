import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import OrderButton from "@/components/landing/OrderButton";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: `О компании — ${company.name}`,
  description:
    "Клининговая компания полного цикла: генеральная и поддерживающая уборка, спецуборка после происшествий, мойка окон. Работаем в Минске и по всей Беларуси 24/7.",
  alternates: { canonical: "/o-kompanii" },
};

const stats = [
  { value: "8 лет", label: "на рынке клининга Беларуси" },
  { value: "12 000+", label: "выполненных уборок" },
  { value: "40+", label: "клинеров в штате" },
  { value: "4.9 / 5", label: "средняя оценка клиентов" },
];

const values = [
  {
    title: "Честность",
    text: "Называем итоговую цену до начала работ и не добавляем скрытых доплат по ходу уборки.",
  },
  {
    title: "Ответственность",
    text: "Отвечаем за результат: если что-то сделано не идеально — переделываем бесплатно.",
  },
  {
    title: "Забота",
    text: "Используем безопасные средства, бережно относимся к вашим вещам, мебели и покрытиям.",
  },
  {
    title: "Скорость",
    text: "На связи круглосуточно и выезжаем в день обращения — даже на срочные и экстренные заказы.",
  },
];

export default function AboutCompanyPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />

      <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-200">
          <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:text-sm">
            О компании
          </div>
          <h1 className="mb-4 text-2xl font-extrabold text-ink sm:text-[34px] sm:leading-tight">
            {company.name} — чистота, которой можно доверять
          </h1>
          <p className="max-w-160 text-sm leading-relaxed text-muted sm:text-base">
            Мы — команда профессионалов, которая берёт на себя уборку любой сложности: от поддерживающей
            уборки квартиры до восстановления помещений после пожара, потопа и других происшествий.
            Работаем в Минске и по всей Беларуси, на связи 24 часа в сутки 7 дней в неделю.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-260 grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-5 text-center sm:p-6">
              <div className="text-2xl font-extrabold text-primary sm:text-[32px]">{s.value}</div>
              <div className="mt-1.5 text-xs leading-snug text-muted sm:text-[13px]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-200">
          <h2 className="mb-3 text-xl font-extrabold text-ink sm:text-2xl">Наша миссия</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted sm:text-[15px]">
            Мы верим, что чистота — это не роскошь, а комфорт, доступный каждому. Наша задача — освободить
            вас от бесконечной уборки и вернуть время на то, что действительно важно: семью, работу и отдых.
          </p>
          <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
            Поэтому мы беремся и за простые, и за самые сложные задачи, от которых отказываются другие. У нас
            собственная профессиональная техника, сертифицированная химия и обученная команда, которая знает,
            как справиться с любым загрязнением быстро и без вреда для здоровья.
          </p>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-260">
          <h2 className="mb-6 text-center text-xl font-extrabold text-ink sm:text-2xl">Наши ценности</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <h3 className="mb-2 text-base font-extrabold text-ink sm:text-lg">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10">
        <div className="mx-auto flex max-w-200 flex-col items-center gap-4 rounded-[22px] bg-dark px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">Готовы доверить нам уборку?</h2>
          <p className="max-w-140 text-sm leading-relaxed text-[#d6d6d6] sm:text-[15px]">
            Оставьте заявку — рассчитаем стоимость и подберём удобное время выезда бригады.
          </p>
          <OrderButton className="mt-1 cursor-pointer rounded-[11px] bg-primary px-8 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] sm:text-base">
            Заказать уборку
          </OrderButton>
        </div>
      </section>

      <Footer id="order" />
    </div>
  );
}
