import { Controller, Post, Body } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('upload')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async uploadDocument(
    @Body() body: { title: string; topic: string; content: string },
  ) {
    return this.documentsService.uploadDoc(body);
  }
}
