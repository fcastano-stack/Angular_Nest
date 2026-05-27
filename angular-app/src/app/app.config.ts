// Importaciones necesarias para la configuración de la aplicación Angular
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
// import { provideRouter } from '@angular/router';

// Importa las rutas definidas para la aplicación
// import { routes } from './app.routes';

// Configuración principal de la aplicación Angular
export const appConfig: ApplicationConfig = {
  providers: [
    // Proporciona manejo global de errores en el navegador
    provideBrowserGlobalErrorListeners(),
    // Configura la detección de cambios de Zone.js con coalescencia de eventos para mejor rendimiento
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Cliente HTTP para llamadas a la API REST
    provideHttpClient(),
    // Configura el enrutador con las rutas definidas
    // provideRouter(routes)
  ]
};
