import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { whyUs } from "@/lib/content";

type WhyUsProps = {
  reason1Src?: string;
  reason2Src?: string;
};

export default function WhyUs({ reason1Src, reason2Src }: WhyUsProps) {
  return (
    <section id="services" className="px-4 pt-8 pb-8 sm:px-6 sm:pt-10 sm:pb-10 lg:px-10">
      <div className="mx-auto mb-5 flex max-w-[1200px] flex-wrap items-end justify-between gap-2.5 sm:mb-7">
        <h2 className="text-2xl font-extrabold text-ink sm:text-[30px]">Причины заказать уборку</h2>
        <span className="text-sm text-muted">в {"Специализированный-клининг"}</span>
      </div>
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
        <div className="relative min-h-72 overflow-hidden rounded-[20px] bg-dark sm:min-h-96 lg:min-h-[420px] lg:rounded-[24px]">
          <ImagePlaceholder label="Фото: клинер за работой" src={reason1Src} className="absolute inset-0" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.1)_55%,transparent_100%)]" />
          <div className="pointer-events-none absolute top-[-14px] left-3 text-[110px] leading-none font-extrabold text-white/[0.12] sm:top-[-30px] sm:left-5 sm:text-[200px]">
            01
          </div>
          <p className="relative max-w-[520px] p-5 text-base leading-relaxed font-semibold text-white sm:p-8 sm:text-lg">
            {whyUs.reason1.text}
          </p>
        </div>
        <div className="flex flex-col gap-5 lg:gap-6">
          <div className="relative min-h-52 flex-1 overflow-hidden rounded-[20px] bg-dark sm:min-h-48 lg:min-h-[190px] lg:rounded-[24px]">
            <ImagePlaceholder label="Фото: клинер за работой" src={reason2Src} className="absolute inset-0" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.72)_0%,transparent_90%)]" />
            <div className="pointer-events-none absolute top-[-10px] right-3 text-7xl leading-none font-extrabold text-white/[0.12] sm:top-[-14px] sm:right-4 sm:text-[110px]">
              02
            </div>
            <p className="absolute inset-x-0 bottom-0 p-4 text-sm leading-snug font-semibold text-white sm:p-5.5">
              {whyUs.reason2.text}
            </p>
          </div>
          <div className="flex flex-1 flex-col justify-center rounded-[20px] bg-primary p-5 sm:p-6.5 lg:rounded-[24px]">
            <div className="text-2xl font-extrabold text-on-primary sm:text-[34px]">24/7</div>
            <div className="mt-1.5 text-sm text-on-primary/85">
              на связи в мессенджерах, готовы выехать в любое время
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
