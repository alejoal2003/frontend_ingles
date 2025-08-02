import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuraciones.html', 
  styleUrl: './configuraciones.css'
})
export class Configuraciones {
  activeSection: string = 'perfil';

  constructor(private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    // Aquí puedes agregar lógica para limpiar el localStorage, sessionStorage, etc.
    this.router.navigate(['/']);
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    
    // Scroll to top when changing sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Log para debugging
    console.log('Sección activa:', section);
  }

  // Método para verificar si una sección está activa
  isActiveSection(section: string): boolean {
    return this.activeSection === section;
  }
}