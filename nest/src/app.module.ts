// Módulo raíz de NestJS.
// Aquí se configura la conexión a MongoDB y se importa el módulo de escuela.
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EscuelaModule } from './escuela/escuela.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ??
        'mongodb+srv://fcastano_db_user:aPK3OU3yeEUVnRr0@listaalumnos.wgdmvhu.mongodb.net/escuelas?appName=listaAlumnos',
    ),
    EscuelaModule,
  ],
})
export class AppModule {}
