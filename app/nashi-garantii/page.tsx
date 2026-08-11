import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import OrderButton from "@/components/landing/OrderButton";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: `Наши гарантии — ${company.name}`,
  description:
    "Гарантируем качество уборки, фиксированную цену без доплат, сохранность имущества, безопасные средства, конфиденциальность и соблюдение сроков.",
  alternates: { canonical: "/nashi-garantii" },
};

const guarantees = [
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
];

export default function GuaranteesPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />

      <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-200">
          <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:text-sm">
            Наши гарантии
          </div>
          <h1 className="mb-4 text-2xl font-extrabold text-ink sm:text-[34px] sm:leading-tight">
            Мы отвечаем за результат
          </h1>
          <p className="max-w-160 text-sm leading-relaxed text-muted sm:text-base">
            Заказывая уборку у нас, вы получаете не только чистоту, но и спокойствие. Каждый заказ подкреплён
            понятными гарантиями — вот что мы обещаем и всегда выполняем.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-260 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {guarantees.map((g, i) => (
            <div key={g.title} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-on-primary">
                {i + 1}
              </div>
              <h2 className="mb-1.5 text-base font-extrabold text-ink sm:text-lg">{g.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{g.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10">
        <div className="mx-auto flex max-w-200 flex-col items-center gap-4 rounded-[22px] bg-dark px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">Закажите уборку с гарантией</h2>
          <p className="max-w-140 text-sm leading-relaxed text-[#d6d6d6] sm:text-[15px]">
            Оставьте заявку — и мы возьмём на себя всю ответственность за чистоту вашего объекта.
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
