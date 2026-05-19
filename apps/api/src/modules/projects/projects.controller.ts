import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import type {
  PaginatedResponse,
  ProjectListItem,
  ProjectDashboardItem,
  ProjectDetailResponse,
} from '../../common/types';

@ApiTags('projects')
@Controller('projects')
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedResponse<ProjectListItem>> {
    return this.projectsService.findAll({ page, limit, status, search });
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Project dashboard stats' })
  getDashboard(@Query('projectId') projectId?: string): Promise<ProjectDashboardItem[]> {
    return this.projectsService.getDashboardStats(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  findOne(@Param('id') id: string): Promise<ProjectDetailResponse> {
    return this.projectsService.findOne(id);
  }
}
