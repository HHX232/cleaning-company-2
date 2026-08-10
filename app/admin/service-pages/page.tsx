import { prisma } from "@/lib/prisma";
import ImageUploadRow from "@/components/admin/ImageUploadRow";

export default async function AdminServicePagesPage() {
  const pages = await prisma.servicePage.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Фото на страницах услуг</h1>
      <div className="flex flex-col gap-8">
        {pages.map((p) => (
          <div key={p.id}>
            <h2 className="mb-3 text-sm font-bold text-muted uppercase">{p.title}</h2>
            <div className="flex flex-col gap-3">
              <ImageUploadRow
                imgKey={`service-page-hero-${p.id}`}
                label="Фото в хиро-блоке"
                currentSrc={p.heroImageUrl ?? undefined}
                redirectTo="/admin/service-pages"
                targetTable="servicePage"
                targetId={p.id}
                targetField="heroImageUrl"
              />
              <ImageUploadRow
                imgKey={`service-page-consultation-${p.id}`}
                label="Фото в блоке консультации"
                currentSrc={p.consultationImageUrl ?? undefined}
                redirectTo="/admin/service-pages"
                targetTable="servicePage"
                targetId={p.id}
                targetField="consultationImageUrl"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
