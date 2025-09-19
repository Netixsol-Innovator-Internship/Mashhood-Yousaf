import {
  Controller,
  Post,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
  constructor(private readonly docService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.docService.processPDF(file);
  }

  @Post(':id/ask')
  async ask(@Param('id') id: string, @Body('question') question: string) {
    // console.log('QUESTION');
    return this.docService.askQuestion(id, question);
  }
}
