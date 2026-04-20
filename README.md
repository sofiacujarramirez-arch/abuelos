# I Love my abuela

> *Your family,* **in print.**

A family gazette service for the Latin diaspora — photos, stories, and cariños from the whole family, laid out into a printed monthly newspaper and mailed to your abuela's door in Colombia.

Built on Next.js 15, Supabase, Stripe (planned), and Vercel.

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS 3.4
- Supabase (auth, Postgres, storage)
- Vercel (hosting)
- Playfair Display + Lora (Google Fonts via `next/font`)

## Local development

```bash
npm install
vercel env pull .env.local          # pulls Supabase env vars from Vercel
npm run dev
```

Open http://localhost:3000.

## Environment variables

Pulled from Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## Project structure

```
src/
  app/               # Next.js App Router
    layout.tsx       # Root layout with font setup
    page.tsx         # Landing page
    globals.css      # Design system + utilities
  components/
    landing/         # Landing page sections
    site-nav.tsx
    site-footer.tsx
  lib/
    supabase/        # Browser + server clients
    utils.ts         # cn() helper
```
