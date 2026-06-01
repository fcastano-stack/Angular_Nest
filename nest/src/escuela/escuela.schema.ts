// Define la estructura de un documento Escuela en MongoDB
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EscuelaDocument = HydratedDocument<Escuela>;

@Schema({ timestamps: true })
export class Escuela {

  @Prop({ required: true, trim: true })
  name: string;

  // URL de la imagen en Cloudinary. Vale null si no se subió ninguna.
  @Prop({ default: null })
  imageUrl: string | null;
}

export const EscuelaSchema = SchemaFactory.createForClass(Escuela);
