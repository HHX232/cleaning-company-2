import { pricing } from "@/lib/windowWashingContent";

export default function Pricing() {
  return (
    <section id="price" className="bg-surface px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-10 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">
        Цены на мойку витрин
      </h2>
      <div className="mx-auto max-w-200 overflow-hidden rounded-2xl border border-border bg-bg">
        {pricing.map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[1fr_130px_auto] sm:gap-4 sm:px-6"
          >
            <span className="text-sm font-semibold text-ink sm:text-[15px]">{row.name}</span>
            <span className="hidden text-sm text-muted sm:block">{row.price}</span>
            <a
              href="#order"
              className="col-start-2 row-start-1 justify-self-end rounded-lg bg-primary px-3.5 py-2 text-xs font-bold whitespace-nowrap text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-[0.98] sm:col-start-3 sm:row-start-auto sm:justify-self-auto sm:px-4.5 sm:py-2.5 sm:text-[13px]"
            >
              заказать
            </a>
            <span className="col-span-2 text-xs text-muted sm:hidden">{row.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
