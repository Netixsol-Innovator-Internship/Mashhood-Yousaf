import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // load env vars before app start
  const app = await NestFactory.create(AppModule);
   app.enableCors({
     origin: '*',
   });
  await app.listen(4000);
  console.log('Server running on http://localhost:4000');
}
bootstrap();
