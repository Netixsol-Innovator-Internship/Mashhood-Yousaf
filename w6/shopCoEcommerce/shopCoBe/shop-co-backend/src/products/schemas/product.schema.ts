// src/products/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop([
    {
      url: String,
      publicId: String,
    },
  ])
  images: any[];

  @Prop([
    {
      name: String,
      options: [String],
      additionalPrice: Number,
    },
  ])
  variants: any[];

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: true })
  isActive: boolean;

  // New fields
  @Prop({
    type: String,
    enum: ['casual', 'formal', 'gym', 'party'],
    required: true,
  })
  dressStyle: string;

  @Prop({
    type: String,
    enum: ['small', 'medium', 'large', 'xl'],
    required: true,
  })
  size: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ category: 1, price: 1 });
