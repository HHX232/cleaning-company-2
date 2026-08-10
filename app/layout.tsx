import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import FloatingContact from "@/components/landing/FloatingContact";
import ContactModalProvider from "@/components/landing/ContactModalProvider";
import "./globals.css";

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Специализированный-клининг — уборка квартир, домов и офисов",
  description:
    "Клининговая компания полного цикла в Минске и по всей Беларуси: генеральная уборка, спецуборка после происшествий, мойка окон, 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${golosText.variable} scroll-smooth antialiased`}>
      <body className="font-sans">
        <SessionProvider>
          <ContactModalProvider>
            {children}
            <FloatingContact />
          </ContactModalProvider>
        </SessionProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
