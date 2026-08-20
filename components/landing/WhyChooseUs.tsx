import { whyChooseUs } from "@/lib/content";

export default function WhyChooseUs({ as: Heading = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto mb-8 max-w-200 sm:mb-10">
        <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:text-sm">
          {whyChooseUs.eyebrow}
        </div>
        <Heading className="mb-4 text-2xl font-extrabold text-ink sm:text-[30px]">{whyChooseUs.title}</Heading>
        <p className="max-w-160 text-sm leading-relaxed text-muted sm:text-base">{whyChooseUs.description}</p>
      </div>

      <div className="mx-auto grid max-w-260 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {whyChooseUs.advantages.map((a) => (
          <div key={a.title} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl">
              {a.icon}
            </div>
            <h3 className="mb-1.5 text-base font-extrabold text-ink">{a.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{a.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
