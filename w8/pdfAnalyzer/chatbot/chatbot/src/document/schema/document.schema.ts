import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PdfDocModel extends Document {
  @Prop() filename: string;
  @Prop() summary: string;
  @Prop() category: string;
  @Prop([String]) highlights: string[];
}

export const PdfDocSchema = SchemaFactory.createForClass(PdfDocModel);
