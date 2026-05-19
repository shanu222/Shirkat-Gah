import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [users, roles, auditLogs, settings] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.role.findMany({ include: { _count: { select: { users: true } } } }),
      this.prisma.auditLog.findMany({ take: 20, orderBy: { createdAt: 'desc' }, include: { user: { select: { firstName: true, lastName: true, email: true } } } }),
      this.prisma.platformSetting.findMany(),
    ]);

    return {
      stats: {
        totalUsers: users,
        activeUsers: await this.prisma.user.count({ where: { status: 'ACTIVE' } }),
        totalRoles: roles.length,
      },
      roles: roles.map((r) => ({ ...r, userCount: r._count.users })),
      recentAuditLogs: auditLogs,
      settings,
    };
  }

  async getUsers(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where = query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: 'insensitive' as const } },
            { firstName: { contains: query.search, mode: 'insensitive' as const } },
            { lastName: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          roles: { include: { role: { select: { name: true, slug: true } } } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
