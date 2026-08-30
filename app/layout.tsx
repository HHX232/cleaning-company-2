import type { Metadata } from "next";
import { Suspense } from "react";
import { Golos_Text } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import FloatingContact from "@/components/landing/FloatingContact";
import ContactModalProvider from "@/components/landing/ContactModalProvider";
import TopProgressBar from "@/components/ui/TopProgressBar";
import "./globals.css";

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.SITE_URL?.trim() || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Специализированный-клининг — уборка квартир, домов и офисов в Минске",
    template: "%s — Специализированный-клининг",
  },
  description:
    "Клининговая компания полного цикла в Минске и по всей Беларуси: генеральная уборка, спецуборка после происшествий, мойка окон, 24/7. Быстрый выезд, честные цены.",
  keywords: [
    "уборка Минск",
    "клининг Минск",
    "генеральная уборка",
    "уборка после ремонта",
    "спецуборка",
    "мойка окон",
    "уборка квартир",
    "уборка офисов",
    "клининговая компания Беларусь",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Специализированный-клининг",
    url: siteUrl,
    title: "Специализированный-клининг — уборка квартир, домов и офисов в Минске",
    description:
      "Клининговая компания полного цикла в Минске и по всей Беларуси: генеральная уборка, спецуборка, мойка окон, 24/7.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${golosText.variable} scroll-smooth antialiased`}>
      <body className="font-sans">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <ContactModalProvider>
          {children}
          <FloatingContact />
        </ContactModalProvider>
        <Toaster position="top-right" />

        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1JPK1TDQ4Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1JPK1TDQ4Z');
          `}
        </Script>

        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111799632', 'ym');

            ym(111799632, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/111799632" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}
