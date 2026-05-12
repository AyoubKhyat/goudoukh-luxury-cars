import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff5c00",
};

export const metadata: Metadata = {
  title: "Goudoukh Luxury Cars | Premium Car Rental Marrakesh",
  description:
    "Experience luxury car rental in Marrakesh. Goudoukh Luxury Cars offers a curated fleet of premium vehicles — from exotic supercars to elegant grand tourers — with white-glove service.",
  keywords: [
    "luxury car rental",
    "Marrakesh",
    "premium cars",
    "supercar rental",
    "Goudoukh",
    "exotic car hire",
    "Morocco",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    title: "Goudoukh Luxury Cars | Premium Car Rental Marrakesh",
    description:
      "Experience luxury car rental in Marrakesh. A curated fleet of premium vehicles with white-glove service.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-white text-[#0a0a0a]">
        <LocalBusinessJsonLd />
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
