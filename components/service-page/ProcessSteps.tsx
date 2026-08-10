import { company } from "@/lib/content";
import { processSteps } from "@/lib/serviceCategoryContent";

export default function ProcessSteps() {
  return (
    <section className="bg-surface px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto grid max-w-300 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {processSteps.map((step, i) => (
          <div key={step.num} className="relative">
            {i > 0 && (
              <span
                className="absolute top-3 -left-3 hidden text-2xl text-border lg:block"
                aria-hidden="true"
              >
                →
              </span>
            )}
            <div className="mb-2 text-3xl font-extrabold text-primary/25">{step.num}</div>
            <h3 className="mb-2 text-base font-extrabold text-ink">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted">{step.text}</p>
            {i === 0 && (
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="mt-2 inline-block text-sm font-bold text-primary hover:text-primary-dark"
              >
                {company.phone}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
