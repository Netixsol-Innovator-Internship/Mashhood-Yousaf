// src/reviews/schemas/review.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Order',
    required: true,
  })
  orderId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
