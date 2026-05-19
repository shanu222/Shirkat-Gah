import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/auth.decorators';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check for ALB/ECS' })
  async check() {
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    const status = dbStatus === 'ok' ? 'healthy' : 'degraded';
    return {
      status,
      timestamp: new Date().toISOString(),
      services: { database: dbStatus },
      version: process.env.npm_package_version ?? '1.0.0',
    };
  }
}
