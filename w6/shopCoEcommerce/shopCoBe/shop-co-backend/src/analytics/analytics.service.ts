// src/analytics/analytics.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Order,
  OrderDocument,
  OrderStatus,
} from '../orders/schemas/order.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userModel.countDocuments().exec();
    const totalOrders = await this.orderModel.countDocuments().exec();
    const totalProducts = await this.productModel.countDocuments().exec();

    const totalRevenueResult = await this.orderModel
      .aggregate([
        { $match: { status: OrderStatus.DELIVERED } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ])
      .exec();

    const totalRevenue = totalRevenueResult[0]?.total || 0;

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
    };
  }

  async getSalesData(timeframe: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    let groupFormat: string;
    let dateSubtract: Date;

    const now = new Date();
    switch (timeframe) {
      case 'daily':
        groupFormat = '%Y-%m-%d';
        dateSubtract = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'weekly':
        groupFormat = '%Y-%U';
        dateSubtract = new Date(now.setDate(now.getDate() - 180));
        break;
      case 'monthly':
        groupFormat = '%Y-%m';
        dateSubtract = new Date(now.setMonth(now.getMonth() - 12));
        break;
    }

    const salesData = await this.orderModel
      .aggregate([
        {
          $match: {
            status: OrderStatus.DELIVERED,
            createdAt: { $gte: dateSubtract },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: '$createdAt',
              },
            },
            totalSales: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .exec();

    return salesData;
  }

  async getTopProducts(limit: number = 5) {
    const topProducts = await this.orderModel
      .aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: {
              $sum: { $multiply: ['$items.quantity', '$items.price'] },
            },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: '$product' },
        {
          $project: {
            productId: '$_id',
            productName: '$product.title',
            totalSold: 1,
            totalRevenue: 1,
          },
        },
      ])
      .exec();

    return topProducts;
  }

  async getUserGrowth(timeframe: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    let groupFormat: string;
    let dateSubtract: Date;

    const now = new Date();
    switch (timeframe) {
      case 'daily':
        groupFormat = '%Y-%m-%d';
        dateSubtract = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'weekly':
        groupFormat = '%Y-%U';
        dateSubtract = new Date(now.setDate(now.getDate() - 180));
        break;
      case 'monthly':
        groupFormat = '%Y-%m';
        dateSubtract = new Date(now.setMonth(now.getMonth() - 12));
        break;
    }

    const userGrowth = await this.userModel
      .aggregate([
        {
          $match: {
            createdAt: { $gte: dateSubtract },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: groupFormat,
                date: '$createdAt',
              },
            },
            userCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .exec();

    return userGrowth;
  }
}
