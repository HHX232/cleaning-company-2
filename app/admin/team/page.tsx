import { prisma } from "@/lib/prisma";
import ImageUploadRow from "@/components/admin/ImageUploadRow";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Фото команды</h1>
      <div className="flex flex-col gap-3">
        {members.map((m) => (
          <ImageUploadRow
            key={m.id}
            imgKey={`team-member-${m.id}`}
            label={`${m.name} — ${m.role}`}
            currentSrc={m.photoUrl ?? undefined}
            redirectTo="/admin/team"
            targetTable="teamMember"
            targetId={m.id}
            targetField="photoUrl"
          />
        ))}
      </div>
    </div>
  );
}
