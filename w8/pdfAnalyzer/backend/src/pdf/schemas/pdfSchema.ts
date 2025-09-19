// PdfDocumentSchema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'pdfdocuments' })
export class PdfDocument extends Document {
  @Prop({ required: true })
  text: string;
}

export const PdfDocumentSchema = SchemaFactory.createForClass(PdfDocument);
