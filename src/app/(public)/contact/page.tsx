"use client";

import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";

/* ──────────────────────────────────────────────
   Contact info cards data
   ────────────────────────────────────────────── */
const contactInfo = [
  {
    title: "Address",
    detail: "Boulevard Mohammed VI, Gueliz\nMarrakesh 40000, Morocco",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "Phone",
    detail: "+212 524 000 000\n+212 600 000 000",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: "Email",
    detail: "concierge@goudoukh.ma\ninfo@goudoukh.ma",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    title: "Hours",
    detail: "Open 24/7 — 365 days a year\nConcierge always available",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

/* ──────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1920&q=80"
            alt="Luxury interior"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="font-bebas text-hero tracking-tight text-white leading-none">
            CONTACT US
          </h1>
          <p className="mt-4 max-w-lg text-lg text-gray-400 leading-relaxed">
            Have a question about our fleet, a special booking request, or a
            partnership proposal? We would love to hear from you.
          </p>
          <div className="mt-6 h-[2px] w-20 bg-[#ff5c00]" />
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: Contact Form */}
            <div>
              <h2 className="font-bebas text-3xl tracking-wide text-[#0a0a0a] mb-2">
                Send Us a Message
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                Fill out the form below and our team will respond within 24 hours.
              </p>
              <ContactForm />
            </div>

            {/* Right: Contact Info Cards */}
            <div className="space-y-6">
              <h2 className="font-bebas text-3xl tracking-wide text-[#0a0a0a] mb-2">
                Get in Touch
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                Prefer to reach us directly? Here are all the ways to connect with our team.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="group rounded-lg border border-gray-200 p-5 transition-all duration-300 hover:border-[#ff5c00]/30 hover:shadow-md hover:shadow-[#ff5c00]/5"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff5c00]/10 text-[#ff5c00] transition-colors duration-300 group-hover:bg-[#ff5c00] group-hover:text-white">
                      {info.icon}
                    </div>
                    <h3 className="font-bebas text-lg tracking-wide text-[#0a0a0a] mb-1">
                      {info.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                      {info.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Showroom CTA with image */}
              <div className="mt-8 relative rounded-lg overflow-hidden">
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80"
                    alt="Luxury car showroom"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[#0a0a0a]/80" />
                </div>
                <div className="relative z-10 p-6">
                  <h3 className="font-bebas text-xl tracking-wide text-white mb-2">
                    Visit Our Showroom
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    Come see our fleet in person at our Gueliz showroom.
                    Complimentary refreshments and a personal tour of every vehicle await you.
                  </p>
                  <a
                    href="https://maps.google.com/?q=Gueliz+Marrakesh+Morocco"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-[#ff5c00] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
                  >
                    Get Directions
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
