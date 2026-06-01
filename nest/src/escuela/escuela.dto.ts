// DTOs: definen qué datos acepta cada endpoint

// POST /escuelas
export class CreateEscuelaDto {
  name: string;
}

// PATCH /escuelas/:id
export class UpdateEscuelaDto {
  name?: string;
  imageUrl?: string | null;
}
