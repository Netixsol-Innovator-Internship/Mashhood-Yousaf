import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auction: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending' })
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
