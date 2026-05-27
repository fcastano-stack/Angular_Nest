// ─── DTOs (Data Transfer Objects) ──────────────────────────
// Un DTO define qué datos esperamos recibir en cada petición.
// Es como un "contrato" entre el frontend y el backend.
// ────────────────────────────────────────────────────────────

// DTO para crear una escuela (POST)
// El frontend debe enviar: { "name": "Escuela X" }
export class CreateEscuelaDto {
  name: string;
}

// DTO para actualizar una escuela (PATCH)
// El signo ? significa que el campo es opcional
export class UpdateEscuelaDto {
  name?: string;
}
