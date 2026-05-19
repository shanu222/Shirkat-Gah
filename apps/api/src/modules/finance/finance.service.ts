import { Injectable } from '@nestjs/common';
import { ExpenseStatus, Prisma } from '@shirkat-gah/database';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  FinanceOverviewResponse,
  PaginatedResponse,
  ExpenseListItem,
} from '../../common/types';

export interface ExpenseQuery {
  page?: number;
  limit?: number;
  status?: string;
  projectId?: string;
}

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<FinanceOverviewResponse> {
    const [budgets, expenses, donors, grants] = await Promise.all([
      this.prisma.budget.findMany({
        include: { project: { select: { title: true, code: true } } },
      }),
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
        include: {
          donor: { select: { name: true, code: true } },
          project: { select: { title: true } },
        },
      }),
    ]);

    const totalAllocated = budgets.reduce(
      (sum: number, b) => sum + Number(b.allocated),
      0,
    );
    const totalSpent = budgets.reduce((sum: number, b) => sum + Number(b.spent), 0);
    const utilization =
      totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

    const byCategoryMap = budgets.reduce<Record<string, number>>((acc, b) => {
      acc[b.category] = (acc[b.category] ?? 0) + Number(b.spent);
      return acc;
    }, {});

    const recentExpenses: ExpenseListItem[] = expenses.map((e) => ({
      id: e.id,
      projectId: e.projectId,
      title: e.title,
      description: e.description,
      amount: e.amount,
      currency: e.currency,
      category: e.category,
      status: e.status,
      createdAt: e.createdAt,
      project: e.project,
      creator: e.creator,
      approver: null,
    }));

    return {
      summary: {
        totalAllocated,
        totalSpent,
        remaining: totalAllocated - totalSpent,
        utilization,
        pendingExpenses: expenses.filter((e) => e.status === ExpenseStatus.SUBMITTED)
          .length,
      },
      byCategory: Object.entries(byCategoryMap).map(([category, amount]) => ({
        category,
        amount,
      })),
      recentExpenses,
      donors: donors.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
        grants: d._count.grants,
        projects: d._count.projects,
      })),
      grants: grants.map((g) => ({
        id: g.id,
        code: g.code,
        title: g.title,
        amount: g.amount,
        currency: g.currency,
        donor: g.donor,
        project: g.project,
      })),
    };
  }

  async getExpenses(
    query: ExpenseQuery,
  ): Promise<PaginatedResponse<ExpenseListItem>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);

    const where: Prisma.ExpenseWhereInput = {
      ...(query.status && {
        status: query.status as ExpenseStatus,
      }),
      ...(query.projectId && { projectId: query.projectId }),
    };

    const [rows, total] = await Promise.all([
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

    const data: ExpenseListItem[] = rows.map((e) => ({
      id: e.id,
      projectId: e.projectId,
      title: e.title,
      description: e.description,
      amount: e.amount,
      currency: e.currency,
      category: e.category,
      status: e.status,
      createdAt: e.createdAt,
      project: e.project,
      creator: e.creator,
      approver: e.approver,
    }));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
