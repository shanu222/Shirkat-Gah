import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { Public } from '../../common/decorators/auth.decorators';

@ApiTags('cms')
@Controller('cms')
export class CmsController {
  constructor(private cmsService: CmsService) {}

  @Public()
  @Get('homepage')
  @ApiOperation({ summary: 'Get homepage CMS content' })
  getHomepage() {
    return this.cmsService.getHomepage();
  }

  @Public()
  @Get('publications')
  @ApiOperation({ summary: 'List publications' })
  getPublications(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
  ) {
    return this.cmsService.getPublications({ page, limit, type });
  }
}
