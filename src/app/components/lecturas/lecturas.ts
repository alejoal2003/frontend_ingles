import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-lecturas',
  imports: [CommonModule, FormsModule],
  templateUrl: './lecturas.html',
  styleUrl: './lecturas.css'
})
export class Lecturas {
  
  // Control del modal
  showModal = false;
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
  
  // Datos de las lecturas
  lecturas: LecturaData[] = [
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

  constructor(private router: Router) {}
  
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

  // Nuevas funcionalidades del juego
  abrirLectura(lecturaId: number) {
    this.currentLectura = this.lecturas.find(l => l.id === lecturaId) || null;
    if (this.currentLectura) {
      this.showModal = true;
      this.inicializarJuego();
    }
  }

  cerrarModal() {
    this.showModal = false;
    this.currentLectura = null;
    this.reiniciarJuego();
  }

  inicializarJuego() {
    this.respuestasUsuario = [];
    this.palabrasDisponibles = [];
    this.puntaje = 0;
    this.juegoCompletado = false;
    this.mostrarResultados = false;
    this.draggedWord = '';
    this.draggedIndex = -1;
    
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
    }
  }

  reiniciarJuego() {
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
      // Devolver la palabra al banco
      const palabra = this.palabrasDisponibles.find(p => p.palabra === respuesta.palabraSeleccionada);
      if (palabra) {
        palabra.utilizada = false;
      }
      respuesta.palabraSeleccionada = '';
    }
  }

  esRespuestaCorrecta(posicion: number): boolean {
    if (!this.currentLectura || !this.juegoCompletado) return false;
    
    const respuestaUsuario = this.respuestasUsuario.find(r => r.posicion === posicion);
    const palabraCorrecta = this.currentLectura.palabrasCompletar.find(p => p.posicion === posicion);
    
    if (!respuestaUsuario || !palabraCorrecta) return false;
    
    return respuestaUsuario.palabraSeleccionada.toLowerCase().trim() === palabraCorrecta.palabra.toLowerCase();
  }

  // Método obsoleto - mantener compatibilidad
  actualizarRespuesta(posicion: number, valor: string) {
    const respuesta = this.respuestasUsuario.find(r => r.posicion === posicion);
    if (respuesta) {
      respuesta.palabraSeleccionada = valor;
    }
  }

}
