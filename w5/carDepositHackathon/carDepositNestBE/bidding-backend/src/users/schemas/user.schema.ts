import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) 
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  bio: string;

  @Prop({ type: [Types.ObjectId], ref: 'Car', default: [] })
  myCars: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Bid', default: [] })
  myBids: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Car', default: [] })
  wishlist: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Bid', default: [] })
  winningBids: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
