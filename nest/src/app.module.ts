// ─── APP MODULE (Módulo Raíz) ─────────────────────────────────
// Es el módulo principal de la aplicación.
// Aquí se conecta la base de datos y se registran los demás módulos.
// ─────────────────────────────────────────────────────────────
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EscuelaModule } from './escuela/escuela.module';

@Module({
  imports: [
    // Conecta la app a MongoDB usando la URI del archivo .env
    // Si no existe la variable de entorno, usa la URI de respaldo
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? '',
    ),
    // Registra el módulo de escuelas para que sus rutas estén disponibles
    EscuelaModule,
  ],
})
export class AppModule {}
