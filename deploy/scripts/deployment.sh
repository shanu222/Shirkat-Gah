#!/usr/bin/env bash
# =============================================================================
# Shirkat Gah — Production Deployment Script (AWS EC2)
# Usage: bash deploy/scripts/deployment.sh
# =============================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "==> Deploying Shirkat Gah from $ROOT_DIR"

# Load environment
if [ -f .env.production ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.production
  set +a
elif [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
else
  echo "ERROR: .env.production or .env not found"
  exit 1
fi

echo "==> Installing dependencies"
pnpm install --frozen-lockfile || pnpm install

echo "==> Generating Prisma client"
pnpm db:generate

echo "==> Running database migrations"
pnpm --filter @shirkat-gah/database migrate:deploy

echo "==> Building monorepo"
pnpm build

echo "==> Restarting API with PM2"
pm2 delete shirkat-gah-api 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

echo "==> Reloading Nginx"
sudo nginx -t && sudo systemctl reload nginx

echo "==> Deployment complete"
pm2 status
curl -sf "http://localhost:${API_PORT:-3001}/api/v1/health" && echo " — Health check OK" || echo " — Health check FAILED"
