// src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  COD = 'cod',
  STRIPE = 'stripe',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: string;

  @Prop([
    {
      productId: {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      variant: { type: String, default: '' },
    },
  ])
  items: any[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 0 })
  discount: number;

  // @Prop({ required: true })
  // shippingAddress: any;
  // ✅ FIXED shippingAddress
  @Prop({
    type: {
      street: String,
      city: String,
      country: String,
      postalCode: String,
    },
    required: true,
  })
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };

  @Prop({
    type: String,
    enum: PaymentMethod,
    required: true,
  })
  paymentMethod: PaymentMethod;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop()
  trackingNumber: string;

  @Prop()
  paymentId: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  paidAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
