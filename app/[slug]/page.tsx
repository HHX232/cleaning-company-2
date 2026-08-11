import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import ServiceCategoryPage from "@/components/service-page/ServiceCategoryPage";
import { servicePageHeroDefault, servicePageConsultationDefault } from "@/lib/homeImageDefaults";
import { prisma } from "@/lib/prisma";

// ISR: known slugs are built statically below and served from cache, then
// silently re-fetched from the DB at most once every 10 minutes. A slug that
// doesn't exist yet at build time still renders on first request
// (dynamicParams defaults to true) and is cached from then on.
// Must be a literal — Next.js statically parses this export, a variable
// reference here silently fails the build.
export const revalidate = 600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Prisma calls aren't `fetch()`, so Next's Data Cache never sees them —
// wrap in unstable_cache to get the same time-based caching `revalidate`
// gives fetch() calls. Without this, the route still statically builds
// (per the generateStaticParams below) but re-hits the DB on every
// request instead of respecting the 10-minute window.
const getServicePage = unstable_cache(
  async (slug: string) => prisma.servicePage.findUnique({ where: { slug } }),
  ["service-page"],
  { revalidate: 600 },
);

const getTeamMembers = unstable_cache(
  async () => prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
  ["team-members"],
  { revalidate: 600 },
);

export async function generateStaticParams() {
  const pages = await prisma.servicePage.findMany({ select: { slug: true } });
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getServicePage(slug);
  if (!page) return {};

  return {
    title: `${page.title} — Специализированный-клининг`,
    description: `${page.title} в Минске и по всей Беларуси. Работаем 24/7, выезд в день обращения, бесплатный расчёт стоимости.`,
  };
}

export default async function ServicePageRoute({ params }: PageProps) {
  const { slug } = await params;
  const [page, teamMembers] = await Promise.all([getServicePage(slug), getTeamMembers()]);

  if (!page) notFound();

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />
      <ServiceCategoryPage
        title={page.title}
        heroDescription={page.heroDescription}
        heroImageUrl={page.heroImageUrl ?? servicePageHeroDefault}
        consultationImageUrl={page.consultationImageUrl ?? servicePageConsultationDefault}
        breadcrumbCategory={{ label: page.breadcrumbCategoryLabel, href: page.breadcrumbCategoryHref }}
        showFeaturesBlock={page.showFeaturesBlock}
        featureTags={(page.featureTags as string[] | null) ?? []}
        showProcessSteps={page.showProcessSteps}
        showMidBanner={page.showMidBanner}
        teamMembers={teamMembers}
      />
      <Footer id="order" />
    </div>
  );
}
