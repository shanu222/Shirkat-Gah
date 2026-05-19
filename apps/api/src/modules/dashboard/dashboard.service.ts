import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getLeadershipStats() {
    const [projectCount, activeProjects, totalBudget, beneficiaries, provinces] =
      await Promise.all([
        this.prisma.project.count(),
        this.prisma.project.count({ where: { status: 'ACTIVE' } }),
        this.prisma.project.aggregate({ _sum: { totalBudget: true } }),
        this.prisma.indicator.aggregate({ _sum: { current: true } }),
        this.prisma.province.findMany({
          include: { _count: { select: { projects: true, districts: true } } },
        }),
      ]);

    const budgetTotal = Number(totalBudget._sum.totalBudget ?? 0);
    const budgets = await this.prisma.budget.findMany();
    const totalSpent = budgets.reduce((s, b) => s + Number(b.spent), 0);
    const totalAllocated = budgets.reduce((s, b) => s + Number(b.allocated), 0);
    const utilization = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

    const monthlyTrend = await this.getMonthlyTrend();
    const programDistribution = await this.getProgramDistribution();
    const projectHealth = await this.getProjectHealth();
    const recentActivity = await this.getRecentActivity();

    return {
      kpis: {
        totalBeneficiaries: beneficiaries._sum.current ?? 152450,
        activeProjects,
        totalProjects: projectCount,
        budgetUtilization: utilization,
        totalBudget: budgetTotal,
        geographicReach: provinces.reduce((s, p) => s + p._count.districts, 0),
      },
      monthlyTrend,
      programDistribution,
      provinceData: provinces.map((p) => ({
        province: p.name,
        projects: p._count.projects,
        districts: p._count.districts,
      })),
      projectHealth,
      recentActivity,
    };
  }

  async getPublicStats() {
    const [projects, publications, courses, provinces] = await Promise.all([
      this.prisma.project.count({ where: { status: 'ACTIVE' } }),
      this.prisma.publication.count({ where: { isPublished: true } }),
      this.prisma.course.count({ where: { isPublished: true } }),
      this.prisma.district.count(),
    ]);

    const sdgIndicators = await this.prisma.sdgIndicator.findMany({ take: 10 });
    const caseStudies = await this.prisma.caseStudy.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { publishedAt: 'desc' },
    });

    const mapData = await this.prisma.project.findMany({
      where: { status: 'ACTIVE', latitude: { not: null } },
      select: {
        id: true,
        title: true,
        code: true,
        latitude: true,
        longitude: true,
        progressPct: true,
        province: { select: { name: true } },
      },
    });

    return {
      stats: {
        activeProjects: projects,
        publications,
        courses,
        districtsCovered: provinces,
        beneficiaries: 152450,
        womenEmpowered: 150000,
      },
      sdgIndicators,
      caseStudies,
      mapData,
    };
  }

  private async getMonthlyTrend() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      beneficiaries: 12000 + i * 1500 + Math.floor(Math.random() * 1000),
      programs: 38 + i,
      budget: 65 + i * 3,
    }));
  }

  private async getProgramDistribution() {
    const projects = await this.prisma.project.findMany({
      select: { sdgTargets: true },
    });
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      p.sdgTargets.forEach((t) => {
        counts[t] = (counts[t] ?? 0) + 1;
      });
    });
    const colors = ['#047857', '#0ea5e9', '#14b8a6', '#f97316', '#8b5cf6'];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }));
  }

  private async getProjectHealth() {
    const projects = await this.prisma.project.findMany({
      where: { status: 'ACTIVE' },
      select: { progressPct: true, riskLevel: true },
    });
    const onTrack = projects.filter((p) => p.progressPct >= 60 && p.riskLevel !== 'high').length;
    const atRisk = projects.filter((p) => p.riskLevel === 'medium').length;
    const delayed = projects.filter((p) => p.progressPct < 40 || p.riskLevel === 'high').length;
    const total = projects.length || 1;
    return [
      { name: 'On Track', value: onTrack, percentage: Math.round((onTrack / total) * 100) },
      { name: 'At Risk', value: atRisk, percentage: Math.round((atRisk / total) * 100) },
      { name: 'Delayed', value: delayed, percentage: Math.round((delayed / total) * 100) },
    ];
  }

  private async getRecentActivity() {
    const logs = await this.prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    return logs.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      user: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System',
      time: log.createdAt,
    }));
  }
}
