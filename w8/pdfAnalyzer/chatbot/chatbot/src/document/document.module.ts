import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentControllerV2 } from './document.controller';
import { PdfProcessingService } from './document.service';
import { PdfDocModel, PdfDocSchema } from './schema/document.schema';
import { GeminiService } from '../gemini.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PdfDocModel.name, schema: PdfDocSchema },
    ]),
  ],
  controllers: [DocumentControllerV2],
  providers: [PdfProcessingService, GeminiService],
})
export class DocumentProcessingModule {}
