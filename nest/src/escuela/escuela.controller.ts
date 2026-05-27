// ─── CONTROLLER ──────────────────────────────────────────────
// El Controller es la "puerta de entrada" de las peticiones HTTP.
// Recibe la petición, la delega al Service y devuelve la respuesta.
// ─────────────────────────────────────────────────────────────
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

// @Controller('escuelas') define la ruta base: /escuelas
@Controller('escuelas')
export class EscuelaController {
  // NestJS inyecta el servicio automáticamente
  constructor(private readonly escuelaService: EscuelaService) {}

  // GET /escuelas — lista todas las escuelas
  @Get()
  findAll() {
    return this.escuelaService.findAll();
  }

  // GET /escuelas/:id — trae una escuela por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.escuelaService.findOne(id);
  }

  // POST /escuelas — crea una nueva escuela con los datos del body
  @Post()
  create(@Body() dto: CreateEscuelaDto) {
    return this.escuelaService.create(dto);
  }

  // PATCH /escuelas/:id — modifica parcialmente una escuela
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEscuelaDto) {
    return this.escuelaService.update(id, dto);
  }

  // DELETE /escuelas/:id — elimina una escuela (responde 204 sin contenido)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.escuelaService.remove(id);
  }
}
