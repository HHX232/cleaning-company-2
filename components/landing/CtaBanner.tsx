import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

type CtaBannerProps = {
  title: string;
  imageLabel: string;
  imageSrc?: string;
  ctaLabel: string;
  ctaHref?: string;
  children: React.ReactNode;
};

export default function CtaBanner({
  title,
  imageLabel,
  imageSrc,
  ctaLabel,
  ctaHref = "#order",
  children,
}: CtaBannerProps) {
  return (
    <section className="px-4 pt-6 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <div className="relative mx-auto min-h-72 max-w-[1200px] overflow-hidden rounded-[20px] bg-dark sm:min-h-[340px]">
        <ImagePlaceholder label={imageLabel} src={imageSrc} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,var(--color-dark)_0%,var(--color-hero-fade)_50%,transparent_82%)]" />
        <div className="relative max-w-[640px] px-5 py-7 sm:px-12 sm:py-11">
          <h2 className="mb-4 text-xl font-extrabold text-white sm:mb-5 sm:text-[28px]">{title}</h2>
          {children}
          <a
            href={ctaHref}
            className="inline-block rounded-[10px] bg-primary px-6 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98] sm:px-7.5 sm:py-4 sm:text-[15px]"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
