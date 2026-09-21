import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import Header from '@/components/Header';
import { siteConfig } from '@/lib/siteConfig';
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-body" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Prémium Szálláshely`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'apartman bükfürdő',
    'bükfürdő szállás',
    'gyógyfürdő apartman',
    'termálfürdő szálláshely',
    'harmónia apartman',
    'wellness pihenés bükfürdő',
    'apartman bérlés közvetlenül',
    'klímás apartman bükfürdő'
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: 'rekalaca-webdesign (https://rekalaca-webdesign.hu)',
  openGraph: {
    type: 'website',
    locale: 'hu_HU',
    url: siteConfig.url,
    title: `${siteConfig.name} - Prémium Pihenés Bükfürdőn`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/images/hero/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Bükfürdő`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Prémium Pihenés Bükfürdőn`,
    description: siteConfig.description,
    images: ['/images/hero/hero-bg.jpg'],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Google LodgingBusiness Schema
  const lodgingSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "url": siteConfig.url,
    "telephone": siteConfig.contact.phone,
    "email": siteConfig.contact.email,
    "image": `${siteConfig.url}/images/hero/hero-bg.jpg`,
    "priceRange": "28000 HUF - 40000 HUF",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.contact.address,
      "addressLocality": siteConfig.contact.city,
      "postalCode": siteConfig.contact.zip,
      "addressCountry": "HU"
    },
    "amenityFeature": siteConfig.includedServices.map(s => ({
      "@type": "LocationFeatureSpecification",
      "name": s.title,
      "value": "True"
    })),
    "checkinTime": "14:00",
    "checkoutTime": "10:00",
    "creator": {
      "@type": "Organization",
      "name": "rekalaca-webdesign",
      "url": "https://rekalaca-webdesign.hu",
      "description": "Weboldal készítés kiadó szállásnak, apartmannak, nyaralónak, hétvégi háznak egyedi kódolással, időpontfoglaló rendszerrel és automata üzenetekkel."
    }
  };

  return (
    <html lang="hu">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingSchema) }}
        />
      </head>
      <body className={`${montserrat.variable} ${playfair.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
