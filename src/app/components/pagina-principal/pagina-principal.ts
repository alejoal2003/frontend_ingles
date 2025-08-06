import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-principal',
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.css'
})
export class PaginaPrincipal {
  
  constructor(private router: Router) {}
  
  showScreen(screenName: string) {
    switch(screenName) {
      case 'login': // CASO AÑADIDO
        this.router.navigate(['/login']);
        break;
      case 'registrarse': // NUEVO CASO AÑADIDO
        this.router.navigate(['/registrarse']);
        break;
      case 'test':
      case 'profile': // Este caso se mantiene por si es usado por otros elementos
        this.router.navigate(['/inicio-logeado']);
        break;
      default:
        // Para las otras tarjetas, podrías querer navegar a sus respectivas rutas
        // Por ejemplo: this.router.navigate([`/${screenName}`]);
        console.log('Navegación para:', screenName, 'no implementada aún.');
    }
  }
}
