import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Goudoukh Luxury Cars",
  description:
    "Get in touch with Goudoukh Luxury Cars. Visit our Marrakesh showroom, call our 24/7 concierge, or send us a message. We respond within 24 hours.",
  openGraph: {
    title: "Contact Us | Goudoukh Luxury Cars",
    description:
      "Get in touch with Goudoukh Luxury Cars. 24/7 concierge, Marrakesh showroom visits, and quick response times.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
