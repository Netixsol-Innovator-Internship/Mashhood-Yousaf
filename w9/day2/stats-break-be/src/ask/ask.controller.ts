// src/ask/ask.controller.ts
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AskService } from './ask.service';
import { ObjectId } from 'mongodb';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Post()
  async askQuestion(@Body() body: { userId: string; question: string }) {
    const response = await this.askService.processQuestion(
      body.userId,
      body.question,
    );
    return { response };
  }
  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    return this.askService.getHistory(userId);
  }

  // @Get('summary/:userId')
  // async getSummary(@Param('userId') userId: string) {
  //   try {
  //     // const summary = await this.mongoService
  //     //   .getCollection('summaries')
  //     //   .findOne({ userId: new ObjectId(userId) });

  //     // if (!summary) {
  //     //   return {
  //     //     success: true,
  //     //     summary: null,
  //     //     message: 'No summary available yet',
  //     //   };
  //     // }

  //     return {
  //       success: true,
  //       summary: summary.summary,
  //       lastUpdated: summary.lastUpdated,
  //       conversationCount: summary.conversationCount,
  //     };
  //   } catch (error) {
  //     console.error('❌ Error fetching summary:', error);
  //     return { success: false, message: 'Error fetching summary' };
  //   }
  // }
}
