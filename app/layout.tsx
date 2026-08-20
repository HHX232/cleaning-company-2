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

        {/* Tawk.to live chat. onLoad hides the default floating launcher —
            it's opened instead from FloatingContact's "Написать в чат"
            button via window.Tawk_API, so there's only one chat bubble. */}
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API = Tawk_API || {};
            var Tawk_LoadStart = new Date();
            Tawk_API.onLoad = function () {
              Tawk_API.hideWidget();
            };
            (function () {
              var s1 = document.createElement("script"),
                s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = "https://embed.tawk.to/6a7f4aae8e924d1d4dd1b320/1k00jnf28";
              s1.charset = "UTF-8";
              s1.setAttribute("crossorigin", "*");
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
