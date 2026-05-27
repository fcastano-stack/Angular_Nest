// ─── SCHEMA ───────────────────────────────────────────────
// Define la "forma" de un documento en MongoDB.
// Cada vez que guardamos una escuela, MongoDB usará este molde.
// ────────────────────────────────────────────────────────────
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Tipo TypeScript para un documento de Escuela en MongoDB
export type EscuelaDocument = HydratedDocument<Escuela>;

// @Schema indica que esta clase es un esquema de MongoDB
// timestamps: true agrega automáticamente createdAt y updatedAt
@Schema({ timestamps: true })
export class Escuela {
  // @Prop define una propiedad del documento
  // required: no puede estar vacío | trim: elimina espacios al inicio/fin
  @Prop({ required: true, trim: true })
  name: string;
}

// Convierte la clase en un esquema usable por Mongoose
export const EscuelaSchema = SchemaFactory.createForClass(Escuela);
