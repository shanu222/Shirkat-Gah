import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Public } from '../../common/decorators/auth.decorators';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('leadership')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leadership dashboard analytics' })
  getLeadership() {
    return this.dashboardService.getLeadershipStats();
  }

  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Public dashboard statistics' })
  getPublic() {
    return this.dashboardService.getPublicStats();
  }
}
