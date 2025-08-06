import { Component, HostListener } from '@angular/core'; // Import HostListener
import { Router } from '@angular/router';

@Component({
  selector: 'app-lecciones',
  imports: [],
  templateUrl: './lecciones.html',
  styleUrl: './lecciones.css'
})
export class Lecciones {

  // --- NEW PROPERTIES ---
  selectedLessonIndex: number | null = null;
  private lessonTypes = ['grammar', 'listening', 'vocabulary'];

  constructor(private router: Router) {}

  // --- NEW METHOD: KEYBOARD EVENT LISTENER ---
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Select lesson with keys 1, 2, 3
    if (['1', '2', '3'].includes(event.key)) {
      this.selectedLessonIndex = parseInt(event.key, 10) - 1;
    } 
    // Start lesson with Enter key
    else if (event.key === 'Enter' && this.selectedLessonIndex !== null) {
      event.preventDefault(); // Prevent any default browser action
      const lessonType = this.lessonTypes[this.selectedLessonIndex];
      this.startLesson(lessonType);
    }
  }
  
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