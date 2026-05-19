import { Controller, Get, Patch, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { User } from '../../common/decorators/user.decorator';
import type { NotificationItem } from '../../common/types';

@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  getNotifications(
    @User('sub') userId: string,
    @Query('unreadOnly') unreadOnly?: boolean,
  ): Promise<NotificationItem[]> {
    return this.notificationsService.getUserNotifications(userId, unreadOnly);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@User('sub') userId: string): Promise<number> {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(
    @User('sub') userId: string,
    @Param('id') id: string,
  ): Promise<{ count: number }> {
    return this.notificationsService.markAsRead(userId, id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@User('sub') userId: string): Promise<{ count: number }> {
    return this.notificationsService.markAllAsRead(userId);
  }
}
