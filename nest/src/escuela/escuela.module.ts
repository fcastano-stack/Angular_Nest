// ─── MODULE ───────────────────────────────────────────────────
// El Module agrupa todo lo relacionado con una entidad.
// NestJS organiza la app en módulos; cada entidad tiene el suyo.
// ─────────────────────────────────────────────────────────────
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EscuelaController } from './escuela.controller';
import { EscuelaService } from './escuela.service';
import { Escuela, EscuelaSchema } from './escuela.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Escuela.name, schema: EscuelaSchema }]),
    CloudinaryModule,
  ],
  controllers: [EscuelaController],
  providers: [EscuelaService],
})
export class EscuelaModule {}
