import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(json());

  //  const appService = app.get(AppService);
  //  await appService.onModuleInit();

  await app.listen(4000);
  console.log('app is running on http://localhost:4000');
}
bootstrap();
