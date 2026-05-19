/**
 * Verifies critical PostgreSQL tables exist and optional admin seed user.
 * Exit code 1 if schema is incomplete (run reset-database.sh on EC2).
 */
import { PrismaClient } from '@prisma/client';

const CRITICAL_TABLES = [
  'users',
  'accounts',
  'sessions',
  'roles',
  'permissions',
  'user_roles',
  'role_permissions',
  'organizations',
  'projects',
  'donors',
  'notifications',
  'reports',
  'files',
  'courses',
  'platform_settings',
] as const;

async function main(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    const rows = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name::text AS table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    const existing = new Set(rows.map((r) => r.table_name));
    const missing = CRITICAL_TABLES.filter((t) => !existing.has(t));

    console.log(`Database: ${process.env.DATABASE_URL?.replace(/:[^:@/]+@/, ':***@') ?? '(DATABASE_URL not set)'}`);
    console.log(`Tables found: ${existing.size}`);

    if (missing.length > 0) {
      console.error('\n❌ Missing critical tables:');
      missing.forEach((t) => console.error(`   - ${t}`));
      console.error('\nExisting public tables:');
      [...existing].sort().forEach((t) => console.error(`   - ${t}`));
      console.error('\nFix: bash deploy/scripts/reset-database.sh');
      process.exit(1);
    }

    console.log('✅ All critical tables present');

    const admin = await prisma.user.findUnique({
      where: { email: 'admin@shirkatgah.org' },
      select: { id: true, email: true, status: true },
    });

    if (!admin) {
      console.warn('⚠️  Admin user missing — run: pnpm db:seed');
      process.exit(2);
    }

    console.log(`✅ Admin user: ${admin.email} (${admin.status})`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Schema verification failed:', error);
  process.exit(1);
});
