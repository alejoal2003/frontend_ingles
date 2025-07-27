import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Cargar la API de YouTube de forma asíncrona
const youtubeApiScript = 'https://www.youtube.com/iframe_api';

// Interfaces para la estructura de datos
interface PalabraCompletable {
  textoOriginal: string;
  textoNormalizado: string;
  tiempo: number;
  lineaIndex: number;
  palabraIndex: number;
  id: string;
  completada: boolean;
}

interface LineaLetra {
  textoOriginal: string;
  tiempoInicio: number;
  tiempoFin: number;
  palabras: string[];
  palabraCompletable?: PalabraCompletable;
  htmlSeguro?: SafeHtml; // Propiedad para el HTML sanitizado
}

interface CancionData {
  id: string;
  titulo: string;
  artista: string;
  youtubeId: string;
  letraCompleta: { texto: string; tiempoInicio: number; tiempoFin: number }[];
  duracion: number;
}

@Component({
  selector: 'app-juego-cancion',
  imports: [CommonModule, FormsModule],
  templateUrl: './juego-cancion.html',
  styleUrls: ['./juego-cancion.css'],
  standalone: true
})
export class JuegoCancion implements OnInit, OnDestroy, AfterViewInit {
  
  cancionData: CancionData | null = null;
  letraProcesada: LineaLetra[] = [];
  
  private youtubePlayer: any;
  isPlayerReady = false;

  juegoActivo = false;
  cancionPausada = false;
  tiempoActual = 0;
  intervalId: any = null;
  
  lineaActualIndex = -1;
  palabraActualCompletando: PalabraCompletable | null = null;
  respuestasUsuario: { [key: string]: string } = {};
  
  score = 0;
  hits = 0;
  vida = 100;
  vidaDecrementoInterval: any = null;

  // Añadir propiedad para el handler bound
  private boundInputHandler?: (event: KeyboardEvent) => void;
  private isBrowser: boolean;
  
