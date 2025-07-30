import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface LecturaData {
  id: number;
  titulo: string;
  emoji: string;
  descripcion: string;
  lecturaEspanol: string;
  lecturaIngles: string;
  palabrasCompletar: { palabra: string; posicion: number }[];
  palabrasDistractoras: string[]; // Palabras adicionales para confundir
}

interface PalabrasDisponibles {
  palabra: string;
  utilizada: boolean;
  esCorrecta: boolean;
}

interface RespuestaUsuario {
  posicion: number;
  palabraSeleccionada: string;
}

@Component({
  selector: 'app-juego-lectura',
  imports: [CommonModule, FormsModule],
  templateUrl: './juego-lectura.html',
  styleUrl: './juego-lectura.css',
  standalone: true
})
export class JuegoLectura implements OnInit, OnDestroy {
  
  // Datos de la lectura actual
  currentLectura: LecturaData | null = null;
  
  // Estado del juego drag and drop
  respuestasUsuario: RespuestaUsuario[] = [];
  palabrasDisponibles: PalabrasDisponibles[] = [];
  puntaje = 0;
  juegoCompletado = false;
  mostrarResultados = false;
  
  // Control de drag and drop
  draggedWord: string = '';
  draggedIndex: number = -1;
  
  // Propiedades para accesibilidad WCAG
  announcements: string[] = [];
  
  // Control de navegación por teclado
  selectedWordIndex: number = -1;
  selectedDropZoneIndex: number = -1;
  keyboardMode: 'words' | 'dropzones' | 'none' = 'none';
  wordSelected: string = '';
  
