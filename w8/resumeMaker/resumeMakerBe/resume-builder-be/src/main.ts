import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'https://resume-maker-fe.vercel.app', // your frontend
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // allow requests from frontend or Postman
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: false, // since you removed it
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Server running on :${port}`);
}
bootstrap();
