import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DataService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [entries, indicators, pending] = await Promise.all([
      this.prisma.dataEntry.count(),
      this.prisma.indicator.count(),
      this.prisma.dataEntry.count({ where: { status: 'PENDING' } }),
    ]);

    const recentEntries = await this.prisma.dataEntry.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: {
        project: { select: { title: true, code: true } },
        indicator: { select: { title: true, code: true } },
        submitter: { select: { firstName: true, lastName: true } },
      },
    });

    const categories = [
      { name: 'Quantitative', count: await this.prisma.dataEntry.count({ where: { type: 'QUANTITATIVE' } }) },
      { name: 'Qualitative', count: await this.prisma.dataEntry.count({ where: { type: 'QUALITATIVE' } }) },
      { name: 'Pending Approval', count: pending },
    ];

    return { stats: { totalEntries: entries, totalIndicators: indicators, pendingApproval: pending }, categories, recentEntries };
  }

  async getEntries(query: { page?: number; limit?: number; status?: string; projectId?: string }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where = {
      ...(query.status && { status: query.status as never }),
      ...(query.projectId && { projectId: query.projectId }),
    };

    const [data, total] = await Promise.all([
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

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
