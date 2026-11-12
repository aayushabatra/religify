#!/usr/bin/env bash
# Manual Cloud Run deploy helper for NARAYAN.
# Requires: gcloud auth, billing-enabled project, Artifact Registry repo.
# Does NOT invent a project ID — pass PROJECT_ID explicitly.
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  PROJECT_ID=your-gcp-project ./scripts/deploy-cloudrun.sh [--dry-run]

Env (optional):
  REGION=asia-south1
  SERVICE=narayan-storefront
  REPOSITORY=narayan
  IMAGE=narayan-storefront
  NEXT_PUBLIC_GA_MEASUREMENT_ID=
  NEXT_PUBLIC_SITE_URL=

Secrets must already exist in Secret Manager (see docs/deploy-cloud-run.md).
EOF
}

DRY_RUN=0
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

if [[ -z "${PROJECT_ID:-}" ]]; then
  echo "ERROR: Set PROJECT_ID to the owner's GCP project (not invented here)." >&2
  usage
  exit 1
fi

REGION="${REGION:-asia-south1}"
SERVICE="${SERVICE:-narayan-storefront}"
REPOSITORY="${REPOSITORY:-narayan}"
IMAGE="${IMAGE:-narayan-storefront}"
TAG="${TAG:-$(git rev-parse --short HEAD 2>/dev/null || echo local)}"
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE}:${TAG}"

run() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "+ $*"
  else
    "$@"
  fi
}

echo "Project:  ${PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Service:  ${SERVICE}"
echo "Image:    ${IMAGE_URI}"
echo "Dry-run:  ${DRY_RUN}"

run gcloud config set project "${PROJECT_ID}"
run gcloud artifacts repositories describe "${REPOSITORY}" --location="${REGION}" \
  || run gcloud artifacts repositories create "${REPOSITORY}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="NARAYAN storefront images"

run gcloud builds submit \
  --tag "${IMAGE_URI}" \
  --project "${PROJECT_ID}" \
  .

run gcloud run deploy "${SERVICE}" \
  --project "${PROJECT_ID}" \
  --image "${IMAGE_URI}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 10 \
  --set-secrets "DATABASE_URL=narayan-database-url:latest,RAZORPAY_KEY_ID=narayan-razorpay-key-id:latest,RAZORPAY_KEY_SECRET=narayan-razorpay-key-secret:latest,RAZORPAY_WEBHOOK_SECRET=narayan-razorpay-webhook-secret:latest" \
  --set-env-vars "NODE_ENV=production,HOSTNAME=0.0.0.0"

echo "Done. Configure custom domain / webhook URL after first deploy."
