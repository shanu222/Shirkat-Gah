#!/usr/bin/env bash
# =============================================================================
# Shirkat Gah — Clean database reset (deployment / staging only)
# Drops database, reapplies Prisma migrations, seeds admin user.
#
# Usage:
#   bash deploy/scripts/reset-database.sh
#   bash deploy/scripts/reset-database.sh --yes   # skip confirmation
# =============================================================================
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

SKIP_CONFIRM=false
if [ "${1:-}" = "--yes" ] || [ "${1:-}" = "-y" ]; then
  SKIP_CONFIRM=true
fi

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

# Parse database name from DATABASE_URL or default
DB_NAME="${DB_NAME:-shirkat_gah}"
if [ -n "${DATABASE_URL:-}" ]; then
  PARSED="$(node -e "
    try {
      const u = new URL(process.env.DATABASE_URL.replace(/^postgresql:/, 'postgres:'));
      const db = u.pathname.replace(/^\\//, '').split('?')[0];
      if (db) process.stdout.write(db);
    } catch (_) {}
  " 2>/dev/null || true)"
  if [ -n "$PARSED" ]; then
    DB_NAME="$PARSED"
  fi
fi

echo "==> Database reset target: $DB_NAME"
echo "    DATABASE_URL=${DATABASE_URL:-(not set)}" | sed 's/:[^:@\/]*@/:***@/g'

if [ "$SKIP_CONFIRM" = false ]; then
  echo ""
  echo "WARNING: This will DROP database '$DB_NAME' and ALL data."
  read -r -p "Type 'reset' to continue: " CONFIRM
  if [ "$CONFIRM" != "reset" ]; then
    echo "Aborted."
    exit 1
  fi
fi

echo "==> Ensuring PostgreSQL is running"
if command -v systemctl &>/dev/null; then
  sudo systemctl start postgresql 2>/dev/null || true
fi

echo "==> Dropping and recreating database"
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS "${DB_NAME}" WITH (FORCE);
CREATE DATABASE "${DB_NAME}" OWNER postgres;
SQL

echo "==> Generating Prisma client"
pnpm db:generate

echo "==> Applying migrations"
pnpm db:migrate:deploy

echo "==> Seeding database"
pnpm db:seed

echo "==> Verifying schema"
pnpm db:verify

echo ""
echo "✅ Database reset complete"
echo ""
echo "Test login:"
echo "  curl -s -X POST http://127.0.0.1:3001/api/v1/auth/login \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"admin@shirkatgah.org\",\"password\":\"Admin@123456\"}'"
