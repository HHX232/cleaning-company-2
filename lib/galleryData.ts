import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type GalleryItemDto = {
  id: string;
  title: string;
  meta: string[];
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
      beforeUrl: r.beforeUrl,
      afterUrl: r.afterUrl,
    }));
  },
  ["gallery-items"],
  { revalidate: 600 },
);
