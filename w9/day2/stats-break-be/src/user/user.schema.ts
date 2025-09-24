import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Conversation' }] })
  conversations: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Summary' })
  summary: Types.ObjectId;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
