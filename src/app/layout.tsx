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
  return (
    <html lang="hu">
      <body className={`${montserrat.variable} ${playfair.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
