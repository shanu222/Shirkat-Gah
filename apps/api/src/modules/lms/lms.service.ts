import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LmsService {
  constructor(private prisma: PrismaService) {}

  async getCourses(query: { page?: number; limit?: number; category?: string; search?: string }) {
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

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: { _count: { select: { lessons: true, enrollments: true } } },
      }),
      this.prisma.course.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getCourse(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: { where: { isPublished: true }, orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async enrollUser(userId: string, courseId: string) {
    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) return existing;

    return this.prisma.enrollment.create({
      data: { userId, courseId, status: 'ENROLLED' },
    });
  }

  async getUserEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: { _count: { select: { lessons: true } } },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getLessonProgress(userId: string, courseId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId, isPublished: true },
      include: {
        progress: { where: { userId } },
      },
      orderBy: { order: 'asc' },
    });
    return lessons;
  }
}
