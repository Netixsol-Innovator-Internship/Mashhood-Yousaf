import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuctionDocument = Auction & Document;

@Schema({ timestamps: true })
export class Auction {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  car: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: 0 })
  currentBid: number;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  currentBidder: Types.ObjectId | null;

  @Prop({ type: [Types.ObjectId], ref: 'Bid', default: [] })
  topBidders: Types.ObjectId[];

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  winner: Types.ObjectId | null;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);
