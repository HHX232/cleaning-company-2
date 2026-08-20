"use client";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import ReadMore from "@/components/ui/ReadMore";
import Faq from "@/components/landing/Faq";
import Reviews, { type ReviewItem } from "@/components/landing/Reviews";
import Gallery from "@/components/landing/Gallery";
import CalculatorDetailed from "@/components/landing/CalculatorDetailed";
import type { GalleryItemDto } from "@/lib/galleryData";
import ConsultationCta from "./ConsultationCta";
import ProcessSteps from "./ProcessSteps";
import MidPageCta from "./MidPageCta";
import ServiceInfoBlocks from "./ServiceInfoBlocks";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import { useContactModal } from "@/components/landing/ContactModalProvider";
import { howToOrder, seoText, serviceFaq, team } from "@/lib/serviceCategoryContent";
import { teamPhotoDefaultFor } from "@/lib/teamPhotoDefaults";
import type { CalculatorOptionsByField } from "@/lib/calculator";

// Small pool of eyebrow slogans so the hero doesn't read identically on every
// service page. Picked deterministically from the title so a given page always
// shows the same one (stable across ISR re-renders), but neighbours differ.
const eyebrowSlogans = [
  "Клининг по всей Беларуси",
  "Работаем 24/7 — без выходных",
  "Выезд в день обращения",
  "Чистота под ключ",
  "Убираем то, за что не берутся другие",
  "Честные цены, идеальный результат",
  "Своя бригада, техника и химия",
  "Более 1000 довольных клиентов",
];

function pickEyebrow(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash + title.charCodeAt(i)) % eyebrowSlogans.length;
  return eyebrowSlogans[hash];
}

type TeamMember = {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
};

type ServiceCategoryPageProps = {
  title: string;
  heroDescription: string;
  heroImageUrl?: string | null;
  consultationImageUrl?: string | null;
  breadcrumbCategory: { label: string; href: string };
  showFeaturesBlock?: boolean;
  featureTags?: string[];
  showMidBanner?: boolean;
  aboutText?: string | null;
  includesText?: string | null;
  teamMembers: TeamMember[];
  calculatorOptions: CalculatorOptionsByField;
  reviews: ReviewItem[];
  galleryItems: GalleryItemDto[];
};

export default function ServiceCategoryPage({
  title,
  heroDescription,
  heroImageUrl,
  consultationImageUrl,
  breadcrumbCategory,
  showFeaturesBlock = true,
  featureTags = [],
  showMidBanner = false,
  aboutText,
  includesText,
  teamMembers,
  calculatorOptions,
  reviews,
  galleryItems,
}: ServiceCategoryPageProps) {
  const openContactModal = useContactModal();

  return (
    <div className="bg-bg text-ink">
      <Breadcrumbs
        items={[{ label: "Главная страница", href: "/" }, breadcrumbCategory, { label: title }]}
      />

      <div className="relative mx-auto mt-4 mb-6 max-w-385 px-4 sm:mt-6 sm:px-6 lg:px-10">
        <section className="relative min-h-105 overflow-hidden rounded-[20px] bg-dark sm:min-h-115 lg:rounded-[26px]">
          <ImagePlaceholder
            label="Фото: клинер за работой"
            src={heroImageUrl ?? undefined}
            className="absolute inset-0 object-[65%_center] sm:object-center"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(21,35,24,0.94)_0%,rgba(21,35,24,0.8)_45%,rgba(21,35,24,0.45)_100%)]" />

          <div className="relative flex h-full flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-15">
            <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:mb-4.5 sm:text-sm sm:tracking-[3px]">
              {pickEyebrow(title)}
            </div>
            <h1 className="mb-4 text-[28px] leading-[1.05] font-extrabold text-white sm:mb-6 sm:text-[40px] lg:text-[48px]">
              {title}
            </h1>
            <p className="mb-6 max-w-115 text-sm leading-relaxed text-[#d6d6d6] sm:mb-8 sm:text-[17px]">
              {heroDescription}
            </p>
            <button
              type="button"
              onClick={openContactModal}
              className="mb-6 inline-block w-fit rounded-[11px] bg-primary px-6 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] sm:mb-9 sm:px-9 sm:py-4.25 sm:text-base"
            >
              Заказать уборку
            </button>

            {showFeaturesBlock && featureTags.length > 0 && (
              <div>
                <div className="mb-3 text-sm font-bold text-white/90 sm:text-base">
                  Справимся с любыми задачами
                </div>
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  {featureTags.map((tag) => (
                    <div
                      key={tag}
                      className="rounded-[20px] border border-white/[0.14] bg-white/8 px-3.5 py-2 text-xs font-semibold text-white sm:px-4 sm:py-2.5 sm:text-[13px]"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <ServiceInfoBlocks title={title} aboutText={aboutText} includesText={includesText} />

      <section className="bg-surface px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-200">
          <h2 className="mb-4 text-xl font-extrabold text-ink sm:text-2xl">{howToOrder.title}</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted sm:text-[15px]">{howToOrder.intro}</p>
          <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
            {howToOrder.outroLead} <strong className="text-ink">{howToOrder.outroBold}</strong>{" "}
            {howToOrder.outroTail}
          </p>
        </div>
      </section>

      <ProcessSteps />
      {showMidBanner && <MidPageCta />}

      <section className="px-4 pt-10 pb-6 sm:px-6 sm:pt-14 lg:px-10">
        <h2 className="mb-2 text-center text-xl font-extrabold text-ink sm:text-2xl">{team.title}</h2>
        <p className="mb-8 text-center text-sm text-muted sm:text-[15px]">
          {team.subtitle[0]}
          <br />
          {team.subtitle[1]}
        </p>
        <div className="mx-auto grid max-w-300 grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {teamMembers.map((m, i) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-border bg-surface text-center">
              <div className="h-36 sm:h-44">
                <ImagePlaceholder label={`Фото: ${m.name}`} src={m.photoUrl ?? teamPhotoDefaultFor(i)} />
              </div>
              <div className="p-3.5">
                <div className="text-sm font-bold text-ink">{m.name}</div>
                <div className="mt-0.5 text-xs text-muted">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-200 text-sm leading-relaxed text-muted sm:text-[15px]">
          <ReadMore>
            {seoText.map((p) => (
              <p key={p.slice(0, 24)} className="mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </ReadMore>
        </div>
      </section>

      <Gallery title="Примеры работ" items={galleryItems} />

      <ConsultationCta imageUrl={consultationImageUrl} />

      <WhyChooseUs />

      <CalculatorDetailed options={calculatorOptions} />

      <Reviews reviews={reviews} />

      <Faq title="Вопросы и ответы" items={serviceFaq} defaultOpenIndex={0} />
    </div>
  );
}
