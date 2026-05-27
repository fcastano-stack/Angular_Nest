// ─── MODULE ───────────────────────────────────────────────────
// El Module agrupa todo lo relacionado con una entidad.
// NestJS organiza la app en módulos; cada entidad tiene el suyo.
// ─────────────────────────────────────────────────────────────
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EscuelaController } from './escuela.controller';
import { EscuelaService } from './escuela.service';
import { Escuela, EscuelaSchema } from './escuela.schema';

@Module({
  imports: [
    // Registra el modelo de Mongoose para poder usarlo con @InjectModel
    MongooseModule.forFeature([{ name: Escuela.name, schema: EscuelaSchema }]),
  ],
  controllers: [EscuelaController], // maneja las rutas HTTP
  providers: [EscuelaService],      // contiene la lógica de negocio
})
export class EscuelaModule {}
