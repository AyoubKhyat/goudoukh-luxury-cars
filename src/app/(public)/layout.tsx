import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CompareBar from "@/components/ui/CompareBar";
import { LanguageProvider } from "@/context/LanguageContext";
import { CompareProvider } from "@/context/CompareContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <CompareProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <CompareBar />
      </CompareProvider>
    </LanguageProvider>
  );
}