  // Base de datos de lecturas
  private lecturas: LecturaData[] = [
    {
      id: 1,
      titulo: 'Inteligencia Artificial',
      emoji: '🤖',
      descripcion: 'Explora los avances recientes y las implicaciones de la IA en nuestra vida diaria.',
      lecturaEspanol: 'La inteligencia artificial está transformando rápidamente nuestro mundo. Desde asistentes virtuales hasta vehículos autónomos, la IA está presente en muchos aspectos de nuestra vida cotidiana. Las empresas utilizan algoritmos de aprendizaje automático para mejorar sus servicios y productos.',
      lecturaIngles: 'Artificial intelligence is _____ transforming our world. From virtual assistants to _____ vehicles, AI is present in many _____ of our daily life. Companies use machine _____ algorithms to improve their services and _____.',
      palabrasCompletar: [
        { palabra: 'rapidly', posicion: 0 },
        { palabra: 'autonomous', posicion: 1 },
        { palabra: 'aspects', posicion: 2 },
        { palabra: 'learning', posicion: 3 },
        { palabra: 'products', posicion: 4 }
      ],
      palabrasDistractoras: ['slowly', 'manual', 'problems', 'teaching', 'issues']
    },
    {
      id: 2,
      titulo: 'Cultura Maya',
      emoji: '🏛️',
      descripcion: 'Un viaje a través de las fascinantes tradiciones y la historia del pueblo maya.',
      lecturaEspanol: 'La civilización maya fue una de las más avanzadas de Mesoamérica. Desarrollaron un complejo sistema de escritura, matemáticas avanzadas y un calendario preciso. Sus pirámides y templos todavía asombran a los visitantes de todo el mundo.',
      lecturaIngles: 'The Mayan _____ was one of the most advanced in Mesoamerica. They developed a complex _____ system, advanced mathematics and a _____ calendar. Their pyramids and _____ still amaze visitors from around the _____.',
      palabrasCompletar: [
        { palabra: 'civilization', posicion: 0 },
        { palabra: 'writing', posicion: 1 },
        { palabra: 'precise', posicion: 2 },
        { palabra: 'temples', posicion: 3 },
        { palabra: 'world', posicion: 4 }
      ],
      palabrasDistractoras: ['culture', 'reading', 'simple', 'houses', 'city']
    },
    {
      id: 3,
      titulo: 'Negocios Sostenibles',
      emoji: '📈',
      descripcion: 'Descubre cómo las empresas están adoptando modelos de negocio más sostenibles.',
      lecturaEspanol: 'Las empresas modernas están adoptando prácticas más sostenibles para proteger el medio ambiente. Esto incluye el uso de energías renovables, la reducción de desperdicios y el desarrollo de productos ecológicos. Los consumidores también prefieren marcas responsables.',
      lecturaIngles: 'Modern companies are _____ more sustainable practices to protect the _____. This includes the use of renewable _____, waste reduction and the development of _____ products. Consumers also prefer _____ brands.',
      palabrasCompletar: [
        { palabra: 'adopting', posicion: 0 },
        { palabra: 'environment', posicion: 1 },
        { palabra: 'energy', posicion: 2 },
        { palabra: 'ecological', posicion: 3 },
        { palabra: 'responsible', posicion: 4 }
      ],
      palabrasDistractoras: ['rejecting', 'economy', 'fuel', 'expensive', 'careless']
    },
    {
      id: 4,
      titulo: 'Calentamiento Global',
      emoji: '🌍',
      descripcion: 'Un análisis de las últimas noticias sobre el calentamiento global y sus efectos.',
      lecturaEspanol: 'El calentamiento global es uno de los desafíos más urgentes de nuestro tiempo. Las temperaturas están aumentando debido a las emisiones de gases de efecto invernadero. Es crucial que tomemos medidas inmediatas para reducir nuestra huella de carbono.',
      lecturaIngles: 'Global warming is one of the most _____ challenges of our time. Temperatures are _____ due to greenhouse gas _____. It is crucial that we take immediate _____ to reduce our carbon _____.',
      palabrasCompletar: [
        { palabra: 'urgent', posicion: 0 },
        { palabra: 'rising', posicion: 1 },
        { palabra: 'emissions', posicion: 2 },
        { palabra: 'actions', posicion: 3 },
        { palabra: 'footprint', posicion: 4 }
      ],
      palabrasDistractoras: ['simple', 'falling', 'benefits', 'delays', 'handprint']
    },
    {
      id: 5,
      titulo: 'Shakespeare',
      emoji: '✍️',
      descripcion: 'Una introducción a la obra y el legado del famoso dramaturgo inglés.',
      lecturaEspanol: 'William Shakespeare es considerado el mejor dramaturgo de la historia. Sus obras como Romeo y Julieta, Hamlet y Macbeth siguen siendo representadas en teatros de todo el mundo. Su influencia en la literatura inglesa es inmensa.',
      lecturaIngles: 'William Shakespeare is considered the _____ playwright in history. His works like Romeo and Juliet, Hamlet and Macbeth continue to be _____ in theaters around the world. His _____ on English literature is _____.',
      palabrasCompletar: [
        { palabra: 'greatest', posicion: 0 },
        { palabra: 'performed', posicion: 1 },
        { palabra: 'influence', posicion: 2 },
        { palabra: 'immense', posicion: 3 }
      ],
      palabrasDistractoras: ['worst', 'forgotten', 'damage', 'small']
    },
    {
      id: 6,
      titulo: 'Vida Cotidiana',
      emoji: '🏠',
      descripcion: 'Frases y vocabulario esencial para situaciones comunes del día a día.',
      lecturaEspanol: 'La vida cotidiana está llena de rutinas y actividades habituales. Nos levantamos temprano, desayunamos, vamos al trabajo o a estudiar, y por la noche regresamos a casa para descansar. Los fines de semana solemos relajarnos y pasar tiempo con la familia.',
      lecturaIngles: 'Daily life is full of _____ and habitual activities. We wake up _____, have breakfast, go to work or _____, and at night we return home to _____. On weekends we usually _____ and spend time with family.',
      palabrasCompletar: [
        { palabra: 'routines', posicion: 0 },
        { palabra: 'early', posicion: 1 },
        { palabra: 'study', posicion: 2 },
        { palabra: 'rest', posicion: 3 },
        { palabra: 'relax', posicion: 4 }
      ],
      palabrasDistractoras: ['chaos', 'late', 'party', 'work', 'stress']
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const lecturaId = parseInt(this.route.snapshot.params['id']);
    this.cargarLectura(lecturaId);
    
    // Configurar navegación por teclado si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.setupKeyboardNavigation();
      this.makeAnnouncement(`Juego de lectura cargado: ${this.currentLectura?.titulo || 'Desconocido'}`);
    }
  }

