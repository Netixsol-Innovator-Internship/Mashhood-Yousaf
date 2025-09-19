import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { json } from 'express';
import * as cors from 'cors';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(json({ limit: '10mb' }));
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Backend listening on ${port}`);
}
bootstrap();
