import { Injectable } from '@nestjs/common';
import { Prisma, UserStatus } from '@shirkat-gah/database';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  AdminOverviewResponse,
  PaginatedResponse,
  UserListItem,
} from '../../common/types';

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<AdminOverviewResponse> {
    const [users, roles, auditLogs, settings, activeUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.role.findMany({ include: { _count: { select: { users: true } } } }),
      this.prisma.auditLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      this.prisma.platformSetting.findMany(),
      this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
    ]);

    return {
      stats: {
        totalUsers: users,
        activeUsers,
        totalRoles: roles.length,
      },
      roles: roles.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        userCount: r._count.users,
      })),
      recentAuditLogs: auditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        createdAt: log.createdAt,
        user: log.user,
      })),
      settings: settings.map((s) => ({
        id: s.id,
        key: s.key,
        value: s.value,
        category: s.category,
      })),
    };
  }

  async getUsers(query: UserQuery): Promise<PaginatedResponse<UserListItem>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);

    const where: Prisma.UserWhereInput = query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: 'insensitive' } },
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
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

    const data: UserListItem[] = rows.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      status: u.status,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      roles: u.roles,
    }));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
