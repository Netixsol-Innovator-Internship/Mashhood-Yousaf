import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  description: string;

  // @Prop({ type: [String], default: [] })
  // images: string[];
  @Prop({ type: String, required: true })
  image: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Auction', default: null })
  auctionId: Types.ObjectId | null;
}

export const CarSchema = SchemaFactory.createForClass(Car);
