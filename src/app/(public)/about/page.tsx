"use client";

import SectionTitle from "@/components/ui/SectionTitle";
import AnimatedLine from "@/components/ui/AnimatedLine";

/* ──────────────────────────────────────────────
   Team Data
   ────────────────────────────────────────────── */
const team = [
  {
    name: "Youssef Alami",
    title: "Founder & CEO",
    bio: "A lifelong petrolhead with a vision to bring world-class automotive experiences to Morocco. Youssef founded Goudoukh Luxury Cars after a decade in luxury hospitality across Europe and the Middle East.",
    gradient: "from-[#ff5c00] to-[#ff8a3d]",
  },
  {
    name: "Sarah Chen",
    title: "Head of Operations",
    bio: "With a background in logistics and premium brand management, Sarah ensures every touchpoint of the Goudoukh experience runs with precision and elegance.",
    gradient: "from-[#0a0a0a] to-[#333]",
  },
  {
    name: "Karim Bennani",
    title: "Fleet Manager",
    bio: "Karim brings 15 years of automotive expertise to curate and maintain our fleet to the highest standards. Every car meets his exacting specifications before it reaches a client.",
    gradient: "from-[#1a1a1a] to-[#ff5c00]",
  },
  {
    name: "Elena Rossi",
    title: "Client Relations Director",
    bio: "Elena crafts bespoke itineraries and concierge experiences. Her network across Marrakesh guarantees access to the finest restaurants, riads, and hidden gems.",
    gradient: "from-[#ff5c00] to-[#0a0a0a]",
  },
];

/* ──────────────────────────────────────────────
   Concierge Services Data
   ────────────────────────────────────────────── */
const services = [
  {
    title: "24/7 Concierge",
    description:
      "Round-the-clock personal assistance for any request. From restaurant reservations to roadside support, we are always one call away.",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: "Airport Transfer",
    description:
      "Seamless pickup and delivery at Marrakesh Menara Airport. Your car will be waiting, detailed and ready, the moment you land.",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
  },
  {
    title: "Full Insurance",
    description:
      "Comprehensive coverage on every rental. Drive with total confidence knowing you are fully protected against any incident.",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Custom Itineraries",
    description:
      "Tailored driving routes through the Atlas Mountains, coastal roads, and desert landscapes. Curated by our local experts for unforgettable journeys.",
    icon: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
  },
];

/* ──────────────────────────────────────────────
   Map Pin Locations
   ────────────────────────────────────────────── */
const mapPins = [
  { label: "GOUDOUKH HQ", x: 220, y: 200 },
  { label: "Airport", x: 130, y: 310 },
  { label: "Medina", x: 250, y: 240 },
  { label: "Palmeraie", x: 310, y: 140 },
];

