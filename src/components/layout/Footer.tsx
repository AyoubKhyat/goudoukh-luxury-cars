"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { label: "Instagram", icon: <InstagramIcon />, href: "#" },
    { label: "X (Twitter)", icon: <XIcon />, href: "#" },
    { label: "Facebook", icon: <FacebookIcon />, href: "#" },
    { label: "LinkedIn", icon: <LinkedInIcon />, href: "#" },
  ];

  return (
    <footer className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Orange accent line at top */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff5c00] to-transparent" />

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-8 lg:px-8">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <h3 className="font-bebas text-4xl tracking-widest text-white mb-2">
                GOUDOUKH
              </h3>
            </Link>
            <div className="h-[2px] w-10 bg-[#ff5c00] mb-4" />
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bebas text-lg tracking-wider text-[#ff5c00] mb-6">
              {t("footer.navigation")}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white hover:pl-1 transition-all duration-300">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-white hover:pl-1 transition-all duration-300">
                  {t("nav.cars")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white hover:pl-1 transition-all duration-300">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:pl-1 transition-all duration-300">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white hover:pl-1 transition-all duration-300">
                  {t("nav.faq")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white hover:pl-1 transition-all duration-300">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-white hover:pl-1 transition-all duration-300">
                  {t("nav.bookNow")}
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white hover:pl-1 transition-all duration-300">
                  {t("compare.title")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bebas text-lg tracking-wider text-[#ff5c00] mb-6">
              {t("footer.services")}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#ff5c00] flex-shrink-0" />
                {t("footer.concierge")}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#ff5c00] flex-shrink-0" />
                {t("footer.airportTransfer")}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#ff5c00] flex-shrink-0" />
                {t("footer.fullInsurance")}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#ff5c00] flex-shrink-0" />
                {t("footer.chauffeur")}
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bebas text-lg tracking-wider text-[#ff5c00] mb-6">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#ff5c00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Avenue Mohammed V<br />Marrakesh, Morocco</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-4 w-4 flex-shrink-0 text-[#ff5c00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <a href="tel:+212600000000" className="hover:text-white transition-colors duration-300">
                  +212 600 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-4 w-4 flex-shrink-0 text-[#ff5c00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:info@goudoukh.ma" className="hover:text-white transition-colors duration-300">
                  info@goudoukh.ma
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social icons row */}
        <div className="mt-16 flex items-center justify-center gap-5">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:border-[#ff5c00] hover:text-[#ff5c00] hover:shadow-lg hover:shadow-[#ff5c00]/10"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-[#1a1a1a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} GOUDOUKH. {t("footer.allRights")}
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors duration-300">
              {t("footer.privacy")}
            </Link>
            <span className="h-3 w-px bg-[#1a1a1a]" />
            <Link href="/terms" className="hover:text-gray-300 transition-colors duration-300">
              {t("footer.terms")}
            </Link>
            <span className="h-3 w-px bg-[#1a1a1a]" />
            <Link href="/cookies" className="hover:text-gray-300 transition-colors duration-300">
              {t("footer.cookies")}
            </Link>
          </div>
        </div>
      </div>

      {/* Giant background GOUDOUKH text */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden">
        <p className="font-bebas text-[8rem] md:text-[12rem] lg:text-[16rem] text-white/[0.03] leading-none text-center whitespace-nowrap -mb-8 md:-mb-12 lg:-mb-16">
          GOUDOUKH
        </p>
      </div>
    </footer>
  );
}
