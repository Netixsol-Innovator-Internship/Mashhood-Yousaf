import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  rollNumber: string;

  @Prop({ required: true })
  filename: string;

  @Prop()
  extractedText: string;

  @Prop()
  wordCount: number;

  @Prop({ ref: 'Assignment' })
  assignmentId: string;

  @Prop({ default: 0 })
  score: number;

  @Prop()
  remarks: string;

  @Prop()
  evaluationDetails: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
