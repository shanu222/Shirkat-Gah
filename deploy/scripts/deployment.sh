#!/usr/bin/env bash
# =============================================================================
# Shirkat Gah — Production Deployment Script (AWS EC2)
# Usage: bash deploy/scripts/deployment.sh
# =============================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "==> Deploying Shirkat Gah from $ROOT_DIR"

# Load environment for migration + health checks
if [ -f .env.production ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.production
  set +a
  ln -sf .env.production .env 2>/dev/null || cp .env.production .env
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
pnpm db:migrate:deploy

echo "==> Building monorepo (database → shared → api → web)"
pnpm build

echo "==> Verifying compiled artifacts"
test -f packages/database/dist/index.js || { echo "ERROR: packages/database/dist/index.js missing"; exit 1; }
test -f packages/shared/dist/index.js || { echo "ERROR: packages/shared/dist/index.js missing"; exit 1; }
test -f apps/api/dist/main.js || { echo "ERROR: apps/api/dist/main.js missing"; exit 1; }

echo "==> Smoke test: Node can load compiled database package"
(cd apps/api && node -e "require('@shirkat-gah/database'); console.log('database package OK')")

mkdir -p logs /var/log/shirkat-gah 2>/dev/null || mkdir -p logs

echo "==> Restarting API with PM2"
pm2 delete shirkat-gah-api 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

echo "==> Waiting for API to become ready"
sleep 3

API_PORT="${API_PORT:-3001}"
curl -sf "http://127.0.0.1:${API_PORT}/health" && echo " — /health OK" || { echo " — /health FAILED"; pm2 logs shirkat-gah-api --lines 50; exit 1; }
curl -sf "http://127.0.0.1:${API_PORT}/api/health" && echo " — /api/health OK" || echo " — /api/health FAILED"
curl -sf "http://127.0.0.1:${API_PORT}/api/v1/health" && echo " — /api/v1/health OK" || echo " — /api/v1/health FAILED"

if command -v nginx &>/dev/null; then
  echo "==> Reloading Nginx"
  sudo nginx -t && sudo systemctl reload nginx
fi

echo "==> Deployment complete"
pm2 status
