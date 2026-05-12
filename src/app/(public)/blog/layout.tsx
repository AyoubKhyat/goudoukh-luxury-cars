import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Journal | Goudoukh Luxury Cars",
  description:
    "Travel guides, driving routes, and insider tips for exploring Morocco in a luxury car. From Atlas Mountain passes to coastal drives.",
  openGraph: {
    title: "Journal — Goudoukh Luxury Cars",
    description:
      "Travel guides, driving routes, and insider tips for exploring Morocco in style.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://goudoukh-luxury-cars.vercel.app" },
          { name: "Journal", url: "https://goudoukh-luxury-cars.vercel.app/blog" },
        ]}
      />
      {children}
    </>
  );
}
