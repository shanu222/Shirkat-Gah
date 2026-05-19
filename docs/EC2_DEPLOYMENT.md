# EC2 + PM2 + Nginx Production Deployment

Target: **AWS EC2 Amazon Linux 2023** · API domain: **api.shirkatgah.org** · Frontend: **Vercel**

## Architecture

```
Vercel (Next.js)  ──HTTPS──▶  Nginx (EC2)  ──▶  PM2 Cluster (NestJS :3001)
                                      │
                    RDS PostgreSQL · Redis · S3
```

## First-Time Server Setup

```bash
# On EC2 as root/sudo
git clone https://github.com/shanu222/Shirkat-Gah.git /opt/shirkat-gah
cd /opt/shirkat-gah
bash deploy/scripts/setup-server.sh
```

## Configure Environment

```bash
cp .env.production.example .env.production
# Edit with RDS URL, JWT secrets, S3 bucket, CORS (Vercel URL)
nano .env.production
ln -sf .env.production .env
```

## Deploy

```bash
bash deploy/scripts/deployment.sh
```

This runs: `pnpm install` → `prisma generate` → `migrate deploy` → `pnpm build` → `pm2 start`

## PM2 Commands

```bash
pm2 status
pm2 logs shirkat-gah-api
pm2 restart shirkat-gah-api
bash deploy/scripts/start.sh   # quick restart
```

## Nginx

Config: `deploy/nginx/api.shirkatgah.org.conf`

```bash
sudo cp deploy/nginx/api.shirkatgah.org.conf /etc/nginx/conf.d/
sudo nginx -t && sudo systemctl reload nginx
```

Point DNS `api.shirkatgah.org` → EC2 elastic IP.

## SSL (Let's Encrypt)

```bash
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.shirkatgah.org
```

## Health Check

```bash
curl https://api.shirkatgah.org/api/v1/health
```

## Vercel Frontend

Set in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.shirkatgah.org` |
| `NEXTAUTH_URL` | `https://app.shirkatgah.org` |
| `NEXTAUTH_SECRET` | *(64 char secret)* |

## Docker Alternative

```bash
docker compose --profile production up -d
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails TS errors | Run `pnpm build` locally first; ensure Node 20+ |
| PM2 crash loop | Check `pm2 logs`, verify `DATABASE_URL` |
| 502 from Nginx | Confirm API on `:3001`, `curl localhost:3001/api/v1/health` |
| CORS errors | Set `CORS_ORIGINS` to exact Vercel URL |
