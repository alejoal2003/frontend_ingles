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
    // Subscribe to progress changes
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
        console.log('Navigating to:', section);
    }
  }

  // Methods to get weekly chart data
  getWeeklyChartData() {
    if (!this.progressStats) return [];
    
    // Get the last 3 weeks for the chart
    const recentWeeks = this.progressStats.weeklyStudyData.slice(0, 3).reverse();
    
    // If there's not enough data, fill with zeros
    while (recentWeeks.length < 3) {
      recentWeeks.unshift({ week: '', hours: 0 });
    }
    
    return recentWeeks;
  }

  // Calculate chart bar height (maximum 100%)
  getBarHeight(hours: number): string {
    if (!this.progressStats) return '0%';
    
    const maxHours = Math.max(...this.getWeeklyChartData().map(w => w.hours), 1);
    const percentage = Math.min((hours / maxHours) * 100, 100);
    return `${Math.max(percentage, 5)}%`; // Minimum 5% for visibility
  }

  // Format study hours
  formatStudyHours(): string {
    if (!this.progressStats) return '0';
    return Math.round(this.progressStats.totalStudyHours).toString();
  }

  // Calculate progress percentage to next level
  getLevelProgress(): number {
    if (!this.progressStats) return 0;
    
    const currentXP = this.progressStats.currentXP;
    const nextLevelXP = this.progressStats.nextLevelXP;
    
    // Find current level XP
    const levels = [
      { name: 'Beginner 1', xp: 0 },
      { name: 'Beginner 2', xp: 500 },
      { name: 'Beginner 3', xp: 1200 },
      { name: 'Intermediate 1', xp: 2000 },
      { name: 'Intermediate 2', xp: 3000 },
      { name: 'Intermediate 3', xp: 4500 },
      { name: 'Advanced 1', xp: 6500 },
      { name: 'Advanced 2', xp: 9000 },
      { name: 'Advanced 3', xp: 12000 },
      { name: 'Expert', xp: 16000 }
    ];

    const currentLevel = levels.find(l => l.name === this.progressStats!.currentLevel);
    if (!currentLevel) return 0;

    const currentLevelXP = currentLevel.xp;
    const xpInCurrentLevel = currentXP - currentLevelXP;
    const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
    
    if (xpNeededForNextLevel <= 0) return 100; // Maximum level
    
    return Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);
  }

  // Get specific statistics by lesson type
  getGrammarStats() {
    return this.progressService.getLessonStats('grammar');
  }

  getListeningStats() {
    return this.progressService.getLessonStats('listening');
  }

  getVocabularyStats() {
    return this.progressService.getLessonStats('vocabulary');
  }

  // Method to reset progress (for development/testing only)
  resetProgress() {
    if (confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
      this.progressService.resetProgress();
    }
  }

  // Navigate to a specific lesson
  startLesson(type: 'grammar' | 'listening' | 'vocabulary') {
    this.router.navigate(['/juego-leccion', type]);
  }
}