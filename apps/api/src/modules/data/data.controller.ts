import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DataService } from './data.service';

@ApiTags('data')
@Controller('data')
@ApiBearerAuth()
export class DataController {
  constructor(private dataService: DataService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Data management overview' })
  getOverview() {
    return this.dataService.getOverview();
  }

  @Get('entries')
  @ApiOperation({ summary: 'List data entries' })
  getEntries(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.dataService.getEntries({ page, limit, status, projectId });
  }
}
