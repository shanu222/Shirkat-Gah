import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceService } from './finance.service';

@ApiTags('finance')
@Controller('finance')
@ApiBearerAuth()
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Financial overview dashboard' })
  getOverview() {
    return this.financeService.getOverview();
  }

  @Get('expenses')
  @ApiOperation({ summary: 'List expenses' })
  getExpenses(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.financeService.getExpenses({ page, limit, status, projectId });
  }
}
