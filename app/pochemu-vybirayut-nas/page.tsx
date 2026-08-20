import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import OrderButton from "@/components/landing/OrderButton";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  title: `Почему выбирают нас — ${company.name}`,
  description:
    "8 причин заказать уборку у нас: работаем 24/7, честные цены без доплат, собственная техника и химия, опытная команда, гарантия результата и выезд в день обращения.",
  alternates: { canonical: "/pochemu-vybirayut-nas" },
};

export default function WhyUsPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />

      <WhyChooseUs as="h1" />

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
