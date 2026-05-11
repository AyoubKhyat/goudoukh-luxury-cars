import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Goudoukh Luxury Cars",
  description:
    "Frequently asked questions about renting luxury cars with Goudoukh in Marrakesh. Insurance, deposits, age requirements, cancellation policy, and more.",
  openGraph: {
    title: "FAQ | Goudoukh Luxury Cars",
    description:
      "Frequently asked questions about luxury car rental in Marrakesh with Goudoukh.",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
