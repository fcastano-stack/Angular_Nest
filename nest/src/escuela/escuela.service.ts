// ─── SERVICE ─────────────────────────────────────────────────
// El Service contiene toda la lógica de negocio.
// El Controller llama a estos métodos; el Service habla con MongoDB.
// ─────────────────────────────────────────────────────────────
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Escuela, EscuelaDocument } from './escuela.schema';
import { CreateEscuelaDto, UpdateEscuelaDto } from './escuela.dto';

// @Injectable permite que NestJS inyecte este servicio donde se necesite
@Injectable()
export class EscuelaService {
  constructor(
    // Inyecta el modelo de Mongoose para poder consultar la BD
    @InjectModel(Escuela.name)
    private readonly escuelaModel: Model<EscuelaDocument>,
  ) {}

  // GET /escuelas — devuelve todas las escuelas ordenadas por fecha de creación
  async findAll(): Promise<EscuelaDocument[]> {
    return this.escuelaModel.find().sort({ createdAt: 1 }).exec();
  }

  // GET /escuelas/:id — busca una escuela por su ID de MongoDB
  async findOne(id: string): Promise<EscuelaDocument> {
    const doc = await this.escuelaModel.findById(id).exec();
    // Si no existe, lanza un error 404
    if (!doc) throw new NotFoundException(`Escuela ${id} no encontrada`);
    return doc;
  }

  // POST /escuelas — crea y guarda una nueva escuela
  async create(dto: CreateEscuelaDto): Promise<EscuelaDocument> {
    const created = new this.escuelaModel(dto);
    return created.save(); // .save() escribe en MongoDB
  }

  // PATCH /escuelas/:id — actualiza solo los campos enviados
  async update(id: string, dto: UpdateEscuelaDto): Promise<EscuelaDocument> {
    const updated = await this.escuelaModel
      .findByIdAndUpdate(id, dto, { new: true }) // new:true devuelve el doc ya actualizado
      .exec();
    if (!updated) throw new NotFoundException(`Escuela ${id} no encontrada`);
    return updated;
  }

  // DELETE /escuelas/:id — elimina una escuela de la BD
  async remove(id: string): Promise<void> {
    const result = await this.escuelaModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Escuela ${id} no encontrada`);
  }
}
