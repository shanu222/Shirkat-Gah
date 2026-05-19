#!/usr/bin/env bash
# =============================================================================
# Shirkat Gah — Verify PostgreSQL connectivity, schema, and admin user
# Usage: bash deploy/scripts/verify-database.sh
# =============================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

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
fi

echo "==> PostgreSQL service"
if command -v systemctl &>/dev/null; then
  systemctl is-active postgresql && echo "✅ postgresql active" || echo "⚠️  postgresql not active"
fi

echo "==> Local psql (postgres user, no password)"
if sudo -u postgres psql -v ON_ERROR_STOP=1 -c "SELECT 1;" >/dev/null 2>&1; then
  echo "✅ sudo -u postgres psql works"
else
  echo "❌ Local postgres auth broken — run: sudo bash deploy/scripts/setup-postgres.sh"
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ DATABASE_URL not set"
  exit 1
fi

echo "==> DATABASE_URL"
echo "   $(echo "$DATABASE_URL" | sed 's/:[^:@\/]*@/:***@/g')"

echo "==> Prisma schema verification"
pnpm db:verify

API_PORT="${API_PORT:-3001}"
echo "==> API health"
curl -sf "http://127.0.0.1:${API_PORT}/api/v1/health" | head -c 500 || echo "⚠️  API not running on port ${API_PORT}"

echo ""
echo "==> Auth login test"
LOGIN_RESPONSE="$(curl -s -w "\n%{http_code}" -X POST "http://127.0.0.1:${API_PORT}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shirkatgah.org","password":"Admin@123456"}' 2>/dev/null || true)"
HTTP_CODE="$(echo "$LOGIN_RESPONSE" | tail -n1)"
BODY="$(echo "$LOGIN_RESPONSE" | sed '$d')"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  echo "✅ Login OK (HTTP $HTTP_CODE)"
  echo "$BODY" | head -c 200
  echo ""
else
  echo "❌ Login failed (HTTP ${HTTP_CODE:-unknown})"
  echo "$BODY"
  exit 1
fi

echo "✅ All database checks passed"
