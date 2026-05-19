import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
@ApiBearerAuth()
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Global search across platform' })
  search(
    @Query('q') q: string,
    @Query('module') module?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.searchService.globalSearch(q, { module, projectId });
  }
}
