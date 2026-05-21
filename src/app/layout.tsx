import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import Header from '@/components/Header';
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Premium Apartman | Foglalás és Információ",
  description: "Látogasson el hozzánk és élvezze a maximális kényelmet és luxust a város szívében.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Harmónia Vendégház",
    "url": "https://apartman-web.vercel.app/",
    "creator": {
      "@type": "Organization",
      "name": "rekalaca-webdesign",
      "url": "https://rekalaca-webdesign.hu",
      "description": "Weboldal készítés kiadó szállásnak, apartmannak, nyaralónak, hétvégi háznak Szabolcs-Szatmár-Bereg megyében, Nyíregyházán és környékén, a Balatonnál, a Velencei-tónál és országosan, egyedi kódolással, időpontfoglaló rendszerrel, szállásfoglaló oldalak összekapcsolásával és automata üzenetekkel."
    }
  };

  return (
    <html lang="hu">
      <body className={`${montserrat.variable} ${playfair.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
