import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PdfDocument, PdfDocumentSchema } from './schemas/pdfSchema';
import { Session, SessionSchema } from './schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PdfDocument.name, schema: PdfDocumentSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
