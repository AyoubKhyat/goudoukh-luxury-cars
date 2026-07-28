# Goudoukh Luxury Cars

Premium car rental website for a Marrakech-based luxury car rental service. Public marketing site with vehicle catalog, booking flow, and admin panel.

**Live:** https://goudoukh-luxury-cars.vercel.app/

## Features

- **Vehicle catalog** — supercars, grand tourers, luxury SUVs
- **Booking flow** — vehicle selection, dates, driver details
- **Multi-language** — English, French, Arabic
- **3D scenes** — Three.js hero + vehicle showcase
- **GSAP animations** — smooth scroll-driven storytelling
- **Admin panel** — vehicle inventory, reservations, availability
- **API layer** — REST endpoints for public + admin operations
- **Prisma ORM** — schema-first database access

## Tech stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Prisma ORM
- **Styling:** Tailwind CSS
- **3D:** Three.js
- **Animation:** Framer Motion + GSAP
- **Hosting:** Vercel

## Project structure

```
goudoukh-luxury-cars/
├── src/app/
│   ├── (public)/       # marketing + booking site
│   ├── admin/          # admin dashboard
│   ├── api/            # REST endpoints
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── prisma/             # DB schema + migrations
├── public/
└── package.json
```

## Getting started

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000

## Environment variables

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` — your PostgreSQL connection string
- `NEXTAUTH_SECRET` — random 32-char string (if auth enabled)

## About

Built by [Ayoub Khyat](https://github.com/AyoubKhyat) — full-stack developer, Marrakech.

For custom booking systems, admin panels, or e-commerce work, contact via [Ibda3 Digital](https://ibda3-digital.vercel.app/) or [Fiverr](https://www.fiverr.com/ayoubkhyat).
