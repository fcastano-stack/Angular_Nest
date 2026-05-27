// Entrada principal del backend NestJS.
// Carga variables de entorno y arranca el servidor.
import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: permite que Angular (cualquier origen en dev, ajustar en prod)
  app.enableCors({
    origin: ['http://localhost:4200', 'https://escuelas-app.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Backend escuchando en http://localhost:${port}`);
}
bootstrap();
