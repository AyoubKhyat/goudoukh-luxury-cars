import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Goudoukh Luxury Cars",
  description: "Admin dashboard for Goudoukh Luxury Cars rental management.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
