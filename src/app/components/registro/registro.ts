import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante: Añadir FormsModule

@Component({
  selector: 'app-registrarse',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar FormsModule para usar ngModel
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistrarseComponent {

  // Propiedades para enlazar con los campos del formulario
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  // Propiedad para mostrar mensajes de error
  errorMessage = '';

  constructor(private router: Router) {}

  /**
   * Navega a la ruta especificada.
   * @param path La ruta a la que se quiere navegar.
   */
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  /**
   * Valida el formulario de registro y navega si es correcto.
   */
  register(): void {
    // 1. Validar que ningún campo esté vacío
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return; // Detiene la ejecución si hay un error
    }

    // 2. Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return; // Detiene la ejecución si hay un error
    }

    // Si todas las validaciones pasan
    this.errorMessage = ''; // Limpia cualquier mensaje de error previo
    console.log('¡Registro exitoso!');
    
    // Navega a la página de inicio de sesión exitoso
    this.router.navigate(['/inicio-logeado']);
  }
}
