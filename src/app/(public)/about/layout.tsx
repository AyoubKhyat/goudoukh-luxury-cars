import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Goudoukh Luxury Cars",
  description:
    "Learn about Goudoukh Luxury Cars — Marrakesh's premier luxury car rental service. 8+ years of excellence, 2400+ satisfied clients, and a passion for the extraordinary.",
  openGraph: {
    title: "About Us | Goudoukh Luxury Cars",
    description:
      "Marrakesh's premier luxury car rental. 8+ years of excellence, 2400+ satisfied clients.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
