import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-canciones',
  imports: [],
  templateUrl: './canciones.html',
  styleUrl: './canciones.css'
})
export class Canciones {

  constructor(private router: Router) {}
  
  navigateToHome() {
    this.router.navigate(['/inicio-logeado']);
  }
  
  navigateToProfile() {
    this.router.navigate(['/inicio-logeado']);
  }
  
  logout() {
    this.router.navigate(['/']);
  }
  
  navigateToSection(section: string) {
    switch(section) {
      case 'inicio':
        this.router.navigate(['/inicio-logeado']);
        break;
      case 'lecturas':
        this.router.navigate(['/lecturas']);
        break;
      case 'progreso':
        this.router.navigate(['/progreso']);
        break;
      case 'lecciones':
        this.router.navigate(['/lecciones']);
        break;
      case 'config':
        this.router.navigate(['/configuraciones']);
        break;
      default:
        console.log('Navegando a:', section);
    }
  }

  playSong(songId: string) {
    console.log('Reproduciendo canción:', songId);
    // Navegar al juego de la canción
    this.router.navigate(['/juego-cancion', songId]);    
  }

}