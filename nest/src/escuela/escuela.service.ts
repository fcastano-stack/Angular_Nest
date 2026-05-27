// Service que contiene la lógica para manejar las escuelas.
// Aquí están los métodos para leer, crear, actualizar y borrar datos.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Escuela, EscuelaDocument } from './escuela.schema';
import { CreateEscuelaDto, UpdateEscuelaDto } from './escuela.dto';

@Injectable()
export class EscuelaService {
  constructor(
    @InjectModel(Escuela.name)
    private readonly escuelaModel: Model<EscuelaDocument>,
  ) {}

  // GET /escuelas
  async findAll(): Promise<EscuelaDocument[]> {
    return this.escuelaModel.find().sort({ createdAt: 1 }).exec();
  }

  // GET /escuelas/:id
  async findOne(id: string): Promise<EscuelaDocument> {
    const doc = await this.escuelaModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Escuela ${id} no encontrada`);
    return doc;
  }

  // POST /escuelas
  async create(dto: CreateEscuelaDto): Promise<EscuelaDocument> {
    const created = new this.escuelaModel(dto);
    return created.save();
  }

  // PATCH /escuelas/:id
  async update(id: string, dto: UpdateEscuelaDto): Promise<EscuelaDocument> {
    const updated = await this.escuelaModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Escuela ${id} no encontrada`);
    return updated;
  }

  // DELETE /escuelas/:id
  async remove(id: string): Promise<void> {
    const result = await this.escuelaModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Escuela ${id} no encontrada`);
  }
}
