import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser'; // Importar SafeHtml
import { CommonModule } from '@angular/common';
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
  // imports: [CommonModule, FormsModule], // No es necesario en standalone con imports en el decorador
  templateUrl: './juego-cancion.html',
  styleUrls: ['./juego-cancion.css']
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

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
    // Eliminamos los listeners innecesarios. Solo necesitamos uno para el evento 'input'.
    document.removeEventListener('input', this.handleGlobalInput.bind(this));
    document.addEventListener('input', this.handleGlobalInput.bind(this), true);
  }

  ngOnDestroy() {
    this.limpiarIntervalos();
    // Limpiar el listener al destruir el componente
    document.removeEventListener('input', this.handleGlobalInput.bind(this), true);
    if (this.youtubePlayer && typeof this.youtubePlayer.destroy === 'function') {
        this.youtubePlayer.destroy();
    }
  }

  loadYouTubeApi() {
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
          { texto: "There's a lady who's sure", tiempoInicio: 55, tiempoFin: 57 },
          { texto: "all that glitters is gold", tiempoInicio: 57.5, tiempoFin: 60 },
          { texto: "And she's buying a stairway to heaven", tiempoInicio: 61, tiempoFin: 66 },
        ]
      },
      'lose-yourself': {
        id: 'lose-yourself', titulo: 'Lose Yourself', artista: 'Eminem', youtubeId: 'xFYQQPAOz7Y', duracion: 320,
        letraCompleta: [
          { texto: "His palms are sweaty, knees weak, arms are heavy", tiempoInicio: 14, tiempoFin: 17 },
          { texto: "There's vomit on his sweater already, mom's spaghetti", tiempoInicio: 17.5, tiempoFin: 21 },
          { texto: "He's nervous, but on the surface he looks calm and ready", tiempoInicio: 21.5, tiempoFin: 25 },
        ]
      },
      'bohemian-rhapsody': {
        id: 'bohemian-rhapsody', titulo: 'Bohemian Rhapsody', artista: 'Queen', youtubeId: 'fJ9rUzIMcZQ', duracion: 354,
        letraCompleta: [
          { texto: "Is this the real life? Is this just fantasy?", tiempoInicio: 15, tiempoFin: 20 },
          { texto: "Caught in a landslide, no escape from reality", tiempoInicio: 20.5, tiempoFin: 25 },
          { texto: "Open your eyes, look up to the skies and see", tiempoInicio: 26, tiempoFin: 31 },
        ]
      },
      'hotel-california': {
        id: 'hotel-california', titulo: 'Hotel California', artista: 'Eagles', youtubeId: 'BciS5krYL80', duracion: 390,
        letraCompleta: [
          { texto: "On a dark desert highway, cool wind in my hair", tiempoInicio: 25, tiempoFin: 29 },
          { texto: "Warm smell of colitas, rising up through the air", tiempoInicio: 30, tiempoFin: 34 },
          { texto: "Up ahead in the distance, I saw a shimmering light", tiempoInicio: 35, tiempoFin: 40 },
        ]
      },
      'shape-of-you': {
        id: 'shape-of-you', titulo: 'Shape of You', artista: 'Ed Sheeran', youtubeId: 'JGwWNGJdvx8', duracion: 233,
        letraCompleta: [
          { texto: "The club isn't the best place to find a lover", tiempoInicio: 9, tiempoFin: 12 },
          { texto: "So the bar is where I go", tiempoInicio: 12.5, tiempoFin: 14.5 },
          { texto: "Me and my friends at the table doing shots", tiempoInicio: 15, tiempoFin: 18 },
        ]
      },
      'imagine': {
        id: 'imagine', titulo: 'Imagine', artista: 'John Lennon', youtubeId: 'YkgkThdzX-8', duracion: 183,
        letraCompleta: [
            { texto: "Imagine there's no heaven", tiempoInicio: 14.5, tiempoFin: 17.5 },
            { texto: "It's easy if you try", tiempoInicio: 19, tiempoFin: 22 },
            { texto: "No hell below us", tiempoInicio: 23.5, tiempoFin: 26.5 },
        ]
      },
    };

    this.cancionData = cancionesDb[songId];
    if (this.cancionData) {
      this.prepararLetra();
    }
  }

  prepararLetra() {
    if (!this.cancionData) return;
    
    this.letraProcesada = this.cancionData.letraCompleta.map((linea, lineaIndex) => {
        const palabras = linea.texto.split(' ');
        const lineaProcesada: LineaLetra = { 
            textoOriginal: linea.texto, tiempoInicio: linea.tiempoInicio, tiempoFin: linea.tiempoFin, palabras: palabras 
        };
        
        const palabrasElegibles = palabras
            .map((p, i) => ({ texto: p, index: i }))
            .filter(p => this.normalizarTexto(p.texto).length > 3);

        if (palabrasElegibles.length > 0) {
            const palabraSeleccionada = palabrasElegibles[Math.floor(Math.random() * palabrasElegibles.length)];
            const tiempoPalabra = linea.tiempoInicio + 1;
            
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
        }
        // Generamos el HTML una sola vez para evitar recalcularlo en el template
        lineaProcesada.htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(this.generarHtmlParaLinea(lineaProcesada));
        return lineaProcesada;
    });
  }

  // Esta función es llamada por el listener global
  handleGlobalInput(event: Event) {
    const target = event.target as HTMLInputElement;
    
    // Verificamos que el evento provenga de uno de nuestros inputs
    if (!target || !target.classList.contains('word-input-inline')) {
      return;
    }

    if (!this.palabraActualCompletando) return;

    const wordId = target.getAttribute('data-word-id');
    
    if (wordId === this.palabraActualCompletando.id) {
      const inputValue = target.value;
      const respuesta = this.normalizarTexto(inputValue);
      const palabraCorrecta = this.palabraActualCompletando.textoNormalizado;
      
      this.respuestasUsuario[wordId] = inputValue;
      
      if (respuesta === palabraCorrecta) {
        this.hits++;
        this.score += 10;
        target.classList.add('correct');
        target.disabled = true;
        this.palabraActualCompletando.completada = true;
        
        setTimeout(() => this.reanudarCancion(), 500);
      }
      
      this.cdRef.detectChanges();
    }
  }
  
  // ============== CAMBIO IMPORTANTE: FUNCIÓN PARA GENERAR EL HTML DEL INPUT ==============
  // Esta función genera el string HTML que luego será sanitizado y mostrado.
  generarHtmlParaLinea(linea: LineaLetra): string {
    if (!linea.palabraCompletable) return linea.textoOriginal;

    const palabra = linea.palabraCompletable;
    const esPalabraActual = this.palabraActualCompletando?.id === palabra.id;
    const placeholder = '•'.repeat(palabra.textoNormalizado.length);
    const width = Math.max(80, palabra.textoNormalizado.length * 12) + 20;

    // quitamos el evento oninput, ya no es necesario
    const inputHtml = `<input type="text"
        class="word-input-inline ${esPalabraActual ? 'active' : ''} ${palabra.completada ? 'correct' : ''}"
        data-word-id="${palabra.id}"
        placeholder="${placeholder}"
        style="width: ${width}px;"
        value="${this.respuestasUsuario[palabra.id] || ''}"
        ${palabra.completada ? 'disabled' : ''}
        autocomplete="off"
        spellcheck="false"
        tabindex="${esPalabraActual ? '0' : '-1'}">`;

    let palabrasHtml = [...linea.palabras];
    palabrasHtml[palabra.palabraIndex] = inputHtml;
    return palabrasHtml.join(' ');
  }

  // Función para actualizar el HTML de la línea activa (necesaria para la clase 'active')
  actualizarHtmlActivo() {
    if (this.lineaActualIndex !== -1) {
        const lineaActiva = this.letraProcesada[this.lineaActualIndex];
        if (lineaActiva) {
            lineaActiva.htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(this.generarHtmlParaLinea(lineaActiva));
        }
    }
  }
  
  pausarCancion() {
    if (this.cancionPausada || !this.isPlayerReady) return;
    
    this.cancionPausada = true;
    this.youtubePlayer.pauseVideo();
    this.iniciarDecrementoVida();
    
    this.ngZone.run(() => {
      this.actualizarHtmlActivo(); // Actualizamos el HTML para añadir la clase 'active'
      this.cdRef.detectChanges();
      setTimeout(() => {
        const input = document.querySelector('.word-input-inline.active') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
    });
  }

  reanudarCancion() {
    if (!this.cancionPausada || !this.isPlayerReady) return;
    
    this.cancionPausada = false;
    this.youtubePlayer.playVideo();
    this.detenerDecrementoVida();
    
    // Actualizamos el HTML para quitar la clase 'active' y poner 'correct'
    this.actualizarHtmlActivo();
    this.palabraActualCompletando = null;
    this.cdRef.detectChanges();
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

    const nuevaLineaIndex = this.letraProcesada.findIndex(linea => 
        this.tiempoActual >= linea.tiempoInicio && this.tiempoActual < linea.tiempoFin
    );

    if (nuevaLineaIndex !== -1 && this.lineaActualIndex !== nuevaLineaIndex) {
        this.lineaActualIndex = nuevaLineaIndex;
    }

    const lineaActual = this.letraProcesada[this.lineaActualIndex];
    if (lineaActual?.palabraCompletable && 
        !lineaActual.palabraCompletable.completada && 
        !this.palabraActualCompletando &&
        this.tiempoActual >= lineaActual.palabraCompletable.tiempo) {
        
        this.palabraActualCompletando = lineaActual.palabraCompletable;
        this.pausarCancion();
    }

    if (this.tiempoActual >= (this.cancionData?.duracion || 0)) {
      this.terminarJuego(true);
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