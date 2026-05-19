import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [reports, templates] = await Promise.all([
      this.prisma.report.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { creator: { select: { firstName: true, lastName: true } } },
      }),
      this.prisma.reportTemplate.findMany({ where: { isPublic: true } }),
    ]);

    const categories = [
      { name: 'Impact Reports', count: reports.filter((r) => r.type === 'impact').length },
      { name: 'Financial Reports', count: reports.filter((r) => r.type === 'financial').length },
      { name: 'M&E Reports', count: reports.filter((r) => r.type === 'me').length },
      { name: 'Donor Reports', count: reports.filter((r) => r.type === 'donor').length },
    ];

    return { recentReports: reports, templates, categories };
  }
}
