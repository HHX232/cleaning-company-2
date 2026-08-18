import { howItWorksSteps } from "@/lib/content";
import { BadgeCheckIcon, BagIcon, CalendarIcon, CameraIcon, PhoneIcon } from "@/components/ui/LineIcons";

const icons = {
  phone: PhoneIcon,
  calendar: CalendarIcon,
  bag: BagIcon,
  camera: CameraIcon,
  badge: BadgeCheckIcon,
};

export default function HowItWorks() {
  return (
    <section className="bg-bg px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-300">
        <h2 className="mb-4 max-w-180 text-[28px] leading-tight font-extrabold text-ink sm:text-4xl lg:text-[44px]">
          Простой и понятный процесс без сюрпризов по цене
        </h2>
        <p className="mb-10 max-w-160 text-sm leading-relaxed text-muted sm:mb-14 sm:text-base">
          От первой заявки до приёмки уборки вы понимаете, что будет происходить, сколько это стоит и когда мы
          приедем.
        </p>

        <div className="flex flex-col gap-5 sm:gap-6">
          {howItWorksSteps.map((step, i) => {
            const Icon = icons[step.icon as keyof typeof icons];
            const isFirst = i === 0;
            const isLast = i === howItWorksSteps.length - 1;
            return (
              <div key={step.title} className="flex gap-5 sm:gap-7">
                {/* Numbered circle sits between two flex-1 line segments, so
                    it's always centered against the card's height (whatever
                    that ends up being) instead of pinned to the top. The
                    segments extend past this row's own box (negative margin,
                    matching the gap-5/gap-6 the stack uses between rows) so
                    the line reads as one unbroken track instead of breaking
                    at each card boundary. */}
                <div className="flex w-10 shrink-0 flex-col items-center sm:w-11">
                  <div
                    className={isFirst ? "w-px flex-1 invisible" : "-mt-5 w-px flex-1 bg-border sm:-mt-6"}
                    aria-hidden="true"
                  />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-on-primary shadow-[0_4px_14px_rgba(47,158,91,0.35)] sm:h-11 sm:w-11">
                    {i + 1}
                  </div>
                  <div
                    className={isLast ? "w-px flex-1 invisible" : "-mb-5 w-px flex-1 bg-border sm:-mb-6"}
                    aria-hidden="true"
                  />
                </div>

                <div className="flex flex-1 gap-4 rounded-2xl border border-border bg-surface p-5 sm:gap-5 sm:p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-base font-extrabold text-ink sm:text-lg">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted sm:text-[15px]">{step.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
