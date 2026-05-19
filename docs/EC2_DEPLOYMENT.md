# EC2 + PM2 + Nginx Production Deployment

Target: **AWS EC2 Amazon Linux 2023** · API: **api.shirkatgah.org** · Frontend: **Vercel**

## Root Cause (Runtime Crash)

The API built successfully but crashed under PM2 because `@shirkat-gah/database` pointed `main` at `./src/index.ts`. Node.js executed raw TypeScript at runtime (`globalThis as unknown as`, `export` syntax), which only works under `ts-node`/Nest watch — not in production.

**Fix:** compile internal packages to `dist/*.js` and point `main`/`exports` at compiled output. Turbo build order: `database → shared → api → web`.

## Architecture

```
Vercel (Next.js)  ──HTTPS──▶  Nginx (EC2)  ──▶  PM2 Cluster (NestJS :3001)
                                      │
                    RDS PostgreSQL · Redis · S3
```

## Build (required before PM2)

```bash
pnpm install
pnpm db:generate
pnpm build   # compiles database + shared + api + web
```

Verify artifacts:

```bash
test -f packages/database/dist/index.js
test -f packages/shared/dist/index.js
test -f apps/api/dist/main.js
```

## First-Time Server Setup

```bash
git clone https://github.com/shanu222/Shirkat-Gah.git /opt/shirkat-gah
cd /opt/shirkat-gah
bash deploy/scripts/setup-server.sh
```

## Configure Environment

```bash
cp .env.production.example .env.production
nano .env.production   # DATABASE_URL, JWT secrets, S3, CORS
ln -sf .env.production .env
```

## Deploy

```bash
bash deploy/scripts/deployment.sh
```

## PM2 Commands

```bash
pm2 start ecosystem.config.js --env production
pm2 status
pm2 logs shirkat-gah-api
pm2 restart shirkat-gah-api
bash deploy/scripts/start.sh
```

PM2 runs from **repo root** with script `apps/api/dist/main.js`.

## Health Checks

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Load balancer probe (no DB) |
| `GET /api/health` | Version-neutral API probe |
| `GET /api/v1/health` | Full check incl. database |

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/v1/health
```

## Prisma

```bash
pnpm db:generate
pnpm db:migrate:deploy
pnpm db:seed   # optional demo data
```

## Nginx + SSL

```bash
sudo cp deploy/nginx/api.shirkatgah.org.conf /etc/nginx/conf.d/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.shirkatgah.org
```

## Vercel Frontend

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.shirkatgah.org` |
| `NEXTAUTH_URL` | `https://app.shirkatgah.org` |
| `NEXTAUTH_SECRET` | 64-char secret |

## Docker Alternative

```bash
docker compose up -d postgres redis
docker compose up -d api
```
