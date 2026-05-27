import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function createApp(): Promise<INestApplication> {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: ['http://localhost:4200', 'https://angular-nest-two.vercel.app', 'https://angular-app-2026.web.app', 'https://angular-app-2026.firebaseapp.com'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type'],
    });
    await app.init();
  }
  return app;
}

// Handler exportado para Vercel (serverless)
export default async function handler(req: any, res: any) {
  const nestApp = await createApp();
  nestApp.getHttpAdapter().getInstance()(req, res);
}

// Inicio local (npm run start:dev / start:prod)
if (require.main === module) {
  createApp().then(async (nestApp) => {
    const port = process.env.PORT ?? 3000;
    await nestApp.listen(port);
    console.log(`Backend escuchando en http://localhost:${port}`);
  });
}
