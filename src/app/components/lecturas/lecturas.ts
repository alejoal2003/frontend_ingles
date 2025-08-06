import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface LecturaData {
  id: number;
  titulo: string;
  emoji: string;
  descripcion: string;
}

@Component({
  selector: 'app-lecturas',
  imports: [CommonModule],
  templateUrl: './lecturas.html',
  styleUrl: './lecturas.css'
})
export class Lecturas implements OnInit, OnDestroy {
  
  private isBrowser: boolean;
  private keydownListener?: (event: KeyboardEvent) => void;
  
  // Simplified reading data (just for showing the list)
  lecturas: LecturaData[] = [
    {
      id: 1,
      titulo: 'Artificial Intelligence',
      emoji: '🤖',
      descripcion: 'Explore recent advances and implications of AI in our daily lives.'
    },
    {
      id: 2,
      titulo: 'Mayan Culture',
      emoji: '🏛️',
      descripcion: 'A journey through the fascinating traditions and history of the Mayan people.'
    },
    {
      id: 3,
      titulo: 'Sustainable Business',
      emoji: '📈',
      descripcion: 'Discover how companies are adopting more sustainable business models.'
    },
    {
      id: 4,
      titulo: 'Global Warming',
      emoji: '🌍',
      descripcion: 'An analysis of the latest news about global warming and its effects.'
    },
    {
      id: 5,
      titulo: 'Shakespeare',
      emoji: '✍️',
      descripcion: 'An introduction to the work and legacy of the famous English playwright.'
    },
    {
      id: 6,
      titulo: 'Daily Life',
      emoji: '🏠',
      descripcion: 'Essential phrases and vocabulary for common day-to-day situations.'
    }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.setupKeyboardNavigation();
    this.announcePageLoad();
  }

  ngOnDestroy() {
    this.removeKeyboardNavigation();
  }

  // Accessibility: Set up keyboard navigation
  private setupKeyboardNavigation() {
    if (!this.isBrowser) return;

    this.keydownListener = (event: KeyboardEvent) => {
      // ESC to go to home
      if (event.key === 'Escape') {
        this.navigateToHome();
        return;
      }

      // Numbers 1-6 to directly access readings
      const num = parseInt(event.key);
      if (num >= 1 && num <= 6 && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        this.abrirLectura(num);
        this.announceSelection(num);
        return;
      }

      // H to go to home
      if (event.key.toLowerCase() === 'h' && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        this.navigateToHome();
        return;
      }
    };

    document.addEventListener('keydown', this.keydownListener);
  }

  private removeKeyboardNavigation() {
    if (this.isBrowser && this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener);
    }
  }

  // Accessibility: Announcements for screen readers
  private announcePageLoad() {
    if (!this.isBrowser) return;
    
    setTimeout(() => {
      this.makeAnnouncement(
        'Readings page loaded. There are 6 readings available. Use keys 1-6 to directly access each reading, or navigate with Tab.'
      );
    }, 1000);
  }

  private announceSelection(lecturaId: number) {
    const lectura = this.lecturas.find(l => l.id === lecturaId);
    if (lectura) {
      this.makeAnnouncement(
        `Opening reading: ${lectura.titulo}. ${lectura.descripcion}`
      );
    }
  }

  private makeAnnouncement(message: string) {
    if (!this.isBrowser) return;
    
    const announcements = document.getElementById('announcements');
    if (announcements) {
      announcements.textContent = message;
      
      // Clear announcement after 3 seconds
      setTimeout(() => {
        announcements.textContent = '';
      }, 3000);
    }
  }
  
  navigateToHome() {
    this.makeAnnouncement('Navigating to home');
    this.router.navigate(['/inicio-logeado']);
  }
  
  navigateToProfile() {
    this.makeAnnouncement('Navigating to profile');
    this.router.navigate(['/inicio-logeado']);
  }
  
  logout() {
    this.makeAnnouncement('Logging out');
    this.router.navigate(['/']);
  }
  
  navigateToSection(section: string) {
    let destination = '';
    let message = '';
    
    switch(section) {
      case 'inicio':
        destination = '/inicio-logeado';
        message = 'Navigating to home';
        break;
      case 'musica':
        destination = '/canciones';
        message = 'Navigating to music section';
        break;
      case 'progreso':
        destination = '/progreso';
        message = 'Navigating to progress section';
        break;
      case 'lecciones':
        destination = '/lecciones';
        message = 'Navigating to lessons section';
        break;
      case 'config':
        destination = '/configuraciones';
        message = 'Navigating to settings';
        break;
      default:
        console.log('Navigating to:', section);
        return;
    }
    
    this.makeAnnouncement(message);
    this.router.navigate([destination]);
  }

  // New functionality: navigate to reading game with accessibility
  abrirLectura(lecturaId: number) {
    const lectura = this.lecturas.find(l => l.id === lecturaId);
    
    if (lectura) {
      this.makeAnnouncement(
        `Opening reading game: ${lectura.titulo}. ${lectura.descripcion}`
      );
      this.router.navigate(['/juego-lectura', lecturaId]);
    } else {
      this.makeAnnouncement('Error: Reading not found');
    }
  }
}