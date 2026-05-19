import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/auth.decorators';
import { PrismaService } from '../../prisma/prisma.service';

const CRITICAL_TABLES = [
  'users',
  'accounts',
  'organizations',
  'projects',
  'roles',
  'permissions',
  'notifications',
  'reports',
  'donors',
  'files',
  'courses',
] as const;

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /** GET /api/health — version-neutral health probe */
  @Public()
  @Get()
  @Version(VERSION_NEUTRAL)
  @ApiOperation({ summary: 'Basic health check' })
  ping() {
    return { status: 'ok' };
  }

  /** GET /api/v1/health — detailed health with DB and schema checks */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Detailed health check with database status' })
  async check() {
    let dbStatus: 'ok' | 'error' = 'ok';
    let schemaStatus: 'ok' | 'degraded' | 'error' = 'ok';
    const missingTables: string[] = [];

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
      schemaStatus = 'error';
    }

    if (dbStatus === 'ok') {
      try {
        const rows = await this.prisma.$queryRaw<Array<{ table_name: string }>>`
          SELECT table_name::text AS table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
        `;
        const existing = new Set(rows.map((r) => r.table_name));
        for (const table of CRITICAL_TABLES) {
          if (!existing.has(table)) missingTables.push(table);
        }
        if (missingTables.length > 0) {
          schemaStatus = 'degraded';
        }
      } catch {
        schemaStatus = 'error';
      }
    }

    const status =
      dbStatus === 'error' || schemaStatus === 'error'
        ? 'error'
        : schemaStatus === 'degraded' || !this.prisma.isSchemaValid()
          ? 'degraded'
          : 'ok';

    return {
      status,
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        schema: schemaStatus,
      },
      ...(missingTables.length > 0 && {
        missingTables,
        hint: 'Run: bash deploy/scripts/reset-database.sh',
      }),
      version: process.env.npm_package_version ?? '1.0.0',
    };
  }
}
