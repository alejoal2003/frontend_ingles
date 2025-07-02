import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-principal',
  imports: [],
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.css'
})
export class PaginaPrincipal {
  
  constructor(private router: Router) {}
  
  showScreen(screenName: string) {
    switch(screenName) {
      case 'test':
      case 'profile':
        this.router.navigate(['/inicio-logeado']);
        break;
      default:
        console.log('Navegando a:', screenName);
    }
  }

}
