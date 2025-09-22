import { forwardRef, Module } from '@nestjs/common';
import { WorkflowService } from '../workflow/research.workflow';
import { TracesModule } from '../traces/traces.module';
import { DocumentsModule } from '../documents/documents.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [DocumentsModule, forwardRef(() => QuestionsModule), TracesModule],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}