  // Nueva propiedad para controlar qué mostrar de la línea actual (karaoke style)
  public lineaActualMostrandoHasta: number = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.loadYouTubeApi();
    const songId = this.route.snapshot.params['id'];
    this.cargarCancion(songId);
  }

  ngAfterViewInit() {
    // La configuración de listeners ahora es más simple
    this.setupEventListeners();
  }

  // ============== CAMBIO IMPORTANTE: MANEJO DE EVENTOS SIMPLIFICADO ==============
  setupEventListeners() {
    if (!this.isBrowser) return;
    
    // Removemos listener anterior si existe
    if (this.boundInputHandler) {
      document.removeEventListener('keydown', this.boundInputHandler, true);
    }
    
    // Creamos una referencia bound para poder removerla después
    this.boundInputHandler = this.handleGlobalInput.bind(this);
    document.addEventListener('keydown', this.boundInputHandler, true);
  }

  ngOnDestroy() {
    this.limpiarIntervalos();
    // Limpiar el listener al destruir el componente
    if (this.isBrowser && this.boundInputHandler) {
      document.removeEventListener('keydown', this.boundInputHandler, true);
    }
    if (this.youtubePlayer && typeof this.youtubePlayer.destroy === 'function') {
        this.youtubePlayer.destroy();
    }
  }

  loadYouTubeApi() {
    if (!this.isBrowser) return;
    
    if (!(window as any).YT) {
      (window as any).onYouTubeIframeAPIReady = () => {
        this.ngZone.run(() => this.setupPlayer());
      };
      const tag = document.createElement('script');
      tag.src = youtubeApiScript;
      document.body.appendChild(tag);
    } else {
      this.setupPlayer();
    }
  }

  setupPlayer() {
    if (!this.cancionData) return;
    
    this.youtubePlayer = new (window as any).YT.Player('youtube-player-container', {
      height: '100%',
      width: '100%',
      videoId: this.cancionData.youtubeId,
      playerVars: { 'autoplay': 0, 'controls': 0, 'modestbranding': 1, 'rel': 0, 'disablekb': 1 },
      events: {
        'onReady': () => this.ngZone.run(() => this.onPlayerReady()),
        'onStateChange': (event: any) => this.ngZone.run(() => this.onPlayerStateChange(event))
      }
    });
  }
  
  onPlayerReady() {
    this.isPlayerReady = true;
    setTimeout(() => this.inicializarJuego(), 1000);
  }
  
  onPlayerStateChange(event: any) {
    if (event.data === (window as any).YT.PlayerState.ENDED) {
        this.terminarJuego(true);
    }
  }

  // ============== CAMBIO IMPORTANTE: BASE DE DATOS DE CANCIONES COMPLETA ==============
  cargarCancion(songId: string) {
    const cancionesDb: { [key: string]: CancionData } = {
      'stairway-to-heaven': {
        id: 'stairway-to-heaven', titulo: 'Stairway to Heaven', artista: 'Led Zeppelin', youtubeId: 'QkF3oxziUI4', duracion: 482,
        letraCompleta: [
          { texto: "There's a lady who's sure all that glitters is gold", tiempoInicio: 53, tiempoFin: 59.5 },
          { texto: "And she's buying a stairway to heaven", tiempoInicio: 60, tiempoFin: 66.5 },
          { texto: "When she gets there she knows if the stores are all closed", tiempoInicio: 67, tiempoFin: 73.5 },
          { texto: "With a word she can get what she came for", tiempoInicio: 74, tiempoFin: 79.5 },
          { texto: "And she's buying a stairway to heaven", tiempoInicio: 80, tiempoFin: 86.5 },
          { texto: "There's a sign on the wall but she wants to be sure", tiempoInicio: 85, tiempoFin: 91 },
          { texto: "Cause you know sometimes words have two meanings", tiempoInicio: 91.5, tiempoFin: 97 },
          { texto: "In a tree by the brook there's a songbird who sings", tiempoInicio: 97.5, tiempoFin: 103 },
          { texto: "Sometimes all of our thoughts are misgiven", tiempoInicio: 103.5, tiempoFin: 109 },
          { texto: "It makes me wonder", tiempoInicio: 110, tiempoFin: 115 },
          { texto: "It makes me wonder", tiempoInicio: 115.5, tiempoFin: 120 },
          { texto: "There's a feeling I get when I look to the west", tiempoInicio: 121, tiempoFin: 127 },
          { texto: "And my spirit is crying for leaving", tiempoInicio: 127.5, tiempoFin: 133 },
          { texto: "In my thoughts I have seen rings of smoke through the trees", tiempoInicio: 133.5, tiempoFin: 139 },
          { texto: "And the voices of those who stand looking", tiempoInicio: 139.5, tiempoFin: 145 },
          { texto: "It makes me wonder", tiempoInicio: 146, tiempoFin: 151 },
          { texto: "It really makes me wonder", tiempoInicio: 151.5, tiempoFin: 156 },
          { texto: "And it's whispered that soon if we all call the tune", tiempoInicio: 157, tiempoFin: 163 },
          { texto: "Then the piper will lead us to reason", tiempoInicio: 163.5, tiempoFin: 169 },
          { texto: "And a new day will dawn for those who stand long", tiempoInicio: 169.5, tiempoFin: 175 },
          { texto: "And the forests will echo with laughter", tiempoInicio: 175.5, tiempoFin: 181 },
          { texto: "If there's a bustle in your hedgerow don't be alarmed now", tiempoInicio: 242, tiempoFin: 248 },
          { texto: "It's just a spring clean for the May queen", tiempoInicio: 248.5, tiempoFin: 254 },
          { texto: "Yes there are two paths you can go by but in the long run", tiempoInicio: 254.5, tiempoFin: 260 },
          { texto: "There's still time to change the road you're on", tiempoInicio: 260.5, tiempoFin: 266 },
          { texto: "And it makes me wonder", tiempoInicio: 267, tiempoFin: 272 },
          { texto: "Your head is humming and it won't go in case you don't know", tiempoInicio: 273, tiempoFin: 279 },
          { texto: "The piper's calling you to join him", tiempoInicio: 279.5, tiempoFin: 285 },
          { texto: "Dear lady can you hear the wind blow and did you know", tiempoInicio: 285.5, tiempoFin: 291 },
          { texto: "Your stairway lies on the whispering wind", tiempoInicio: 291.5, tiempoFin: 297 },
          { texto: "And as we wind on down the road", tiempoInicio: 362, tiempoFin: 367 },
          { texto: "Our shadows taller than our soul", tiempoInicio: 367.5, tiempoFin: 372 },
          { texto: "There walks a lady we all know", tiempoInicio: 372.5, tiempoFin: 377 },
          { texto: "Who shines white light and wants to show", tiempoInicio: 377.5, tiempoFin: 382 },
          { texto: "How everything still turns to gold", tiempoInicio: 382.5, tiempoFin: 387 },
          { texto: "And if you listen very hard", tiempoInicio: 387.5, tiempoFin: 392 },
          { texto: "The tune will come to you at last", tiempoInicio: 392.5, tiempoFin: 397 },
          { texto: "When all are one and one is all", tiempoInicio: 397.5, tiempoFin: 402 },
          { texto: "To be a rock and not to roll", tiempoInicio: 402.5, tiempoFin: 407 },
          { texto: "And she's buying a stairway to heaven", tiempoInicio: 407.5, tiempoFin: 413 }
        ]
      },
      'lose-yourself': {
        id: 'lose-yourself', titulo: 'Lose Yourself', artista: 'Eminem', youtubeId: 'xFYQQPAOz7Y', duracion: 320,
        letraCompleta: [
          { texto: "His palms are sweaty knees weak arms are heavy", tiempoInicio: 14, tiempoFin: 17 },
          { texto: "There's vomit on his sweater already mom's spaghetti", tiempoInicio: 17.5, tiempoFin: 21 },
          { texto: "He's nervous but on the surface he looks calm and ready", tiempoInicio: 21.5, tiempoFin: 25 },
          { texto: "To drop bombs but he keeps on forgetting", tiempoInicio: 25.5, tiempoFin: 28 },
          { texto: "What he wrote down the whole crowd goes so loud", tiempoInicio: 28.5, tiempoFin: 32 },
        ]
      },
      'bohemian-rhapsody': {
        id: 'bohemian-rhapsody', titulo: 'Bohemian Rhapsody', artista: 'Queen', youtubeId: 'fJ9rUzIMcZQ', duracion: 354,
        letraCompleta: [
          { texto: "Is this the real life is this just fantasy", tiempoInicio: 15, tiempoFin: 20 },
          { texto: "Caught in a landslide no escape from reality", tiempoInicio: 20.5, tiempoFin: 25 },
          { texto: "Open your eyes look up to the skies and see", tiempoInicio: 26, tiempoFin: 31 },
          { texto: "I'm just a poor boy I need no sympathy", tiempoInicio: 32, tiempoFin: 37 },
          { texto: "Because I'm easy come easy go little high little low", tiempoInicio: 38, tiempoFin: 43 },
        ]
      },
      'hotel-california': {
        id: 'hotel-california', titulo: 'Hotel California', artista: 'Eagles', youtubeId: 'BciS5krYL80', duracion: 390,
        letraCompleta: [
          { texto: "On a dark desert highway cool wind in my hair", tiempoInicio: 25, tiempoFin: 29 },
          { texto: "Warm smell of colitas rising up through the air", tiempoInicio: 30, tiempoFin: 34 },
          { texto: "Up ahead in the distance I saw a shimmering light", tiempoInicio: 35, tiempoFin: 40 },
          { texto: "My head grew heavy and my sight grew dim", tiempoInicio: 41, tiempoFin: 45 },
          { texto: "I had to stop for the night", tiempoInicio: 46, tiempoFin: 50 },
        ]
      },
      'shape-of-you': {
        id: 'shape-of-you', titulo: 'Shape of You', artista: 'Ed Sheeran', youtubeId: 'JGwWNGJdvx8', duracion: 233,
        letraCompleta: [
          { texto: "The club isn't the best place to find a lover", tiempoInicio: 9, tiempoFin: 12 },
          { texto: "So the bar is where I go", tiempoInicio: 12.5, tiempoFin: 14.5 },
          { texto: "Me and my friends at the table doing shots", tiempoInicio: 15, tiempoFin: 18 },
          { texto: "Drinking fast and then we talk slow", tiempoInicio: 18.5, tiempoFin: 21 },
          { texto: "Come over and start up a conversation with just me", tiempoInicio: 21.5, tiempoFin: 25 },
        ]
      },
      'imagine': {
        id: 'imagine', titulo: 'Imagine', artista: 'John Lennon', youtubeId: 'YkgkThdzX-8', duracion: 183,
        letraCompleta: [
            { texto: "Imagine there's no heaven", tiempoInicio: 14.5, tiempoFin: 17.5 },
            { texto: "It's easy if you try", tiempoInicio: 19, tiempoFin: 22 },
            { texto: "No hell below us", tiempoInicio: 23.5, tiempoFin: 26.5 },
            { texto: "Above us only sky", tiempoInicio: 27, tiempoFin: 30 },
            { texto: "Imagine all the people living for today", tiempoInicio: 31, tiempoFin: 36 },
        ]
      },
    };

    this.cancionData = cancionesDb[songId];
    if (this.cancionData) {
      this.prepararLetra();
    } else {
      console.error('Canción no encontrada:', songId);
    }
  }

  prepararLetra() {
    if (!this.cancionData) return;
    
    this.letraProcesada = this.cancionData.letraCompleta.map((linea, lineaIndex) => {
        const palabras = linea.texto.split(' ');
        const lineaProcesada: LineaLetra = { 
            textoOriginal: linea.texto, tiempoInicio: linea.tiempoInicio, tiempoFin: linea.tiempoFin, palabras: palabras 
        };
        
        // Seleccionar palabras elegibles (más de 2 caracteres, sin puntuación)
        const palabrasElegibles = palabras
            .map((p, i) => ({ texto: p, index: i }))
            .filter(p => this.normalizarTexto(p.texto).length > 2);

        if (palabrasElegibles.length > 0) {
            const palabraSeleccionada = palabrasElegibles[Math.floor(Math.random() * palabrasElegibles.length)];
            // CORRECCIÓN: El tiempo de la palabra debe ser cuando aparece la línea, no antes
            const tiempoPalabra = linea.tiempoInicio + 0.5; // Pequeño delay después de que aparezca la línea
            
            lineaProcesada.palabraCompletable = {
                textoOriginal: palabraSeleccionada.texto,
                textoNormalizado: this.normalizarTexto(palabraSeleccionada.texto),
                tiempo: tiempoPalabra,
                lineaIndex: lineaIndex,
                palabraIndex: palabraSeleccionada.index,
                id: `word-${lineaIndex}-${palabraSeleccionada.index}`,
                completada: false
            };
            this.respuestasUsuario[lineaProcesada.palabraCompletable.id] = '';
            
            console.log(`Palabra completable en línea ${lineaIndex}:`, lineaProcesada.palabraCompletable);
        }
        
        // Generamos el HTML una sola vez para evitar recalcularlo en el template
        lineaProcesada.htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(this.generarHtmlParaLinea(lineaProcesada));
        return lineaProcesada;
    });
    
    console.log('Letra procesada:', this.letraProcesada);
  }

  // Esta función es llamada por el listener global
  handleGlobalInput(event: KeyboardEvent) {
    if (!this.palabraActualCompletando) return;

    const { key } = event;
    
    // Solo procesar teclas de teclado, no clicks
    if (event.type !== 'keydown') return;
    
    // Prevenir comportamiento por defecto en teclas especiales
    if (key === 'Enter' || key === ' ' || key === 'Escape') {
      event.preventDefault();
    }

    const palabraId = this.palabraActualCompletando.id;
    const respuestaActual = this.respuestasUsuario[palabraId] || '';
    const palabraCompleta = this.palabraActualCompletando.textoNormalizado;

    if (key === 'Backspace') {
      // Borrar último carácter
      if (respuestaActual.length > 0) {
        this.respuestasUsuario[palabraId] = respuestaActual.slice(0, -1);
        this.actualizarHtmlActivo();
        this.cdRef.detectChanges();
      }
    } else if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
      // Agregar carácter (solo letras y números)
      if (respuestaActual.length < palabraCompleta.length) {
        this.respuestasUsuario[palabraId] = respuestaActual + key.toLowerCase();
        
        // Verificar si se completó la palabra
        const nuevaRespuesta = this.respuestasUsuario[palabraId];
        if (nuevaRespuesta.length === palabraCompleta.length) {
          // La palabra está completa, verificar si es correcta
          if (this.normalizarTexto(nuevaRespuesta) === palabraCompleta) {
            // ✅ CORRECTO - Marcar como completada INMEDIATAMENTE
            this.hits++;
            this.score += 10;
            this.vida = 100; // Restablecer vida al 100%
            this.palabraActualCompletando.completada = true;
            
            console.log('✅ Palabra correcta:', nuevaRespuesta);
            // Actualizar HTML inmediatamente para mostrar verde
            this.actualizarHtmlActivo();
            this.cdRef.detectChanges();
            
            // Esperar un poco para que se vea el verde y luego continuar
            setTimeout(() => this.reanudarCancion(), 1500);
          } else {
            // ❌ INCORRECTO - Mostrar rojo inmediatamente
            this.vida = Math.max(0, this.vida - 25);
            console.log('❌ Palabra incorrecta:', nuevaRespuesta, 'vs', palabraCompleta);
            
            // Actualizar HTML para mostrar rojo
            this.actualizarHtmlActivo();
            this.cdRef.detectChanges();
            
            setTimeout(() => {
              // Resetear la respuesta para permitir re-intentar
              this.respuestasUsuario[palabraId] = '';
              this.actualizarHtmlActivo();
              this.cdRef.detectChanges();
            }, 2000);
          }
        } else {
          // Solo actualizar visualización (palabra no completa aún)
          this.actualizarHtmlActivo();
          this.cdRef.detectChanges();
        }
      }
    }
  }
  
  // ============== CAMBIO IMPORTANTE: FUNCIÓN PARA GENERAR EL HTML DEL INPUT ==============
  // Esta función genera el string HTML que luego será sanitizado y mostrado.
  generarHtmlParaLinea(linea: LineaLetra, mostrarSoloHastaPalabra: number = -1): string {
    
    if (!linea.palabraCompletable) {
      // Si no hay palabra completable, mostrar solo hasta cierta palabra si se especifica
      if (mostrarSoloHastaPalabra >= 0 && mostrarSoloHastaPalabra < linea.palabras.length) {
        const resultado = linea.palabras.slice(0, mostrarSoloHastaPalabra + 1).join(' ');
        return resultado;
      }
      return linea.textoOriginal;
    }

    const palabra = linea.palabraCompletable;
    const esPalabraActual = this.palabraActualCompletando?.id === palabra.id;
    const respuestaUsuario = this.respuestasUsuario[palabra.id] || '';
    
    // Crear el display visual SOLO con los puntos y letras escritas
    let displayText = '';
    const palabraLength = palabra.textoNormalizado.length;
    
    for (let i = 0; i < palabraLength; i++) {
      if (i < respuestaUsuario.length) {
        displayText += respuestaUsuario[i];
      } else {
        displayText += '•';
      }
    }
    
    // Determinar estado con lógica mejorada
    let claseEstado = '';
    if (palabra.completada) {
      claseEstado = 'word-completed';
    } else if (esPalabraActual) {
      // Verificar si la respuesta actual está mal cuando está completa
      if (respuestaUsuario.length === palabraLength) {
        if (this.normalizarTexto(respuestaUsuario) === palabra.textoNormalizado) {
          claseEstado = 'word-completed'; // Verde cuando es correcta
        } else {
          claseEstado = 'word-error'; // Rojo cuando es incorrecta
        }
      } else {
        claseEstado = 'word-active'; // Amarillo mientras se escribe
      }
    }
    
    // Debug: Mostrar estado actual
    if (esPalabraActual) {
      console.log(`🎨 Estado de palabra: ${claseEstado}, Respuesta: "${respuestaUsuario}", Completada: ${palabra.completada}`);
    }

    // NUEVO DISEÑO: Solo mostrar el texto con input invisible encima
    const inputHtml = `<span class="word-input-wrapper ${claseEstado}" data-word-id="${palabra.id}">
        <input type="text"
            class="word-input-invisible"
            data-word-id="${palabra.id}"
            value="${respuestaUsuario}"
            ${palabra.completada ? 'disabled' : ''}
            autocomplete="off"
            spellcheck="false"
            maxlength="${palabraLength}"
            tabindex="${esPalabraActual ? '0' : '-1'}"
            style="position: absolute; opacity: 0; pointer-events: ${esPalabraActual ? 'all' : 'none'};">
        <span class="word-text-display">${displayText}</span>
    </span>`;

    let palabrasHtml = [...linea.palabras];
    palabrasHtml[palabra.palabraIndex] = inputHtml;
    
    // Si se especifica mostrar solo hasta cierta palabra
    if (mostrarSoloHastaPalabra >= 0) {
      palabrasHtml = palabrasHtml.slice(0, mostrarSoloHastaPalabra + 1);
      const resultado = palabrasHtml.join(' ');
      return resultado;
    }
    
    const resultado = palabrasHtml.join(' ');
    return resultado;
  }

  // Función para procesar línea - usado por el template
  procesarLinea(linea: LineaLetra): SafeHtml {
    return linea.htmlSeguro || this.sanitizer.bypassSecurityTrustHtml(linea.textoOriginal);
  }

  // Función para actualizar el HTML de la línea activa (necesaria para la clase 'active')
  actualizarHtmlActivo() {
    if (this.lineaActualIndex !== -1) {
        const lineaActiva = this.letraProcesada[this.lineaActualIndex];
        if (lineaActiva) {
            // Regenerar completamente el HTML para asegurar que las clases se apliquen
            lineaActiva.htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(
                this.generarHtmlParaLinea(lineaActiva, this.lineaActualMostrandoHasta)
            );
            
            // Forzar detección de cambios
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
        }
    }
  }
  
  pausarCancion() {
    if (this.cancionPausada || !this.isPlayerReady) return;
    
    this.cancionPausada = true;
    this.youtubePlayer.pauseVideo();
    this.iniciarDecrementoVida();
    
    // CORRECCIÓN: Cuando se pausa, mantener toda la línea visible (no cortar)
    // Solo necesitamos asegurar que lineaActualMostrandoHasta sea -1 para mostrar toda la línea
    this.lineaActualMostrandoHasta = -1;
    console.log(`🎮 JUEGO PAUSADO - Manteniendo línea completa visible`);
    
    this.ngZone.run(() => {
      // Actualizamos el HTML para añadir la clase 'active' y cortar en la palabra
      this.actualizarHtmlActivo(); 
      this.cdRef.detectChanges();
      
      // Esperar un poco más para asegurar que el DOM se actualice
      setTimeout(() => {
        if (this.isBrowser) {
          const input = document.querySelector('.word-input-invisible[tabindex="0"]') as HTMLInputElement;
          if (input) {
            input.focus();
            // Limpiar el valor y empezar desde cero
            input.value = '';
            this.respuestasUsuario[this.palabraActualCompletando!.id] = '';
            // Actualizar visual una vez más
            this.actualizarHtmlActivo();
            this.cdRef.detectChanges();
          }
        }
      }, 200);
    });
  }

  reanudarCancion() {
    if (!this.cancionPausada || !this.isPlayerReady) return;
    
    this.cancionPausada = false;
    this.youtubePlayer.playVideo();
    this.detenerDecrementoVida();
    
    // IMPORTANTE: Después de completar palabra, mostrar toda la línea
    this.lineaActualMostrandoHasta = -1;
    
    // Actualizamos el HTML para mostrar la palabra completada y el resto de la línea
    this.actualizarHtmlActivo();
    this.palabraActualCompletando = null;
    this.cdRef.detectChanges();
    
    console.log('🎵 Canción reanudada - mostrando línea completa');
  }


  // --- El resto de las funciones (inicializarJuego, actualizarJuego, etc.) permanecen sin cambios significativos ---
  // ... (incluir el resto de funciones del archivo original como iniciarSimulacionTiempo, terminarJuego, etc.)
  inicializarJuego() {
    this.juegoActivo = true;
    this.cancionPausada = false;
    this.score = 0;
    this.hits = 0;
    this.vida = 100;
    this.lineaActualIndex = -1;
    this.palabraActualCompletando = null;
    this.tiempoActual = 0;
    
    if (this.isPlayerReady) {
      this.youtubePlayer.playVideo();
    }
    
    this.iniciarSimulacionTiempo();
  }

  iniciarSimulacionTiempo() {
    this.limpiarIntervalos();
    this.intervalId = setInterval(() => {
      if (this.isPlayerReady && this.youtubePlayer.getCurrentTime && this.juegoActivo) {
        this.tiempoActual = this.youtubePlayer.getCurrentTime();
        this.actualizarJuego();
        this.cdRef.detectChanges();
      }
    }, 100);
  }

  actualizarJuego() {
    if (!this.juegoActivo || this.cancionPausada) return;

    // Encontrar la línea actual basada en el tiempo (APARECER ANTES, como karaoke)
    const nuevaLineaIndex = this.letraProcesada.findIndex(linea => 
        this.tiempoActual >= (linea.tiempoInicio - 2) && this.tiempoActual < linea.tiempoFin + 2
    );

    // Cambiar a nueva línea si es necesario
    if (nuevaLineaIndex !== -1 && this.lineaActualIndex !== nuevaLineaIndex) {
        this.lineaActualIndex = nuevaLineaIndex;
        this.lineaActualMostrandoHasta = -1; // Reset para nueva línea - mostrar toda la línea
        console.log(`Nueva línea activa: ${this.lineaActualIndex}`, this.letraProcesada[this.lineaActualIndex]);
        
        // Actualizar para mostrar toda la línea cuando aparece
        this.actualizarHtmlActivo();
    }

    // Verificar si debemos pausar DESPUÉS de que termine de cantarse el verso (con margen más preciso)
    if (this.lineaActualIndex >= 0) {
        const lineaActual = this.letraProcesada[this.lineaActualIndex];
        
        // Si la línea tiene palabra completable, aún no está completada, y ya terminó de cantarse
        // Usar un margen de 0.5 segundos para mayor precisión
        if (lineaActual.palabraCompletable && 
            !lineaActual.palabraCompletable.completada && 
            !this.palabraActualCompletando &&
            this.tiempoActual >= (lineaActual.tiempoFin + 0.3)) {
            
            console.log('🎵 VERSO TERMINADO - Pausando para completar palabra:', lineaActual.palabraCompletable);
            this.palabraActualCompletando = lineaActual.palabraCompletable;
            this.pausarCancion();
        }
    }

    // Verificar si el juego ha terminado
    if (this.tiempoActual >= (this.cancionData?.duracion || 0)) {
      this.terminarJuego(true);
    }

    // Verificar si se ha acabado la vida
    if (this.vida <= 0) {
      this.terminarJuego(false);
    }
  }

  iniciarDecrementoVida() {
    this.detenerDecrementoVida();
    this.vidaDecrementoInterval = setInterval(() => {
      this.vida = Math.max(0, this.vida - 1);
      this.cdRef.detectChanges();
      if (this.vida === 0) {
        this.terminarJuego(false);
      }
    }, 150);
  }

  detenerDecrementoVida() {
    if (this.vidaDecrementoInterval) {
      clearInterval(this.vidaDecrementoInterval);
      this.vidaDecrementoInterval = null;
    }
  }
  
  terminarJuego(completado: boolean) {
    this.juegoActivo = false;
    this.cancionPausada = false;
    this.limpiarIntervalos();
    
    if (this.isPlayerReady) {
      this.youtubePlayer.pauseVideo();
    }
    
    if (completado && this.vida > 0) {
      this.score += this.vida;
    }
    
    this.cdRef.detectChanges();
  }

  reiniciarJuego() {
    this.limpiarIntervalos();
    this.respuestasUsuario = {};
    
    this.letraProcesada.forEach(linea => {
      if (linea.palabraCompletable) {
        linea.palabraCompletable.completada = false;
        this.respuestasUsuario[linea.palabraCompletable.id] = '';
      }
      linea.htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(this.generarHtmlParaLinea(linea));
    });
    
    if (this.isPlayerReady) {
      this.youtubePlayer.seekTo(0);
      setTimeout(() => this.inicializarJuego(), 500);
    }
  }

  limpiarIntervalos() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.detenerDecrementoVida();
  }
  
  normalizarTexto(texto: string): string {
    return texto.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"]/g,"");
  }
  
  volverACanciones() {
    this.limpiarIntervalos();
    if (this.youtubePlayer) {
      this.youtubePlayer.pauseVideo();
    }
    this.router.navigate(['/canciones']);
  }

  navigateToProfile() { this.router.navigate(['/profile']); }
  logout() { this.router.navigate(['/login']); }
}