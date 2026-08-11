import { company, contactLinks } from "@/lib/content";

const siteUrl = process.env.SITE_URL?.trim() || "http://localhost:3000";
const phoneE164 = `+${company.phone.replace(/\D/g, "")}`;

// schema.org LocalBusiness for the homepage. A cleaning company is a
// HomeAndConstructionBusiness; areaServed is the whole country, open 24/7.
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#business`,
    name: company.name,
    description:
      "Клининговая компания полного цикла в Минске и по всей Беларуси: генеральная уборка, спецуборка после происшествий, мойка окон, 24/7.",
    url: siteUrl,
    telephone: phoneE164,
    email: company.email,
    priceRange: "от 80 руб.",
    image: `${siteUrl}/images/logos/specializirovanny-cleaning-logo-green (4).svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.city,
      addressCountry: "BY",
    },
    areaServed: { "@type": "Country", name: "Беларусь" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [contactLinks.telegram, contactLinks.whatsapp].filter((s) => s.startsWith("http")),
  };
}

// schema.org FAQPage from the homepage FAQ — legitimate rich-result markup
// (these are real Q&A shown on the page).
export function faqJsonLd(faq: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
