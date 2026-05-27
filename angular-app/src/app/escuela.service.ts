// ─── ESCUELA SERVICE ────────────────────────────────────────
// El Service en Angular es quien hace las llamadas HTTP al backend.
// El componente (app.ts) llama a estos métodos y muestra los resultados.
// ─────────────────────────────────────────────────────────────
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// Interface: define la forma del objeto Escuela que devuelve el backend
export interface Escuela {
  _id: string;   // MongoDB usa _id en lugar de id numérico
  name: string;
  createdAt?: string;
}

// @Injectable hace que Angular pueda inyectar este servicio en cualquier componente
@Injectable({ providedIn: 'root' })
export class EscuelaService {
  // URL base: se arma con el environment + la ruta del recurso
  private readonly base = `${environment.apiUrl}/escuelas`;

  constructor(private http: HttpClient) {}

  // GET /escuelas — devuelve un Observable con el array de escuelas
  getAll(): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(this.base);
  }

  // POST /escuelas — crea una nueva escuela
  create(name: string): Observable<Escuela> {
    return this.http.post<Escuela>(this.base, { name });
  }

  // PATCH /escuelas/:id — actualiza el nombre de una escuela
  update(id: string, name: string): Observable<Escuela> {
    return this.http.patch<Escuela>(`${this.base}/${id}`, { name });
  }

  // DELETE /escuelas/:id — elimina una escuela
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
