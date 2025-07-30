import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CancionesService } from '../../services/canciones.service';
import { CancionData } from '../../interfaces/cancion.interface';

@Component({
  selector: 'app-canciones',
  imports: [],
  templateUrl: './canciones.html',
  styleUrl: './canciones.css'
})
export class Canciones {
  
  canciones: CancionData[] = [];

  constructor(
    private router: Router,
    private cancionesService: CancionesService
  ) {
    // Cargar todas las canciones disponibles
    this.canciones = this.cancionesService.obtenerTodasLasCanciones();
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  // Método para navegar a diferentes secciones de la aplicación
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
        console.log('Sección no reconocida:', section);
    }
  }

  playSong(songId: string) {
    console.log('Reproduciendo canción:', songId);
    
    // Verificar que la canción existe antes de navegar
    if (this.cancionesService.existeCancion(songId)) {
      this.router.navigate(['/juego-cancion', songId]);
    } else {
      console.error('Canción no encontrada:', songId);
    }
  }
}