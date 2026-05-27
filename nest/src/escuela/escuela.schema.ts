// Esquema Mongoose para la colección de escuelas.
// Define cómo se guarda cada documento en MongoDB.
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EscuelaDocument = HydratedDocument<Escuela>;

@Schema({ timestamps: true })
export class Escuela {
  @Prop({ required: true, trim: true })
  name: string;
}

export const EscuelaSchema = SchemaFactory.createForClass(Escuela);
