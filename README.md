# Shirkat Gah Digital Platform

Enterprise-grade integrated digital platform for **Shirkat Gah — Women's Resource Centre**. A unified ecosystem for impact measurement, learning management, financial governance, public transparency, and organizational administration.

## Architecture

```
shirkat-gah-platform/
├── apps/
│   ├── web/          # Next.js 15 (App Router) — Frontend
│   └── api/          # NestJS — REST API with Swagger
├── packages/
│   ├── database/     # Prisma ORM + PostgreSQL schema
│   └── shared/       # Shared types, constants, RBAC definitions
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion, TanStack Query, Zustand, React Hook Form + Zod, Recharts, Leaflet |
| Backend | NestJS, JWT Auth, RBAC, BullMQ, Redis caching |
| Database | PostgreSQL, Prisma ORM |
| Storage | S3-compatible (MinIO locally) |
| Auth | NextAuth.js + JWT, OAuth-ready |
| DevOps | Docker Compose, GitHub Actions, ESLint, Prettier, Husky |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (for infrastructure)

### 1. Clone and install

```bash
pnpm install
cp .env.example .env
```

### 2. Start infrastructure

```bash
docker compose up -d postgres redis minio mailhog
```

### 3. Setup database

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 4. Run development servers

```bash
# Terminal 1 — API (port 4000)
pnpm dev:api

# Terminal 2 — Web (port 3000)
pnpm dev:web
```

Or run both with Turbo:

```bash
pnpm dev
```

### 5. Access the platform

| Service | URL |
|---------|-----|
| Web App | http://localhost:3000 |
| API | http://localhost:4000/api/v1 |
| Swagger Docs | http://localhost:4000/api/docs |
| MinIO Console | http://localhost:9001 |
| MailHog | http://localhost:8025 |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@shirkatgah.org | Admin@123456 |
| Project Manager | pm@shirkatgah.org | Demo@123456 |
| Finance Officer | finance@shirkatgah.org | Demo@123456 |
| Learner | learner@shirkatgah.org | Demo@123456 |

## Platform Modules

- **Leadership Dashboard** — Organization-wide KPIs, trends, project health, geographic analytics
- **Project Dashboard** — Milestone tracking, indicator progress, budget utilization
- **Public Dashboard** — SDG alignment, impact statistics, Pakistan GIS map
- **Data Management** — Quantitative/qualitative entries, approval workflows, version history
- **Finance Management** — Budgets, expenses, donor tracking, grant utilization
- **LMS** — Courses, enrollment, quizzes, certificates, progress tracking
- **Reports Engine** — Dynamic reports, templates, scheduled exports
- **CMS** — Homepage, publications, events, team management
- **Admin Panel** — Users, roles, permissions, audit logs, platform settings
- **File Repository** — S3 uploads, versioning, MoV tagging, secure downloads

## User Roles (RBAC)

Super Admin · Admin · Project Manager · Finance Officer · Data Entry Operator · Monitoring Officer · Trainer · Learner · Public User · Donor Viewer

## Production Deployment (Vercel + AWS)

Full guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) · GitHub secrets: [docs/GITHUB_SECRETS.md](docs/GITHUB_SECRETS.md)

| Component | Platform |
|-----------|----------|
| Frontend | **Vercel** (Edge Network, ISR, middleware) |
| API | **AWS ECS Fargate** + ALB |
| Database | **AWS RDS PostgreSQL 16** |
| Cache/Queues | **AWS ElastiCache Redis** + BullMQ |
| Files | **AWS S3** + **CloudFront CDN** |
| Email | **AWS SES** |
| IaC | **Terraform** in `infra/terraform/` |

### Quick deploy

**Vercel:** Import repo → root `apps/web` → set env from `apps/web/.env.production.example`

**AWS:**
```bash
cd infra/terraform && cp terraform.tfvars.example terraform.tfvars
terraform init && terraform apply
```

CI/CD: `.github/workflows/deploy-vercel.yml` + `.github/workflows/deploy-aws.yml`

### Local Docker (development)

```bash
docker compose up -d
```

---

Interactive Swagger documentation available at `/api/docs` when the API server is running.

## License

Proprietary — Shirkat Gah Women's Resource Centre
