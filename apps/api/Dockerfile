# =============================================================================
# Shirkat Gah API — Production Multi-Stage Dockerfile
# =============================================================================
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# ─── Dependencies ────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile || pnpm install

# ─── Builder ─────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .

ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"
RUN pnpm db:generate
RUN pnpm --filter @shirkat-gah/shared build
RUN pnpm --filter @shirkat-gah/api build

# ─── Production runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV API_PORT=3001

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    mkdir -p /app/logs && chown -R nestjs:nodejs /app

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./package.json
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/node_modules/@prisma ./node_modules/@prisma

USER nestjs
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/v1/health || exit 1

CMD ["node", "dist/main.js"]
