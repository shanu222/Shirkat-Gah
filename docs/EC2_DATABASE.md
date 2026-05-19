# EC2 PostgreSQL Database Setup

This guide fixes PostgreSQL authentication, Prisma schema drift, and the missing `users` table on AWS EC2.

## Root Causes (Summary)

| Issue | Cause |
|-------|--------|
| `users` table missing | Partial `db push` / manual SQL left orphan tables (`accounts`, `sessions`) without full schema |
| `db push` says "in sync" | Wrong database name (`shirkatgah` vs `shirkat_gah`) or `_prisma_migrations` out of sync with actual tables |
| Login 500 | `prisma.user.findUnique()` hits non-existent `users` table → `P2021` |
| `psql` asks for password | `pg_hba.conf` changed to `scram-sha-256`/`md5` for local connections |
| No admin user | Seed never ran after incomplete schema |

## Quick Fix (EC2)

Run from repository root on the EC2 instance:

```bash
# 1. Fix PostgreSQL local auth + create database
sudo bash deploy/scripts/setup-postgres.sh

# 2. Update .env.production
# DATABASE_URL=postgresql://postgres@localhost:5432/shirkat_gah?schema=public

# 3. Drop drifted DB, migrate, seed
bash deploy/scripts/reset-database.sh --yes

# 4. Full deploy + verify login
bash deploy/scripts/deployment.sh

# 5. End-to-end verification
bash deploy/scripts/verify-database.sh
```

## Correct DATABASE_URL

```env
# Local trust auth (recommended — API and Postgres on same EC2)
DATABASE_URL=postgresql://postgres@localhost:5432/shirkat_gah?schema=public
```

**Do not use:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/shirkatgah
```

Problems with the wrong URL:
- Database name `shirkatgah` (no underscore) may point to a stale/partial database
- Password auth fails when `pg_hba.conf` uses `trust` for localhost or password was never set

## pg_hba.conf (After setup-postgres.sh)

```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    all             all             0.0.0.0/0               scram-sha-256
host    all             all             ::/0                    scram-sha-256
```

- **Localhost / Unix socket:** `trust` — no password for same-host API
- **External IP:** `scram-sha-256` — password required (security preserved)

Backup is created at `pg_hba.conf.bak.<timestamp>` before changes.

## Prisma Migrations

The repo now includes an initial migration:

```
packages/database/prisma/migrations/20250519000000_init/migration.sql
```

Commands:

```bash
pnpm db:generate        # Regenerate Prisma client
pnpm db:migrate:deploy  # Apply migrations (production)
pnpm db:seed            # Seed admin + roles + permissions
pnpm db:verify          # Verify critical tables + admin user
pnpm db:reset           # prisma migrate reset (dev only)
```

## Admin Credentials (After Seed)

| Field | Value |
|-------|-------|
| Email | `admin@shirkatgah.org` |
| Password | `Admin@123456` |

## Verification Commands

```bash
# PostgreSQL
sudo -u postgres psql -c "SELECT 1;"
sudo -u postgres psql -d shirkat_gah -c "\dt users"

# Schema
pnpm db:verify

# API health (includes schema check)
curl http://127.0.0.1:3001/api/v1/health

# Login
curl -X POST http://127.0.0.1:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shirkatgah.org","password":"Admin@123456"}'

# Vercel proxy (from anywhere)
curl -X POST https://shirkat-gah-web.vercel.app/api/backend/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shirkatgah.org","password":"Admin@123456"}'
```

## Critical Tables

After a successful reset, these must exist:

- `users`, `accounts`, `sessions`, `roles`, `permissions`
- `organizations`, `projects`, `donors`
- `notifications`, `reports`, `files`, `courses`

Health endpoint reports `missingTables` when schema is degraded.

## Troubleshooting

### migrate deploy says "already applied" but users missing

Schema drift — `_prisma_migrations` records exist but tables were dropped manually or wrong DB was used:

```bash
bash deploy/scripts/reset-database.sh --yes
```

### Login returns 503 instead of 500

Expected after hardening — schema incomplete. Run reset script.

### PM2 crash loop after deploy

Check logs: `pm2 logs shirkat-gah-api --lines 100`

Common fix: `JWT_SECRET` and `JWT_REFRESH_SECRET` must be set in `.env.production`.

### Husky fails on EC2

Deployment sets `HUSKY=0` automatically. Manual install: `HUSKY=0 pnpm install`.
