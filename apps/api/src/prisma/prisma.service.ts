import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@shirkat-gah/database';

const CRITICAL_TABLES = [
  'users',
  'roles',
  'permissions',
  'organizations',
  'accounts',
  'sessions',
] as const;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private schemaValid = false;

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'production'
          ? [{ emit: 'event', level: 'error' }, { emit: 'event', level: 'warn' }]
          : [{ emit: 'stdout', level: 'query' }, { emit: 'stdout', level: 'error' }],
    });
  }

  isSchemaValid(): boolean {
    return this.schemaValid;
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connected');
    await this.validateCriticalTables();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  private async validateCriticalTables(): Promise<void> {
    try {
      const rows = await this.$queryRaw<Array<{ table_name: string }>>`
        SELECT table_name::text AS table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
      `;

      const existing = new Set(rows.map((r) => r.table_name));
      const missing = CRITICAL_TABLES.filter((t) => !existing.has(t));

      if (missing.length > 0) {
        this.schemaValid = false;
        this.logger.error(
          `Database schema incomplete — missing tables: ${missing.join(', ')}. ` +
            'Run: bash deploy/scripts/reset-database.sh',
        );
        return;
      }

      this.schemaValid = true;
      this.logger.log('Database schema validated (critical tables present)');
    } catch (error) {
      this.schemaValid = false;
      this.logger.error(
        'Failed to validate database schema',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
