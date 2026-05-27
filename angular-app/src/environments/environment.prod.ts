// ─── ENVIRONMENT (Producción) ──────────────────────────────
// Este archivo se usa cuando la app se compila para producción.
// Apunta al backend real desplegado en Vercel.
export const environment = {
  production: true,
  // URL del backend en Vercel (sin /escuelas al final)
  apiUrl: 'https://angular-nest-api.vercel.app',
};
