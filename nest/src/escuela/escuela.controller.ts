// Rutas HTTP del recurso Escuela
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { EscuelaService } from './escuela.service';
import { CreateEscuelaDto, UpdateEscuelaDto } from './escuela.dto';

@Controller('escuelas')
export class EscuelaController {
  constructor(private readonly escuelaService: EscuelaService) {}

  @Get()
  findAll() {
    return this.escuelaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.escuelaService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateEscuelaDto) {
    return this.escuelaService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEscuelaDto) {
    return this.escuelaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.escuelaService.remove(id);
  }

  // Recibe la imagen como multipart/form-data (campo "image"),
  // la guarda en memoria y la pasa al service para subirla a Cloudinary.
  @Post(':id/imagen')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.escuelaService.uploadImage(id, file);
  }
}
