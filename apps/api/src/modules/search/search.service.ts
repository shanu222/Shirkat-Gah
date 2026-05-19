import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { SearchResponse, SearchResultItem } from '../../common/types';

export interface SearchFilters {
  module?: string;
  projectId?: string;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(query: string, filters?: SearchFilters): Promise<SearchResponse> {
    if (!query || query.length < 2) {
      return { results: [], query, total: 0 };
    }

    const searchTerm = query.toLowerCase();
    const results: SearchResultItem[] = [];

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
      for (const p of projects) {
        results.push({
          type: 'project',
          id: p.id,
          title: p.title,
          subtitle: p.code,
          url: `/dashboard/projects/${p.id}`,
        });
      }
    }

    if (!filters?.module || filters.module === 'courses') {
      const courses = await this.prisma.course.findMany({
        where: { title: { contains: searchTerm, mode: 'insensitive' }, isPublished: true },
        take: 5,
        select: { id: true, title: true, slug: true, category: true },
      });
      for (const c of courses) {
        results.push({
          type: 'course',
          id: c.id,
          title: c.title,
          subtitle: c.category ?? undefined,
          url: `/lms/${c.slug}`,
        });
      }
    }

    if (!filters?.module || filters.module === 'publications') {
      const pubs = await this.prisma.publication.findMany({
        where: { title: { contains: searchTerm, mode: 'insensitive' }, isPublished: true },
        take: 5,
        select: { id: true, title: true, type: true, slug: true },
      });
      for (const p of pubs) {
        results.push({
          type: 'publication',
          id: p.id,
          title: p.title,
          subtitle: p.type,
          url: `/publications/${p.slug}`,
        });
      }
    }

    return { results, query, total: results.length };
  }
}
