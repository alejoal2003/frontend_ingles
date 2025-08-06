import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserProfile {
  fullName: string;
  email: string;
  currentLevel: string;
  studyTopics: string[];
  learningGoals: string[];
  interfaceLanguage: string;
  timeZone: string;
}

interface AccessibilitySettings {
  fontSize: string;
  highContrast: boolean;
  darkMode: boolean;
}

interface NotificationSettings {
  studyReminders: {
    enabled: boolean;
    frequency: string;
    time: string;
    daysOfWeek: string[];
  };
  progressNotifications: boolean;
  promotionalNotifications: boolean;
}

interface PreferenceSettings {
  contentTypes: string[];
  exerciseDifficulty: string;
  excludedTopics: string[];
}

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './configuraciones.html', 
  styleUrl: './configuraciones.css'
})
export class Configuraciones implements OnInit {
  activeSection: string = 'perfil';
  
  // Forms
  profileForm!: FormGroup;
  
  // Data models
  userProfile: UserProfile = {
    fullName: 'Juan Pérez',
    email: 'juan@email.com',
    currentLevel: 'intermediate',
    studyTopics: ['grammar', 'vocabulary'],
    learningGoals: ['business', 'travel'],
    interfaceLanguage: 'es',
    timeZone: 'America/Guayaquil'
  };

  accessibilitySettings: AccessibilitySettings = {
    fontSize: 'normal',
    highContrast: false,
    darkMode: false
  };

