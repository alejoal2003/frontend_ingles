import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressService, LessonResult } from '../../services/progress.service'; 

// Interfaces para mejor tipado
interface Question {
  type: 'multiple_choice';
  question: string;
  options: string[];
  answer: string;
  audio?: string;
}

interface QuestionStatus {
  answered: boolean;
  correct: boolean;
}

@Component({
  selector: 'app-juego',
  templateUrl: './juego-leccion.html', 
  styleUrl: './juego-leccion.css',     
  standalone: true,                   
  imports: [CommonModule]             
})
export class JuegoLeccion implements OnInit {

  lessonType: string = '';
  title: string = '';
  questions: Question[] = [];
  currentQuestion: Question | null = null;
  currentQuestionIndex: number = 0;
  score: number = 0;
  gameState: 'playing' | 'finished' | 'loading' = 'loading';
  questionStatus: QuestionStatus[] = [];
  selectedAnswer: string = '';
  showFeedback: boolean = false;
  isAnswerCorrect: boolean = false;
  startTime: Date = new Date();

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private progressService: ProgressService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.lessonType = params.get('tipo') || 'default';
      this.loadGameData(this.lessonType);
    });
  }

  loadGameData(type: string) {
    switch (type) {
      case 'grammar':
        this.title = 'Juego de Gramática';
        this.questions = [
          {
            type: 'multiple_choice',
            question: 'I ____ to the gym every day.',
            options: ['go', 'goes', 'went', 'going'],
            answer: 'go'
          },
          {
            type: 'multiple_choice',
            question: 'She ___ learning English for two years.',
            options: ['has been', 'is', 'was', 'have been'],
            answer: 'has been'
          },
          {
            type: 'multiple_choice',
            question: 'If I ____ rich, I would travel around the world.',
            options: ['am', 'was', 'were', 'will be'],
            answer: 'were'
          },
          {
            type: 'multiple_choice',
            question: 'The book ____ by millions of people.',
            options: ['is read', 'reads', 'was reading', 'have read'],
            answer: 'is read'
          },
          {
            type: 'multiple_choice',
            question: 'I wish I ____ speak French fluently.',
            options: ['can', 'could', 'will', 'would'],
            answer: 'could'
          },
          {
            type: 'multiple_choice',
            question: 'By next year, I ____ living here for five years.',
            options: ['will be', 'will have been', 'am', 'have been'],
            answer: 'will have been'
          },
          {
            type: 'multiple_choice',
            question: 'The meeting ____ postponed until next week.',
            options: ['has been', 'have been', 'was been', 'is been'],
            answer: 'has been'
          },
          {
            type: 'multiple_choice',
            question: 'Neither John nor Mary ____ coming to the party.',
            options: ['is', 'are', 'was', 'were'],
            answer: 'is'
          },
          {
            type: 'multiple_choice',
            question: 'I would rather you ____ smoking in the house.',
            options: ['don\'t', 'didn\'t', 'won\'t', 'wouldn\'t'],
            answer: 'didn\'t'
          },
          {
            type: 'multiple_choice',
            question: 'The car needs ____.',
            options: ['to repair', 'repairing', 'repaired', 'repair'],
            answer: 'repairing'
          }
        ];
        break;

      case 'listening':
        this.title = 'Juego de Listening';
        this.questions = [
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_1.mp3',
            question: 'What is the speaker talking about?',
            options: ['A holiday trip', 'A new job', 'A favorite book', 'A difficult problem'],
            answer: 'A holiday trip'
          },
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_2.mp3',
            question: 'What time will the meeting be?',
            options: ['Two o\'clock', 'Three o\'clock', 'Four o\'clock', 'Five o\'clock'],
            answer: 'Three o\'clock'
          },
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_3.mp3',
            question: 'Where does the conversation take place?',
            options: ['At a restaurant', 'At a bank', 'At a hospital', 'At a school'],
            answer: 'At a restaurant'
          },
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_4.mp3',
            question: 'What is the woman\'s profession?',
            options: ['Teacher', 'Doctor', 'Engineer', 'Lawyer'],
            answer: 'Teacher'
          },
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_5.mp3',
            question: 'Which station does the train arrive at?',
            options: ['Central Station', 'North Station', 'South Station', 'East Station'],
            answer: 'Central Station'
          },
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_6.mp3',
            question: 'How does the man feel about the weather?',
            options: ['Happy', 'Disappointed', 'Excited', 'Worried'],
            answer: 'Disappointed'
          },
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_7.mp3',
            question: 'How much does the item cost?',
            options: ['Ten dollars', 'Fifteen dollars', 'Twenty dollars', 'Twenty-five dollars'],
            answer: 'Fifteen dollars'
          },
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_8.mp3',
            question: 'What time does the store close?',
            options: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],
            answer: '6:00 PM'
          },
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_9.mp3',
            question: 'What is the woman\'s name?',
            options: ['Sarah', 'Mary', 'Jennifer', 'Lisa'],
            answer: 'Sarah'
          },
          {
            type: 'multiple_choice',
            audio: 'audio_intermedio_10.mp3',
            question: 'What transportation will they use?',
            options: ['Bus', 'Train', 'Car', 'Bicycle'],
            answer: 'Train'
          }
        ];
        break;

      case 'vocabulary':
        this.title = 'Juego de Vocabulario';
        this.questions = [
          {
            type: 'multiple_choice',
            question: 'What is a synonym for "Enormous"?',
            options: ['Huge', 'Small', 'Medium', 'Tiny'],
            answer: 'Huge'
          },
          {
            type: 'multiple_choice',
            question: 'What does "meticulous" mean?',
            options: ['Careless', 'Very careful and precise', 'Fast', 'Lazy'],
            answer: 'Very careful and precise'
          },
          {
            type: 'multiple_choice',
            question: 'Choose the correct synonym for "abundant":',
            options: ['Scarce', 'Plentiful', 'Empty', 'Difficult'],
            answer: 'Plentiful'
          },
          {
            type: 'multiple_choice',
            question: 'What is the opposite of "ancient"?',
            options: ['Old', 'Historic', 'Modern', 'Traditional'],
            answer: 'Modern'
          },
          {
            type: 'multiple_choice',
            question: 'What does "conspicuous" mean?',
            options: ['Hidden', 'Easily seen or noticed', 'Small', 'Quiet'],
            answer: 'Easily seen or noticed'
          },
          {
            type: 'multiple_choice',
            question: 'Choose the synonym for "diligent":',
            options: ['Lazy', 'Hardworking', 'Slow', 'Careless'],
            answer: 'Hardworking'
          },
          {
            type: 'multiple_choice',
            question: 'What does "eloquent" mean?',
            options: ['Silent', 'Fluent and persuasive in speaking', 'Confused', 'Angry'],
            answer: 'Fluent and persuasive in speaking'
          },
          {
            type: 'multiple_choice',
            question: 'What is a synonym for "frugal"?',
            options: ['Wasteful', 'Expensive', 'Economical', 'Generous'],
            answer: 'Economical'
          },
          {
            type: 'multiple_choice',
            question: 'What does "gregarious" mean?',
            options: ['Antisocial', 'Sociable and outgoing', 'Quiet', 'Serious'],
            answer: 'Sociable and outgoing'
          },
          {
            type: 'multiple_choice',
            question: 'Choose the correct synonym for "immaculate":',
            options: ['Dirty', 'Messy', 'Perfect/spotless', 'Broken'],
            answer: 'Perfect/spotless'
          }
        ];
        break;

      default:
        this.title = 'Juego no encontrado';
        this.questions = [];
        break;
    }
    
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.gameState = 'playing';
    this.selectedAnswer = '';
    this.showFeedback = false;
    this.startTime = new Date(); // Reiniciar cronómetro
    
    // Inicializar estado de preguntas
    this.questionStatus = this.questions.map(() => ({
      answered: false,
      correct: false
    }));
    
    if (this.questions.length > 0) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    }
  }

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
  }

  submitAnswer() {
    if (!this.selectedAnswer || !this.currentQuestion) return;
    
    const isCorrect = this.checkAnswer(this.selectedAnswer);
    
    // Actualizar estado de la pregunta
    this.questionStatus[this.currentQuestionIndex] = {
      answered: true,
      correct: isCorrect
    };
    
    this.isAnswerCorrect = isCorrect;
    this.showFeedback = true;
  }

  checkAnswer(userAnswer: string): boolean {
    if (!this.currentQuestion) return false;
    
    const isCorrect = userAnswer.trim() === this.currentQuestion.answer.trim();
    
    if (isCorrect) {
      this.score++;
    }
    
    return isCorrect;
  }
  
  nextQuestion() {
    this.currentQuestionIndex++;
    this.selectedAnswer = '';
    this.showFeedback = false;
    
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    } else {
      // Fin del juego - registrar resultado
      this.finishGame();
    }
  }

  private finishGame() {
    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - this.startTime.getTime()) / 1000 / 60); // en minutos
    const percentage = Math.round((this.score / this.questions.length) * 100);

    // Crear resultado de la lección
    const lessonResult: LessonResult = {
      lessonType: this.lessonType as 'grammar' | 'listening' | 'vocabulary',
      score: this.score,
      totalQuestions: this.questions.length,
      percentage: percentage,
      timeSpent: Math.max(timeSpent, 1), // Mínimo 1 minuto
      date: new Date()
    };

    // Registrar el resultado en el servicio de progreso
    this.progressService.addLessonResult(lessonResult);

    // Cambiar estado del juego
    this.gameState = 'finished';
  }

  getFinalMessage(): string {
    const percentage = (this.score / this.questions.length) * 100;
    
    if (percentage >= 90) {
      return '¡Excelente! Dominas perfectamente el tema.';
    } else if (percentage >= 80) {
      return '¡Muy bien! Tienes un buen dominio del tema.';
    } else if (percentage >= 70) {
      return '¡Bien! Vas por buen camino, sigue practicando.';
    } else if (percentage >= 60) {
      return 'Aceptable. Te recomendamos repasar el tema.';
    } else {
      return 'Necesitas más práctica. ¡No te desanimes!';
    }
  }

  getFinalGrade(): string {
    const percentage = (this.score / this.questions.length) * 100;
    
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'D';
  }

  restartGame() {
    this.loadGameData(this.lessonType);
  }

  goToLessons() {
    this.router.navigate(['/lecciones']);
  }

  playAudio() {
    if (this.currentQuestion?.audio) {
      console.log(`Reproduciendo audio: ${this.currentQuestion.audio}`);
      // Aquí iría la lógica real para reproducir el archivo de audio
      // Por ejemplo: this.audioService.play(this.currentQuestion.audio);
    }
  }

  getCurrentQuestionNumber(): number {
    return this.currentQuestionIndex + 1;
  }

  getTotalQuestions(): number {
    return this.questions.length;
  }
}