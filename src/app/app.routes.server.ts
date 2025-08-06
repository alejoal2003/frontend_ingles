import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'registrarse',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'inicio-logeado',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'lecturas',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'canciones',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'progreso',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'lecciones',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'configuraciones',
    renderMode: RenderMode.Prerender
  },
  // Rutas con parámetros usan Server-Side Rendering
  {
    path: 'juego-lectura/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'juego-leccion/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'juego-cancion/**',
    renderMode: RenderMode.Server
  },
  // Ruta catch-all para rutas no definidas
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
