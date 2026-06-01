import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EscuelaController } from './escuela.controller';
import { EscuelaService } from './escuela.service';
import { Escuela, EscuelaSchema } from './escuela.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Escuela.name, schema: EscuelaSchema }]),
    CloudinaryModule, // necesario para que EscuelaService pueda usar CloudinaryService
  ],
  controllers: [EscuelaController],
  providers: [EscuelaService],
})
export class EscuelaModule {}
