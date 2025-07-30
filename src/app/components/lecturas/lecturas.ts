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
  
  // Datos simplificados de las lecturas (solo para mostrar la lista)
  lecturas: LecturaData[] = [
    {
      id: 1,
      titulo: 'Inteligencia Artificial',
      emoji: '🤖',
      descripcion: 'Explora los avances recientes y las implicaciones de la IA en nuestra vida diaria.'
    },
    {
      id: 2,
      titulo: 'Cultura Maya',
      emoji: '🏛️',
      descripcion: 'Un viaje a través de las fascinantes tradiciones y la historia del pueblo maya.'
    },
    {
      id: 3,
      titulo: 'Negocios Sostenibles',
      emoji: '📈',
      descripcion: 'Descubre cómo las empresas están adoptando modelos de negocio más sostenibles.'
    },
    {
      id: 4,
      titulo: 'Calentamiento Global',
      emoji: '🌍',
      descripcion: 'Un análisis de las últimas noticias sobre el calentamiento global y sus efectos.'
    },
    {
      id: 5,
      titulo: 'Shakespeare',
      emoji: '✍️',
      descripcion: 'Una introducción a la obra y el legado del famoso dramaturgo inglés.'
    },
    {
      id: 6,
      titulo: 'Vida Cotidiana',
      emoji: '🏠',
      descripcion: 'Frases y vocabulario esencial para situaciones comunes del día a día.'
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

  // Accesibilidad: Configurar navegación por teclado
  private setupKeyboardNavigation() {
    if (!this.isBrowser) return;

    this.keydownListener = (event: KeyboardEvent) => {
      // ESC para ir al inicio
      if (event.key === 'Escape') {
        this.navigateToHome();
        return;
      }

      // Números 1-6 para acceder directamente a las lecturas
      const num = parseInt(event.key);
      if (num >= 1 && num <= 6 && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        this.abrirLectura(num);
        this.announceSelection(num);
        return;
      }

      // H para ir al inicio (Home)
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

  // Accesibilidad: Anuncios para lectores de pantalla
  private announcePageLoad() {
    if (!this.isBrowser) return;
    
    setTimeout(() => {
      this.makeAnnouncement(
        'Página de lecturas cargada. Hay 6 lecturas disponibles. Usa las teclas 1-6 para acceder directamente a cada lectura, o navega con Tab.'
      );
    }, 1000);
  }

  private announceSelection(lecturaId: number) {
    const lectura = this.lecturas.find(l => l.id === lecturaId);
    if (lectura) {
      this.makeAnnouncement(
        `Abriendo lectura: ${lectura.titulo}. ${lectura.descripcion}`
      );
    }
  }

  private makeAnnouncement(message: string) {
    if (!this.isBrowser) return;
    
    const announcements = document.getElementById('announcements');
    if (announcements) {
      announcements.textContent = message;
      
      // Limpiar el anuncio después de 3 segundos
      setTimeout(() => {
        announcements.textContent = '';
      }, 3000);
    }
  }
  
  navigateToHome() {
    this.makeAnnouncement('Navegando al inicio');
    this.router.navigate(['/inicio-logeado']);
  }
  
  navigateToProfile() {
    this.makeAnnouncement('Navegando al perfil');
    this.router.navigate(['/inicio-logeado']);
  }
  
  logout() {
    this.makeAnnouncement('Cerrando sesión');
    this.router.navigate(['/']);
  }
  
  navigateToSection(section: string) {
    let destination = '';
    let message = '';
    
    switch(section) {
      case 'inicio':
        destination = '/inicio-logeado';
        message = 'Navegando al inicio';
        break;
      case 'musica':
        destination = '/canciones';
        message = 'Navegando a la sección de música';
        break;
      case 'progreso':
        destination = '/progreso';
        message = 'Navegando a la sección de progreso';
        break;
      case 'lecciones':
        destination = '/lecciones';
        message = 'Navegando a la sección de lecciones';
        break;
      case 'config':
        destination = '/configuraciones';
        message = 'Navegando a configuraciones';
        break;
      default:
        console.log('Navegando a:', section);
        return;
    }
    
    this.makeAnnouncement(message);
    this.router.navigate([destination]);
  }

  // Nueva funcionalidad: navegar al juego de lectura con accesibilidad
  abrirLectura(lecturaId: number) {
    const lectura = this.lecturas.find(l => l.id === lecturaId);
    
    if (lectura) {
      this.makeAnnouncement(
        `Abriendo juego de lectura: ${lectura.titulo}. ${lectura.descripcion}`
      );
      this.router.navigate(['/juego-lectura', lecturaId]);
    } else {
      this.makeAnnouncement('Error: Lectura no encontrada');
    }
  }
}