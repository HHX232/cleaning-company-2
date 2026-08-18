import type { HomeImageSlotKey } from "./homeImageSlots";

// Static fallback photos (in public/images/posters) shown when the admin
// hasn't uploaded a real image for a slot. The DB/S3 image always wins;
// these only fill the gap so the site never renders a bare placeholder.
const P = "/images/posters";

export const homeImageDefaults: Partial<Record<HomeImageSlotKey, string>> = {
  "hero-home": `${P}/cleaning-building2-optimized.webp`,
  "why-us-reason1": `${P}/whyus-punctual.webp`,
  "why-us-reason2": "/images/services/com-industrial.webp",
  "why-us-reason3": `${P}/whyus-trusted.webp`,
  "why-us-reason4": `${P}/whyus-specialized.webp`,
  "why-us-reason5": "/images/services/windows-office.webp",
  "svc-incidents": `${P}/pexels-jonathanborba-28576631.webp`,
  "svc-windows": `${P}/moika-okon.webp`,
  "svc-flats": `${P}/pexels-shvets-production-7513164.webp`,
  "svc-houses": `${P}/pexels-tima-miroshnichenko-6196685.webp`,
  "svc-rooms": `${P}/momo_air-cleaning-services-9663247_1920.webp`,
  "cta-banner-home": `${P}/pexels-liliana-drew-9462636.webp`,
};

// Defaults for the dynamic service pages (app/[slug]) when a page has no
// image of its own: hero background + the bottom consultation-CTA photo.
export const servicePageHeroDefault = `${P}/pexels-jonathanborba-28576645.webp`;
export const servicePageConsultationDefault = `${P}/pexels-tima-miroshnichenko-6196685.webp`;
