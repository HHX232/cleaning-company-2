import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// items is a JSON column (SQLite has no scalar-list type) — coerce it back
// to string[] here so every consumer keeps its simple typed shape.
export const getServiceBlocks = unstable_cache(
  async () => {
    const rows = await prisma.serviceBlock.findMany({ orderBy: { order: "asc" } });
    return rows.map((row) => ({ ...row, items: (row.items as string[] | null) ?? [] }));
  },
  ["service-blocks"],
  { revalidate: 600 },
);
