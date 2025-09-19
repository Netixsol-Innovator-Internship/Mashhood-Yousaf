import {
  Controller,
  Post,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfProcessingService } from './document.service';

@Controller('docs')
export class DocumentControllerV2 {
  constructor(private readonly pdfService: PdfProcessingService) {}

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async handleUpload(@UploadedFile() uploadedFile: Express.Multer.File) {
    return this.pdfService.extractAndSave(uploadedFile);
  }

  @Post(':docId/query')
  async handleQuery(
    @Param('docId') documentId: string,
    @Body('question') userQuestion: string,
  ) {
    return this.pdfService.answerUserQuery(documentId, userQuestion);
  }
}
