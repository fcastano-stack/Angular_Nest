INTEGRACIÓN DE CLOUDINARY EN ANGULAR + NESTJS
==============================================
Proyecto: Angular_Nest | Backend: NestJS + MongoDB | Storage: Cloudinary
Fecha: Junio 2026

═══════════════════════════════════════════════════════════════
PASO 1 — INSTALAR DEPENDENCIAS (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest

  npm install cloudinary multer
  npm install --save-dev @types/multer

  - cloudinary   → SDK oficial para subir archivos a la nube
  - multer        → middleware que procesa multipart/form-data (archivos)
  - @types/multer → tipos TypeScript para Express.Multer.File


═══════════════════════════════════════════════════════════════
PASO 2 — CONFIGURAR VARIABLES DE ENTORNO (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest/.env

  CLOUDINARY_CLOUD_NAME=tu_cloud_name
  CLOUDINARY_API_KEY=tu_api_key
  CLOUDINARY_API_SECRET=tu_api_secret

  Estas credenciales se obtienen en:
  https://console.cloudinary.com → Settings → API Keys

  IMPORTANTE: el API Secret NUNCA debe ir en el frontend ni en un
  repositorio público. Solo en el .env del backend.


═══════════════════════════════════════════════════════════════
PASO 3 — CREAR EL PROVIDER (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest/src/cloudinary/cloudinary.provider.ts

  Inicializa y configura el SDK de Cloudinary con las variables de
  entorno. NestJS lo gestiona como un "token inyectable".

  Código clave:
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });


═══════════════════════════════════════════════════════════════
PASO 4 — CREAR EL SERVICE (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest/src/cloudinary/cloudinary.service.ts

  Contiene el método uploadImage() que:
  1. Recibe un archivo (Express.Multer.File) con su buffer en memoria
  2. Abre un stream de subida a Cloudinary (upload_stream)
  3. Devuelve una Promise con la respuesta (incluye secure_url)
  4. Guarda las imágenes en la carpeta "escuelas" de tu cuenta Cloudinary

  Código clave:
    uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
      return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: 'escuelas' },
          (error, result) => { ... }
        );
        Readable.from(file.buffer).pipe(upload);
      });
    }


