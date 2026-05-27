// Módulo de la entidad Escuela.
// Se conecta el controller, service y el esquema de MongoDB.
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EscuelaController } from './escuela.controller';
import { EscuelaService } from './escuela.service';
import { Escuela, EscuelaSchema } from './escuela.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Escuela.name, schema: EscuelaSchema }]),
  ],
  controllers: [EscuelaController],
  providers: [EscuelaService],
})
export class EscuelaModule {}
