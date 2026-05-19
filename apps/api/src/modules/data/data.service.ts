import { Injectable } from '@nestjs/common';
import { ApprovalStatus, DataEntryType, Prisma } from '@shirkat-gah/database';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  DataOverviewResponse,
  PaginatedResponse,
  DataEntryListItem,
} from '../../common/types';

export interface DataEntryQuery {
  page?: number;
  limit?: number;
  status?: string;
  projectId?: string;
}

@Injectable()
export class DataService {
  constructor(private readonly prisma: PrismaService) {}

  private mapEntry(row: {
    id: string;
    type: string;
    projectId: string | null;
    indicatorId: string | null;
    title: string;
    value: unknown;
    narrative: string | null;
    period: string | null;
    status: string;
    version: number;
    submittedBy: string;
    approvedBy: string | null;
    approvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    project: { title: string; code: string } | null;
    indicator: { title: string; code: string } | null;
    submitter: { firstName: string; lastName: string };
  }): DataEntryListItem {
    return {
      id: row.id,
      type: row.type,
      projectId: row.projectId,
      indicatorId: row.indicatorId,
      title: row.title,
      value: row.value,
      narrative: row.narrative,
      period: row.period,
      status: row.status,
      version: row.version,
      submittedBy: row.submittedBy,
      approvedBy: row.approvedBy,
      approvedAt: row.approvedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      project: row.project,
      indicator: row.indicator,
      submitter: row.submitter,
    };
  }

  async getOverview(): Promise<DataOverviewResponse> {
    const [entries, indicators, pending] = await Promise.all([
      this.prisma.dataEntry.count(),
      this.prisma.indicator.count(),
      this.prisma.dataEntry.count({ where: { status: ApprovalStatus.PENDING } }),
    ]);

    const recentRows = await this.prisma.dataEntry.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: {
        project: { select: { title: true, code: true } },
        indicator: { select: { title: true, code: true } },
        submitter: { select: { firstName: true, lastName: true } },
      },
    });

    const [quantitative, qualitative] = await Promise.all([
      this.prisma.dataEntry.count({ where: { type: DataEntryType.QUANTITATIVE } }),
      this.prisma.dataEntry.count({ where: { type: DataEntryType.QUALITATIVE } }),
    ]);

    const categories = [
      { name: 'Quantitative', count: quantitative },
      { name: 'Qualitative', count: qualitative },
      { name: 'Pending Approval', count: pending },
    ];

    return {
      stats: { totalEntries: entries, totalIndicators: indicators, pendingApproval: pending },
      categories,
      recentEntries: recentRows.map((r) => this.mapEntry(r)),
    };
  }

  async getEntries(query: DataEntryQuery): Promise<PaginatedResponse<DataEntryListItem>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where: Prisma.DataEntryWhereInput = {
      ...(query.status && { status: query.status as ApprovalStatus }),
      ...(query.projectId && { projectId: query.projectId }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.dataEntry.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          project: { select: { title: true, code: true } },
          indicator: { select: { title: true, code: true } },
          submitter: { select: { firstName: true, lastName: true } },
        },
      }),
      this.prisma.dataEntry.count({ where }),
    ]);

    const data = rows.map((r) => this.mapEntry(r));
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
