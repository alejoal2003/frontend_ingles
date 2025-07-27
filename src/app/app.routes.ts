import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/pagina-principal/pagina-principal').then(m => m.PaginaPrincipal)
  },
  { 
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  { 
    path: 'registrarse', // RUTA CORREGIDA
    loadComponent: () => import('./components/registro/registro').then(m => m.RegistrarseComponent)
  },
  { 
    path: 'inicio-logeado', 
    loadComponent: () => import('./components/inicio-logeado/inicio-logeado').then(m => m.InicioLogeado)
  },
  { 
    path: 'lecturas', 
    loadComponent: () => import('./components/lecturas/lecturas').then(m => m.Lecturas)
  },
  { 
    path: 'canciones', 
    loadComponent: () => import('./components/canciones/canciones').then(m => m.Canciones)
  },
  { 
    path: 'progreso', 
    loadComponent: () => import('./components/progreso/progreso').then(m => m.Progreso)
  },
  { 
    path: 'lecciones', 
    loadComponent: () => import('./components/lecciones/lecciones').then(m => m.Lecciones)
  },
  { 
    path: 'configuraciones', 
    loadComponent: () => import('./components/configuraciones/configuraciones').then(m => m.Configuraciones)
  },
  { path: '**', redirectTo: '' }
];
