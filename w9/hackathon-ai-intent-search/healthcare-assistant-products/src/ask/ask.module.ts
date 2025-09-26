import { Module } from '@nestjs/common';
import { AskService } from './ask.service';
import { AskController } from './ask.controller';
import { MongoModule } from '../mongo/mongo.module';
import { MongoService } from 'src/mongo/mongo.service';

@Module({
  imports: [MongoModule],
  controllers: [AskController],
  providers: [AskService, MongoService],
  exports: [MongoService, AskService],
})
export class AskModule {}
