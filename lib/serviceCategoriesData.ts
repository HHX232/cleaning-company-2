import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ServiceCategoryContent = {
  slug: string;
  href: string;
  label: string;
  title: string;
  eyebrow: string;
  lead: string;
};

export type ServiceHubSharedContent = {
  sectionTitle: string;
  emptyText: string;
  ctaTitle: string;
  ctaText: string;
};

// The 5 fixed hub pages (uborka-kvartir, uborka-domov,
// uborka-kommercheskih-pomeshhenij, speczuborka, mojka-okon) — matches the
// routes under app/. Also seeded into the DB so the admin has editable rows
// out of the box.
export const SERVICE_CATEGORY_DEFAULTS: ServiceCategoryContent[] = [
  {
    slug: "uborka-kvartir",
    href: "/uborka-kvartir",
    label: "Уборка квартир",
    title: "Уборка квартир в Минске",
    eyebrow: "Уборка квартир",
    lead: "От поддерживающей уборки до генеральной и после ремонта — приведём в порядок квартиру любой площади и в любом состоянии. Выберите нужную услугу или оставьте заявку, и мы поможем подобрать.",
  },
  {
    slug: "uborka-domov",
    href: "/uborka-domov",
    label: "Уборка домов",
    title: "Уборка домов и коттеджей",
    eyebrow: "Уборка домов",
    lead: "Большой дом, дача или коттедж — уберём от подвала до мансарды. Работаем со всей площадью и любыми поверхностями, используя профессиональную технику.",
  },
  {
    slug: "uborka-kommercheskih-pomeshhenij",
    href: "/uborka-kommercheskih-pomeshhenij",
    label: "Уборка помещений",
    title: "Уборка коммерческих помещений",
    eyebrow: "Коммерческий клининг",
    lead: "Офисы, магазины, рестораны, медцентры и производства — поддерживаем чистоту так, чтобы это не мешало вашей работе. Разовая или регулярная уборка на договорной основе.",
  },
  {
    slug: "speczuborka",
    href: "/speczuborka",
    label: "Спецуборка",
    title: "Спецуборка после происшествий",
    eyebrow: "Спецуборка",
    lead: "Беремся за то, за что не берутся другие: после пожара, потопа, запущенные и антисанитарные помещения, дезинфекция и удаление запахов. Работаем деликатно и круглосуточно.",
  },
  {
    slug: "mojka-okon",
    href: "/mojka-okon",
    label: "Мойка окон",
    title: "Мойка окон и остекления",
    eyebrow: "Мойка окон",
    lead: "Сезонная мойка, уборка после ремонта, окна в квартире, доме и офисе — вымоем стекло, рамы и подоконники до прозрачности на любой высоте.",
  },
];

export const SERVICE_HUB_SHARED_DEFAULTS: ServiceHubSharedContent = {
  sectionTitle: "Выберите услугу",
  emptyText: "Услуги этой категории скоро появятся.",
  ctaTitle: "Не нашли нужную услугу?",
  ctaText: "Оставьте заявку — подберём решение под вашу задачу и рассчитаем стоимость бесплатно.",
};

// All 5 hub rows, DB row wins per slug, falling back to the matching
// default for any not yet in the DB (shouldn't happen post-seed).
export async function getAllServiceCategories(): Promise<(ServiceCategoryContent & { id: string })[]> {
  const rows = await prisma.serviceCategoryPage.findMany({ orderBy: { order: "asc" } });
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  return SERVICE_CATEGORY_DEFAULTS.map((def, i) => {
    const row = bySlug.get(def.slug);
    return row ?? { ...def, id: `seed-${i}` };
  });
}

export const getServiceCategoryContent = unstable_cache(
  async (slug: string): Promise<ServiceCategoryContent | undefined> => {
    const row = await prisma.serviceCategoryPage.findUnique({ where: { slug } });
    if (row) return row;
    return SERVICE_CATEGORY_DEFAULTS.find((c) => c.slug === slug);
  },
  ["service-category-content"],
  { revalidate: 600 },
);

export const getServiceHubShared = unstable_cache(
  async (): Promise<ServiceHubSharedContent> => {
    const row = await prisma.serviceHubShared.findUnique({ where: { id: "service-hub" } });
    return row ?? SERVICE_HUB_SHARED_DEFAULTS;
  },
  ["service-hub-shared"],
  { revalidate: 600 },
);
