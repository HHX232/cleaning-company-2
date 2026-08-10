import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Faq from "@/components/landing/Faq";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";
import Gallery from "@/components/landing/Gallery";
import Hero from "@/components/window-washing/Hero";
import WhatsIncluded from "@/components/window-washing/WhatsIncluded";
import PromotionsMarquee from "@/components/window-washing/PromotionsMarquee";
import PromotionsList from "@/components/window-washing/PromotionsList";
import Pricing from "@/components/window-washing/Pricing";
import ChatContact from "@/components/window-washing/ChatContact";
import TextPromoBlocks from "@/components/window-washing/TextPromoBlocks";
import ContactForm from "@/components/window-washing/ContactForm";
import ContactCards from "@/components/window-washing/ContactCards";
import { beforeAfter, faq } from "@/lib/windowWashingContent";

export const metadata: Metadata = {
  title: "Мойка витрин и фасадного остекления — Специализированный-клининг",
  description:
    "Профессиональная мойка витрин, фасадного остекления и вывесок для магазинов, кафе, офисов и торговых центров в Минске и по всей Беларуси.",
};

export default function WindowWashingPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header tagline="Мойка витрин и фасадного остекления" />
      <Hero />
      <WhatsIncluded />
      <PromotionsMarquee />
      <PromotionsList />
      <Gallery title="До и после" items={beforeAfter} />
      <Pricing />
      <Faq title="Вопросы и ответы" items={faq} defaultOpenIndex={0} />
      <ChatContact />
      <TextPromoBlocks />
      <ContactForm />
      <ContactCards />
      <CtaBanner
        title="Закажите мойку витрин прямо сейчас"
        imageLabel="Фото: чистая витрина"
        ctaLabel="Заказать консультацию"
      >
        <p className="mb-5 text-sm leading-relaxed text-[#dcdcdc] sm:mb-6 sm:text-[15px]">
          Оставьте заявку — рассчитаем стоимость и подберём удобное время выезда бригады.
        </p>
      </CtaBanner>
      <Footer />
    </div>
  );
}
