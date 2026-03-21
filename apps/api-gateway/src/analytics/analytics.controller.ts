import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin — Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] Get platform analytics summary' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date YYYY-MM-DD (defaults to 30 days ago)' })
  @ApiQuery({ name: 'to',   required: false, description: 'End date YYYY-MM-DD (defaults to today)' })
  getSummary(@Query('from') from?: string, @Query('to') to?: string) {
    return this.analyticsService.getSummary({ from, to });
  }

  @Get('customers')
  @ApiOperation({ summary: '[Admin] Get customer registration stats' })
  getCustomerStats() {
    return this.analyticsService.getCustomerStats();
  }
}
