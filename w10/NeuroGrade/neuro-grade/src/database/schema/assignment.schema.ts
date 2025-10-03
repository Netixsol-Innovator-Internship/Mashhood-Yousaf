import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  instructions: string;

  @Prop({ required: true })
  minLength: number;

  @Prop({ default: 100 })
  maxMarks: number;

  @Prop({ enum: ['strict', 'loose'], default: 'strict', type: String })
  gradingMode: 'strict' | 'loose';

  @Prop()
  teacherName: string;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
