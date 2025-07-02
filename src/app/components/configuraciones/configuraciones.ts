import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuraciones',
  imports: [],
  templateUrl: './configuraciones.html',
  styleUrl: './configuraciones.css'
})
export class Configuraciones {

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
      case 'lecciones':
        this.router.navigate(['/lecciones']);
        break;
      default:
        console.log('Navegando a:', section);
    }
  }

}
