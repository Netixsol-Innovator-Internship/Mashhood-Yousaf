import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

@Schema()
export class Resume extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  education: string;

  @Prop([String])
  skills: string[];

  @Prop()
  experience: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: 1 })
  templateId: number;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
