import { prisma } from "@/lib/prisma";
import { imageUrl } from "@/lib/imageStorage";
import { homeImageSlots } from "@/lib/homeImageSlots";
import ImageUploadRow from "@/components/admin/ImageUploadRow";

export default async function AdminHomePage() {
  const images = await prisma.siteImage.findMany({
    where: { key: { in: homeImageSlots.map((s) => s.key) } },
  });
  const imageByKey = new Map(images.map((img) => [img.key, img]));
  const sections = Array.from(new Set(homeImageSlots.map((s) => s.section)));

  return (
    <div className="mx-auto max-w-200">
      <h1 className="mb-6 text-xl font-extrabold text-ink">Фото на главной странице</h1>
      {sections.map((section) => (
        <div key={section} className="mb-8">
          <h2 className="mb-3 text-sm font-bold text-muted uppercase">{section}</h2>
          <div className="flex flex-col gap-3">
            {homeImageSlots
              .filter((slot) => slot.section === section)
              .map((slot) => {
                const img = imageByKey.get(slot.key);
                return (
                  <ImageUploadRow
                    key={slot.key}
                    imgKey={slot.key}
                    label={slot.label}
                    currentSrc={img ? imageUrl(slot.key, img.updatedAt) : undefined}
                    redirectTo="/admin"
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
