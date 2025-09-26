// src/ask/ask.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AskService } from './ask.service';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Post('question')
  async askQuestion(@Body() body: { userId: string; question: string }) {
    const { userId, question } = body;
    const result = await this.askService.processQuestion(userId, question);
    return result;
  }
}
