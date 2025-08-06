import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-logeado',
  imports: [],
  templateUrl: './inicio-logeado.html',
  styleUrl: './inicio-logeado.css'
})
export class InicioLogeado implements OnInit {
  
  constructor(private router: Router) {}

  ngOnInit() {
    // Asegurar que la pantalla home esté activa al cargar el componente
    setTimeout(() => {
      this.showScreen('home');
    }, 0);
  }
  
  showScreen(screenName: string) {
    // Manejar navegación especial
    switch(screenName) {
      case 'test':
        this.router.navigate(['/']); // Salir - volver al inicio
        return;
      case 'reading':
        this.router.navigate(['/lecturas']); // Ir a la página de lecturas
        return;
      case 'songs':
        this.router.navigate(['/canciones']); // Ir a canciones
        return;
      case 'progress':
        this.router.navigate(['/progreso']); // Ir a progreso
        return;
      case 'lessons':
        this.router.navigate(['/lecciones']); // Ir a lecciones
        return;
      case 'settings':
        this.router.navigate(['/configuraciones']); // Ir a configuraciones
        return;
      case 'home':
        // Si ya estamos en inicio-logeado y hacen clic en 'home', mostrar la pantalla home local
        break;
      default:
        // Para otras pantallas, mostrar dentro del componente
        break;
    }

    // Ocultar todas las pantallas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      screen.classList.remove('active');
    });

    // Remover clase active de todos los nav-items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
    });

    // Mostrar la pantalla seleccionada
    const targetScreen = document.getElementById(screenName);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }

    // Activar el nav-item correspondiente basado en el texto
    const navTexts = {
      'home': 'Inicio',
      'profile': 'Perfil',
      'reading': 'Lecturas',
      'songs': 'Canciones',
      'progress': 'Progreso',
      'lessons': 'Lecciones',
      'settings': 'Configuración'
    };

    if (navTexts[screenName as keyof typeof navTexts]) {
      const targetNavText = navTexts[screenName as keyof typeof navTexts];
      const allNavItems = document.querySelectorAll('.nav-item');
      allNavItems.forEach(item => {
        const textElement = item.querySelector('.nav-text');
        if (textElement && textElement.textContent?.trim() === targetNavText) {
          item.classList.add('active');
        }
      });
    }

    console.log('Mostrando pantalla:', screenName);
  }

}
