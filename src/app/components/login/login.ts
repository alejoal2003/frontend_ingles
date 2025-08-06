// Se importa HostListener de @angular/core
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  constructor(private router: Router) {}

  // --- FUNCIÓN AÑADIDA ---
  /**
   * Escucha el evento de teclado a nivel de ventana.
   * Si se presiona Ctrl+Enter (o Cmd+Enter en Mac), se inicia sesión.
   * @param event El evento del teclado.
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Comprueba si se presionó Enter junto con Ctrl o la tecla Command (para Mac)
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault(); // Evita cualquier comportamiento por defecto del navegador
      this.login();
    }
  }

  /**
   * Navigates to the specified path.
   * @param path The path to navigate to.
   */
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  /**
   * Handles the login logic.
   * For now, it navigates to the logged-in home page.
   */
  login(): void {
    // Here you would typically have your authentication logic
    console.log('Attempting to log in with keyboard shortcut...');
    
    // On successful login, navigate to the main area
    this.router.navigate(['/inicio-logeado']);
  }
}