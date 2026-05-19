import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { ReportsOverviewResponse } from '../../common/types';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(): Promise<ReportsOverviewResponse> {
    const [reports, templates] = await Promise.all([
      this.prisma.report.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.reportTemplate.findMany({ where: { isPublic: true } }),
    ]);

    const categories = [
      {
        name: 'Impact Reports',
        count: reports.filter((r) => r.type === 'impact').length,
      },
      {
        name: 'Financial Reports',
        count: reports.filter((r) => r.type === 'financial').length,
      },
      {
        name: 'M&E Reports',
        count: reports.filter((r) => r.type === 'me').length,
      },
      {
        name: 'Donor Reports',
        count: reports.filter((r) => r.type === 'donor').length,
      },
    ];

    return {
      recentReports: reports.map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        status: r.status,
        createdAt: r.createdAt,
        creator: r.creator,
      })),
      templates: templates.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        isPublic: t.isPublic,
      })),
      categories,
    };
  }
}
