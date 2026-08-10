import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { hero } from "@/lib/windowWashingContent";

export default function Hero() {
  return (
    <section className="mx-4 mt-4 overflow-hidden rounded-[20px] bg-dark sm:mx-6 sm:mt-6 lg:mx-10 lg:rounded-[26px]">
      <div className="grid grid-cols-1 lg:min-h-130 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:mb-4.5 sm:tracking-[3px]">
            {hero.eyebrow}
          </div>
          <h1 className="mb-4 text-[32px] leading-[1.08] font-extrabold text-white sm:mb-5.5 sm:text-[40px] lg:text-[48px] lg:leading-[1.05]">
            {hero.title[0]}
            <br />
            {hero.title[1]}
          </h1>
          <p className="mb-6 max-w-115 text-sm leading-relaxed text-[#cfe0d2] sm:mb-8 sm:text-base">
            {hero.description}
          </p>
          <div className="mb-6 flex flex-wrap gap-3.5 sm:mb-9">
            <a
              href="#order"
              className="inline-block rounded-[11px] bg-primary px-6 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] sm:px-8 sm:py-4 sm:text-[15px]"
            >
              Заказать мойку витрин
            </a>
            <a
              href="#price"
              className="inline-flex items-center border-b border-white/40 pb-0.5 text-sm font-bold text-white transition-colors duration-200 hover:border-white hover:text-primary"
            >
              Смотреть цены ↓
            </a>
          </div>
          <div className="grid max-w-115 grid-cols-3 gap-2.5 sm:gap-3.5">
            {hero.stats.map((st) => (
              <div
                key={st.label}
                className="rounded-2xl border border-white/[0.14] bg-white/[0.06] p-3 text-center sm:p-4"
              >
                <div className="text-base font-extrabold text-primary sm:text-[22px]">{st.value}</div>
                <div className="mt-1 text-[10px] text-[#cfe0d2] sm:text-[11px]">{st.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-56 sm:h-72 lg:h-auto">
          <ImagePlaceholder label="Фото: мойка витрины магазина" className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(200deg,transparent_40%,var(--color-hero-fade)_100%)]" />
        </div>
      </div>
    </section>
  );
}
