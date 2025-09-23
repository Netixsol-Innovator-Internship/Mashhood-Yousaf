import { Module } from '@nestjs/common';
import { AskModule } from './ask/ask.module';
import { UploadModule } from './upload/upload.module';
import { MongoModule } from './mongo/mongo.module';
import { MongooseModule } from '@nestjs/mongoose'; // Add this import

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    UploadModule,
    MongoModule,
    AskModule,
  ],
})
export class AppModule {}
