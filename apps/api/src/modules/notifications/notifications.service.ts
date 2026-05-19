import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { NotificationItem } from '../../common/types';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserNotifications(userId: string, unreadOnly = false): Promise<NotificationItem[]> {
    const rows = await this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly && { isRead: false }) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return rows.map((n) => ({
      id: n.id,
      userId: n.userId,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      isRead: n.isRead,
      readAt: n.readAt,
      metadata: n.metadata,
      createdAt: n.createdAt,
    }));
  }

  async markAsRead(userId: string, notificationId: string): Promise<{ count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
    return { count: result.count };
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { count: result.count };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }
}
