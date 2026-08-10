import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";

export type GalleryItem = {
  slotId: string;
  title: string;
  meta: readonly string[];
  beforeLabel: string;
  afterLabel: string;
  beforeSrc?: string;
  afterSrc?: string;
};

type GalleryProps = {
  title: string;
  items: readonly GalleryItem[];
};

export default function Gallery({ title, items }: GalleryProps) {
  return (
    <section className="bg-surface px-4 pt-6 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">{title}</h2>
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        {items.map((g) => (
          <div key={g.slotId} className="overflow-hidden rounded-2xl border border-border bg-bg">
            <div className="px-5 pt-4">
              <h3 className="mb-2 text-lg font-bold text-primary">{g.title}</h3>
              <div className="flex flex-wrap gap-x-4.5 gap-y-1 text-[13px] text-muted">
                {g.meta.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
            <BeforeAfterSlider
              beforeLabel={g.beforeLabel}
              afterLabel={g.afterLabel}
              beforeSrc={g.beforeSrc}
              afterSrc={g.afterSrc}
              className="mx-5 my-4 h-48 rounded-xl sm:h-55"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
