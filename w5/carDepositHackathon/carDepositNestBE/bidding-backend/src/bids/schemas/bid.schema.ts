import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auction: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId;

  @Prop({ required: true })
  amount: number;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
