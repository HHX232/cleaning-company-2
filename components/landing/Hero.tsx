import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import CountUp from "@/components/ui/CountUp";
import { heroServices, heroStats } from "@/lib/content";
import OrderButton from "./OrderButton";

export default function Hero({ imageSrc }: { imageSrc?: string }) {
  return (
    <div className="relative mx-auto mt-4 mb-6 max-w-385 px-4 sm:mt-6 sm:px-6 lg:mb-37.5 lg:px-10">
      <section className="relative min-h-105 overflow-hidden rounded-[20px] bg-dark sm:min-h-120 lg:min-h-140 lg:rounded-[26px]">
        <ImagePlaceholder label="Фото: клинер за работой" src={imageSrc} className="absolute inset-0" priority />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(21,35,24,0.94)_0%,rgba(21,35,24,0.8)_45%,rgba(21,35,24,0.45)_100%)]" />

        <div className="relative flex h-full flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-15">
          <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:mb-4.5 sm:text-sm sm:tracking-[3px]">
            Клининг по всей Беларуси
          </div>
          <h1 className="mb-4 text-[34px] leading-[1.02] font-extrabold tracking-[-0.5px] text-white sm:mb-6 sm:text-[46px] sm:leading-[0.98] lg:text-[60px] lg:tracking-[-1px]">
            Чистота
            <br />
            <span className="text-primary">любой</span> сложности
          </h1>
          <p className="mb-6 max-w-105 text-sm leading-relaxed text-[#d6d6d6] sm:mb-8 sm:text-[17px]">
            Доступны 24/7 — приедем, когда это нужно именно вам. Все клининговые услуги в одном месте.
          </p>
          <div className="mb-6 flex flex-wrap items-center gap-4 sm:mb-9">
            <OrderButton className="inline-block cursor-pointer rounded-[11px] bg-primary px-6 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] sm:px-9 sm:py-4.25 sm:text-base">
              Заказать уборку
            </OrderButton>
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 border-b border-white/40 pb-0.5 text-sm font-bold text-white transition-colors duration-200 hover:border-white hover:text-primary sm:text-[15px]"
            >
              Смотреть услуги ↓
            </a>
          </div>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {heroServices.map((s) => (
              <div
                key={s.label}
                className="rounded-[20px] border border-white/[0.14] bg-white/8 px-3.5 py-2 text-xs font-semibold text-white sm:px-4 sm:py-2.5 sm:text-[13px]"
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative mt-4 flex rounded-[18px] border border-border bg-bg shadow-[0_16px_36px_rgba(0,0,0,0.14)] sm:mt-6 lg:absolute lg:right-20 lg:bottom-0 lg:left-20 lg:mt-0 lg:translate-y-[75%]">
        {heroStats.map((st, i) => (
          <div
            key={st.label}
            className={`flex-1 px-2 py-3.5 text-center sm:px-5 sm:py-5.5 ${i > 0 ? "border-l border-border" : ""}`}
          >
            <CountUp value={st.value} className="text-lg font-extrabold text-primary sm:text-[26px]" />
            <div className="mt-1 text-[11px] text-muted sm:text-xs">{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
