// src/reviews/reviews.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schemas/review.schema';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
