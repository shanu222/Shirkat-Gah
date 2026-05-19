import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; status?: string; search?: string }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where = {
      ...(query.status && { status: query.status as never }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { code: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          manager: { select: { id: true, firstName: true, lastName: true } },
          province: { select: { name: true } },
          district: { select: { name: true } },
          donors: { include: { donor: { select: { name: true, code: true } } } },
          _count: { select: { indicators: true, activities: true, members: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        manager: { select: { id: true, firstName: true, lastName: true, email: true } },
        province: true,
        district: true,
        donors: { include: { donor: true } },
        grants: true,
        indicators: { orderBy: { code: 'asc' } },
        activities: { orderBy: { code: 'asc' } },
        milestones: { orderBy: { order: 'asc' } },
        budgets: true,
        members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async getDashboardStats(projectId?: string) {
    const where = projectId ? { id: projectId } : {};
    const projects = await this.prisma.project.findMany({
      where: { ...where, status: 'ACTIVE' },
      include: {
        indicators: true,
        milestones: true,
        budgets: true,
        activities: true,
      },
    });

    return projects.map((p) => ({
      id: p.id,
      code: p.code,
      title: p.title,
      progressPct: p.progressPct,
      riskLevel: p.riskLevel,
      status: p.status,
      indicators: p.indicators.map((i) => ({
        code: i.code,
        title: i.title,
        current: i.current,
        target: i.target,
        progress: i.target > 0 ? Math.round((i.current / i.target) * 100) : 0,
      })),
      milestones: p.milestones,
      budgetSummary: {
        allocated: p.budgets.reduce((s, b) => s + Number(b.allocated), 0),
        spent: p.budgets.reduce((s, b) => s + Number(b.spent), 0),
      },
      activityCount: p.activities.length,
    }));
  }
}
