// ─── ENVIRONMENT (Desarrollo local) ──────────────────────────
// Este archivo se usa cuando corremos la app con: ng serve
// Angular usa automáticamente environment.ts en modo desarrollo
// y environment.prod.ts cuando se hace ng build (producción)
export const environment = {
  production: false,
  // URL del backend corriendo en tu computadora
  apiUrl: 'http://localhost:3000',
};
