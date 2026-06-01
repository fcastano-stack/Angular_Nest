import { Component, ViewEncapsulation, signal, inject, OnDestroy } from '@angular/core';
import { switchMap, catchError, of } from 'rxjs';
import { EscuelaService, Escuela } from './escuela.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  encapsulation: ViewEncapsulation.None,
})
export class App implements OnDestroy {
  private readonly svc = inject(EscuelaService);

  protected readonly title = signal('Gestión de Escuelas 2026');
  items      = signal<Escuela[]>([]);
  loading    = signal(false);
  saving     = signal(false);
  newName    = signal('');
  notification     = signal('');
  notificationType = signal<'success' | 'error' | 'info'>('success');

  // Archivo e imagen de previsualización del formulario
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);

  private notificationTimeout: number | null = null;

  constructor() {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.svc.getAll().subscribe({
      next:  (data) => { this.items.set(data); this.loading.set(false); },
      error: (err)  => { console.error('Error al cargar escuelas', err); this.loading.set(false); },
    });
  }

  // Guarda el archivo elegido y genera una previsualización local
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      this.imagePreview.set(null);
    }
  }

  // Crea la escuela y, si hay imagen seleccionada, la sube a Cloudinary
  addItem(): void {
    const name = this.newName().trim();
    if (!name || this.saving()) return;
    this.saving.set(true);

    this.svc.create(name).pipe(
      switchMap(created => {
        if (this.selectedFile) {
          return this.svc.uploadImage(created._id, this.selectedFile).pipe(
            catchError(() => of(created)) // si falla la imagen, igual guarda la escuela
          );
        }
        return of(created);
      })
    ).subscribe({
      next: (final) => {
        this.items.update(arr => [...arr, final]);
        this.clearForm();
        this.saving.set(false);
        this.showNotification('Escuela registrada correctamente.', 'success');
      },
      error: (err) => {
        console.error('Error al crear escuela', err);
        this.saving.set(false);
        this.showNotification('Error al registrar la escuela.', 'error');
      },
    });
  }

  clearForm(): void {
    this.newName.set('');
    this.selectedFile = null;
    this.imagePreview.set(null);
  }

  deleteItem(id: string): void {
    this.svc.delete(id).subscribe({
      next:  () =>  this.items.update(arr => arr.filter(i => i._id !== id)),
      error: (err) => console.error('Error al eliminar', err),
    });
  }

  updateItem(id: string, name: string): void {
    if (!name.trim()) return;
    this.svc.update(id, name).subscribe({
      next: (updated) => {
        this.items.update(arr => arr.map(it => it._id === id ? updated : it));
        this.showNotification('Escuela modificada correctamente.', 'success');
      },
      error: (err) => console.error('Error al actualizar', err),
    });
  }

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
