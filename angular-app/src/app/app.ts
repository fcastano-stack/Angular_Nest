// ─── APP COMPONENT ─────────────────────────────────────────
// El componente principal de la app Angular.
// Contiene la lógica de la pantalla: cargar, agregar, editar y borrar.
// Se comunica con el backend a través del EscuelaService.
// ─────────────────────────────────────────────────────────────
import { Component, ViewEncapsulation, signal, inject, OnDestroy } from '@angular/core';
import { EscuelaService, Escuela } from './escuela.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App implements OnDestroy {
  // Inyecta el servicio que hace las llamadas al backend.
  private readonly svc = inject(EscuelaService);

  // Estados simples con señales de Angular.
  protected readonly title = signal('Gestión de Escuelas 2026');
  items = signal<Escuela[]>([]);
  loading = signal(false);
  newName = signal('');
  notification = signal('');
  notificationType = signal<'success' | 'error' | 'info'>('success');
  private notificationTimeout: number | null = null;

  constructor() {
    this.loadItems();
  }

  // Carga todas las escuelas desde el backend.
  loadItems(): void {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar escuelas', err);
        this.loading.set(false);
      },
    });
  }

  // Crea una nueva escuela y actualiza la lista.
  addItem(): void {
    const name = this.newName().trim();
    if (!name) return;
    this.svc.create(name).subscribe({
      next: (created) => {
        this.items.update((arr) => [...arr, created]);
        this.newName.set('');
        this.showNotification('Escuela registrada correctamente.', 'success');
      },
      error: (err) => {
        console.error('Error al crear escuela', err);
        this.showNotification('Error al registrar la escuela.', 'error');
      },
    });
  }

  // Borra una escuela por su _id.
  deleteItem(id: string): void {
    this.svc.delete(id).subscribe({
      next: () => {
        this.items.update((arr) => arr.filter((i) => i._id !== id));
      },
      error: (err) => console.error('Error al eliminar', err),
    });
  }

  // Envía el nombre actualizado al backend.
  updateItem(id: string, name: string): void {
    if (!name.trim()) return;
    this.svc.update(id, name).subscribe({
      next: (updated) => {
        this.items.update((arr) =>
          arr.map((it) => (it._id === id ? updated : it)),
        );
        this.showNotification('Escuela modificada correctamente.', 'success');
      },
      error: (err) => console.error('Error al actualizar', err),
    });
  }

  // Muestra una notificación breve arriba en la pantalla.
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.notification.set(message);
    this.notificationType.set(type);
    if (this.notificationTimeout) window.clearTimeout(this.notificationTimeout);
    this.notificationTimeout = window.setTimeout(() => {
      this.notification.set('');
      this.notificationTimeout = null;
    }, 3200);
  }

  ngOnDestroy(): void {
    if (this.notificationTimeout) window.clearTimeout(this.notificationTimeout);
  }
}
