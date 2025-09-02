import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: 'http://localhost:3000  ', // frontend ka URL
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // This automatically transforms JSON to DTO instances
      whitelist: true, // Remove properties not in DTO
    }),
  );
  await app.listen(3001);
  console.log('Server running on http://localhost:3001');
}
bootstrap();
