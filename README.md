# NARAYAN — Rituals & Living

Premium D2C storefront for a Hisar, Haryana family pooja business (working brand name).

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Drizzle ORM + Postgres (optional `DATABASE_URL`)
- Razorpay (optional keys + webhook secret)
- Sample catalogue file fallback when DB is unset

## Run locally

```bash
npm install
npm run dev
```

Works without Cloud SQL or Razorpay — catalogue falls back to labelled sample seed data; checkout stays a demo enquiry.

## Optional integrations

```bash
# Apply schema (requires DATABASE_URL)
npm run db:push
npm run db:seed

# Env names only — see .env.example
# DATABASE_URL=
# RAZORPAY_KEY_ID=
# RAZORPAY_KEY_SECRET=
# RAZORPAY_WEBHOOK_SECRET=
# NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

Live Razorpay checkout requires keys **and** webhook secret **and** `DATABASE_URL`. Orders are marked paid only after a verified webhook — never from the browser alone.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run db:push` | Push Drizzle schema |
| `npm run db:seed` | Seed sample catalogue into Postgres |

## Architecture

- `src/app/` — thin routes + API (`/api/checkout`, `/api/payments/razorpay/webhook`, `/api/analytics/track`)
- `src/features/home|shop|product|cart|checkout`
- `src/lib/catalog|cart|analytics|payments|contact`
- `src/db/` — Drizzle schema, client, seed
- `src/config/store.ts` — Hisar placeholders

## Phases

- **A** Home + PLPs
- **B** PDP + cart + demo checkout
- **C** Postgres + Razorpay webhooks + analytics persistence (this work)
- **D** Soft launch with real catalogue / GA4 / GCP prod

## Deploy (Cloud Run)

Production uses Next.js **standalone** output + `Dockerfile`.

See **[docs/deploy-cloud-run.md](docs/deploy-cloud-run.md)** for Cloud SQL, Secret Manager, `cloudbuild.yaml`, and `scripts/deploy-cloudrun.sh`.

Live GCP deploy requires the owner's `PROJECT_ID` and billing — this repo only ships scaffolding.

