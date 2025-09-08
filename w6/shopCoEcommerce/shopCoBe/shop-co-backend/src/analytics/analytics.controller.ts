// src/analytics/analytics.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpStatus,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
import { Roles } from '../auth/decorators/roles.decorater';
import { UserRole } from '../users/schemas/user.schema';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardStats(@Res() res) {
    try {
      const stats = await this.analyticsService.getDashboardStats();
      return res.status(HttpStatus.OK).json(stats);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('sales')
  async getSalesData(
    @Query('timeframe') timeframe: 'daily' | 'weekly' | 'monthly',
    @Res() res,
  ) {
    try {
      const salesData = await this.analyticsService.getSalesData(timeframe);
      return res.status(HttpStatus.OK).json(salesData);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('top-products')
  async getTopProducts(
    @Query('limit', ParseIntPipe) limit: number,
    @Res() res,
  ) {
    try {
      const topProducts = await this.analyticsService.getTopProducts(limit);
      return res.status(HttpStatus.OK).json(topProducts);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('user-growth')
  async getUserGrowth(
    @Query('timeframe') timeframe: 'daily' | 'weekly' | 'monthly',
    @Res() res,
  ) {
    try {
      const userGrowth = await this.analyticsService.getUserGrowth(timeframe);
      return res.status(HttpStatus.OK).json(userGrowth);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
