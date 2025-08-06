// Se importa HostListener de @angular/core
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistrarseComponent {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private router: Router) {}

  // --- FUNCIÓN AÑADIDA ---
  /**
   * Escucha el evento de teclado a nivel de ventana.
   * Si se presiona Ctrl+Enter (o Cmd+Enter en Mac), se intenta el registro.
   * @param event El evento del teclado.
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.register();
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  register(): void {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.errorMessage = '';
    console.log('¡Registro exitoso con atajo de teclado!');
    
    this.router.navigate(['/inicio-logeado']);
  }
}