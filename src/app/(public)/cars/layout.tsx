import type { Metadata } from "next";

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
  return children;
}
