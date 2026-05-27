// Controller REST para la entidad Escuela.
// Recibe las peticiones HTTP y llama al servicio correspondiente.
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
} from '@nestjs/common';
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
}
