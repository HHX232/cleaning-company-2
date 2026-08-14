import type { MetadataRoute } from "next";

const base = process.env.SITE_URL?.trim() || "http://localhost:3000";

// Static file, generated once at build time — zero per-request cost.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private / non-indexable areas.
      disallow: ["/admin", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
