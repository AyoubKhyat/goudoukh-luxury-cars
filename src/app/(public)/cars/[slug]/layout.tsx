import type { Metadata } from "next";
import { fleetData } from "@/data/fleet";
import { CarJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = fleetData.find((c) => c.id === slug);

  if (!car) {
    return { title: "Car Not Found | Goudoukh Luxury Cars" };
  }

  return {
    title: `${car.name} | Goudoukh Luxury Cars`,
    description: car.description,
    openGraph: {
      title: `${car.name} — Rent from ${car.pricePerDay.toLocaleString()} MAD/day`,
      description: car.description,
    },
  };
}

export default async function CarDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = fleetData.find((c) => c.id === slug);

  return (
    <>
      {car && <CarJsonLd car={car} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://goudoukh-luxury-cars.vercel.app" },
          { name: "Fleet", url: "https://goudoukh-luxury-cars.vercel.app/cars" },
          { name: car?.name ?? slug, url: `https://goudoukh-luxury-cars.vercel.app/cars/${slug}` },
        ]}
      />
      {children}
    </>
  );
}
