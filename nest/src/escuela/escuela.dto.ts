// DTOs son objetos que describen los datos que se reciben por HTTP.
// Se usan para validar y tipar lo que llega al backend.
export class CreateEscuelaDto {
  name: string;
}

export class UpdateEscuelaDto {
  name?: string;
}
