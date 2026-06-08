// Lógica de negocio: consultas a MongoDB y subida de imágenes a Cloudinary
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Escuela, EscuelaDocument } from './escuela.schema';
import { CreateEscuelaDto, UpdateEscuelaDto } from './escuela.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class EscuelaService {
  constructor(
    @InjectModel(Escuela.name)
    private readonly escuelaModel: Model<EscuelaDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async findAll(): Promise<EscuelaDocument[]> {
    return this.escuelaModel.find().sort({ createdAt: 1 }).exec();
  }

  async findOne(id: string): Promise<EscuelaDocument> {
    const doc = await this.escuelaModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Escuela ${id} no encontrada`);
    return doc;
  }

  async create(dto: CreateEscuelaDto): Promise<EscuelaDocument> {
    return new this.escuelaModel(dto).save();
  }

  async update(id: string, dto: UpdateEscuelaDto): Promise<EscuelaDocument> {
    const updated = await this.escuelaModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Escuela ${id} no encontrada`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.escuelaModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Escuela ${id} no encontrada`);
  }

  // Sube el archivo a Cloudinary y guarda la URL resultante en MongoDB
  async uploadImage(id: string, file: Express.Multer.File): Promise<EscuelaDocument> {
    const { secure_url } = await this.cloudinaryService.uploadImage(file);
    return this.update(id, { imageUrl: secure_url });
  }
}
