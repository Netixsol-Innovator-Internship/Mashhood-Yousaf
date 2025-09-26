import { Module } from '@nestjs/common';
import { AskModule } from './ask/ask.module';
import { UploadModule } from './upload/upload.module';
import { MongoModule } from './mongo/mongo.module';
import { MongooseModule } from '@nestjs/mongoose'; // Add this import
import { AuthModule } from './auth/auth.module';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    UploadModule,
    MongoModule,
    AskModule,
    AuthModule,
  ],
  controllers: [ProductsController],
})
export class AppModule {}
