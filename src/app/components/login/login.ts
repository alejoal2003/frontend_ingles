import { Component } from '@angular/core';
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
    console.log('Attempting to log in...');
    
    // On successful login, navigate to the main area
    this.router.navigate(['/inicio-logeado']);
  }
}
