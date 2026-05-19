import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  PaginatedResponse,
  CourseListItem,
  CourseDetailResponse,
  EnrollmentItem,
  EnrollmentRecord,
  LessonProgressItem,
} from '../../common/types';

export interface CourseQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

@Injectable()
export class LmsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCourses(query: CourseQuery): Promise<PaginatedResponse<CourseListItem>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where = {
      isPublished: true,
      ...(query.category && { category: query.category }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { description: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: { _count: { select: { lessons: true, enrollments: true } } },
      }),
      this.prisma.course.count({ where }),
    ]);

    const data: CourseListItem[] = rows.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      thumbnailUrl: c.thumbnailUrl,
      category: c.category,
      level: c.level,
      duration: c.duration,
      price: c.price,
      currency: c.currency,
      isPublished: c.isPublished,
      isFeatured: c.isFeatured,
      instructor: c.instructor,
      tags: c.tags,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      _count: c._count,
    }));

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getCourse(slug: string): Promise<CourseDetailResponse> {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: { where: { isPublished: true }, orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) throw new NotFoundException('Course not found');

    const { lessons, _count, ...rest } = course;
    return {
      ...rest,
      lessons: lessons.map((l) => ({
        id: l.id,
        courseId: l.courseId,
        title: l.title,
        description: l.description,
        type: l.type,
        content: l.content,
        videoUrl: l.videoUrl,
        pdfUrl: l.pdfUrl,
        duration: l.duration,
        order: l.order,
        isPublished: l.isPublished,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
      })),
      _count,
    };
  }

  async enrollUser(userId: string, courseId: string): Promise<EnrollmentRecord> {
    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) {
      return {
        id: existing.id,
        userId: existing.userId,
        courseId: existing.courseId,
        status: existing.status,
        progressPct: existing.progressPct,
        enrolledAt: existing.enrolledAt,
        completedAt: existing.completedAt,
        expiresAt: existing.expiresAt,
      };
    }

    const created = await this.prisma.enrollment.create({
      data: { userId, courseId, status: 'ENROLLED' },
    });
    return {
      id: created.id,
      userId: created.userId,
      courseId: created.courseId,
      status: created.status,
      progressPct: created.progressPct,
      enrolledAt: created.enrolledAt,
      completedAt: created.completedAt,
      expiresAt: created.expiresAt,
    };
  }

  async getUserEnrollments(userId: string): Promise<EnrollmentItem[]> {
    const rows = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: { _count: { select: { lessons: true, enrollments: true } } },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return rows.map((e) => ({
      id: e.id,
      userId: e.userId,
      courseId: e.courseId,
      status: e.status,
      progressPct: e.progressPct,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
      expiresAt: e.expiresAt,
      course: {
        id: e.course.id,
        slug: e.course.slug,
        title: e.course.title,
        description: e.course.description,
        thumbnailUrl: e.course.thumbnailUrl,
        category: e.course.category,
        level: e.course.level,
        duration: e.course.duration,
        price: e.course.price,
        currency: e.course.currency,
        isPublished: e.course.isPublished,
        isFeatured: e.course.isFeatured,
        instructor: e.course.instructor,
        tags: e.course.tags,
        createdAt: e.course.createdAt,
        updatedAt: e.course.updatedAt,
        _count: e.course._count,
      },
    }));
  }

  async getLessonProgress(userId: string, courseId: string): Promise<LessonProgressItem[]> {
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId, isPublished: true },
      include: {
        progress: { where: { userId } },
      },
      orderBy: { order: 'asc' },
    });

    return lessons.map((l) => ({
      id: l.id,
      courseId: l.courseId,
      title: l.title,
      description: l.description,
      type: l.type,
      content: l.content,
      videoUrl: l.videoUrl,
      pdfUrl: l.pdfUrl,
      duration: l.duration,
      order: l.order,
      isPublished: l.isPublished,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
      progress: l.progress.map((p) => ({
        id: p.id,
        completed: p.completed,
        progressPct: p.progressPct,
      })),
    }));
  }
}
