import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LmsService } from './lms.service';
import { User } from '../../common/decorators/user.decorator';
import { Public } from '../../common/decorators/auth.decorators';

@ApiTags('lms')
@Controller('lms')
export class LmsController {
  constructor(private lmsService: LmsService) {}

  @Public()
  @Get('courses')
  @ApiOperation({ summary: 'List published courses' })
  getCourses(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.lmsService.getCourses({ page, limit, category, search });
  }

  @Public()
  @Get('courses/:slug')
  @ApiOperation({ summary: 'Get course details' })
  getCourse(@Param('slug') slug: string) {
    return this.lmsService.getCourse(slug);
  }

  @Post('courses/:courseId/enroll')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in a course' })
  enroll(@User('sub') userId: string, @Param('courseId') courseId: string) {
    return this.lmsService.enrollUser(userId, courseId);
  }

  @Get('my-learning')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user enrollments' })
  myLearning(@User('sub') userId: string) {
    return this.lmsService.getUserEnrollments(userId);
  }

  @Get('courses/:courseId/progress')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lesson progress for course' })
  progress(@User('sub') userId: string, @Param('courseId') courseId: string) {
    return this.lmsService.getLessonProgress(userId, courseId);
  }
}
