#!/usr/bin/env bash
# Quick start/restart without full rebuild
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if [ -f .env.production ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.production
  set +a
fi

test -f apps/api/dist/main.js || {
  echo "ERROR: apps/api/dist/main.js not found. Run: pnpm build"
  exit 1
}

pm2 restart shirkat-gah-api || pm2 start ecosystem.config.js --env production
pm2 save
pm2 status

API_PORT="${API_PORT:-3001}"
curl -sf "http://127.0.0.1:${API_PORT}/health" && echo " API healthy" || echo " API health check failed"
