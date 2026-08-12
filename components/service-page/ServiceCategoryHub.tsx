import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import OrderButton from "@/components/landing/OrderButton";
import { company } from "@/lib/content";
import { getServiceCategory, getServiceCategoryChildren } from "@/lib/serviceCategories";

export function categoryMetadata(slug: string): Metadata {
  const cat = getServiceCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.title} — ${company.name}`,
    description: `${cat.title}: ${cat.lead}`.slice(0, 300),
    alternates: { canonical: cat.href },
  };
}

export default async function ServiceCategoryHub({ slug }: { slug: string }) {
  const cat = getServiceCategory(slug);
  if (!cat) notFound();

  const items = await getServiceCategoryChildren(cat.href);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />

      <Breadcrumbs items={[{ label: "Главная страница", href: "/" }, { label: cat.label }]} />

      <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-200">
          <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:text-sm">
            {cat.eyebrow}
          </div>
          <h1 className="mb-4 text-2xl font-extrabold text-ink sm:text-[34px] sm:leading-tight">{cat.title}</h1>
          <p className="max-w-160 text-sm leading-relaxed text-muted sm:text-base">{cat.lead}</p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-260">
          <h2 className="mb-6 text-xl font-extrabold text-ink sm:text-2xl">Выберите услугу</h2>
          {items.length === 0 ? (
            <p className="text-sm text-muted">Услуги этой категории скоро появятся.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {items.map((it) => (
                <Link
                  key={it.slug}
                  href={`/${it.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] sm:p-6"
                >
                  <h3 className="mb-1.5 text-base font-extrabold text-ink group-hover:text-primary sm:text-lg">
                    {it.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted">{it.heroDescription}</p>
                  <span className="mt-auto text-sm font-bold text-primary">Подробнее →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10">
        <div className="mx-auto flex max-w-200 flex-col items-center gap-4 rounded-[22px] bg-dark px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">Не нашли нужную услугу?</h2>
          <p className="max-w-140 text-sm leading-relaxed text-[#d6d6d6] sm:text-[15px]">
            Оставьте заявку — подберём решение под вашу задачу и рассчитаем стоимость бесплатно.
          </p>
          <OrderButton className="mt-1 cursor-pointer rounded-[11px] bg-primary px-8 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] sm:text-base">
            Заказать уборку
          </OrderButton>
        </div>
      </section>

      <Footer id="order" />
    </div>
  );
}
