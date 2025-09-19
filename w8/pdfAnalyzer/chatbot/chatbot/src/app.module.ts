import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { DocumentProcessingModule } from './document/document.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    DocumentProcessingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
