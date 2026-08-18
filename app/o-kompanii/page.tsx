import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import OrderButton from "@/components/landing/OrderButton";
import CountUp from "@/components/ui/CountUp";
import { BadgeCheckIcon, ClockIcon, StarIcon, UsersIcon } from "@/components/ui/LineIcons";
import { company } from "@/lib/content";
import { getAboutContent } from "@/lib/aboutData";

const statIcons = [ClockIcon, BadgeCheckIcon, UsersIcon, StarIcon];

export const metadata: Metadata = {
  title: `О компании — ${company.name}`,
  description:
    "Клининговая компания полного цикла: генеральная и поддерживающая уборка, спецуборка после происшествий, мойка окон. Работаем в Минске и по всей Беларуси 24/7.",
  alternates: { canonical: "/o-kompanii" },
};

// ISR: content comes from the admin-editable AboutPage row, re-read from the
// DB at most once every 10 minutes.
export const revalidate = 600;

export default async function AboutCompanyPage() {
  const about = await getAboutContent();

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />

      <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-200">
          <div className="mb-3 text-xs font-extrabold tracking-[2px] text-primary uppercase sm:text-sm">
            {about.eyebrow}
          </div>
          <h1 className="mb-4 text-2xl font-extrabold text-ink sm:text-[34px] sm:leading-tight">{about.heading}</h1>
          <p className="max-w-160 text-sm leading-relaxed text-muted sm:text-base">{about.lead}</p>
        </div>
      </section>

      {about.stats.length > 0 && (
        <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
          <div className="mx-auto grid max-w-260 grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {about.stats.map((s, i) => {
              const Icon = statIcons[i % statIcons.length];
              return (
                <div
                  key={s.label}
                  className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-4 sm:p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CountUp value={s.value} className="block text-xl font-extrabold text-primary sm:text-2xl" />
                    <div className="mt-0.5 text-xs leading-snug text-muted sm:text-[13px]">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10">
        <div className="mx-auto max-w-200">
          <h2 className="mb-3 text-xl font-extrabold text-ink sm:text-2xl">{about.missionTitle}</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted sm:text-[15px]">{about.missionText1}</p>
          <p className="text-sm leading-relaxed text-muted sm:text-[15px]">{about.missionText2}</p>
        </div>
      </section>

      {about.values.length > 0 && (
        <section className="px-4 pb-10 sm:px-6 sm:pb-14 lg:px-10">
          <div className="mx-auto max-w-260">
            <h2 className="mb-6 text-center text-xl font-extrabold text-ink sm:text-2xl">Наши ценности</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {about.values.map((v) => (
                <div key={v.title} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                  <h3 className="mb-2 text-base font-extrabold text-ink sm:text-lg">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-10">
        <div className="mx-auto flex max-w-200 flex-col items-center gap-4 rounded-[22px] bg-dark px-6 py-10 text-center sm:px-10 sm:py-12">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">{about.ctaTitle}</h2>
          <p className="max-w-140 text-sm leading-relaxed text-[#d6d6d6] sm:text-[15px]">{about.ctaText}</p>
          <OrderButton className="mt-1 cursor-pointer rounded-[11px] bg-primary px-8 py-3.5 text-sm font-bold text-on-primary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] sm:text-base">
            Заказать уборку
          </OrderButton>
        </div>
      </section>

      <Footer id="order" />
    </div>
  );
}
