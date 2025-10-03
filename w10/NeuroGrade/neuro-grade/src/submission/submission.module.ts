import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import {
  Submission,
  SubmissionSchema,
} from '../database/schema/submission.schema';
import {
  Assignment,
  AssignmentSchema,
} from '../database/schema/assignment.schema';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
      { name: Assignment.name, schema: AssignmentSchema },
    ]),
    SharedModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
