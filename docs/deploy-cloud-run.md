# Deploy NARAYAN to Google Cloud Run

This runbook ships **scaffolding only**. A live deploy needs the owner's GCP project ID, billing, and Secret Manager values — none of which are invented here.

**Suggested merge order before deploy:** PR #2 (commerce) → #3 (payments/DB) → this deploy PR.

## Prerequisites

1. GCP project with billing enabled (owner-supplied `PROJECT_ID`)
2. APIs: Cloud Run, Cloud Build, Artifact Registry, Secret Manager, Cloud SQL Admin
3. Cloud SQL Postgres instance (or compatible Postgres) for production catalogue/orders
4. Razorpay merchant account (test keys first)
5. Optional: GA4 measurement ID

## Architecture reminder

```
Cloud Run (Next.js standalone)
    ├── Secret Manager → DATABASE_URL, Razorpay secrets
    ├── Cloud SQL (Postgres) via private IP or Auth Proxy connector
    └── Public HTTPS URL → Razorpay webhook endpoint
```

Money stays integer **paise**. Orders are marked paid only after a **verified Razorpay webhook**.

## 1. Create secrets (names only — values stay in Secret Manager)

Suggested secret IDs (match `cloudbuild.yaml` / `scripts/deploy-cloudrun.sh`):

| Secret Manager ID | Maps to env |
| --- | --- |
| `narayan-database-url` | `DATABASE_URL` |
| `narayan-razorpay-key-id` | `RAZORPAY_KEY_ID` |
| `narayan-razorpay-key-secret` | `RAZORPAY_KEY_SECRET` |
| `narayan-razorpay-webhook-secret` | `RAZORPAY_WEBHOOK_SECRET` |

Example (replace placeholders; do not commit values):

```bash
echo -n "postgresql://USER:PASSWORD@/narayan?host=/cloudsql/PROJECT:REGION:INSTANCE" \
  | gcloud secrets create narayan-database-url --data-file=-

echo -n "rzp_test_..." | gcloud secrets create narayan-razorpay-key-id --data-file=-
echo -n "..." | gcloud secrets create narayan-razorpay-key-secret --data-file=-
echo -n "whsec_..." | gcloud secrets create narayan-razorpay-webhook-secret --data-file=-
```

Grant the Cloud Run runtime service account `roles/secretmanager.secretAccessor` on these secrets.

## 2. Cloud SQL + `DATABASE_URL`

Prefer the Cloud SQL Auth Proxy / Cloud Run **Cloud SQL connection** annotation rather than a public IP.

- Create a Postgres database (e.g. `narayan`)
- Apply schema: from a machine with DB access, set `DATABASE_URL` and run:

```bash
npm run db:push
npm run db:seed   # labelled sample catalogue only
```

For Cloud Run, add a Cloud SQL instance attachment when deploying, e.g.:

```bash
gcloud run services update narayan-storefront \
  --region=asia-south1 \
  --add-cloudsql-instances=PROJECT:REGION:INSTANCE
```

`DATABASE_URL` for Unix socket style often looks like:

```text
postgresql://USER:PASSWORD@/DBNAME?host=/cloudsql/PROJECT:REGION:INSTANCE
```

Without `DATABASE_URL`, the app still boots and serves the **file seed catalogue** — useful for smoke tests, not for live orders.

## 3. Build & deploy

### Option A — Cloud Build (`cloudbuild.yaml`)

```bash
gcloud builds submit --config=cloudbuild.yaml \
  --project=YOUR_PROJECT_ID \
  --substitutions=_REGION=asia-south1,_SERVICE=narayan-storefront,_REPOSITORY=narayan,_NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN
```

Create the Artifact Registry Docker repo once (`narayan` in `asia-south1`) if it does not exist.

### Option B — Helper script

```bash
chmod +x scripts/deploy-cloudrun.sh
PROJECT_ID=YOUR_PROJECT_ID ./scripts/deploy-cloudrun.sh --dry-run   # print commands
PROJECT_ID=YOUR_PROJECT_ID ./scripts/deploy-cloudrun.sh             # execute
```

### Option C — Manual `gcloud run deploy`

```bash
docker build -t REGION-docker.pkg.dev/PROJECT/narayan/narayan-storefront:TAG .
docker push REGION-docker.pkg.dev/PROJECT/narayan/narayan-storefront:TAG

gcloud run deploy narayan-storefront \
  --image=REGION-docker.pkg.dev/PROJECT/narayan/narayan-storefront:TAG \
  --region=asia-south1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --set-secrets=DATABASE_URL=narayan-database-url:latest,RAZORPAY_KEY_ID=narayan-razorpay-key-id:latest,RAZORPAY_KEY_SECRET=narayan-razorpay-key-secret:latest,RAZORPAY_WEBHOOK_SECRET=narayan-razorpay-webhook-secret:latest \
  --set-env-vars=NODE_ENV=production,HOSTNAME=0.0.0.0
```

## 4. Public env vars (non-secret)

Safe to set on the service or as Docker build-args:

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL / metadata |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 (optional; app stubs without it) |

## 5. Razorpay webhook

After the service has a stable HTTPS URL:

1. Razorpay Dashboard → Webhooks → add  
   `https://YOUR_CLOUD_RUN_URL/api/payments/razorpay/webhook`
2. Subscribe to `payment.captured` (and optionally `order.paid`)
3. Store the webhook secret as `narayan-razorpay-webhook-secret`

Paid status is set **only** after HMAC verification in that route.

## 6. Smoke checklist

- [ ] `/` loads over HTTPS
- [ ] `/shop` and a PDP render (DB or seed fallback)
- [ ] Cart cookie works
- [ ] Checkout: demo enquiry if secrets incomplete; Razorpay only when fully wired
- [ ] Webhook rejects unsigned payloads (`401`)
- [ ] No secrets in image layers or git

## 7. Local Docker smoke (no GCP)

```bash
docker build -t narayan-local .
docker run --rm -p 8080:8080 narayan-local
# open http://localhost:8080 — seed catalogue, no live payments
```

## Blockers owned by the business

- GCP `PROJECT_ID` + billing
- Cloud SQL credentials
- Razorpay live/test keys + webhook secret
- Custom domain / DNS
- Legal policies before public launch
