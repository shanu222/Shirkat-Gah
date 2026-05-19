# Shirkat Gah — Production Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        VERCEL (Frontend)                        │
│  Next.js 15 · Edge Network · ISR/SSR · NextAuth · Middleware  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS (API Gateway / ALB)
┌────────────────────────────▼────────────────────────────────────┐
│                     AWS (Backend Services)                       │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────────┐ │
│  │ ECS Fargate  │  │ RDS Postgres│  │ ElastiCache Redis      │ │
│  │ NestJS API   │──│             │  │ BullMQ queues          │ │
│  └──────────────┘  └─────────────┘  └────────────────────────┘ │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────────┐ │
│  │ S3 + CF CDN  │  │ AWS SES     │  │ Secrets Manager        │ │
│  │ File storage │  │ Email       │  │ JWT, DB credentials    │ │
│  └──────────────┘  └─────────────┘  └────────────────────────┘ │
│  CloudWatch · WAF · Route53 · ACM · IAM                         │
└─────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- AWS Account with admin/IaC permissions
- Vercel account linked to GitHub repo
- Domain (optional): `app.shirkatgah.org`, `api.shirkatgah.org`
- GitHub repository: [shanu222/Shirkat-Gah](https://github.com/shanu222/Shirkat-Gah)

---

## 1. AWS Infrastructure (Terraform)

### Initial setup

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your AWS region, domain, etc.

terraform init
terraform plan
terraform apply
```

### What gets provisioned

| Resource | Purpose |
|----------|---------|
| VPC + subnets | Isolated network (public/private) |
| RDS PostgreSQL 16 | Primary database |
| ElastiCache Redis | Cache + BullMQ queues |
| S3 bucket | File uploads (MoV, documents) |
| CloudFront | CDN for S3 assets |
| ECR | Docker image registry for API |
| ECS Fargate | NestJS API containers |
| ALB | Load balancer + HTTPS termination |
| Secrets Manager | DB URL, JWT secrets |
| CloudWatch | Logs + alarms |
| IAM roles | ECS task execution + task roles |

### Post-apply outputs

After `terraform apply`, note:

- `api_url` — set as `NEXT_PUBLIC_API_URL` in Vercel
- `rds_endpoint` — used in `DATABASE_URL` (via Secrets Manager)
- `s3_bucket_name` — file storage
- `cloudfront_domain` — CDN URL for public assets
- `ecr_repository_url` — CI/CD pushes API images here

---

## 2. Database Migration & Seed

Run migrations against RDS (from a secure bastion or CI job):

```bash
export DATABASE_URL="postgresql://USER:PASS@RDS_ENDPOINT:5432/shirkat_gah?schema=public&sslmode=require"
pnpm db:generate
pnpm db:migrate
pnpm db:seed   # staging/dev only
```

---

## 3. Vercel Frontend Deployment

### Connect repository

1. Import [shanu222/Shirkat-Gah](https://github.com/shanu222/Shirkat-Gah) in Vercel
2. Set **Root Directory**: `apps/web`
3. Framework: Next.js (auto-detected)

### Required environment variables (Vercel)

| Variable | Example | Environment |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api.shirkatgah.org` | Production |
| `NEXTAUTH_URL` | `https://app.shirkatgah.org` | Production |
| `NEXTAUTH_SECRET` | *(32+ char random)* | Production |
| `NEXT_PUBLIC_APP_URL` | `https://app.shirkatgah.org` | Production |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | *(optional)* | All |
| `NEXT_PUBLIC_SENTRY_DSN` | *(optional)* | Production |
| `SENTRY_AUTH_TOKEN` | *(build only)* | Production |

### Preview / Staging

Use separate Vercel project or Preview env vars pointing to staging API.

---

## 4. AWS API Deployment (ECS)

GitHub Actions workflow `.github/workflows/deploy-aws.yml` runs on push to `main`:

1. Build Docker image
2. Push to ECR
3. Update ECS service
4. Run DB migrations (optional job)

Manual deploy:

```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.ap-south-1.amazonaws.com
docker build -f apps/api/Dockerfile -t shirkat-gah-api .
docker tag shirkat-gah-api:latest ACCOUNT.dkr.ecr.ap-south-1.amazonaws.com/shirkat-gah-api:latest
docker push ACCOUNT.dkr.ecr.ap-south-1.amazonaws.com/shirkat-gah-api:latest
aws ecs update-service --cluster shirkat-gah --service shirkat-gah-api --force-new-deployment
```

---

## 5. Environment Matrix

| | Development | Staging | Production |
|---|-------------|---------|------------|
| Frontend | localhost:3000 | Vercel Preview | Vercel Production |
| API | localhost:4000 | ECS staging | ECS production |
| Database | Docker Postgres | RDS staging | RDS production |
| Storage | MinIO | S3 staging | S3 + CloudFront |
| Email | MailHog | SES sandbox | SES production |

---

## 6. Security Checklist

- [ ] Rotate all secrets in AWS Secrets Manager
- [ ] Enable RDS encryption at rest
- [ ] Enable S3 bucket encryption + block public access
- [ ] Configure WAF on ALB (rate limiting, geo rules)
- [ ] Restrict RDS/Redis to private subnets
- [ ] Use ACM certificates for HTTPS
- [ ] Set `CORS_ORIGINS` to Vercel production URL only
- [ ] Enable CloudWatch alarms for API errors/latency
- [ ] Configure Sentry for frontend + backend

---

## 7. Monitoring

- **CloudWatch**: ECS logs at `/ecs/shirkat-gah-api`
- **Sentry**: Errors and performance (set `SENTRY_DSN`)
- **Health check**: `GET /api/v1/health`

---

## 8. Local Development (unchanged)

```bash
docker compose up -d postgres redis minio mailhog
pnpm install
pnpm db:push && pnpm db:seed
pnpm dev:api   # :4000
pnpm dev:web   # :3000
```

---

## Support

For infrastructure changes, edit `infra/terraform/` and run `terraform plan` before apply.
