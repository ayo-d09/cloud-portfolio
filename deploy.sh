#!/bin/bash
set -euo pipefail

# ── Config ────────────────────────────────────────────────────
BUCKET_NAME="ayo-portfolio-site-12345"
AWS_REGION="us-east-1"
WEBSITE_DIR="$(cd "$(dirname "$0")/website" && pwd)"
TERRAFORM_DIR="$(cd "$(dirname "$0")/terraform" && pwd)"

# ── Colors ────────────────────────────────────────────────────
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log()     { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ─────────────────────────────────────────────────────────────
log "Running preflight checks..."
command -v aws       &>/dev/null || error "AWS CLI is not installed. Run: pip install awscli"
command -v terraform &>/dev/null || error "Terraform is not installed. See: https://developer.hashicorp.com/terraform/install"
aws sts get-caller-identity --region "$AWS_REGION" &>/dev/null \
  || error "AWS credentials not configured. Run: aws configure"
[[ -d "$WEBSITE_DIR" ]] || error "Website directory not found: $WEBSITE_DIR"
[[ -f "$WEBSITE_DIR/index.html" ]] || error "index.html not found in $WEBSITE_DIR"
success "Preflight checks passed."
echo ""

# ── Fetch CloudFront Distribution ID from Terraform output ────
log "Fetching CloudFront Distribution ID from Terraform..."
cd "$TERRAFORM_DIR"
DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null) || {
  warn "Could not read 'cloudfront_distribution_id' from Terraform outputs."
  warn "Attempting to look it up via AWS CLI..."
  DISTRIBUTION_ID=$(
    aws cloudfront list-distributions \
      --query "DistributionList.Items[?Origins.Items[?DomainName && contains(DomainName,'${BUCKET_NAME}')]].Id" \
      --output text 2>/dev/null | head -n1
  )
  [[ -n "$DISTRIBUTION_ID" ]] || error "Could not determine CloudFront Distribution ID. Check your Terraform outputs or AWS console."
}
success "Distribution ID: $DISTRIBUTION_ID"
echo ""

# ── Upload website files to S3 ────────────────────────────────
log "Syncing website files to s3://${BUCKET_NAME} ..."
aws s3 sync "$WEBSITE_DIR" "s3://${BUCKET_NAME}" \
  --region "$AWS_REGION" \
  --delete \
  --cache-control "max-age=86400" \
  --exclude "*.DS_Store" \
  --exclude ".git/*"

# Override cache-control for HTML — always revalidate
aws s3 cp "$WEBSITE_DIR/index.html" "s3://${BUCKET_NAME}/index.html" \
  --region "$AWS_REGION" \
  --content-type "text/html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --metadata-directive REPLACE
success "Files uploaded to S3."
echo ""

# ── Invalidate CloudFront cache ───────────────────────────────
log "Creating CloudFront invalidation for /* ..."
INVALIDATION_ID=$(
  aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" \
    --query "Invalidation.Id" \
    --output text
)
success "Invalidation created: $INVALIDATION_ID"
echo ""

# ── Wait for invalidation to complete ────────────────────────
log "Waiting for invalidation to complete (this may take ~30–60 seconds)..."
aws cloudfront wait invalidation-completed \
  --distribution-id "$DISTRIBUTION_ID" \
  --id "$INVALIDATION_ID"
success "Invalidation complete. CDN cache is fresh."
echo ""

# ── Done ──────────────────────────────────────────────────────
CLOUDFRONT_URL=$(
  aws cloudfront get-distribution \
    --id "$DISTRIBUTION_ID" \
    --query "Distribution.DomainName" \
    --output text
)
echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}   Deployment complete!                          ${NC}"
echo -e "${GREEN}=================================================${NC}"
echo ""
echo -e "  ${CYAN}Live URL:${NC} https://${CLOUDFRONT_URL}"
echo ""