  ngOnDestroy() {
    // Limpiar eventos de teclado si es necesario
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('keydown', this.handleGlobalKeyDown.bind(this));
    }
  }

  // Métodos de accesibilidad WCAG
  private setupKeyboardNavigation() {
    // Solo escuchar teclas especiales globalmente, no Enter/Espacio
    document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this));
  }

  private handleGlobalKeyDown(event: KeyboardEvent) {
    if (this.juegoCompletado) return;
    
    switch (event.key) {
      case 'Escape':
        this.clearSelection();
        this.volverALecturas();
        break;
        
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        event.preventDefault();
        this.jumpToDropZone(parseInt(event.key) - 1);
        break;
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (this.juegoCompletado) return; // No permitir navegación si el juego terminó
    
    switch (event.key) {
      case 'Escape':
        this.clearSelection();
        this.volverALecturas();
        break;
        
      case 'Tab':
        // Permitir navegación normal con Tab
        return;
        
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        this.handleArrowNavigation(event.key);
        break;
        
      case 'Enter':
      case ' ': // Espacio
        event.preventDefault();
        this.handleSelection();
        break;
        
      case 'Delete':
      case 'Backspace':
        event.preventDefault();
        this.handleDelete();
        break;
        
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        event.preventDefault();
        this.jumpToDropZone(parseInt(event.key) - 1);
        break;
    }
  }

  private handleArrowNavigation(key: string) {
    if (this.keyboardMode === 'none') {
      // Iniciar en modo palabras
      this.keyboardMode = 'words';
      this.selectedWordIndex = 0;
      this.updateKeyboardFocus();
      return;
    }

    if (this.keyboardMode === 'words') {
      const availableWords = this.palabrasDisponibles.filter(p => !p.utilizada);
      if (key === 'ArrowRight' || key === 'ArrowDown') {
        this.selectedWordIndex = (this.selectedWordIndex + 1) % availableWords.length;
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        this.selectedWordIndex = this.selectedWordIndex <= 0 ? 
          availableWords.length - 1 : this.selectedWordIndex - 1;
      }
    } else if (this.keyboardMode === 'dropzones') {
      if (key === 'ArrowRight' || key === 'ArrowDown') {
        this.selectedDropZoneIndex = (this.selectedDropZoneIndex + 1) % this.respuestasUsuario.length;
      } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
        this.selectedDropZoneIndex = this.selectedDropZoneIndex <= 0 ? 
          this.respuestasUsuario.length - 1 : this.selectedDropZoneIndex - 1;
      }
    }
    
    this.updateKeyboardFocus();
  }

  private handleSelection() {
    if (this.keyboardMode === 'words' && !this.wordSelected) {
      // Seleccionar palabra
      const availableWords = this.palabrasDisponibles.filter(p => !p.utilizada);
      if (this.selectedWordIndex >= 0 && this.selectedWordIndex < availableWords.length) {
        const palabraIndex = this.palabrasDisponibles.findIndex(p => p === availableWords[this.selectedWordIndex]);
        this.wordSelected = availableWords[this.selectedWordIndex].palabra;
        this.selectedWordIndex = palabraIndex;
        
        // Cambiar a modo drop zones
        this.keyboardMode = 'dropzones';
        this.selectedDropZoneIndex = 0;
        
        this.makeAnnouncement(`Palabra seleccionada: ${this.wordSelected}. Usa las flechas para navegar entre espacios y Enter para colocar.`);
        this.updateKeyboardFocus();
      }
    } else if (this.keyboardMode === 'dropzones' && this.wordSelected) {
      // Colocar palabra en drop zone
      this.placeWordWithKeyboard();
    }
  }

  private handleDelete() {
    if (this.keyboardMode === 'dropzones' && this.selectedDropZoneIndex >= 0) {
      this.devolverPalabra(this.selectedDropZoneIndex);
    }
  }

  private jumpToDropZone(index: number) {
    if (index >= 0 && index < this.respuestasUsuario.length) {
      // Si hay una palabra seleccionada, colocarla directamente
      if (this.wordSelected) {
        this.placeWordInSlot(index);
        this.makeAnnouncement(`Palabra ${this.wordSelected} colocada en el espacio ${index + 1}`);
      } else {
        this.keyboardMode = 'dropzones';
        this.selectedDropZoneIndex = index;
        this.updateKeyboardFocus();
        this.makeAnnouncement(`Navegando al espacio ${index + 1}. Selecciona una palabra primero para colocarla aquí.`);
      }
    }
  }

  private placeWordWithKeyboard() {
    if (this.wordSelected && this.selectedDropZoneIndex >= 0) {
      // Verificar si ya hay una palabra en esta posición
      const respuestaExistente = this.respuestasUsuario[this.selectedDropZoneIndex];
      if (respuestaExistente && respuestaExistente.palabraSeleccionada) {
        // Devolver la palabra anterior al banco
        const palabraAnterior = this.palabrasDisponibles.find(p => p.palabra === respuestaExistente.palabraSeleccionada);
        if (palabraAnterior) {
          palabraAnterior.utilizada = false;
        }
      }

      // Colocar la nueva palabra
      respuestaExistente.palabraSeleccionada = this.wordSelected;

      // Marcar la palabra como utilizada
      const palabraUtilizada = this.palabrasDisponibles[this.selectedWordIndex];
      if (palabraUtilizada) {
        palabraUtilizada.utilizada = true;
      }

      this.makeAnnouncement(`Palabra ${this.wordSelected} colocada en el espacio ${this.selectedDropZoneIndex + 1}`);
      
      // Limpiar selección
      this.clearSelection();
    }
  }

  private clearSelection() {
    this.wordSelected = '';
    this.selectedWordIndex = -1;
    this.selectedDropZoneIndex = -1;
    this.keyboardMode = 'none';
    this.updateKeyboardFocus();
  }

  private updateKeyboardFocus() {
    // Aquí se actualizaría el foco visual, se implementará en CSS
    // Por ahora solo anunciamos el cambio
    if (this.keyboardMode === 'words') {
      const availableWords = this.palabrasDisponibles.filter(p => !p.utilizada);
      if (this.selectedWordIndex >= 0 && this.selectedWordIndex < availableWords.length) {
        const palabra = availableWords[this.selectedWordIndex].palabra;
        this.makeAnnouncement(`Palabra enfocada: ${palabra}`);
      }
    } else if (this.keyboardMode === 'dropzones') {
      if (this.selectedDropZoneIndex >= 0) {
        const respuesta = this.respuestasUsuario[this.selectedDropZoneIndex];
        const mensaje = respuesta.palabraSeleccionada ? 
          `Espacio ${this.selectedDropZoneIndex + 1} ocupado por: ${respuesta.palabraSeleccionada}` :
          `Espacio ${this.selectedDropZoneIndex + 1} vacío`;
        this.makeAnnouncement(mensaje);
      }
    }
  }

  private makeAnnouncement(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.announcements.unshift(message);
      // Mantener solo los últimos 3 anuncios
      if (this.announcements.length > 3) {
        this.announcements = this.announcements.slice(0, 3);
      }
      
      // Anunciar a lectores de pantalla
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }

  cargarLectura(lecturaId: number) {
    this.currentLectura = this.lecturas.find(l => l.id === lecturaId) || null;
    if (this.currentLectura) {
      this.inicializarJuego();
    } else {
      console.error('Lectura no encontrada:', lecturaId);
      this.volverALecturas();
    }
  }

  // Navegación con accesibilidad
  navigateToHome() {
    this.makeAnnouncement('Navegando al inicio');
    this.router.navigate(['/inicio-logeado']);
  }
  
  navigateToProfile() {
    this.makeAnnouncement('Navegando al perfil');
    this.router.navigate(['/inicio-logeado']);
  }
  
  logout() {
    this.makeAnnouncement('Cerrando sesión');
    this.router.navigate(['/']);
  }

  volverALecturas() {
    this.makeAnnouncement('Regresando a la lista de lecturas');
    this.router.navigate(['/lecturas']);
  }

  // Lógica del juego con accesibilidad
  inicializarJuego() {
    this.respuestasUsuario = [];
    this.palabrasDisponibles = [];
    this.puntaje = 0;
    this.juegoCompletado = false;
    this.mostrarResultados = false;
    this.draggedWord = '';
    this.draggedIndex = -1;
    
    // Reset keyboard navigation
    this.clearSelection();
    
    if (this.currentLectura) {
      // Inicializar respuestas vacías
      this.respuestasUsuario = this.currentLectura.palabrasCompletar.map(p => ({
        posicion: p.posicion,
        palabraSeleccionada: ''
      }));

      // Mezclar palabras correctas con distractoras
      const todasLasPalabras = [
        ...this.currentLectura.palabrasCompletar.map(p => ({
          palabra: p.palabra,
          utilizada: false,
          esCorrecta: true
        })),
        ...this.currentLectura.palabrasDistractoras.map(p => ({
          palabra: p,
          utilizada: false,
          esCorrecta: false
        }))
      ];

      // Mezclar el array
      this.palabrasDisponibles = this.shuffleArray(todasLasPalabras);
      
      this.makeAnnouncement(
        `Juego inicializado. ${this.currentLectura.palabrasCompletar.length} espacios para completar con ${this.palabrasDisponibles.length} palabras disponibles. Usa las flechas del teclado para navegar, Enter para seleccionar, y las teclas 1-5 para saltar a espacios específicos.`
      );
    }
  }

  // Método para seleccionar palabras con click o teclado
  selectWord(palabra: string, index: number) {
    if (this.juegoCompletado || this.palabrasDisponibles[index].utilizada) {
      return;
    }

    // Si ya hay una palabra seleccionada, deseleccionarla
    if (this.wordSelected) {
      this.clearSelection();
    }

    // Seleccionar la nueva palabra
    this.wordSelected = palabra;
    this.selectedWordIndex = index;
    // No forzar cambio a modo dropzones, mantener la navegación natural
    // this.keyboardMode = 'dropzones';
    // this.selectedDropZoneIndex = 0;

    this.makeAnnouncement(`Palabra seleccionada: ${palabra}. Ahora navega con Tab a un espacio vacío y presiona Enter para colocarla, o presiona las teclas 1-${this.respuestasUsuario.length} para saltar directamente a un espacio específico.`);
  }

  // Método para colocar palabras en espacios
  placeWordInSlot(slotIndex: number) {
    if (!this.wordSelected || this.juegoCompletado) {
      return;
    }

    // Verificar si ya hay una palabra en esta posición
    const respuestaExistente = this.respuestasUsuario[slotIndex];
    if (respuestaExistente && respuestaExistente.palabraSeleccionada) {
      // Devolver la palabra anterior al banco
      const palabraAnterior = this.palabrasDisponibles.find(p => p.palabra === respuestaExistente.palabraSeleccionada);
      if (palabraAnterior) {
        palabraAnterior.utilizada = false;
      }
    }

    // Colocar la nueva palabra
    respuestaExistente.palabraSeleccionada = this.wordSelected;

    // Marcar la palabra como utilizada
    const palabraUtilizada = this.palabrasDisponibles[this.selectedWordIndex];
    if (palabraUtilizada) {
      palabraUtilizada.utilizada = true;
    }

    this.makeAnnouncement(`Palabra ${this.wordSelected} colocada en el espacio ${slotIndex + 1}`);
    
    // Limpiar selección
    this.clearSelection();
  }

  // Método para manejar acciones en drop zones (colocar o devolver palabras)
  handleDropZoneAction(slotIndex: number) {
    if (this.juegoCompletado) {
      return;
    }

    // Si hay una palabra seleccionada, colocarla
    if (this.wordSelected) {
      this.placeWordInSlot(slotIndex);
    } 
    // Si no hay palabra seleccionada pero el espacio tiene una palabra, devolverla
    else if (this.respuestasUsuario[slotIndex].palabraSeleccionada) {
      this.devolverPalabra(slotIndex);
    }
    // Si no hay palabra seleccionada y el espacio está vacío, dar instrucción
    else {
      this.makeAnnouncement(`Espacio ${slotIndex + 1} está vacío. Primero selecciona una palabra del banco para colocarla aquí.`);
    }
  }

  reiniciarJuego() {
    this.makeAnnouncement('Reiniciando el juego');
    this.inicializarJuego();
  }

  shuffleArray(array: PalabrasDisponibles[]): PalabrasDisponibles[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  verificarRespuestas() {
    if (!this.currentLectura) return;
    
    let correctas = 0;
    this.respuestasUsuario.forEach(respuesta => {
      const palabraCorrecta = this.currentLectura!.palabrasCompletar
        .find(p => p.posicion === respuesta.posicion);
      
      if (palabraCorrecta && 
          respuesta.palabraSeleccionada.toLowerCase().trim() === palabraCorrecta.palabra.toLowerCase()) {
        correctas++;
      }
    });
    
    this.puntaje = Math.round((correctas / this.currentLectura.palabrasCompletar.length) * 100);
    this.juegoCompletado = true;
    this.mostrarResultados = true;
    
    // Anuncio de resultados para accesibilidad
    const mensaje = `Juego completado. Has obtenido ${correctas} respuestas correctas de ${this.currentLectura.palabrasCompletar.length}. Tu puntaje es ${this.puntaje}%.`;
    this.makeAnnouncement(mensaje);
  }

  // Métodos de Drag and Drop
  onDragStart(event: DragEvent, palabra: string, index: number) {
    this.draggedWord = palabra;
    this.draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', palabra);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, posicion: number) {
    event.preventDefault();
    
    if (this.draggedWord && this.draggedIndex !== -1) {
      // Verificar si ya hay una palabra en esta posición
      const respuestaExistente = this.respuestasUsuario.find(r => r.posicion === posicion);
      if (respuestaExistente && respuestaExistente.palabraSeleccionada) {
        // Devolver la palabra anterior al banco
        const palabraAnterior = this.palabrasDisponibles.find(p => p.palabra === respuestaExistente.palabraSeleccionada);
        if (palabraAnterior) {
          palabraAnterior.utilizada = false;
        }
      }

      // Colocar la nueva palabra
      if (respuestaExistente) {
        respuestaExistente.palabraSeleccionada = this.draggedWord;
      }

      // Marcar la palabra como utilizada
      const palabraUtilizada = this.palabrasDisponibles[this.draggedIndex];
      if (palabraUtilizada) {
        palabraUtilizada.utilizada = true;
      }

      // Limpiar variables de drag
      this.draggedWord = '';
      this.draggedIndex = -1;
    }
  }

  devolverPalabra(posicion: number) {
    const respuesta = this.respuestasUsuario.find(r => r.posicion === posicion);
    if (respuesta && respuesta.palabraSeleccionada) {
      const palabraDevuelta = respuesta.palabraSeleccionada;
      
      // Devolver la palabra al banco
      const palabra = this.palabrasDisponibles.find(p => p.palabra === respuesta.palabraSeleccionada);
      if (palabra) {
        palabra.utilizada = false;
      }
      respuesta.palabraSeleccionada = '';
      
      this.makeAnnouncement(`Palabra ${palabraDevuelta} devuelta al banco de palabras`);
    }
  }

  // Métodos para indicadores visuales del estado del teclado
  isWordSelected(index: number): boolean {
    const availableWords = this.palabrasDisponibles.filter(p => !p.utilizada);
    return this.keyboardMode === 'words' && 
           this.selectedWordIndex >= 0 && 
           availableWords[this.selectedWordIndex] === this.palabrasDisponibles[index];
  }

  isDropZoneSelected(index: number): boolean {
    return this.keyboardMode === 'dropzones' && this.selectedDropZoneIndex === index;
  }

  isWordHighlighted(palabra: string): boolean {
    return this.wordSelected === palabra;
  }

  esRespuestaCorrecta(posicion: number): boolean {
    if (!this.currentLectura || !this.juegoCompletado) return false;
    
    const respuestaUsuario = this.respuestasUsuario.find(r => r.posicion === posicion);
    const palabraCorrecta = this.currentLectura.palabrasCompletar.find(p => p.posicion === posicion);
    
    if (!respuestaUsuario || !palabraCorrecta) return false;
    
    return respuestaUsuario.palabraSeleccionada.toLowerCase().trim() === palabraCorrecta.palabra.toLowerCase();
  }
}
