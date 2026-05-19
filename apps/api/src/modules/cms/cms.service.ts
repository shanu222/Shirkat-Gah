import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  HomepageResponse,
  PaginatedResponse,
  PublicationItem,
  CmsPageItem,
  ProgramItem,
  TeamMemberItem,
  EventItem,
} from '../../common/types';

export interface PublicationQuery {
  page?: number;
  limit?: number;
  type?: string;
}

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomepage(): Promise<HomepageResponse> {
    const [page, programs, publications, team, events] = await Promise.all([
      this.prisma.cmsPage.findUnique({ where: { slug: 'home' } }),
      this.prisma.program.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      this.prisma.publication.findMany({
        where: { isPublished: true },
        take: 6,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      this.prisma.event.findMany({
        where: { isPublished: true, startDate: { gte: new Date() } },
        take: 5,
        orderBy: { startDate: 'asc' },
      }),
    ]);

    const mapPage = (p: typeof page): CmsPageItem | null =>
      p
        ? {
            id: p.id,
            slug: p.slug,
            title: p.title,
            content: p.content,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            isPublished: p.isPublished,
            publishedAt: p.publishedAt,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }
        : null;

    const mapPrograms = (items: typeof programs): ProgramItem[] =>
      items.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        icon: p.icon,
        coverUrl: p.coverUrl,
        order: p.order,
        isActive: p.isActive,
      }));

    const mapPublications = (items: typeof publications): PublicationItem[] =>
      items.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        abstract: p.abstract,
        content: p.content,
        type: p.type,
        coverUrl: p.coverUrl,
        fileUrl: p.fileUrl,
        author: p.author,
        publishedAt: p.publishedAt,
        tags: p.tags,
        isPublished: p.isPublished,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));

    const mapTeam = (items: typeof team): TeamMemberItem[] =>
      items.map((m) => ({
        id: m.id,
        name: m.name,
        title: m.title,
        bio: m.bio,
        photoUrl: m.photoUrl,
        email: m.email,
        linkedIn: m.linkedIn,
        order: m.order,
        isActive: m.isActive,
      }));

    const mapEvents = (items: typeof events): EventItem[] =>
      items.map((e) => ({
        id: e.id,
        slug: e.slug,
        title: e.title,
        description: e.description,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        coverUrl: e.coverUrl,
        isPublished: e.isPublished,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      }));

    return {
      page: mapPage(page),
      programs: mapPrograms(programs),
      publications: mapPublications(publications),
      team: mapTeam(team),
      events: mapEvents(events),
    };
  }

  async getPublications(query: PublicationQuery): Promise<PaginatedResponse<PublicationItem>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where = {
      isPublished: true,
      ...(query.type && { type: query.type }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.publication.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.publication.count({ where }),
    ]);

    const data: PublicationItem[] = rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      abstract: p.abstract,
      content: p.content,
      type: p.type,
      coverUrl: p.coverUrl,
      fileUrl: p.fileUrl,
      author: p.author,
      publishedAt: p.publishedAt,
      tags: p.tags,
      isPublished: p.isPublished,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
