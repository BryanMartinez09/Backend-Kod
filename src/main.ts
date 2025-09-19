// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todos los endpoints (ej: /api/auth/login)
  app.setGlobalPrefix('api');

  // Configuración de CORS (importante para el frontend en localhost:5173 o similar)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });

  // Body parser para JSON y formularios
  app.use(bodyParser.json({ strict: false }));
  app.use(bodyParser.urlencoded({ extended: true }));

  // Pipes globales de validación (usa class-validator y class-transformer)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Levantar servidor
  await app.listen(3000);
  console.log('🚀 API running on http://localhost:3000');
}
bootstrap();