/* ──────────────────────────────────────────────
   Page Component
   ────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white pt-32 pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="font-bebas text-hero tracking-tight text-[#0a0a0a] leading-none">
            THE GOUDOUKH
            <br />
            <span className="text-gradient-orange">STORY</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-500 leading-relaxed">
            Born from a passion for extraordinary machines and Moroccan
            hospitality, Goudoukh Luxury Cars delivers the finest luxury car rental experience
            in Marrakesh. Every detail is curated. Every journey, unforgettable.
          </p>
          <AnimatedLine className="mt-8 max-w-md" />
        </div>

        {/* Decorative corner element */}
        <div className="absolute top-20 right-0 hidden lg:block w-64 h-64 opacity-[0.03]">
          <div className="w-full h-full border-[3px] border-[#ff5c00] rotate-45 translate-x-1/2" />
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-[#0a0a0a] py-24" data-dark>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Copy */}
            <div>
              <SectionTitle
                title="OUR MISSION"
                subtitle="Where automotive passion meets Moroccan soul"
                dark
              />
              <div className="space-y-5 text-gray-400 leading-relaxed">
                <p>
                  Goudoukh Luxury Cars was founded in 2019 with a singular belief: that driving
                  an exceptional car should be more than transportation — it
                  should be an experience that stirs the senses and creates
                  lasting memories.
                </p>
                <p>
                  Based in the heart of Marrakesh, we curate a fleet of the
                  world&apos;s most desirable vehicles and pair them with the
                  warmth and generosity of Moroccan hospitality. From the winding
                  passes of the Atlas Mountains to the sun-drenched boulevards of
                  the Palmeraie, every road becomes a destination.
                </p>
                <p>
                  Our team of automotive enthusiasts hand-selects each vehicle,
                  maintains it to manufacturer specification, and presents it
                  with the care of a five-star concierge. Because at Goudoukh, the
                  journey is everything.
                </p>
              </div>
              <AnimatedLine className="mt-8 max-w-xs" delay={300} />
            </div>

            {/* Right: Decorative Abstract Element */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Gradient background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff5c00]/20 via-[#1a1a1a] to-[#ff5c00]/10" />
                {/* Inner frame */}
                <div className="absolute inset-4 rounded-xl border border-[#ff5c00]/20" />
                {/* Cross lines */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#ff5c00]/10" />
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#ff5c00]/10" />
                {/* Center badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-bebas text-7xl md:text-8xl tracking-wider text-[#ff5c00]/80">
                      G
                    </p>
                    <p className="font-bebas text-sm tracking-[0.4em] text-white/40 mt-1">
                      EST. 2019
                    </p>
                  </div>
                </div>
                {/* Corner accents */}
                <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-[#ff5c00]/40 rounded-tl-lg" />
                <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-[#ff5c00]/40 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-[#ff5c00]/40 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-[#ff5c00]/40 rounded-br-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle
            title="OUR TEAM"
            subtitle="The people behind every exceptional journey"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative rounded-lg border border-gray-200 p-6 transition-all duration-300 hover:border-[#ff5c00]/30 hover:shadow-lg hover:shadow-[#ff5c00]/5"
              >
                {/* Avatar circle */}
                <div
                  className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} transition-transform duration-300 group-hover:scale-105`}
                >
                  <span className="font-bebas text-2xl text-white tracking-wider">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>

                {/* Info */}
                <h3 className="font-bebas text-xl tracking-wide text-center text-[#0a0a0a] group-hover:text-[#ff5c00] transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-xs text-[#ff5c00] font-medium text-center mt-1 mb-3 uppercase tracking-wider">
                  {member.title}
                </p>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  {member.bio}
                </p>

                {/* Orange bottom accent on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff5c00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concierge Services Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle
            title="CONCIERGE SERVICES"
            subtitle="White-glove attention to every detail of your journey"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group rounded-lg bg-[#f2f2f0] p-6 transition-all duration-300 hover:bg-[#0a0a0a]"
              >
                <div className="mb-4 text-[#ff5c00] transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="font-bebas text-xl tracking-wide text-[#0a0a0a] group-hover:text-white transition-colors duration-300 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-400 leading-relaxed transition-colors duration-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map / Find Us Section */}
      <section className="bg-[#f2f2f0] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionTitle title="FIND US" subtitle="Visit Goudoukh Luxury Cars in Marrakesh" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Stylized SVG Map */}
            <div className="relative rounded-lg bg-white p-6 shadow-sm border border-gray-200 overflow-hidden">
              <svg
                viewBox="0 0 450 400"
                className="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background grid */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 40}
                    x2="450"
                    y2={i * 40}
                    stroke="#f2f2f0"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 40}
                    y1="0"
                    x2={i * 40}
                    y2="400"
                    stroke="#f2f2f0"
                    strokeWidth="1"
                  />
                ))}

                {/* Main roads */}
                <path
                  d="M50 200 L400 200"
                  stroke="#e5e5e5"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M200 50 L200 350"
                  stroke="#e5e5e5"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M100 100 L350 300"
                  stroke="#e5e5e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M100 300 L350 100"
                  stroke="#e5e5e5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Boulevard arcs */}
                <path
                  d="M150 120 Q225 80 300 120"
                  stroke="#e5e5e5"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M150 280 Q225 320 300 280"
                  stroke="#e5e5e5"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Medina area (stylized polygon) */}
                <polygon
                  points="220,210 270,200 290,230 275,265 235,270 210,245"
                  fill="#0a0a0a"
                  fillOpacity="0.05"
                  stroke="#0a0a0a"
                  strokeWidth="1"
                  strokeOpacity="0.1"
                />

                {/* Labels for areas */}
                <text x="240" y="255" fontSize="8" fill="#aaa" textAnchor="middle" fontFamily="sans-serif">
                  MEDINA
                </text>
                <text x="320" y="125" fontSize="8" fill="#aaa" textAnchor="middle" fontFamily="sans-serif">
                  PALMERAIE
                </text>

                {/* Pin markers */}
                {mapPins.map((pin) => (
                  <g key={pin.label}>
                    {/* Pin shadow */}
                    <ellipse
                      cx={pin.x}
                      cy={pin.y + 14}
                      rx="6"
                      ry="2"
                      fill="#0a0a0a"
                      fillOpacity="0.15"
                    />
                    {/* Pin body */}
                    <path
                      d={`M${pin.x} ${pin.y + 12} C${pin.x} ${pin.y + 12} ${pin.x - 10} ${pin.y - 2} ${pin.x - 10} ${pin.y - 6} A10 10 0 1 1 ${pin.x + 10} ${pin.y - 6} C${pin.x + 10} ${pin.y - 2} ${pin.x} ${pin.y + 12} ${pin.x} ${pin.y + 12}z`}
                      fill="#ff5c00"
                    />
                    {/* Pin dot */}
                    <circle cx={pin.x} cy={pin.y - 6} r="3.5" fill="#ffffff" />
                    {/* Label */}
                    <rect
                      x={pin.x - 30}
                      y={pin.y - 28}
                      width="60"
                      height="14"
                      rx="2"
                      fill="#0a0a0a"
                      fillOpacity="0.85"
                    />
                    <text
                      x={pin.x}
                      y={pin.y - 19}
                      fontSize="7"
                      fill="#ffffff"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                      fontWeight="600"
                    >
                      {pin.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="font-bebas text-2xl tracking-wide text-[#0a0a0a] mb-4">
                  Goudoukh Headquarters
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-[#ff5c00] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#0a0a0a]">Address</p>
                      <p className="text-sm text-gray-500">
                        Boulevard Mohammed VI, Gueliz
                        <br />
                        Marrakesh 40000, Morocco
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-[#ff5c00] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#0a0a0a]">Phone</p>
                      <p className="text-sm text-gray-500">+212 524 000 000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-[#ff5c00] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#0a0a0a]">Email</p>
                      <p className="text-sm text-gray-500">concierge@goudoukh.ma</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-[#ff5c00] mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-[#0a0a0a]">Hours</p>
                      <p className="text-sm text-gray-500">
                        Open 24/7 — 365 days a year
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatedLine className="max-w-xs" delay={200} />

              <div className="rounded-lg bg-[#0a0a0a] p-6">
                <p className="font-bebas text-xl tracking-wide text-white mb-2">
                  Airport Pickup Available
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  We offer complimentary meet-and-greet at Marrakesh Menara
                  Airport (RAK). Your vehicle will be detailed, fueled, and
                  waiting at the terminal.
                </p>
                <a
                  href="/booking"
                  className="mt-4 inline-block rounded bg-[#ff5c00] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
