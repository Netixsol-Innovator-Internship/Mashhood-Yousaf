/* eslint-disable */
import { Controller, Get, Query } from '@nestjs/common';
import { MongoService } from './mongo/mongo.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly mongoService: MongoService) {}

  @Get()
  async getProducts(
    @Query('name') name?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 100,
  ) {
    const collection = this.mongoService.getCollection('products');

    const filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await collection
      .find(filter)
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    return {
      page: Number(page),
      limit: Number(limit),
      total: products.length,
      products,
    };
  }
}