  notificationSettings: NotificationSettings = {
    studyReminders: {
      enabled: true,
      frequency: 'daily',
      time: '18:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    progressNotifications: true,
    promotionalNotifications: false
  };

  preferenceSettings: PreferenceSettings = {
    contentTypes: ['interactive', 'videos'],
    exerciseDifficulty: 'appropriate',
    excludedTopics: []
  };

  // Options for dropdowns and selections
  englishLevels = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'elementary', label: 'Básico' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'upper-intermediate', label: 'Intermedio Alto' },
    { value: 'advanced', label: 'Avanzado' },
    { value: 'proficient', label: 'Competente' }
  ];

  studyTopicsOptions = [
    { value: 'grammar', label: 'Gramática' },
    { value: 'vocabulary', label: 'Vocabulario' },
    { value: 'pronunciation', label: 'Pronunciación' },
    { value: 'listening', label: 'Comprensión Auditiva' },
    { value: 'reading', label: 'Comprensión Lectora' },
    { value: 'writing', label: 'Escritura' },
    { value: 'conversation', label: 'Conversación' }
  ];

  learningGoalsOptions = [
    { value: 'business', label: 'Inglés de Negocios' },
    { value: 'travel', label: 'Viajes' },
    { value: 'academic', label: 'Académico' },
    { value: 'general', label: 'Uso General' },
    { value: 'exams', label: 'Preparación de Exámenes' },
    { value: 'career', label: 'Desarrollo Profesional' }
  ];

  interfaceLanguages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' }
  ];

  timeZones = [
    { value: 'America/Guayaquil', label: 'Ecuador (GMT-5)' },
    { value: 'America/Lima', label: 'Perú (GMT-5)' },
    { value: 'America/Bogota', label: 'Colombia (GMT-5)' },
    { value: 'America/Caracas', label: 'Venezuela (GMT-4)' },
    { value: 'America/Santiago', label: 'Chile (GMT-3)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (GMT-3)' }
  ];

  fontSizes = [
    { value: 'small', label: 'Pequeño' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Grande' },
    { value: 'extra-large', label: 'Muy Grande' }
  ];

  reminderFrequencies = [
    { value: 'daily', label: 'Diario' },
    { value: 'every-other-day', label: 'Cada dos días' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'custom', label: 'Personalizado' }
  ];

  daysOfWeek = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  contentTypesOptions = [
    { value: 'interactive', label: 'Lecciones Interactivas' },
    { value: 'videos', label: 'Videos' },
    { value: 'audios', label: 'Audios' },
    { value: 'reading', label: 'Artículos de Lectura' },
    { value: 'grammar', label: 'Ejercicios de Gramática' },
    { value: 'games', label: 'Juegos' },
    { value: 'flashcards', label: 'Tarjetas de Memoria' }
  ];

  difficultyLevels = [
    { value: 'easier', label: 'Más Fácil' },
    { value: 'appropriate', label: 'Adecuado a mi Nivel' },
    { value: 'challenging', label: 'Más Desafiante' }
  ];

  // State management
  isLoading: boolean = false;
  saveMessage: string = '';
  showSaveMessage: boolean = false;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForms();
    this.loadUserSettings();
  }

  initializeForms() {
    this.profileForm = this.fb.group({
      fullName: [this.userProfile.fullName, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
      currentLevel: [this.userProfile.currentLevel, Validators.required],
      studyTopics: [this.userProfile.studyTopics],
      learningGoals: [this.userProfile.learningGoals],
      interfaceLanguage: [this.userProfile.interfaceLanguage, Validators.required],
      timeZone: [this.userProfile.timeZone, Validators.required]
    });
  }

  navigateToSection(section: string) {
    switch(section) {
      case 'inicio':
        this.router.navigate(['/inicio-logeado']);
        break;
      case 'lecturas':
        this.router.navigate(['/lecturas']);
        break;
      case 'musica':
        this.router.navigate(['/canciones']);
        break;
      case 'progreso':
        this.router.navigate(['/progreso']);
        break;
      case 'config':
        this.router.navigate(['/configuraciones']);
        break;
      default:
        console.log('Navegando a:', section);
    }
  }
  
  loadUserSettings() {
    // In a real app, this would load from an API or service
    // For now, we'll use the initial values set above
    console.log('Settings loaded');
  }

  navigateToProfile() {
    this.router.navigate(['/perfil']);
  }

  logout() {
    // Clear any stored data
    this.router.navigate(['/']);
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Sección activa:', section);
  }

  isActiveSection(section: string): boolean {
    return this.activeSection === section;
  }

  // Profile methods
  onProfileSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        const formValue = this.profileForm.value;
        
        // Update user profile
        this.userProfile = {
          ...this.userProfile,
          fullName: formValue.fullName,
          email: formValue.email,
          currentLevel: formValue.currentLevel,
          studyTopics: formValue.studyTopics,
          learningGoals: formValue.learningGoals,
          interfaceLanguage: formValue.interfaceLanguage,
          timeZone: formValue.timeZone
        };

        this.isLoading = false;
        this.showSaveMessage = true;
        this.saveMessage = 'Perfil actualizado correctamente';
        
        setTimeout(() => {
          this.showSaveMessage = false;
        }, 3000);
      }, 1000);
    }
  }

  onTopicChange(topic: string) {
    const topics = this.userProfile.studyTopics;
    const index = topics.indexOf(topic);
    
    if (index > -1) {
      topics.splice(index, 1);
    } else {
      topics.push(topic);
    }
    
    this.profileForm.patchValue({ studyTopics: topics });
  }

  onGoalChange(goal: string) {
    const goals = this.userProfile.learningGoals;
    const index = goals.indexOf(goal);
    
    if (index > -1) {
      goals.splice(index, 1);
    } else {
      goals.push(goal);
    }
    
    this.profileForm.patchValue({ learningGoals: goals });
  }

  // Accessibility methods
  onFontSizeChange(size: string) {
    this.accessibilitySettings.fontSize = size;
    document.documentElement.style.fontSize = this.getFontSizeValue(size);
    this.saveSettings('Tamaño de fuente actualizado');
  }

  getFontSizeValue(size: string): string {
    const sizes: { [key: string]: string } = {
      'small': '14px',
      'normal': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    return sizes[size] || '16px';
  }

  onHighContrastToggle() {
    this.accessibilitySettings.highContrast = !this.accessibilitySettings.highContrast;
    document.body.classList.toggle('high-contrast', this.accessibilitySettings.highContrast);
    this.saveSettings('Configuración de contraste actualizada');
  }

  onDarkModeToggle() {
    this.accessibilitySettings.darkMode = !this.accessibilitySettings.darkMode;
    document.body.classList.toggle('dark-mode', this.accessibilitySettings.darkMode);
    this.saveSettings('Modo oscuro actualizado');
  }

  // Notification methods
  onStudyRemindersToggle() {
    this.notificationSettings.studyReminders.enabled = !this.notificationSettings.studyReminders.enabled;
    this.saveSettings('Recordatorios de estudio actualizados');
  }

  onReminderFrequencyChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  if (selectElement) {
    const frequency = selectElement.value;
    // Resto de tu lógica...
    this.notificationSettings.studyReminders.frequency = frequency;
    this.saveSettings('Frecuencia de recordatorios actualizada');
  }
}

  onReminderTimeChange(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement) {
    const time = inputElement.value;
    // Resto de tu lógica...
    this.notificationSettings.studyReminders.time = time;
    this.saveSettings('Hora de recordatorios actualizada');
  }
}

  onDayOfWeekToggle(day: string) {
    const days = this.notificationSettings.studyReminders.daysOfWeek;
    const index = days.indexOf(day);
    
    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push(day);
    }
    
    this.saveSettings('Días de recordatorio actualizados');
  }

  onProgressNotificationsToggle() {
    this.notificationSettings.progressNotifications = !this.notificationSettings.progressNotifications;
    this.saveSettings('Notificaciones de progreso actualizadas');
  }

  onPromotionalNotificationsToggle() {
    this.notificationSettings.promotionalNotifications = !this.notificationSettings.promotionalNotifications;
    this.saveSettings('Notificaciones promocionales actualizadas');
  }

  // Preference methods
  onContentTypeToggle(contentType: string) {
    const types = this.preferenceSettings.contentTypes;
    const index = types.indexOf(contentType);
    
    if (index > -1) {
      types.splice(index, 1);
    } else {
      types.push(contentType);
    }
    
    this.saveSettings('Tipos de contenido actualizados');
  }

  onDifficultyChange(difficulty: string) {
    this.preferenceSettings.exerciseDifficulty = difficulty;
    this.saveSettings('Dificultad de ejercicios actualizada');
  }

  onExcludedTopicAdd(topic: string) {
    if (topic && !this.preferenceSettings.excludedTopics.includes(topic)) {
      this.preferenceSettings.excludedTopics.push(topic);
      this.saveSettings('Tema excluido agregado');
    }
  }

  onExcludedTopicRemove(topic: string) {
    const index = this.preferenceSettings.excludedTopics.indexOf(topic);
    if (index > -1) {
      this.preferenceSettings.excludedTopics.splice(index, 1);
      this.saveSettings('Tema excluido eliminado');
    }
  }

  // Utility methods
  saveSettings(message: string) {
    this.saveMessage = message;
    this.showSaveMessage = true;
    
    setTimeout(() => {
      this.showSaveMessage = false;
    }, 2000);
  }

  isTopicSelected(topic: string): boolean {
    return this.userProfile.studyTopics.includes(topic);
  }

  isGoalSelected(goal: string): boolean {
    return this.userProfile.learningGoals.includes(goal);
  }

  isContentTypeSelected(contentType: string): boolean {
    return this.preferenceSettings.contentTypes.includes(contentType);
  }

  isDaySelected(day: string): boolean {
    return this.notificationSettings.studyReminders.daysOfWeek.includes(day);
  }

  // Form validation helpers
  get fullNameInvalid() {
    return this.profileForm.get('fullName')?.invalid && this.profileForm.get('fullName')?.touched;
  }

  get emailInvalid() {
    return this.profileForm.get('email')?.invalid && this.profileForm.get('email')?.touched;
  }

  get newPasswordInvalid() {
    return this.profileForm.get('newPassword')?.invalid && this.profileForm.get('newPassword')?.touched;
  }
}