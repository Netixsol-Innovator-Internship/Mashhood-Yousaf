import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PdfModule } from './pdf/pdf.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || '', {
      autoCreate: true,
    }),
    PdfModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
