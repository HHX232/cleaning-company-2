import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import OrderButton from "@/components/landing/OrderButton";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: `Почему выбирают нас — ${company.name}`,
  description:
    "8 причин заказать уборку у нас: работаем 24/7, честные цены без доплат, собственная техника и химия, опытная команда, гарантия результата и выезд в день обращения.",
  alternates: { canonical: "/pochemu-vybirayut-nas" },
};

const advantages = [
  {
    icon: "🕒",
    title: "Работаем 24/7",
    text: "Принимаем заявки и выезжаем круглосуточно — даже ночью, в выходные и праздники.",
  },
  {
    icon: "₽",
    title: "Честная цена",
    text: "Фиксируем стоимость до начала работ. Никаких скрытых доплат «по факту».",
  },
  {
    icon: "⚡",
    title: "Выезд в день обращения",
    text: "Срочно нужна уборка? Приедем сегодня и приведём объект в порядок под ключ.",
  },
  {
    icon: "🧪",
    title: "Своя химия и техника",
    text: "Профессиональные моющие пылесосы, парогенераторы и сертифицированные средства.",
  },
  {
    icon: "👷",
    title: "Опытная команда",
    text: "Обученные клинеры со стажем, которые знают, как справиться с любым загрязнением.",
  },
  {
    icon: "🛡️",
    title: "Гарантия результата",
    text: "Не устроил результат? Вернёмся и переделаем бесплатно — без лишних вопросов.",
  },
  {
    icon: "🌍",
    title: "По всей Беларуси",
    text: "Работаем в Минске и выезжаем в область и другие города страны.",
  },
  {
    icon: "🤝",
    title: "Берёмся за сложное",
    text: "Убираем то, за что не берутся другие: после пожара, потопа, запущенные помещения.",
  },
];

export default function WhyUsPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />

      <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-200">
          <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:text-sm">
            Почему выбирают нас
          </div>
          <h1 className="mb-4 text-2xl font-extrabold text-ink sm:text-[34px] sm:leading-tight">
            8 причин доверить уборку нам
          </h1>
          <p className="max-w-160 text-sm leading-relaxed text-muted sm:text-base">
            Мы делаем клининг простым и предсказуемым: честная цена, быстрый выезд и результат, за который
            не стыдно. Вот почему нам доверяют тысячи клиентов по всей Беларуси.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-260 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {advantages.map((a) => (
            <div key={a.title} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
                {a.icon}
              </div>
              <h2 className="mb-1.5 text-base font-extrabold text-ink">{a.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10">
        <div className="mx-auto flex max-w-200 flex-col items-center gap-4 rounded-[22px] bg-dark px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">Убедитесь сами</h2>
          <p className="max-w-140 text-sm leading-relaxed text-[#d6d6d6] sm:text-[15px]">
            Оставьте заявку — рассчитаем стоимость бесплатно и подберём удобное время.
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
