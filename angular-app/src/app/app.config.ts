// ─── APP CONFIG ───────────────────────────────────────────────
// Configuración principal de la app Angular.
// Aquí se registran los servicios globales disponibles en toda la app.
// ─────────────────────────────────────────────────────────────
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Manejo global de errores del navegador
    provideBrowserGlobalErrorListeners(),
    // Optimización de detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Habilita HttpClient en toda la app (necesario para hacer peticiones HTTP)
    provideHttpClient(),
  ]
};
