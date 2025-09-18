// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Prefijo global (para /api/...)
  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ strict: false }));
  app.use(bodyParser.urlencoded({ extended: true }));


  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3000);
  console.log('API running on http://localhost:3000');
}
bootstrap();
