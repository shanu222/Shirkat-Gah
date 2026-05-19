import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/auth.decorators';
import { PrismaService } from '../../prisma/prisma.service';

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

  /** GET /api/v1/health — detailed health with DB check */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Detailed health check with database status' })
  async check() {
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    const status = dbStatus === 'ok' ? 'ok' : 'degraded';
    return {
      status,
      timestamp: new Date().toISOString(),
      services: { database: dbStatus },
      version: process.env.npm_package_version ?? '1.0.0',
    };
  }
}
