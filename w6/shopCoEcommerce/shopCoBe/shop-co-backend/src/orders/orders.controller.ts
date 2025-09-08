// src/orders/orders.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
import { Roles } from '../auth/decorators/roles.decorater';
// import { UserRole, OrderStatus } from './schemas/order.schema';
import { OrderStatus } from './schemas/order.schema';
import { UserRole } from '../users/schemas/user.schema'; 

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Request() req, @Body() createOrderDto: any, @Res() res) {
    try {
      createOrderDto.userId = req.user.userId;
      const order = await this.ordersService.create(createOrderDto);
      return res.status(HttpStatus.CREATED).json(order);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status: OrderStatus,
    @Res() res,
  ) {
    try {
      const result = await this.ordersService.findAll(page, limit, status);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('my-orders')
  async getUserOrders(@Request() req, @Res() res) {
    try {
      const orders = await this.ordersService.getUserOrders(req.user.userId);
      return res.status(HttpStatus.OK).json(orders);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const order = await this.ordersService.findById(id);
      return res.status(HttpStatus.OK).json(order);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
      });
    }
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() statusData: any,
    @Res() res,
  ) {
    try {
      const order = await this.ordersService.updateStatus(
        id,
        statusData.status,
      );
      return res.status(HttpStatus.OK).json(order);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Put(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Res() res) {
    try {
      const order = await this.ordersService.cancelOrder(id);
      return res.status(HttpStatus.OK).json(order);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}
