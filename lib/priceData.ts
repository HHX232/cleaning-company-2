import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { priceTabs, type PriceTabId } from "@/lib/content";

export type PriceRowDto = { name: string; price: string };

export const getPriceData = unstable_cache(
  async (): Promise<Record<PriceTabId, PriceRowDto[]>> => {
    const rows = await prisma.priceRow.findMany({ orderBy: { order: "asc" } });
    const grouped = Object.fromEntries(priceTabs.map((t) => [t.id, [] as PriceRowDto[]])) as Record<
      PriceTabId,
      PriceRowDto[]
    >;
    const validTabs = new Set(priceTabs.map((t) => t.id));
    for (const row of rows) {
      if (validTabs.has(row.tab as PriceTabId)) {
        grouped[row.tab as PriceTabId].push({ name: row.name, price: row.price });
      }
    }
    return grouped;
  },
  ["price-rows"],
  { revalidate: 600 },
);
