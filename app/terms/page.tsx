import type { Metadata } from "next";
import { company, contactLinks, feedbackEmail } from "@/lib/content";
import { getLegalContent } from "@/lib/legalData";
import Header from "@/components/landing/Header";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: `Пользовательское соглашение — ${company.name}`,
};

const linkClass = "underline hover:text-ink";
const phoneHref = `tel:+${company.phone.replace(/\D/g, "")}`;

export default async function TermsPage() {
  const content = await getLegalContent("terms");
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <Nav />
      <div className="mx-auto max-w-180 px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink sm:text-[28px]">{content.heading}</h1>
        <p className="mb-8 text-sm text-muted">{content.effectiveDate}</p>

        <div className="flex flex-col gap-6">
          {content.sections.map((s) => (
            <section key={s.title}>
              <h2 className="mb-2 text-base font-extrabold text-ink sm:text-lg">{s.title}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted">{s.body}</p>
            </section>
          ))}
          <section>
            <h2 className="mb-2 text-base font-extrabold text-ink sm:text-lg">Контакты</h2>
            <p className="text-sm leading-relaxed text-muted">
              По всем вопросам, связанным с настоящим соглашением, вы можете связаться с нами по адресу{" "}
              <a href={contactLinks.email} className={linkClass}>
                {feedbackEmail}
              </a>{" "}
              или по телефону{" "}
              <a href={phoneHref} className={linkClass}>
                {company.phone}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      <Footer id="order" />
    </div>
  );
}
