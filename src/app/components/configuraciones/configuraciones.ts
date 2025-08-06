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
  styleUrls: ['./configuraciones.css']
})
export class ConfiguracionesComponent implements OnInit {
  activeSection: string = 'perfil';
  profileForm: FormGroup;
  isLoading: boolean = false;
  showSaveMessage: boolean = false;
  saveMessage: string = 'Changes saved successfully!';

  // Profile data
  userProfile: UserProfile = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    currentLevel: 'intermediate',
    studyTopics: ['grammar', 'vocabulary'],
    learningGoals: ['business', 'travel'],
    interfaceLanguage: 'en',
    timeZone: 'UTC-5'
  };

  // Settings
  accessibilitySettings: AccessibilitySettings = {
    fontSize: 'medium',
    highContrast: false,
    darkMode: false
  };

  notificationSettings: NotificationSettings = {
    studyReminders: {
      enabled: true,
      frequency: 'daily',
      time: '19:00',
      daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    },
    progressNotifications: true,
    promotionalNotifications: false
  };

  preferenceSettings: PreferenceSettings = {
    contentTypes: ['reading', 'listening'],
    exerciseDifficulty: 'intermediate',
    excludedTopics: []
  };

  // Configuration options
  englishLevels = [
    { value: 'beginner', label: 'Beginner (A1-A2)' },
    { value: 'intermediate', label: 'Intermediate (B1-B2)' },
    { value: 'advanced', label: 'Advanced (C1-C2)' }
  ];

  studyTopicsOptions = [
    { value: 'grammar', label: 'Grammar' },
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'pronunciation', label: 'Pronunciation' },
    { value: 'listening', label: 'Listening' },
    { value: 'reading', label: 'Reading' },
    { value: 'writing', label: 'Writing' },
    { value: 'speaking', label: 'Speaking' }
  ];

  learningGoalsOptions = [
    { value: 'business', label: 'Business English' },
    { value: 'travel', label: 'Travel' },
    { value: 'academic', label: 'Academic' },
    { value: 'social', label: 'Social Communication' },
    { value: 'exams', label: 'Exam Preparation' },
    { value: 'career', label: 'Career Development' }
  ];

  interfaceLanguages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  timeZones = [
    { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
    { value: 'UTC-6', label: 'Central Time (UTC-6)' },
    { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
    { value: 'UTC', label: 'GMT (UTC)' },
    { value: 'UTC+1', label: 'Central European Time (UTC+1)' }
  ];

  fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' }
  ];

  reminderFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'every-other-day', label: 'Every Other Day' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom' }
  ];

  daysOfWeek = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  contentTypesOptions = [
    { value: 'reading', label: 'Reading Comprehension' },
    { value: 'listening', label: 'Listening Exercises' },
    { value: 'grammar', label: 'Grammar Practice' },
    { value: 'vocabulary', label: 'Vocabulary Building' },
    { value: 'games', label: 'Interactive Games' },
    { value: 'videos', label: 'Educational Videos' }
  ];

  difficultyLevels = [
    { value: 'easy', label: 'Easy - For beginners' },
    { value: 'intermediate', label: 'Intermediate - Balanced challenge' },
    { value: 'hard', label: 'Hard - For advanced learners' },
    { value: 'adaptive', label: 'Adaptive - Adjusts to your performance' }
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  // Navigation methods between app sections
  navigateToSection(section: string): void {
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

  // Navigation methods within configuration sections
  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  isActiveSection(section: string): boolean {
    return this.activeSection === section;
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  // Form initialization and validation
  initializeForm(): FormGroup {
    return this.formBuilder.group({
      fullName: [this.userProfile.fullName, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      currentLevel: [this.userProfile.currentLevel, Validators.required],
      interfaceLanguage: [this.userProfile.interfaceLanguage, Validators.required],
      timeZone: [this.userProfile.timeZone, Validators.required]
    });
  }

  get fullNameInvalid(): boolean {
    const control = this.profileForm.get('fullName');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get emailInvalid(): boolean {
    const control = this.profileForm.get('email');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get newPasswordInvalid(): boolean {
    const control = this.profileForm.get('newPassword');
    return !!(control && control.invalid && (control.dirty || control.touched) && control.value);
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.userProfile = { ...this.userProfile, ...this.profileForm.value };
        this.isLoading = false;
        this.showSuccessMessage('Profile updated successfully!');
      }, 2000);
    }
  }

  isTopicSelected(topic: string): boolean {
    return this.userProfile.studyTopics.includes(topic);
  }

  onTopicChange(topic: string): void {
    if (this.isTopicSelected(topic)) {
      this.userProfile.studyTopics = this.userProfile.studyTopics.filter(t => t !== topic);
    } else {
      this.userProfile.studyTopics.push(topic);
    }
  }

  isGoalSelected(goal: string): boolean {
    return this.userProfile.learningGoals.includes(goal);
  }

  onGoalChange(goal: string): void {
    if (this.isGoalSelected(goal)) {
      this.userProfile.learningGoals = this.userProfile.learningGoals.filter(g => g !== goal);
    } else {
      this.userProfile.learningGoals.push(goal);
    }
  }

  onFontSizeChange(size: string): void {
    this.accessibilitySettings.fontSize = size;
    this.applyFontSize(size);
    this.showSuccessMessage('Font size updated!');
  }

  onHighContrastToggle(): void {
    this.accessibilitySettings.highContrast = !this.accessibilitySettings.highContrast;
    this.applyHighContrast(this.accessibilitySettings.highContrast);
    this.showSuccessMessage(`High contrast ${this.accessibilitySettings.highContrast ? 'enabled' : 'disabled'}!`);
  }

  onDarkModeToggle(): void {
    this.accessibilitySettings.darkMode = !this.accessibilitySettings.darkMode;
    this.applyDarkMode(this.accessibilitySettings.darkMode);
    this.showSuccessMessage(`Dark mode ${this.accessibilitySettings.darkMode ? 'enabled' : 'disabled'}!`);
  }

  onStudyRemindersToggle(): void {
    this.notificationSettings.studyReminders.enabled = !this.notificationSettings.studyReminders.enabled;
    this.showSuccessMessage(`Study reminders ${this.notificationSettings.studyReminders.enabled ? 'enabled' : 'disabled'}!`);
  }

  onReminderFrequencyChange(event: any): void {
    this.notificationSettings.studyReminders.frequency = event.target.value;
    this.showSuccessMessage('Reminder frequency updated!');
  }

  onReminderTimeChange(event: any): void {
    this.notificationSettings.studyReminders.time = event.target.value;
    this.showSuccessMessage('Reminder time updated!');
  }

  isDaySelected(day: string): boolean {
    return this.notificationSettings.studyReminders.daysOfWeek.includes(day);
  }

  onDayOfWeekToggle(day: string): void {
    if (this.isDaySelected(day)) {
      this.notificationSettings.studyReminders.daysOfWeek = 
        this.notificationSettings.studyReminders.daysOfWeek.filter(d => d !== day);
    } else {
      this.notificationSettings.studyReminders.daysOfWeek.push(day);
    }
    this.showSuccessMessage('Reminder days updated!');
  }

  onProgressNotificationsToggle(): void {
    this.notificationSettings.progressNotifications = !this.notificationSettings.progressNotifications;
    this.showSuccessMessage(`Progress notifications ${this.notificationSettings.progressNotifications ? 'enabled' : 'disabled'}!`);
  }

  onPromotionalNotificationsToggle(): void {
    this.notificationSettings.promotionalNotifications = !this.notificationSettings.promotionalNotifications;
    this.showSuccessMessage(`Promotional notifications ${this.notificationSettings.promotionalNotifications ? 'enabled' : 'disabled'}!`);
  }

  isContentTypeSelected(contentType: string): boolean {
    return this.preferenceSettings.contentTypes.includes(contentType);
  }

  onContentTypeToggle(contentType: string): void {
    if (this.isContentTypeSelected(contentType)) {
      this.preferenceSettings.contentTypes = 
        this.preferenceSettings.contentTypes.filter(ct => ct !== contentType);
    } else {
      this.preferenceSettings.contentTypes.push(contentType);
    }
    this.showSuccessMessage('Content preferences updated!');
  }

  onDifficultyChange(difficulty: string): void {
    this.preferenceSettings.exerciseDifficulty = difficulty;
    this.showSuccessMessage('Exercise difficulty updated!');
  }

  onExcludedTopicAdd(topic: string): void {
    if (topic.trim() && !this.preferenceSettings.excludedTopics.includes(topic.trim())) {
      this.preferenceSettings.excludedTopics.push(topic.trim());
      this.showSuccessMessage('Topic excluded successfully!');
    }
  }

  onExcludedTopicRemove(topic: string): void {
    this.preferenceSettings.excludedTopics = 
      this.preferenceSettings.excludedTopics.filter(t => t !== topic);
    this.showSuccessMessage('Topic removed from exclusions!');
  }

  private loadUserData(): void {
    console.log('Loading user configuration data...');
  }

  private showSuccessMessage(message: string): void {
    this.saveMessage = message;
    this.showSaveMessage = true;
    setTimeout(() => {
      this.showSaveMessage = false;
    }, 3000);
  }

  private applyFontSize(size: string): void {
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    document.body.classList.add(`font-${size}`);
  }

  private applyHighContrast(enabled: boolean): void {
    if (enabled) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }

  private applyDarkMode(enabled: boolean): void {
    if (enabled) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}