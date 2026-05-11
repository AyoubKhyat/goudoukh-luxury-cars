import type { Metadata } from "next";
import { fleetData } from "@/data/fleet";

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

export default function CarDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
