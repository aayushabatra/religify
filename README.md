# NARAYAN — Rituals & Living

Premium D2C storefront for a Hisar, Haryana family pooja business (working brand name).

Phase A delivers foundation layout, home, collection PLPs, and search PLP with clearly labelled sample catalogue data.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Lean dependencies; sample catalogue in `src/lib/catalog`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Production build |
| `npm start` | Serve production build |

## Architecture

- `src/app/` — thin routes
- `src/features/home|shop|product|cart|checkout` — journey UI
- `src/components/layout|ui` — shell + primitives
- `src/lib/catalog|cart|analytics|payments` — services
- `src/config/store.ts` — Hisar placeholders
- `src/db/` — reserved for Cloud SQL schema later

## Sample data

All products, prices, and imagery are **sample development data**, not production truth. Replace via `src/lib/catalog/seed.ts` and `public/images/` when real catalogue and photography arrive.

## What’s next

- Phase B: full PDP, cart persistence, demo checkout
- Phase C: Cloud SQL, Razorpay, webhooks, analytics persistence

## Notes

- Do not invent nationwide shipping or legal claims
- Secrets belong in environment variables (see `.env.example`)
