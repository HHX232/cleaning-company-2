import { promotionsList } from "@/lib/windowWashingContent";

export default function PromotionsList() {
  return (
    <section className="px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">Список акций</h2>
      <div className="mx-auto grid max-w-275 grid-cols-1 gap-5 sm:grid-cols-3">
        {promotionsList.map((promo) => (
          <div
            key={promo.title}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6.5 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-[20px] bg-primary px-3.5 py-1.5 text-[13px] font-extrabold text-on-primary">
                {promo.badge}
              </span>
              <span className="text-[11px] text-muted">{promo.meta}</span>
            </div>
            <div className="text-base font-bold text-ink">{promo.title}</div>
            <div className="text-[13px] leading-relaxed text-muted">{promo.text}</div>
            <a href="#order" className="mt-1 text-[13px] font-bold text-primary hover:text-primary-dark">
              Воспользоваться →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
