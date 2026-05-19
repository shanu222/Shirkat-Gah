import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [budgets, expenses, donors, grants] = await Promise.all([
      this.prisma.budget.findMany({ include: { project: { select: { title: true, code: true } } } }),
      this.prisma.expense.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          project: { select: { title: true, code: true } },
          creator: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.donor.findMany({
        where: { isActive: true },
        include: { _count: { select: { grants: true, projects: true } } },
      }),
      this.prisma.grant.findMany({
        include: { donor: { select: { name: true, code: true } }, project: { select: { title: true } } },
      }),
    ]);

    const totalAllocated = budgets.reduce((s, b) => s + Number(b.allocated), 0);
    const totalSpent = budgets.reduce((s, b) => s + Number(b.spent), 0);
    const utilization = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

    const byCategory = budgets.reduce(
      (acc, b) => {
        acc[b.category] = (acc[b.category] ?? 0) + Number(b.spent);
        return acc;
      },
      {} as Record<string, number>,
    );

    const donorSummary = donors.map((d) => ({
      id: d.id,
      name: d.name,
      code: d.code,
      grants: d._count.grants,
      projects: d._count.projects,
    }));

    return {
      summary: {
        totalAllocated,
        totalSpent,
        remaining: totalAllocated - totalSpent,
        utilization,
        pendingExpenses: expenses.filter((e) => e.status === 'SUBMITTED').length,
      },
      byCategory: Object.entries(byCategory).map(([category, amount]) => ({ category, amount })),
      recentExpenses: expenses,
      donors: donorSummary,
      grants,
    };
  }

  async getExpenses(query: { page?: number; limit?: number; status?: string; projectId?: string }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where = {
      ...(query.status && { status: query.status as never }),
      ...(query.projectId && { projectId: query.projectId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          project: { select: { title: true, code: true } },
          creator: { select: { firstName: true, lastName: true } },
          approver: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.expense.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
