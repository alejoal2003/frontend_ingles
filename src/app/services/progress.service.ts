import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

// Interfaces para el sistema de progreso
export interface LessonResult {
  lessonType: 'grammar' | 'listening' | 'vocabulary';
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number; // en minutos
  date: Date;
}

export interface WeeklyStudy {
  week: string;
  hours: number;
}

export interface ProgressStats {
  totalStudyHours: number;
  wordsLearned: number;
  lessonsCompleted: number;
  averageAccuracy: number;
  currentStreak: number;
  currentLevel: string;
  currentXP: number;
  nextLevelXP: number;
  weeklyStudyData: WeeklyStudy[];
  recentResults: LessonResult[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly STORAGE_KEY = 'english_master_progress';
  private progressSubject = new BehaviorSubject<ProgressStats>(this.getInitialProgress());
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Solo carga el progreso si se está ejecutando en un navegador.
    if (this.isBrowser) {
      this.loadProgress();
    }
  }

  get progress$() {
    return this.progressSubject.asObservable();
  }

  get currentProgress(): ProgressStats {
    return this.progressSubject.value;
  }

  // Método para agregar resultado de lección
  addLessonResult(result: LessonResult) {
    const currentProgress = this.currentProgress;
    
    // Agregar nuevo resultado
    currentProgress.recentResults.unshift(result);
    
    // Mantener solo los últimos 50 resultados
    if (currentProgress.recentResults.length > 50) {
      currentProgress.recentResults = currentProgress.recentResults.slice(0, 50);
    }

    // Actualizar estadísticas
    this.updateStats(currentProgress, result);
    
    // Guardar y notificar cambios
    this.saveProgress(currentProgress);
    this.progressSubject.next(currentProgress);
  }

  private updateStats(progress: ProgressStats, result: LessonResult) {
    // Actualizar horas de estudio
    progress.totalStudyHours += result.timeSpent / 60;

    // Actualizar lecciones completadas
    progress.lessonsCompleted++;

    // Actualizar palabras aprendidas (estimación basada en tipo de lección)
    const wordsPerLesson = {
      'grammar': 5,
      'listening': 8,
      'vocabulary': 15
    };
    progress.wordsLearned += wordsPerLesson[result.lessonType];

    // Actualizar precisión promedio
    const allResults = progress.recentResults;
    if (allResults.length > 0) {
      const totalAccuracy = allResults.reduce((sum, r) => sum + r.percentage, 0);
      progress.averageAccuracy = Math.round(totalAccuracy / allResults.length);
    }

    // Actualizar racha de estudio
    this.updateStudyStreak(progress, result.date);

    // Actualizar XP y nivel
    this.updateXPAndLevel(progress, result);

    // Actualizar datos semanales
    this.updateWeeklyData(progress, result);
  }

  private updateStudyStreak(progress: ProgressStats, lessonDate: Date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lessonDateOnly = new Date(lessonDate.getFullYear(), lessonDate.getMonth(), lessonDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    // Si la lección es de hoy o ayer, continúa o inicia la racha
    if (lessonDateOnly.getTime() === todayOnly.getTime() || 
        lessonDateOnly.getTime() === yesterdayOnly.getTime()) {
      
      // Verificar si ya estudió hoy
      const studiedToday = progress.recentResults.some(result => {
        const resultDate = new Date(result.date);
        const resultDateOnly = new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate());
        return resultDateOnly.getTime() === todayOnly.getTime();
      });

      if (studiedToday && lessonDateOnly.getTime() === todayOnly.getTime()) {
        progress.currentStreak++;
      }
    } else {
      // Reiniciar racha si no estudió ayer ni hoy
      progress.currentStreak = 1;
    }
  }

  private updateXPAndLevel(progress: ProgressStats, result: LessonResult) {
    // Calcular XP basado en el resultado
    let xpGained = 0;
    
    if (result.percentage >= 90) {
      xpGained = 100;
    } else if (result.percentage >= 80) {
      xpGained = 80;
    } else if (result.percentage >= 70) {
      xpGained = 60;
    } else if (result.percentage >= 60) {
      xpGained = 40;
    } else {
      xpGained = 20;
    }

    // Bonificación por tipo de lección
    const bonusMultiplier = {
      'vocabulary': 1.2,
      'listening': 1.1,
      'grammar': 1.0
    };
    
    xpGained = Math.round(xpGained * bonusMultiplier[result.lessonType]);
    progress.currentXP += xpGained;

    // Verificar subida de nivel
    this.checkLevelUp(progress);
  }

  private checkLevelUp(progress: ProgressStats) {
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

    let currentLevelIndex = 0;
    for (let i = levels.length - 1; i >= 0; i--) {
      if (progress.currentXP >= levels[i].xp) {
        currentLevelIndex = i;
        break;
      }
    }

    progress.currentLevel = levels[currentLevelIndex].name;
    
    // Establecer XP para siguiente nivel
    if (currentLevelIndex < levels.length - 1) {
      progress.nextLevelXP = levels[currentLevelIndex + 1].xp;
    } else {
      progress.nextLevelXP = progress.currentXP; // Nivel máximo alcanzado
    }
  }

  private updateWeeklyData(progress: ProgressStats, result: LessonResult) {
    const lessonDate = new Date(result.date);
    const weekStart = new Date(lessonDate);
    weekStart.setDate(lessonDate.getDate() - lessonDate.getDay());
    
    const weekKey = `${weekStart.getFullYear()}-W${this.getWeekNumber(weekStart)}`;
    
    let weekData = progress.weeklyStudyData.find(w => w.week === weekKey);
    if (!weekData) {
      weekData = { week: weekKey, hours: 0 };
      progress.weeklyStudyData.unshift(weekData);
    }
    
    weekData.hours += result.timeSpent / 60;
    
    // Mantener solo las últimas 12 semanas
    if (progress.weeklyStudyData.length > 12) {
      progress.weeklyStudyData = progress.weeklyStudyData.slice(0, 12);
    }
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  private getInitialProgress(): ProgressStats {
    return {
      totalStudyHours: 0,
      wordsLearned: 0,
      lessonsCompleted: 0,
      averageAccuracy: 0,
      currentStreak: 0,
      currentLevel: 'Principiante 1',
      currentXP: 0,
      nextLevelXP: 500,
      weeklyStudyData: [],
      recentResults: []
    };
  }

  private loadProgress() {
    // La verificación de `isBrowser` ya se hace en el constructor
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        // Convertir fechas de string a Date
        progress.recentResults = progress.recentResults.map((result: any) => ({
          ...result,
          date: new Date(result.date)
        }));
        this.progressSubject.next(progress);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }

  private saveProgress(progress: ProgressStats) {
    // La verificación de `isBrowser` se realiza aquí para evitar errores al guardar
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  }

  // Método para resetear el progreso (útil para desarrollo/testing)
  resetProgress() {
    const initialProgress = this.getInitialProgress();
    this.saveProgress(initialProgress);
    this.progressSubject.next(initialProgress);
  }

  // Método para obtener estadísticas específicas
  getLessonStats(lessonType: 'grammar' | 'listening' | 'vocabulary') {
    const results = this.currentProgress.recentResults.filter(r => r.lessonType === lessonType);
    
    if (results.length === 0) {
      return { averageScore: 0, totalCompleted: 0, bestScore: 0 };
    }

    const totalScore = results.reduce((sum, r) => sum + r.percentage, 0);
    const averageScore = Math.round(totalScore / results.length);
    const bestScore = Math.max(...results.map(r => r.percentage));

    return {
      averageScore,
      totalCompleted: results.length,
      bestScore
    };
  }
}