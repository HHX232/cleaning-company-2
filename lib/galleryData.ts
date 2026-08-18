import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type GalleryItemDto = {
  id: string;
  title: string;
  meta: string[];
  category: string;
  beforeUrl: string | null;
  afterUrl: string | null;
};

export const getGalleryItems = unstable_cache(
  async (): Promise<GalleryItemDto[]> => {
    const rows = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      meta: (r.meta as string[] | null) ?? [],
      category: r.category,
      beforeUrl: r.beforeUrl,
      afterUrl: r.afterUrl,
    }));
  },
  ["gallery-items"],
  { revalidate: 600 },
);

// "windows" items show only on "Мойка окон" service pages; everywhere else
// (including the homepage) shows every other category.
export function filterGalleryItems(items: GalleryItemDto[], isWindowsPage: boolean): GalleryItemDto[] {
  return items.filter((item) => (item.category === "windows") === isWindowsPage);
}
