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
    // Aquí puedes agregar la lógica para reproducir la canción
    // Por ejemplo, cambiar el estado visual de la tarjeta
    
    // Remover la clase 'playing' de todas las tarjetas
    const allCards = document.querySelectorAll('.cancion-card');
    allCards.forEach(card => card.classList.remove('playing'));
    
    // Agregar la clase 'playing' a la tarjeta seleccionada
    const targetCard = document.querySelector(`[data-song="${songId}"]`);
    if (targetCard) {
      targetCard.classList.add('playing');
    }
    
    // Simulación de reproducción - en una implementación real aquí iría la lógica del reproductor de audio
    setTimeout(() => {
      console.log(`Reproduciendo: ${songId}`);
    }, 100);
  }

}