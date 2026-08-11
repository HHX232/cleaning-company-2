import { prisma } from "@/lib/prisma";
import ImageUploadRow from "@/components/admin/ImageUploadRow";
import { createTeamMember, deleteTeamMember, updateTeamMember } from "./actions";

const inputClass = "rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs text-ink";
const labelClass = "flex flex-col gap-1 text-[11px] font-bold text-muted";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-1 text-xl font-extrabold text-ink">Команда</h1>
      <p className="mb-6 text-sm text-muted">
        Специалисты в блоке «Наша команда». «Порядок» — число для сортировки (меньше — выше в списке).
      </p>

      <div className="mb-8 flex flex-col gap-4">
        {members.length === 0 && <p className="text-sm text-muted">Пока нет специалистов.</p>}
        {members.map((m) => (
          <div key={m.id} className="rounded-xl border border-border bg-surface p-4">
            <form action={updateTeamMember.bind(null, m.id)} className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_90px_auto]">
              <label className={labelClass}>
                Имя
                <input type="text" name="name" defaultValue={m.name} required className={inputClass} />
              </label>
              <label className={labelClass}>
                Должность
                <input type="text" name="role" defaultValue={m.role} required className={inputClass} />
              </label>
              <label className={labelClass}>
                Порядок
                <input type="number" name="order" defaultValue={m.order} className={inputClass} />
              </label>
              <div className="flex items-end gap-2">
                <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
                  Сохранить
                </button>
                <button
                  type="submit"
                  formAction={deleteTeamMember.bind(null, m.id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-bg"
                >
                  Удалить
                </button>
              </div>
            </form>
            <ImageUploadRow
              imgKey={`team-member-${m.id}`}
              label="Фото специалиста"
              currentSrc={m.photoUrl ?? undefined}
              redirectTo="/admin/team"
              targetTable="teamMember"
              targetId={m.id}
              targetField="photoUrl"
            />
          </div>
        ))}
      </div>

      <details className="rounded-lg border border-border bg-surface p-3">
        <summary className="cursor-pointer text-xs font-bold text-ink">+ Новый специалист</summary>
        <form action={createTeamMember} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_90px_auto]">
          <label className={labelClass}>
            Имя
            <input type="text" name="name" placeholder="Кирилл" required className={inputClass} />
          </label>
          <label className={labelClass}>
            Должность
            <input type="text" name="role" placeholder="Старший специалист по уборке" required className={inputClass} />
          </label>
          <label className={labelClass}>
            Порядок
            <input type="number" name="order" placeholder="0" defaultValue={0} className={inputClass} />
          </label>
          <div className="flex items-end">
            <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary">
              Создать
            </button>
          </div>
        </form>
        <p className="mt-2 text-[11px] text-muted">Фото можно загрузить после создания специалиста.</p>
      </details>
    </div>
  );
}
