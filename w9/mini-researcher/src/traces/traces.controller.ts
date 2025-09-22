import { Controller, Get, Param } from '@nestjs/common';
import { TracesService } from './traces.service';

@Controller('trace')
export class TracesController {
  constructor(private readonly tracesService: TracesService) {}

  @Get(':questionId')
  async getTrace(@Param('questionId') questionId: string) {
    const trace = await this.tracesService.getTrace(questionId);
    if (!trace) {
      return { error: 'Trace not found' };
    }
    return trace;
  }
}
