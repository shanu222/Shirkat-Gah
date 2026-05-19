#!/usr/bin/env bash
# =============================================================================
# Shirkat Gah — PostgreSQL setup for AWS EC2 (Amazon Linux 2023)
# Fixes local auth (pg_hba), creates database, enables service.
#
# Usage (as root or with sudo):
#   sudo bash deploy/scripts/setup-postgres.sh
# =============================================================================
set -euo pipefail

DB_NAME="${DB_NAME:-shirkat_gah}"
DB_USER="${DB_USER:-postgres}"

echo "==> Shirkat Gah PostgreSQL Setup"

# Install PostgreSQL server (setup-server.sh only installs client)
if ! rpm -q postgresql15-server &>/dev/null; then
  dnf install -y postgresql15-server postgresql15
fi

# Initialize cluster if needed
if [ ! -d /var/lib/pgsql/data/base ]; then
  postgresql-setup --initdb
fi

systemctl enable postgresql
systemctl start postgresql

# Locate pg_hba.conf
PG_HBA=""
for candidate in \
  /var/lib/pgsql/data/pg_hba.conf \
  /var/lib/pgsql/15/data/pg_hba.conf \
  /etc/postgresql/*/main/pg_hba.conf; do
  if [ -f "$candidate" ]; then
    PG_HBA="$candidate"
    break
  fi
done

if [ -z "$PG_HBA" ]; then
  PG_HBA="$(sudo -u postgres psql -tAc "SHOW hba_file;" 2>/dev/null | tr -d '[:space:]')"
fi

if [ -z "$PG_HBA" ] || [ ! -f "$PG_HBA" ]; then
  echo "ERROR: Could not locate pg_hba.conf"
  exit 1
fi

echo "==> pg_hba.conf: $PG_HBA"

BACKUP="${PG_HBA}.bak.$(date +%Y%m%d%H%M%S)"
cp "$PG_HBA" "$BACKUP"
echo "==> Backup: $BACKUP"

# Replace pg_hba with safe localhost-trust + external password auth
cat > "$PG_HBA" <<'EOF'
# Shirkat Gah — managed by deploy/scripts/setup-postgres.sh
# Local connections: trust (API on same EC2 host)
# Remote connections: scram-sha-256 (require password)

# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    all             all             0.0.0.0/0               scram-sha-256
host    all             all             ::/0                    scram-sha-256
EOF

echo "==> Restarting PostgreSQL"
systemctl restart postgresql
sleep 2

echo "==> Verifying local postgres login (no password)"
if ! sudo -u postgres psql -v ON_ERROR_STOP=1 -c "SELECT version();" >/dev/null; then
  echo "ERROR: postgres user cannot connect locally"
  echo "Restore backup: cp $BACKUP $PG_HBA && systemctl restart postgresql"
  exit 1
fi
echo "✅ Local postgres login OK"

echo "==> Creating database: $DB_NAME"
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
SQL

echo "==> Database list"
sudo -u postgres psql -c "\\l" | grep -E "Name|${DB_NAME}" || true

echo ""
echo "==> Setup complete"
echo ""
echo "Use this DATABASE_URL in .env.production (local trust auth, no password):"
echo "  DATABASE_URL=postgresql://${DB_USER}@localhost:5432/${DB_NAME}?schema=public"
echo ""
echo "Next steps:"
echo "  1. Update .env.production with the DATABASE_URL above"
echo "  2. bash deploy/scripts/reset-database.sh   # clean schema + seed"
echo "  3. bash deploy/scripts/deployment.sh"
