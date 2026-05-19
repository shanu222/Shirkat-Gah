# GitHub Actions Secrets Required

## AWS Deployment (deploy-aws.yml)
| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user with ECR + ECS deploy permissions |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `DATABASE_URL` | RDS connection string for migrations |

## Vercel Deployment (deploy-vercel.yml)
| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel account token |
| `VERCEL_ORG_ID` | Vercel team/org ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `NEXT_PUBLIC_API_URL` | Production API URL |
| `NEXTAUTH_SECRET` | NextAuth secret (32+ chars) |
| `NEXTAUTH_URL` | Production frontend URL |
| `NEXT_PUBLIC_APP_URL` | Production frontend URL |

## Optional
| Secret | Description |
|--------|-------------|
| `SENTRY_AUTH_TOKEN` | Sentry release tracking |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN |
