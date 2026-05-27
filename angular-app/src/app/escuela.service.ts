// Servicio Angular que habla con el backend NestJS.
// Aquí están las llamadas HTTP para listar, crear, editar y borrar escuelas.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Escuela {
  _id: string;   // MongoDB usa _id en lugar de id numérico
  name: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class EscuelaService {
  private readonly base = `${environment.apiUrl}/escuelas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(this.base);
  }

  create(name: string): Observable<Escuela> {
    return this.http.post<Escuela>(this.base, { name });
  }

  update(id: string, name: string): Observable<Escuela> {
    return this.http.patch<Escuela>(`${this.base}/${id}`, { name });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
