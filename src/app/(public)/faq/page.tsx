"use client";

import { useState } from "react";
import Link from "next/link";

/* ──────────────────────────────────────────────
   FAQ Data
   ────────────────────────────────────────────── */
const faqs = [
  {
    question: "What documents do I need to rent a car?",
    answer:
      "You will need a valid driving licence (held for at least 2 years), a valid passport or national ID, and a credit card in your name for the security deposit. International driving permits are accepted alongside your home-country licence.",
  },
  {
    question: "What is the minimum age to rent?",
    answer:
      "The minimum age is 21 years for standard and luxury sedans, and 25 years for supercars and high-performance vehicles. A young-driver surcharge of 200 MAD/day applies for drivers aged 21-24.",
  },
  {
    question: "Is insurance included in the rental price?",
    answer:
      "Basic third-party liability insurance is included with every rental at no extra cost. We also offer comprehensive full-coverage insurance as an optional add-on for 500 MAD/day, which covers collision damage, theft, and personal belongings.",
  },
  {
    question: "Can I pick up the car at the airport?",
    answer:
      "Absolutely. We offer complimentary meet-and-greet at Marrakesh Menara Airport (RAK). Your vehicle will be detailed, fueled, and waiting at the terminal. Simply share your flight details at the time of booking and our concierge will be there when you land.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Free cancellation is available up to 48 hours before your scheduled pickup. Cancellations within 48 hours incur a fee equal to one day of the rental rate. No-shows are charged the full rental amount. Modifications to existing bookings are free of charge, subject to availability.",
  },
  {
    question: "Do you offer a chauffeur service?",
    answer:
      "Yes, we offer professional chauffeur service for all vehicles at 1,200 MAD/day. Our chauffeurs are licensed, multilingual, and trained in executive driving. This service is perfect for airport transfers, business meetings, or city tours.",
  },
  {
    question: "How do I extend my rental?",
    answer:
      "Contact our 24/7 concierge team by phone or email at least 24 hours before your scheduled return. Extensions are subject to vehicle availability and will be billed at the same daily rate. Rentals of 7+ days qualify for our 10% loyalty discount.",
  },
  {
    question: "What fuel policy do you follow?",
    answer:
      "All vehicles are delivered with a full tank of fuel. We ask that you return the vehicle with a full tank as well. If the car is returned with less fuel, a refuelling charge of 25 MAD per litre (plus a 200 MAD service fee) will apply.",
  },
  {
    question: "Are there mileage limits?",
    answer:
      "Standard rentals include 300 km per day. Additional kilometres are charged at 5 MAD/km for sedans and SUVs, and 10 MAD/km for supercars. We also offer unlimited mileage packages for weekly and monthly bookings -- contact us for details.",
  },
  {
    question: "Can I take the car outside Morocco?",
    answer:
      "Cross-border travel is not permitted for any vehicle in our fleet. All rentals must remain within Morocco. Attempted cross-border travel will void insurance coverage and incur a penalty. We offer one-way rentals between major Moroccan cities on select vehicles.",
  },
  {
    question: "What happens in case of a breakdown or accident?",
    answer:
      "Call our 24/7 roadside assistance hotline immediately. We will dispatch a replacement vehicle or a tow truck depending on the situation. If you have full insurance, all associated costs are covered. Without full insurance, you may be liable for a deductible up to 15,000 MAD depending on the vehicle.",
  },
  {
    question: "Do you offer long-term or monthly rentals?",
    answer:
      "Yes, we offer attractive monthly rates with significant discounts compared to daily pricing. Long-term rentals include complimentary full insurance, scheduled maintenance, and priority vehicle swaps. Contact our team for a custom quote.",
  },
];

/* ──────────────────────────────────────────────
   Accordion Item
   ────────────────────────────────────────────── */
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-lg border transition-all duration-300 ${
        isOpen
          ? "border-[#ff5c00]/30 shadow-md shadow-[#ff5c00]/5"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span
          className={`font-medium text-sm pr-4 transition-colors duration-300 ${
            isOpen ? "text-[#ff5c00]" : "text-[#0a0a0a]"
          }`}
        >
          {question}
        </span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen
              ? "bg-[#ff5c00] text-white rotate-180"
              : "bg-[#f2f2f0] text-[#0a0a0a]"
          }`}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-5">
          <div className="h-px w-full bg-gray-100 mb-4" />
          <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────── */
export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="font-bebas text-hero tracking-tight text-white leading-none">
            FREQUENTLY ASKED
            <br />
            <span className="text-[#ff5c00]">QUESTIONS</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-gray-400 leading-relaxed">
            Everything you need to know about renting with Goudoukh Luxury Cars.
            Can&apos;t find what you are looking for? Contact our team.
          </p>
          <div className="mt-6 h-[2px] w-20 bg-[#ff5c00]" />
        </div>

        {/* Decorative */}
        <div className="absolute bottom-0 right-0 hidden lg:block opacity-[0.02]">
          <p className="font-bebas text-[12rem] text-white leading-none -mb-8">
            FAQ
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-16 rounded-lg bg-[#f2f2f0] p-8 text-center">
            <h3 className="font-bebas text-2xl tracking-wide text-[#0a0a0a] mb-2">
              Still Have Questions?
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Our concierge team is available 24/7 to assist you with any
              questions about our fleet, services, or booking process.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="rounded bg-[#ff5c00] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
              >
                Contact Us
              </Link>
              <a
                href="tel:+212524000000"
                className="rounded border border-[#0a0a0a] px-8 py-3 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white"
              >
                Call +212 524 000 000
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
