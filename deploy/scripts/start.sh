#!/usr/bin/env bash
# Quick start/restart without full rebuild
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

pm2 restart shirkat-gah-api || pm2 start ecosystem.config.js --env production
pm2 save
pm2 status

curl -sf "http://localhost:${API_PORT:-3001}/api/v1/health" && echo " API healthy" || echo " API health check failed"
