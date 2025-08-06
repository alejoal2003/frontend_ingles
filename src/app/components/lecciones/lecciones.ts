import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lecciones',
  imports: [],
  templateUrl: './lecciones.html',
  styleUrl: './lecciones.css'
})
export class Lecciones {

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
      case 'musica':
        this.router.navigate(['/canciones']);
        break;
      case 'progreso':
        this.router.navigate(['/progreso']);
        break;
      case 'config':
        this.router.navigate(['/configuraciones']);
        break;
      default:
        console.log('Navegando a:', section);
    }
  }

  /**
   * Navega a la pantalla del juego, pasando el tipo de lección como un parámetro en la URL.
   * @param lessonType El tipo de lección ('grammar', 'listening', 'vocabulary').
   */
  startLesson(lessonType: string) {
    this.router.navigate(['/juego-leccion', lessonType]);
  }

}