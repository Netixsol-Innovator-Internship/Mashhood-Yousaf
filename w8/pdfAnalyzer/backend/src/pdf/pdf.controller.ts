import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfService } from './pdf.service';
import { AskDto } from './dto/ask.dto';
import { diskStorage, memoryStorage } from 'multer';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: memoryStorage(),
      limits: {
        fileSize: parseInt(process.env.MAX_PDF_SIZE_BYTES || '5242880', 10),
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf')
          cb(new Error('Only PDFs allowed'), false);
        else cb(null, true);
      },
    }),
  )
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException('No file uploaded or wrong format');
    const sessionId = await this.pdfService.extractAndSave(file.buffer);
    return { sessionId };
  }

  @Post('ask')
  async ask(@Body() body: AskDto) {
    const { sessionId, question } = body;
    if (!sessionId || !question)
      throw new BadRequestException('sessionId and question required');
    const answer = await this.pdfService.ask(sessionId, question);
    return { answer };
  }
}
