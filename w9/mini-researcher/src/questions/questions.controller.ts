import { Controller, Post, Body } from '@nestjs/common';
import { WorkflowService } from '../workflow/research.workflow';
import { QuestionsService } from './questions.service';

@Controller('ask')
export class QuestionsController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  async askQuestion(@Body('question') question: string) {
    if (!question || question.trim() === '') {
      return { error: 'Question is required' };
    }
    return this.workflowService.runWorkflow(question);
  }
}
