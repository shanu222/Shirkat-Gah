import { PrismaClient } from '@prisma/client';

/** Production-safe Prisma singleton (compiled to plain JS for Node runtime) */
const globalForPrisma = globalThis as typeof globalThis & {
  __shirkatGahPrisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error', 'warn'],
  });
}

export const prisma: PrismaClient = globalForPrisma.__shirkatGahPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__shirkatGahPrisma = prisma;
}

export { prisma as db };
export * from '@prisma/client';
