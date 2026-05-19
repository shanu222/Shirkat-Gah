import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string, filters?: { module?: string; projectId?: string }) {
    if (!query || query.length < 2) return { results: [] };

    const searchTerm = query.toLowerCase();
    const results: Array<{ type: string; id: string; title: string; subtitle?: string; url: string }> = [];

    if (!filters?.module || filters.module === 'projects') {
      const projects = await this.prisma.project.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { code: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: { id: true, title: true, code: true },
      });
      results.push(...projects.map((p) => ({ type: 'project', id: p.id, title: p.title, subtitle: p.code, url: `/dashboard/projects/${p.id}` })));
    }

    if (!filters?.module || filters.module === 'courses') {
      const courses = await this.prisma.course.findMany({
        where: { title: { contains: searchTerm, mode: 'insensitive' }, isPublished: true },
        take: 5,
        select: { id: true, title: true, slug: true, category: true },
      });
      results.push(...courses.map((c) => ({ type: 'course', id: c.id, title: c.title, subtitle: c.category ?? undefined, url: `/lms/${c.slug}` })));
    }

    if (!filters?.module || filters.module === 'publications') {
      const pubs = await this.prisma.publication.findMany({
        where: { title: { contains: searchTerm, mode: 'insensitive' }, isPublished: true },
        take: 5,
        select: { id: true, title: true, type: true, slug: true },
      });
      results.push(...pubs.map((p) => ({ type: 'publication', id: p.id, title: p.title, subtitle: p.type, url: `/publications/${p.slug}` })));
    }

    return { results, query, total: results.length };
  }
}
