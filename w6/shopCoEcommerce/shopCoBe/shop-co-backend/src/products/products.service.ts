// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: any): Promise<ProductDocument> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    search?: string,
    dressStyle?: string, // Add dressStyle parameter here
  ): Promise<{ products: ProductDocument[]; total: number }> {
    const query: any = { isActive: true };

    if (category) query.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (search) {
      query.$text = { $search: search };
    }
    // Add dressStyle filter if provided
    if (dressStyle) {
      query.dressStyle = dressStyle;
    }

    const skip = (page - 1) * limit;
    const products = await this.productModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.productModel.countDocuments(query).exec();

    return { products, total };
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: any): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  async updateStock(id: string, quantity: number): Promise<ProductDocument> {
    const product = await this.productModel
      .findByIdAndUpdate(id, { $inc: { stock: -quantity } }, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateRating(id: string, rating: number): Promise<ProductDocument> {
    const product = await this.findById(id);
    const newReviewCount = product.reviewCount + 1;
    const newAverageRating =
      (product.averageRating * product.reviewCount + rating) / newReviewCount;

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(
        id,
        {
          averageRating: newAverageRating,
          reviewCount: newReviewCount,
        },
        { new: true },
      )
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct;
  }
}
