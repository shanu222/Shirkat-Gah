import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProjectStatus } from '@shirkat-gah/database';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  PaginatedResponse,
  ProjectListItem,
  ProjectDashboardItem,
  ProjectDetailResponse,
} from '../../common/types';

export interface ProjectQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProjectQuery): Promise<PaginatedResponse<ProjectListItem>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      ...(query.status && { status: query.status as ProjectStatus }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { code: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [rows, total] = await Promise.all([
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

    const data: ProjectListItem[] = rows.map((p) => ({
      id: p.id,
      code: p.code,
      title: p.title,
      status: p.status,
      progressPct: p.progressPct,
      manager: p.manager,
      province: p.province,
      district: p.district,
      _count: p._count,
    }));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<ProjectDetailResponse> {
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
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });
    if (!project) throw new NotFoundException('Project not found');

    return {
      id: project.id,
      code: project.code,
      title: project.title,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      progressPct: project.progressPct,
      riskLevel: project.riskLevel,
      totalBudget: project.totalBudget,
      currency: project.currency,
      managerId: project.managerId,
      provinceId: project.provinceId,
      districtId: project.districtId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      manager: project.manager,
      province: project.province,
      district: project.district,
      donors: project.donors.map((d) => ({
        projectId: d.projectId,
        donorId: d.donorId,
        amount: d.amount,
        donor: { id: d.donor.id, name: d.donor.name, code: d.donor.code },
      })),
      grants: project.grants.map((g) => ({
        id: g.id,
        code: g.code,
        title: g.title,
        amount: g.amount,
        currency: g.currency,
      })),
      indicators: project.indicators.map((i) => ({
        id: i.id,
        code: i.code,
        title: i.title,
        current: i.current,
        target: i.target,
      })),
      activities: project.activities.map((a) => ({
        id: a.id,
        code: a.code,
        title: a.title,
        status: a.status,
      })),
      milestones: project.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        dueDate: m.dueDate,
        status: m.status,
        order: m.order,
      })),
      budgets: project.budgets.map((b) => ({
        id: b.id,
        category: b.category,
        allocated: b.allocated,
        spent: b.spent,
      })),
      members: project.members.map((m) => ({
        projectId: m.projectId,
        userId: m.userId,
        role: m.role,
        joinedAt: m.joinedAt,
        user: m.user,
      })),
    };
  }

  async getDashboardStats(projectId?: string): Promise<ProjectDashboardItem[]> {
    const where: Prisma.ProjectWhereInput = {
      status: ProjectStatus.ACTIVE,
      ...(projectId && { id: projectId }),
    };

    const projects = await this.prisma.project.findMany({
      where,
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
      milestones: p.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        dueDate: m.dueDate,
        status: m.status,
        order: m.order,
      })),
      budgetSummary: {
        allocated: p.budgets.reduce((sum: number, b) => sum + Number(b.allocated), 0),
        spent: p.budgets.reduce((sum: number, b) => sum + Number(b.spent), 0),
      },
      activityCount: p.activities.length,
    }));
  }
}
