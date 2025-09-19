import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'sessions', timestamps: true })
export class Session extends Document {
  @Prop({ type: Types.ObjectId, ref: 'PdfDocument', required: true })
  pdf: Types.ObjectId;

  @Prop({ default: Date.now, expires: 3600 })
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
