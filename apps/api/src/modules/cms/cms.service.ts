import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  async getHomepage() {
    const page = await this.prisma.cmsPage.findUnique({ where: { slug: 'home' } });
    const programs = await this.prisma.program.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
    const publications = await this.prisma.publication.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { publishedAt: 'desc' },
    });
    const team = await this.prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
    const events = await this.prisma.event.findMany({
      where: { isPublished: true, startDate: { gte: new Date() } },
      take: 5,
      orderBy: { startDate: 'asc' },
    });

    return { page, programs, publications, team, events };
  }

  async getPublications(query: { page?: number; limit?: number; type?: string }) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where = {
      isPublished: true,
      ...(query.type && { type: query.type }),
    };

    const [data, total] = await Promise.all([
      this.prisma.publication.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.publication.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
