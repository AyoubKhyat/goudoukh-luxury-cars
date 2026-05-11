import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Cars | GOUDOUKH - Premium Car Rental Marrakesh",
  description:
    "Compare luxury cars side by side. View specifications, pricing, and features of our premium fleet to find your perfect rental car in Marrakesh.",
  openGraph: {
    title: "Compare Cars | GOUDOUKH",
    description:
      "Compare luxury cars side by side. Find the perfect rental for your Marrakesh journey.",
  },
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
