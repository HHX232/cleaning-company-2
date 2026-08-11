import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const base = process.env.SITE_URL?.trim() || "http://localhost:3000";

// ISR: the sitemap is generated statically and re-built from the DB at most
// once every 10 minutes, so new service pages appear without a redeploy and
// with almost no runtime cost (no per-request rendering).
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await prisma.servicePage.findMany({ select: { slug: true, updatedAt: true } });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/moyka-vitrin`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/o-kompanii`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/pochemu-vybirayut-nas`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/nashi-garantii`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contacts`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...servicePages];
}
