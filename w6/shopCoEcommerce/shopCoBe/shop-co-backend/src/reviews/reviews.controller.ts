// src/reviews/reviews.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorater';
import { UserRole } from '../users/schemas/user.schema';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createReviewDto: any, @Res() res) {
    try {
      createReviewDto.userId = req.user.userId;
      const review = await this.reviewsService.create(createReviewDto);
      return res.status(HttpStatus.CREATED).json(review);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Get('product/:productId')
  async findByProductId(
    @Param('productId') productId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res() res,
  ) {
    try {
      const result = await this.reviewsService.findByProductId(
        productId,
        page,
        limit,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res() res,
  ) {
    try {
      const result = await this.reviewsService.findAll(page, limit);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async remove(@Param('id') id: string, @Res() res) {
    try {
      await this.reviewsService.remove(id);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Review deleted successfully' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async toggleStatus(
    @Param('id') id: string,
    @Body() statusData: any,
    @Res() res,
  ) {
    try {
      const review = await this.reviewsService.toggleReviewStatus(
        id,
        statusData.isActive,
      );
      return res.status(HttpStatus.OK).json(review);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}
