import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

export type SpecialistMember = {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
};

type SpecialistsProps = {
  members: SpecialistMember[];
};

// Homepage "Наши специалисты" — now driven by the admin-editable TeamMember
// table (/admin/team), the same source the service pages use.
export default function Specialists({ members }: SpecialistsProps) {
  if (members.length === 0) return null;

  return (
    <section id="specialists" className="px-4 pt-6 pb-10 sm:px-6 sm:pb-14 lg:px-10">
      <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:mb-8 sm:text-[30px]">Наши специалисты</h2>
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {members.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-2xl border border-border bg-surface text-center">
            <div className="aspect-270/190">
              <ImagePlaceholder label={`Фото: ${m.name}`} src={m.photoUrl ?? undefined} />
            </div>
            <div className="p-4">
              <div className="mb-1 text-[15px] font-bold text-ink">{m.name}</div>
              <div className="text-[13px] text-muted">{m.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
