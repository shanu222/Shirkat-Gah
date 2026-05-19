# Vercel + EC2 Proxy Deployment (No Custom Domain)

Temporary production setup using Vercel HTTPS frontend and EC2 HTTP backend.

## Root Cause — Mixed Content

| Layer | URL | Protocol |
|-------|-----|----------|
| Frontend | `https://shirkat-gah-web.vercel.app` | HTTPS |
| Backend | `http://13.233.16.121:4000` | HTTP |

Browsers **block** HTTPS pages from calling HTTP APIs (Mixed Content). This caused login failures and 401 errors.

## Solution — Vercel Proxy Rewrites

All API paths are versioned on the backend as `/api/v1/*`. The proxy injects that prefix:

```
Browser (HTTPS)
  → /api/backend/auth/login  (same-origin, secure)
    → Vercel rewrite: /api/backend/:path* → EC2/api/v1/:path*
      → http://13.233.16.121:4000/api/v1/auth/login
```

NextAuth runs **server-side** and calls EC2 directly via `BACKEND_URL/api/v1/*`. If direct fetch fails, it retries via the same-origin proxy URL.

URL resolution is centralized in `apps/web/src/lib/api-config.ts`.

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

**Important:**

- `BACKEND_URL` must NOT use `NEXT_PUBLIC_` prefix.
- `BACKEND_URL` must be set at **build time** — rewrites are baked into the Next.js config during deploy.
- Do not append `/api/v1` to `BACKEND_URL`; the rewrite and server helpers add it.

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
bash deploy/scripts/deployment.sh
curl http://13.233.16.121:4000/api/v1/health
curl -X POST http://13.233.16.121:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@shirkatgah.org","password":"Admin@123456"}'
```

### 2. Vercel (frontend)

1. Push code to GitHub
2. Set environment variables (table above)
3. Redeploy (Root Directory: `apps/web`)
4. Test login at `https://shirkat-gah-web.vercel.app/auth/login`

### 3. Verify proxy

```bash
curl https://shirkat-gah-web.vercel.app/api/backend/health
curl https://shirkat-gah-web.vercel.app/api/backend/dashboard/public
```

## Local Development

Copy `apps/web/.env.local.example` to `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
BACKEND_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-nextauth-secret-change-in-production
```

To test the Vercel proxy pattern locally:

```bash
NEXT_PUBLIC_API_URL=/api/backend
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
