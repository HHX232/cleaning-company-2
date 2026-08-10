import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { specialists } from "@/lib/content";

type SpecialistsProps = {
  imageSrcBySlot?: Record<string, string>;
};

export default function Specialists({ imageSrcBySlot = {} }: SpecialistsProps) {
  return (
    <section id="specialists" className="px-4 pt-6 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">Наши специалисты</h2>
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {specialists.map((p) => (
          <div key={p.slotId} className="overflow-hidden rounded-2xl border border-border bg-surface text-center">
            <div className="h-[180px]">
              <ImagePlaceholder label={p.placeholder} src={imageSrcBySlot[p.slotId]} />
            </div>
            <div className="p-4">
              <div className="mb-1 text-[15px] font-bold text-ink">{p.role}</div>
              <div className="text-[13px] text-muted">{p.exp}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
