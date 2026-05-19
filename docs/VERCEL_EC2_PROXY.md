# Vercel + EC2 Proxy Deployment (No Custom Domain)

Temporary production setup using Vercel HTTPS frontend and EC2 HTTP backend.

## Root Cause — Mixed Content

| Layer | URL | Protocol |
|-------|-----|----------|
| Frontend | `https://shirkat-gah-web.vercel.app` | HTTPS |
| Backend | `http://13.233.16.121:4000` | HTTP |

Browsers **block** HTTPS pages from calling HTTP APIs (Mixed Content). This caused login failures and 401 errors.

## Solution — Vercel Proxy Rewrites

```
Browser (HTTPS)
  → /api/backend/api/v1/*  (same-origin, secure)
    → Vercel server rewrite
      → http://13.233.16.121:4000/api/v1/*  (server-to-server, allowed)
```

NextAuth runs **server-side** and calls EC2 directly via `BACKEND_URL` (no browser involved).

## Vercel Environment Variables

Set in **Vercel Dashboard → Settings → Environment Variables** (Production + Preview):

| Variable | Value | Exposed to browser? |
|----------|-------|---------------------|
| `NEXT_PUBLIC_API_URL` | `/api/backend` | Yes |
| `BACKEND_URL` | `http://13.233.16.121:4000` | No (server only) |
| `NEXTAUTH_URL` | `https://shirkat-gah-web.vercel.app` | No |
| `NEXTAUTH_SECRET` | *(64+ char random string)* | No |
| `NEXT_PUBLIC_APP_URL` | `https://shirkat-gah-web.vercel.app` | Yes |
| `AUTH_DEBUG` | `true` *(temporary, for Vercel logs)* | No |

**Important:** `BACKEND_URL` must NOT use `NEXT_PUBLIC_` prefix.

## EC2 Backend Environment

In `.env.production` on EC2:

```bash
CORS_ORIGINS=https://shirkat-gah-web.vercel.app
NEXT_PUBLIC_APP_URL=https://shirkat-gah-web.vercel.app
API_HOST=0.0.0.0
API_PORT=4000
```

Ensure EC2 security group allows inbound **4000** from Vercel (or `0.0.0.0/0` temporarily).

Ensure database is seeded:

```bash
pnpm db:seed
# Demo: admin@shirkatgah.org / Admin@123456
```

## Deploy Steps

### 1. EC2 (backend)

```bash
cd /opt/shirkat-gah
# Update .env.production with CORS_ORIGINS
bash deploy/scripts/deployment.sh
curl http://13.233.16.121:4000/health
curl -X POST http://13.233.16.121:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shirkatgah.org","password":"Admin@123456"}'
```

### 2. Vercel (frontend)

1. Push code to GitHub
2. Set environment variables (table above)
3. Redeploy (Build Command: auto, Root Directory: `apps/web`)
4. Test login at `https://shirkat-gah-web.vercel.app/auth/login`

### 3. Verify proxy

```bash
curl https://shirkat-gah-web.vercel.app/api/backend/health
curl https://shirkat-gah-web.vercel.app/api/backend/api/v1/dashboard/public
```

## Local Development

Copy `apps/web/.env.local.example` to `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
BACKEND_URL=http://localhost:4000
```

## When You Add a Domain + SSL

1. Point `api.yourdomain.org` to EC2 + Nginx + Let's Encrypt
2. Set `NEXT_PUBLIC_API_URL=https://api.yourdomain.org`
3. Remove proxy rewrites (or keep as fallback)
4. Update `CORS_ORIGINS` and `NEXTAUTH_URL`

## Demo Credentials

| Email | Password |
|-------|----------|
| `admin@shirkatgah.org` | `Admin@123456` |
