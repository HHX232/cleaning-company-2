type ServiceInfoBlocksProps = {
  title: string;
  aboutText?: string | null;
  includesText?: string | null;
};

function decapitalize(s: string): string {
  return s.length ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

export default function ServiceInfoBlocks({ title, aboutText, includesText }: ServiceInfoBlocksProps) {
  const includesItems = (includesText ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const hasAbout = !!aboutText?.trim();
  const hasIncludes = includesItems.length > 0;

  if (!hasAbout && !hasIncludes) return null;

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div
        className={`mx-auto max-w-300 grid grid-cols-1 gap-8 ${
          hasAbout && hasIncludes ? "lg:grid-cols-2 lg:gap-12" : ""
        }`}
      >
        {hasAbout && (
          <div className={!hasIncludes ? "mx-auto max-w-200 w-full" : undefined}>
            <h2 className="mb-4 text-xl leading-tight font-extrabold text-ink sm:text-2xl">
              Что такое {decapitalize(title)}?
            </h2>
            <p className="text-sm leading-relaxed text-muted sm:text-[15px]">{aboutText}</p>
          </div>
        )}

        {hasIncludes && (
          <div className={`rounded-2xl bg-surface p-6 sm:p-8 ${!hasAbout ? "mx-auto max-w-200 w-full" : ""}`}>
            <h2 className="mb-4 text-xl leading-tight font-extrabold text-ink sm:text-2xl">
              Что входит в услугу «{title}»?
            </h2>
            <div className="flex flex-col gap-2.5">
              {includesItems.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink sm:text-[15px]">
                  <span className="mt-0.5 shrink-0 font-extrabold text-primary">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
