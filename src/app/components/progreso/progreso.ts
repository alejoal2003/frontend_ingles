import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressService, ProgressStats } from '../../services/progress.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progreso',
  imports: [CommonModule],
  templateUrl: './progreso.html',
  styleUrl: './progreso.css',
  standalone: true
})
export class Progreso implements OnInit, OnDestroy {
  progressStats: ProgressStats | null = null;
  private progressSubscription?: Subscription;

  constructor(
    private router: Router,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    // Suscribirse a los cambios de progreso
    this.progressSubscription = this.progressService.progress$.subscribe(
      progress => {
        this.progressStats = progress;
      }
    );
  }

  ngOnDestroy() {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
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
      case 'lectura':
        this.router.navigate(['/lecturas']);
        break;
      case 'musica':
        this.router.navigate(['/canciones']);
        break;
      case 'lecciones':
        this.router.navigate(['/lecciones']);
        break;
      case 'config':
        this.router.navigate(['/configuraciones']);
        break;
      default:
        console.log('Navegando a:', section);
    }
  }

  // Métodos para obtener datos del gráfico semanal
  getWeeklyChartData() {
    if (!this.progressStats) return [];
    
    // Obtener las últimas 3 semanas para el gráfico
    const recentWeeks = this.progressStats.weeklyStudyData.slice(0, 3).reverse();
    
    // Si no hay datos suficientes, completar con ceros
    while (recentWeeks.length < 3) {
      recentWeeks.unshift({ week: '', hours: 0 });
    }
    
    return recentWeeks;
  }

  // Calcular altura de barras del gráfico (máximo 100%)
  getBarHeight(hours: number): string {
    if (!this.progressStats) return '0%';
    
    const maxHours = Math.max(...this.getWeeklyChartData().map(w => w.hours), 1);
    const percentage = Math.min((hours / maxHours) * 100, 100);
    return `${Math.max(percentage, 5)}%`; // Mínimo 5% para visibilidad
  }

  // Formatear horas de estudio
  formatStudyHours(): string {
    if (!this.progressStats) return '0';
    return Math.round(this.progressStats.totalStudyHours).toString();
  }

  // Calcular porcentaje de progreso al siguiente nivel
  getLevelProgress(): number {
    if (!this.progressStats) return 0;
    
    const currentXP = this.progressStats.currentXP;
    const nextLevelXP = this.progressStats.nextLevelXP;
    
    // Encontrar XP del nivel actual
    const levels = [
      { name: 'Principiante 1', xp: 0 },
      { name: 'Principiante 2', xp: 500 },
      { name: 'Principiante 3', xp: 1200 },
      { name: 'Intermedio 1', xp: 2000 },
      { name: 'Intermedio 2', xp: 3000 },
      { name: 'Intermedio 3', xp: 4500 },
      { name: 'Avanzado 1', xp: 6500 },
      { name: 'Avanzado 2', xp: 9000 },
      { name: 'Avanzado 3', xp: 12000 },
      { name: 'Experto', xp: 16000 }
    ];

    const currentLevel = levels.find(l => l.name === this.progressStats!.currentLevel);
    if (!currentLevel) return 0;

    const currentLevelXP = currentLevel.xp;
    const xpInCurrentLevel = currentXP - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    
    if (xpNeededForNextLevel <= 0) return 100; // Nivel máximo
    
    return Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);
  }

  // Obtener estadísticas específicas por tipo de lección
  getGrammarStats() {
    return this.progressService.getLessonStats('grammar');
  }

  getListeningStats() {
    return this.progressService.getLessonStats('listening');
  }

  getVocabularyStats() {
    return this.progressService.getLessonStats('vocabulary');
  }

  // Método para reiniciar progreso (solo para desarrollo/testing)
  resetProgress() {
    if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
      this.progressService.resetProgress();
    }
  }

  // Navegar a una lección específica
  startLesson(type: 'grammar' | 'listening' | 'vocabulary') {
    this.router.navigate(['/juego-leccion', type]);
  }
}