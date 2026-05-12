import type { Metadata } from "next";
import { fleetData } from "@/data/fleet";
import { FleetPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Our Fleet | Goudoukh Luxury Cars",
  description:
    "Browse our curated fleet of luxury vehicles in Marrakesh — supercars, grand tourers, premium SUVs, and convertibles. All maintained to the highest standards.",
  openGraph: {
    title: "Our Fleet | Goudoukh Luxury Cars",
    description:
      "Browse our curated fleet of luxury vehicles in Marrakesh — supercars, grand tourers, premium SUVs, and convertibles.",
  },
};

export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FleetPageJsonLd cars={fleetData} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://goudoukh-luxury-cars.vercel.app" },
          { name: "Fleet", url: "https://goudoukh-luxury-cars.vercel.app/cars" },
        ]}
      />
      {children}
    </>
  );
}
