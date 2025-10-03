import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Assignment,
  AssignmentSchema,
} from '../database/schema/assignment.schema';
import {
  Submission,
  SubmissionSchema,
} from '../database/schema/submission.schema';
import { GeminiService } from './gemini.service';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Submission.name, schema: SubmissionSchema },
    ]),
  ],
  providers: [GeminiService, PdfService],
  exports: [GeminiService, PdfService, MongooseModule],
})
export class SharedModule {}
