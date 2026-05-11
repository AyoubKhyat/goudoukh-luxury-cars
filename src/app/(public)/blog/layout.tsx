import type { Metadata } from "next";

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
  return children;
}
