// src/reviews/reviews.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private productsService: ProductsService,
    private ordersService: OrdersService,
  ) {}

  async create(createReviewDto: any): Promise<ReviewDocument> {
    // Check if user has purchased the product
    // const order = await this.ordersService.findById(createReviewDto.orderId);
    // const hasPurchased = order.items.some(
    //   (item) => item.productId.toString() === createReviewDto.productId,
    // );

    // ✅ Check if user has purchased the product (without requiring orderId)
    const orders = await this.ordersService.findByUserId(
      createReviewDto.userId,
    );

    const hasPurchased = orders.some((order) =>
      order.items.some(
        (item) => item.productId._id.toString() === createReviewDto.userId,
      ),
    );

    if (!hasPurchased) {
      throw new Error('You can only review products you have purchased');
    }

    // Check if user has already reviewed this product
    const existingReview = await this.reviewModel
      .findOne({
        userId: createReviewDto.userId,
        productId: createReviewDto.productId,
      })
      .exec();

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    const createdReview = new this.reviewModel(createReviewDto);
    const review = await createdReview.save();

    // Update product rating
    await this.productsService.updateRating(
      createReviewDto.productId,
      createReviewDto.rating,
    );

    return review;
  }

  async findByProductId(
    productId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ reviews: ReviewDocument[]; total: number }> {
    const query = { productId, isActive: true };

    const skip = (page - 1) * limit;
    const reviews = await this.reviewModel
      .find(query)
      .populate('userId', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.reviewModel.countDocuments(query).exec();

    return { reviews, total };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ reviews: ReviewDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const reviews = await this.reviewModel
      .find()
      .populate('userId', 'name')
      .populate('productId', 'title')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.reviewModel.countDocuments().exec();

    return { reviews, total };
  }

  async remove(id: string): Promise<void> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Update product rating before deleting
    const product = await this.productsService.findById(
      review.productId.toString(),
    );
    const newReviewCount = product.reviewCount - 1;
    const newAverageRating =
      newReviewCount > 0
        ? (product.averageRating * product.reviewCount - review.rating) /
          newReviewCount
        : 0;

    await this.productsService.update(review.productId.toString(), {
      averageRating: newAverageRating,
      reviewCount: newReviewCount,
    });

    await this.reviewModel.deleteOne({ _id: id }).exec();
  }

  async toggleReviewStatus(
    id: string,
    isActive: boolean,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }
}
