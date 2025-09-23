import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AskService } from './ask.service';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Post()
  async handleAsk(@Body('question') question: string) {
    if (!question) throw new BadRequestException('Question is required');
    return this.askService.processQuestion(question);
  }
}
