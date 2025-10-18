import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(json());

  //  const appService = app.get(AppService);
  //  await appService.onModuleInit();

  await app.listen(process.env.PORT ?? 4000);
  console.log('app is running on http://localhsost:4000');
}
bootstrap();
