import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// The five service-category hub pages. Their `href` matches the
// breadcrumbCategoryHref stored on each child ServicePage, so a hub lists
// exactly the sub-services that point back to it via the breadcrumb.
export type ServiceCategory = {
  slug: string; // route segment, e.g. "uborka-kvartir"
  href: string; // "/uborka-kvartir" (== children.breadcrumbCategoryHref)
  label: string; // breadcrumb label
  title: string; // H1
  eyebrow: string;
  lead: string;
};

export const serviceCategories: ServiceCategory[] = [
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

export function getServiceCategory(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.slug === slug);
}

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
