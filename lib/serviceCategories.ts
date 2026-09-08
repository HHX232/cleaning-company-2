import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// The five service-category hub pages' own copy (slug/title/eyebrow/lead)
// now lives in the ServiceCategoryPage table — see lib/serviceCategoriesData.ts.

export type ServiceCategoryChild = {
  slug: string;
  title: string;
  heroDescription: string;
};

// Cached list of a category's sub-service pages (ISR, 10-minute window).
// unstable_cache folds the `href` argument into the cache key automatically.
export const getServiceCategoryChildren = unstable_cache(
  async (href: string): Promise<ServiceCategoryChild[]> =>
    prisma.servicePage.findMany({
      where: { breadcrumbCategoryHref: href },
      orderBy: { title: "asc" },
      select: { slug: true, title: true, heroDescription: true },
    }),
  ["service-category-children"],
  { revalidate: 600 },
);
