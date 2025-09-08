// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { NotificationGateway } from 'src/notifications/notification.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
    private usersService: UsersService,
    private notificationGateway: NotificationGateway, // 👈 inject gateway
  ) {}

  async create(createOrderDto: any): Promise<OrderDocument> {
    // Validate products and stock
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findById(item.productId);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.title}`);
      }
    }

    // Create order
    const createdOrder = new this.orderModel(createOrderDto);
    const order = await createdOrder.save();

    // Update product stock
    for (const item of createOrderDto.items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }

    // Add loyalty points (1 point per dollar spent)
    const loyaltyPoints = Math.floor(createOrderDto.totalAmount);
    await this.usersService.updateLoyaltyPoints(
      createOrderDto.userId,
      loyaltyPoints,
    );

    // 👇 Send real-time notification
      const user = await this.usersService.findById(createOrderDto.userId);
      this.notificationGateway.broadcastOrderNotification({
        message: `${user.name} just placed an order of $${order.totalAmount}`,
        user: {
          id: user._id,
          name: user.name,
        },
        totalAmount: order.totalAmount,
        items: order.items.length,
      });
      console.log('user', user)

      return order;
    }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
    userId?: string,
  ): Promise<{ orders: OrderDocument[]; total: number }> {
    const query: any = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;
    const orders = await this.orderModel
      .find(query)
      .populate('userId', 'name email')
      .populate('items.productId', 'title images')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.orderModel.countDocuments(query).exec();

    return { orders, total };
  }

  async findById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findById(id)
      .populate('userId', 'name email phone')
      .populate('items.productId', 'title images sku')
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByUserId(userId: string): Promise<OrderDocument[]> {
    const orders = await this.orderModel
      .find({ userId })
      .populate('userId', 'name email phone') // populate user basic info
      .populate('items.productId', 'title images sku') // populate product fields
      .exec();

    // if (!orders || orders.length === 0) {
    //   throw new NotFoundException('No orders found for this user');
    // }

    return orders;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDocument> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updatePaymentStatus(
    id: string,
    isPaid: boolean,
  ): Promise<OrderDocument> {
    const order = await this.orderModel
      .findByIdAndUpdate(
        id,
        {
          isPaid,
          paidAt: isPaid ? new Date() : null,
        },
        { new: true },
      )
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async getUserOrders(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ userId })
      .populate('items.productId', 'title images')
      .sort({ createdAt: -1 })
      .exec();
  }

  async cancelOrder(id: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status: OrderStatus.CANCELLED }, { new: true })
      .exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Restore product stock
    for (const item of order.items) {
      await this.productsService.updateStock(
        item.productId.toString(),
        -item.quantity,
      );
    }

    // Deduct loyalty points
    const loyaltyPoints = Math.floor(order.totalAmount);
    await this.usersService.updateLoyaltyPoints(
      order.userId.toString(),
      -loyaltyPoints,
    );

    return order;
  }
}
