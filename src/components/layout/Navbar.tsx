"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import type { TranslationKey } from "@/i18n";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks: { href: string; labelKey: TranslationKey }[] = [
    { href: "/cars", labelKey: "nav.cars" },
    { href: "/about", labelKey: "nav.about" },
    { href: "/contact", labelKey: "nav.contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-gradient-to-b from-black/40 to-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className={`font-bebas text-2xl tracking-widest transition-colors duration-500 ${
              scrolled ? "text-[#0a0a0a]" : "text-white"
            }`}
          >
            GOUDOUKH
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-colors duration-300 ${
                  scrolled
                    ? isActive(link.href)
                      ? "text-[#ff5c00]"
                      : "text-[#0a0a0a] hover:text-[#ff5c00]"
                    : isActive(link.href)
                    ? "text-[#ff5c00]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {t(link.labelKey)}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#ff5c00] rounded-full" />
                )}
              </Link>
            ))}
            <Link
              href="/booking"
              className={`ml-2 rounded px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isActive("/booking")
                  ? "bg-[#e05200] text-white"
                  : "bg-[#ff5c00] text-white hover:bg-[#e05200] hover:shadow-lg hover:shadow-[#ff5c00]/20"
              }`}
            >
              {t("nav.bookNow")}
            </Link>
            <LanguageSwitcher light={!scrolled} />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative z-50 flex md:hidden h-10 w-10 flex-col items-center justify-center gap-[5px]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${
                mobileOpen
                  ? "translate-y-[7px] rotate-45 bg-white"
                  : scrolled
                  ? "bg-[#0a0a0a]"
                  : "bg-white"
              }`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${
                mobileOpen
                  ? "opacity-0"
                  : scrolled
                  ? "bg-[#0a0a0a]"
                  : "bg-white"
              }`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${
                mobileOpen
                  ? "-translate-y-[7px] -rotate-45 bg-white"
                  : scrolled
                  ? "bg-[#0a0a0a]"
                  : "bg-white"
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-lg transition-all duration-500 md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`font-bebas text-4xl tracking-wider transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-[#ff5c00]"
                  : "text-white hover:text-[#ff5c00]"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <Link
            href="/booking"
            onClick={() => setMobileOpen(false)}
            className="mt-4 rounded bg-[#ff5c00] px-10 py-3 font-bebas text-xl tracking-wider text-white transition-colors duration-300 hover:bg-[#e05200]"
          >
            {t("nav.bookNow")}
          </Link>
          <div className="mt-4">
            <LanguageSwitcher light />
          </div>
        </div>
      </div>
    </>
  );
}
