import { unstable_cache } from "next/cache";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyUs from "@/components/landing/WhyUs";
import ServiceGuarantees from "@/components/landing/ServiceGuarantees";
import Promotions from "@/components/landing/Promotions";
import ServicesDetail from "@/components/landing/ServicesDetail";
import Pricing from "@/components/landing/Pricing";
import CalculatorDetailed from "@/components/landing/CalculatorDetailed";
import Gallery from "@/components/landing/Gallery";
import CtaBanner from "@/components/landing/CtaBanner";
import Faq from "@/components/landing/Faq";
import Specialists from "@/components/landing/Specialists";
import Reviews from "@/components/landing/Reviews";
import Footer from "@/components/landing/Footer";
import { faq } from "@/lib/content";
import { getGalleryItems, filterGalleryItems } from "@/lib/galleryData";
import { homeImageSlots } from "@/lib/homeImageSlots";
import { homeImageDefaults } from "@/lib/homeImageDefaults";
import { imageUrl } from "@/lib/imageStorage";
import { prisma } from "@/lib/prisma";
import { getCalculatorOptions } from "@/lib/calculatorOptionsData";
import { getServiceBlocks } from "@/lib/serviceBlocksData";
import { getPriceData } from "@/lib/priceData";
import { faqJsonLd, localBusinessJsonLd } from "@/lib/structuredData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Специализированный-клининг — уборка квартир, домов и офисов в Минске",
  description:
    "Заказать уборку в Минске и по всей Беларуси: генеральная и поддерживающая уборка, спецуборка после пожара/потопа, мойка окон, уборка офисов. Работаем 24/7, честные цены, быстрый выезд.",
  alternates: { canonical: "/" },
};

export const revalidate = 600;

const getHomeImages = unstable_cache(
  async () =>
    prisma.siteImage.findMany({
      where: { key: { in: homeImageSlots.map((s) => s.key) } },
      select: { key: true, updatedAt: true },
    }),
  ["home-images"],
  { revalidate: 600 },
);

const getPromos = unstable_cache(
  async () => prisma.promo.findMany({ orderBy: { order: "asc" } }),
  ["home-promos"],
  { revalidate: 600 },
);

const getReviews = unstable_cache(
  async () => prisma.review.findMany({ orderBy: { order: "asc" } }),
  ["home-reviews"],
  { revalidate: 600 },
);

const getTeamMembers = unstable_cache(
  async () =>
    prisma.teamMember.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, role: true, photoUrl: true },
    }),
  ["team-members"],
  { revalidate: 600 },
);

export default async function Home() {
  const [images, promos, serviceBlocks, calculatorOptions, reviews, priceData, galleryItems, teamMembers] =
    await Promise.all([
      getHomeImages(),
      getPromos(),
      getServiceBlocks(),
      getCalculatorOptions(),
      getReviews(),
      getPriceData(),
      getGalleryItems(),
      getTeamMembers(),
    ]);
  const bigServices = serviceBlocks.filter((b) => b.size === "BIG");
  const smallServices = serviceBlocks.filter((b) => b.size === "SMALL");
  const src = (key: string) => {
    const img = images.find((i) => i.key === key);
    // Admin-uploaded image (S3) wins; otherwise fall back to a static poster
    // default if the slot has one, else undefined (renders a placeholder).
    if (img) return imageUrl(key, img.updatedAt);
    return homeImageDefaults[key as keyof typeof homeImageDefaults];
  };

  const servicesImageSrcBySlot: Record<string, string> = {};
  for (const slot of homeImageSlots) {
    const url = src(slot.key);
    if (!url) continue;
    if (slot.key.startsWith("svc-")) servicesImageSrcBySlot[slot.key] = url;
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faq)) }}
      />
      <Header />
      <Nav />
      <Hero imageSrc={src("hero-home")} />
      <HowItWorks />
      <WhyUs
        slideSrcs={[
          src("why-us-reason1"),
          src("why-us-reason2"),
          src("why-us-reason3"),
          src("why-us-reason4"),
          src("why-us-reason5"),
        ]}
      />
      <Promotions promos={promos} />
      <ServicesDetail bigServices={bigServices} smallServices={smallServices} imageSrcBySlot={servicesImageSrcBySlot} />
      <Pricing priceData={priceData} />
      <CalculatorDetailed options={calculatorOptions} />
      <Gallery title="Примеры работ" items={filterGalleryItems(galleryItems, false)} />
      <ServiceGuarantees />
      <CtaBanner
        title="Специализированный-клининг – уборка любой сложности 24/7!"
        imageLabel="Фото: сотрудник компании"
        imageSrc={src("cta-banner-home")}
        imageClassName="object-[center_30%]"
        ctaLabel="Заказать консультацию"
      >
        <p className="mb-4 border-l-[3px] border-primary pl-4 text-sm leading-relaxed font-semibold text-[#f2f2f2] sm:mb-4.5 sm:text-base">
          Произошёл потоп, пожар или другое ЧП? Мы оперативно выезжаем 24/7 и быстро устраняем последствия, бережно
          очищая помещения с помощью профессиональных технологий.
        </p>
        <p className="mb-4 text-sm leading-relaxed text-[#dcdcdc] sm:mb-4.5 sm:text-[15px]">
          Работаем там, где другие не берутся: убираем запущенные квартиры, помещения после смерти и ликвидируем
          антисанитарию, используя безопасные средства и современное оборудование.
        </p>
        <p className="mb-5 text-sm leading-relaxed font-bold text-white sm:mb-6 sm:text-[15px]">
          Оставьте заявку – наш специалист готов выехать в любое время, чтобы быстро и качественно решить вашу
          проблему!
        </p>
      </CtaBanner>
      <Faq title="Вопросы и ответы" items={faq} defaultOpenIndex={1} />
      <Specialists members={teamMembers} />
      <Reviews reviews={reviews} />
      <Footer id="order" />
    </div>
  );
}
