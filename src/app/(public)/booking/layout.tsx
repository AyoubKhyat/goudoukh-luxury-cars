import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Ride | Goudoukh Luxury Cars",
  description:
    "Reserve your dream car in minutes. Choose from supercars, SUVs, sedans, and convertibles. Pay in cash at pickup — no card required.",
  openGraph: {
    title: "Book Your Ride | Goudoukh Luxury Cars",
    description:
      "Reserve your dream car in minutes. Choose from supercars, SUVs, sedans, and convertibles. Pay in cash at pickup.",
  },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