═══════════════════════════════════════════════════════════════
PASO 5 — CREAR EL MODULE (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest/src/cloudinary/cloudinary.module.ts

  Agrupa Provider y Service en un módulo reutilizable.
  Exporta CloudinaryService para que otros módulos puedan usarlo.

  Código clave:
    @Module({
      providers: [CloudinaryProvider, CloudinaryService],
      exports: [CloudinaryService],
    })
    export class CloudinaryModule {}


═══════════════════════════════════════════════════════════════
PASO 6 — ACTUALIZAR EL SCHEMA DE MONGODB (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest/src/escuela/escuela.schema.ts

  Agregar el campo imageUrl para guardar la URL de la imagen:

    @Prop({ default: null })
    imageUrl: string | null;

  Mongoose lo almacena en cada documento de la colección "escuelas".


═══════════════════════════════════════════════════════════════
PASO 7 — ACTUALIZAR EL DTO (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest/src/escuela/escuela.dto.ts

  Agregar imageUrl al DTO de actualización para que el service
  pueda persistir la URL devuelta por Cloudinary:

    export class UpdateEscuelaDto {
      name?: string;
      imageUrl?: string | null;
    }


═══════════════════════════════════════════════════════════════
PASO 8 — ACTUALIZAR EL SERVICE DE ESCUELA (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest/src/escuela/escuela.service.ts

  1. Inyectar CloudinaryService en el constructor
  2. Agregar el método uploadImage() que:
     - Llama a cloudinaryService.uploadImage(file)
     - Obtiene la secure_url de la respuesta
     - Actualiza el documento en MongoDB con esa URL

  Código clave:
    async uploadImage(id: string, file: Express.Multer.File) {
      const { secure_url } = await this.cloudinaryService.uploadImage(file);
      return this.update(id, { imageUrl: secure_url });
    }


═══════════════════════════════════════════════════════════════
PASO 9 — ACTUALIZAR EL CONTROLLER (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest/src/escuela/escuela.controller.ts

  Agregar el endpoint que recibe el archivo del frontend:

    POST /escuelas/:id/imagen
    Content-Type: multipart/form-data
    Campo del archivo: "image"

  Decoradores clave:
    @Post(':id/imagen')
    @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
    uploadImage(@Param('id') id, @UploadedFile() file) { ... }

  memoryStorage() guarda el archivo en RAM (no en disco),
  ideal para pasarlo directamente al stream de Cloudinary.


═══════════════════════════════════════════════════════════════
PASO 10 — REGISTRAR EL MÓDULO (NestJS)
═══════════════════════════════════════════════════════════════
Ubicación: /nest/src/escuela/escuela.module.ts

  Importar CloudinaryModule para que EscuelaService pueda
  usar CloudinaryService:

    @Module({
      imports: [
        MongooseModule.forFeature([...]),
        CloudinaryModule,        ← agregar esto
      ],
      ...
    })


═══════════════════════════════════════════════════════════════
PASO 11 — ACTUALIZAR EL SERVICE DE ANGULAR (Frontend)
═══════════════════════════════════════════════════════════════
Ubicación: /angular-app/src/app/escuela.service.ts

  1. Agregar imageUrl al interface Escuela:

    export interface Escuela {
      _id: string;
      name: string;
      imageUrl?: string | null;
      createdAt?: string;
    }

  2. Agregar método para llamar al endpoint de subida de imagen:

    uploadImage(id: string, file: File): Observable<Escuela> {
      const formData = new FormData();
      formData.append('image', file);
      return this.http.post<Escuela>(`${this.base}/${id}/imagen`, formData);
    }

  Notas importantes:
  • Usar FormData (no JSON) porque el backend espera multipart/form-data
  • NO agregar Content-Type manualmente; el navegador lo hace solo
  • El response incluirá { imageUrl: "https://..." } desde Cloudinary


═══════════════════════════════════════════════════════════════
PASO 12 — USAR EN EL COMPONENTE ANGULAR (Frontend)
═══════════════════════════════════════════════════════════════
Ubicación: /angular-app/src/app/app.ts

  TYPESCRIPT — Variables y métodos:

    // Archivo seleccionado y vista previa local
    selectedFile: File | null = null;
    imagePreview = signal<string | null>(null);

    // Guardar el archivo elegido y generar preview con DataURL
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

    // Crear escuela y luego subir imagen (si existe)
    // Usa switchMap para encadenar operaciones asincrónicas
    addItem(): void {
      const name = this.newName().trim();
      if (!name || this.saving()) return;
      this.saving.set(true);

      this.svc.create(name).pipe(
        switchMap(created => {
          if (this.selectedFile) {
            // Si hay archivo, subir después de crear la escuela
            return this.svc.uploadImage(created._id, this.selectedFile).pipe(
              catchError(() => of(created)) // si falla imagen, igual retorna escuela
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

  HTML — Formulario de registro:

    <!-- Input file -->
    <label class="file-label" [class.file-selected]="selectedFile">
      <input type="file" accept="image/*" (change)="onFileSelected($event)" style="display:none">
      <i class="fas fa-upload"></i>
      {{ selectedFile ? selectedFile.name : 'Elegir imagen...' }}
    </label>

    <!-- Vista previa local (antes de guardar) -->
    @if (imagePreview()) {
      <img [src]="imagePreview()!" class="img-preview" alt="vista previa">
    }

  HTML — Tabla con miniaturas:

    <img
      [src]="item.imageUrl"
      class="thumb thumb-clickable"
      [alt]="item.name"
      (click)="openImageModal(item.imageUrl)"
      title="Click para ampliar"
    >


═══════════════════════════════════════════════════════════════
PASO 13 — MODAL PARA VER IMAGEN EN GRANDE (Frontend)
═══════════════════════════════════════════════════════════════
Ubicación: /angular-app/src/app/app.ts + app.html + app.css

  TYPESCRIPT — Signal y métodos del modal:

    // URL de la imagen a mostrar en el modal
    modalImageUrl = signal<string | null>(null);

    // Abre el modal si hay URL
    openImageModal(imageUrl: string | undefined): void {
      if (imageUrl) this.modalImageUrl.set(imageUrl);
    }

    // Cierra el modal limpiando la URL
    closeImageModal(): void {
      this.modalImageUrl.set(null);
    }

  HTML — Estructura del modal:

    @if (modalImageUrl()) {
      <div class="modal-overlay" (click)="closeImageModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeImageModal()" title="Cerrar">
            <i class="fas fa-times"></i>
          </button>
          <img [src]="modalImageUrl()!" [alt]="'Imagen grande'" class="modal-image">
        </div>
      </div>
    }

  Notas sobre el diseño:
  • El modal-overlay ocupa toda la pantalla con fixed positioning
  • Al hacer click en el fondo (overlay), se cierra el modal
  • Al hacer click en la imagen, stopPropagation() evita cerrar
  • El botón X está en z-index: 1001 para estar sobre todo
  • La imagen usa object-fit: contain para no distorsionarse

  CSS — Estilos importantes:

    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-image {
      width: 100%;
      height: 100%;
      object-fit: contain; // respeta proporciones, no distorsiona
    }

    .modal-close {
      position: absolute;
      top: 1rem; right: 1rem;
      width: 40px; height: 40px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 1001;
    }


═══════════════════════════════════════════════════════════════
FLUJO COMPLETO
═══════════════════════════════════════════════════════════════

  FLUJO DE REGISTRO CON IMAGEN:

    Usuario llena nombre + elige archivo
          ↓
    Hace click en "Registrar"
          ↓
    addItem() crea la escuela (POST /escuelas)
          ↓
    switchMap() encadena la próxima operación
          ↓
    Si hay archivo: uploadImage() sube a Cloudinary (POST /escuelas/:id/imagen)
          ↓
    Backend recibe en FileInterceptor → multer guarda en RAM
          ↓
    CloudinaryService abre upload_stream y sube a Cloudinary
          ↓
    Cloudinary responde con { secure_url: "https://..." }
          ↓
    Backend guarda secure_url en MongoDB (escuela.imageUrl)
          ↓
    Backend devuelve escuela actualizada
          ↓
    Angular actualiza items[] y muestra la miniatura en tabla
          ↓
    Usuario ve la imagen en tabla (40x40px)

  FLUJO DE VER IMAGEN GRANDE:

    Usuario hace click en miniatura de tabla
          ↓
    (click)="openImageModal(item.imageUrl)" dispara
          ↓
    openImageModal() escribe URL en signal modalImageUrl
          ↓
    @if (modalImageUrl()) renderiza el modal (overlay + imagen)
          ↓
    Usuario ve imagen a pantalla completa (90vw x 90vh)
          ↓
    Hace click en X o en el fondo oscuro
          ↓
    closeImageModal() limpia el signal
          ↓
    Modal desaparece, vuelve a tabla


═══════════════════════════════════════════════════════════════
ESTRUCTURA DE ARCHIVOS CREADOS / MODIFICADOS
═══════════════════════════════════════════════════════════════

  NUEVOS:
    nest/src/cloudinary/
      ├── cloudinary.provider.ts
      ├── cloudinary.service.ts
      └── cloudinary.module.ts

  MODIFICADOS — BACKEND:
    nest/.env                          → credenciales Cloudinary
    nest/.env.example                  → template
    nest/package.json                  → cloudinary + multer
    nest/src/escuela/escuela.schema.ts → campo imageUrl
    nest/src/escuela/escuela.dto.ts    → imageUrl en UpdateDto
    nest/src/escuela/escuela.service.ts → método uploadImage()
    nest/src/escuela/escuela.controller.ts → endpoint POST /:id/imagen
    nest/src/escuela/escuela.module.ts → importa CloudinaryModule

  MODIFICADOS — FRONTEND:
    angular-app/src/app/escuela.service.ts → Escuela interface + uploadImage()
    angular-app/src/app/app.ts             → signals, métodos, modal
    angular-app/src/app/app.html           → form file, preview, tabla, modal
    angular-app/src/app/app.css            → estilos modal, preview, thumbnails
    angular-app/angular.json               → fileReplacements (prod config)


═══════════════════════════════════════════════════════════════
CONCEPTOS CLAVE
═══════════════════════════════════════════════════════════════

  1. RxJS switchMap → Encadena operaciones asincrónicas
     • Primero: crear escuela
     • Luego: subir imagen (solo si existe archivo)
     • Si falla imagen: atrapar error con catchError

  2. FormData → Para archivos (multipart/form-data)
     • No se puede usar JSON
     • El navegador pone el boundary automático
     • No modificar Content-Type

  3. Angular Signals → Estado reactivo simple
     • signal() crea variable observable
     • .set() actualiza el valor
     • @if (signal()) en template se re-renderiza automático

  4. FileReader API → Para preview local
     • Lee el archivo como DataURL
     • Muestra imagen antes de guardar en servidor

  5. Cloudinary upload_stream → Para archivos grandes
     • Stream directo en RAM (no guardar en disco)
     • Más eficiente que upload_url

  6. Fixed positioning + z-index → Para modales
     • fixed: relativo a viewport, no al documento
     • z-index: 1000 para overlay, 1001 para botón X
     • click handlers + stopPropagation para control
