import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';


// Importar las interfaces y el servicio
import { PalabraCompletable, LineaLetra, CancionData } from '../../interfaces/cancion.interface';
import { CancionesService } from '../../services/canciones.service';

// Cargar la API de YouTube de forma asíncrona
const youtubeApiScript = 'https://www.youtube.com/iframe_api';

@Component({
  selector: 'app-juego-cancion',
  imports: [CommonModule, FormsModule],
  templateUrl: './juego-cancion.html',
  styleUrls: ['./juego-cancion.css'],
  standalone: true
})
export class JuegoCancion implements OnInit, OnDestroy, AfterViewInit {
  
  // AÑADIR: Variable para trackear el songId actual
  private currentSongId: string | null = null;
  
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
  vidas = 3; // Nueva propiedad para el sistema de vidas
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
    private cancionesService: CancionesService, // AÑADIDO: Inyectar el servicio
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

 // ...existing code...

ngOnInit() {
    this.loadYouTubeApi();
    
    // CAMBIO: Suscribirse a cambios en los parámetros de la ruta
    this.route.params.subscribe(params => {
      const newSongId = params['id'];
      
      // CORREGIDO: Cargar siempre, tanto en inicialización como en cambios
      if (newSongId && newSongId !== this.currentSongId) {
        console.log('🔄 Cambio de canción detectado:', this.currentSongId, '→', newSongId);
        
        // Solo reiniciar si había una canción anterior
        if (this.currentSongId !== null) {
          this.reiniciarComponente();
        }
        
        this.currentSongId = newSongId;
        this.cargarCancion(newSongId);
      }
    });
}

  // NUEVA FUNCIÓN: Reiniciar completamente el componente
  reiniciarComponente() {
    console.log('🔄 Reiniciando componente completamente...');
    
    // Limpiar todo el estado anterior
    this.limpiarIntervalos();
    
    // Destruir el player de YouTube si existe
    if (this.youtubePlayer && typeof this.youtubePlayer.destroy === 'function') {
      try {
        this.youtubePlayer.destroy();
        console.log('📺 YouTube player destruido');
      } catch (error) {
        console.warn('⚠️ Error al destruir YouTube player:', error);
      }
    }
    
    // Resetear todas las variables
    this.cancionData = null;
    this.letraProcesada = [];
    this.youtubePlayer = null;
    this.isPlayerReady = false;
    this.juegoActivo = false;
    this.cancionPausada = false;
    this.tiempoActual = 0;
    this.lineaActualIndex = -1;
    this.palabraActualCompletando = null;
    this.respuestasUsuario = {};
    this.score = 0;
    this.hits = 0;
    this.vida = 100;
    this.vidas = 3;
    this.lineaActualMostrandoHasta = -1;
    
    // Forzar detección de cambios
    this.cdRef.detectChanges();
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

  // MEJORAR: ngOnDestroy con limpieza más exhaustiva
  ngOnDestroy() {
    console.log('🧹 Destruyendo componente JuegoCancion...');
    
    this.limpiarIntervalos();
    
    // Limpiar el listener al destruir el componente
    if (this.isBrowser && this.boundInputHandler) {
      document.removeEventListener('keydown', this.boundInputHandler, true);
    }
    
    // Destruir YouTube player
    if (this.youtubePlayer && typeof this.youtubePlayer.destroy === 'function') {
      try {
        this.youtubePlayer.destroy();
        console.log('📺 YouTube player destruido en ngOnDestroy');
      } catch (error) {
        console.warn('⚠️ Error al destruir player en ngOnDestroy:', error);
      }
    }
    
    // Limpiar contenedor de YouTube
    const container = document.getElementById('youtube-player-container');
    if (container) {
      container.innerHTML = '';
    }
  }

  // MEJORAR: loadYouTubeApi con mejor detección
  loadYouTubeApi() {
    if (!this.isBrowser) return;
    
    // Verificar si YT ya está disponible
    if ((window as any).YT && (window as any).YT.Player) {
      console.log('✅ API de YouTube ya disponible');
      // No llamar setupPlayer aquí, se llamará desde cargarCancion
      return;
    }
    
    // Si ya hay un script cargándose, esperar
    if ((window as any).ytApiLoading) {
      console.log('⏳ API de YouTube ya cargándose...');
      return;
    }
    
    console.log('📥 Cargando API de YouTube...');
    (window as any).ytApiLoading = true;
    
    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('✅ API de YouTube lista');
      (window as any).ytApiLoading = false;
      this.ngZone.run(() => {
        // No llamar setupPlayer aquí automáticamente
        console.log('🎬 YouTube API lista para usar');
      });
    };
    
    // Solo agregar el script si no existe
    if (!document.querySelector(`script[src="${youtubeApiScript}"]`)) {
      const tag = document.createElement('script');
      tag.src = youtubeApiScript;
      tag.onerror = () => {
        console.error('❌ Error cargando API de YouTube');
        (window as any).ytApiLoading = false;
      };
      document.body.appendChild(tag);
    }
  }

 // MEJORAR: Setup del player con mejor manejo de estados
  setupPlayer() {
    if (!this.cancionData) {
      console.warn('⚠️ No hay cancionData para setup del player');
      return;
    }

    // VERIFICAR que la API de YouTube esté disponible
    if (!(window as any).YT || !(window as any).YT.Player) {
      console.warn('⚠️ API de YouTube no disponible, reintentando en 1s...');
      setTimeout(() => {
        if (this.cancionData) {
          this.setupPlayer();
        }
      }, 1000);
      return;
    }


    // Limpiar player anterior si existe
    if (this.youtubePlayer) {
      try {
        this.youtubePlayer.destroy();
      } catch (error) {
        console.warn('⚠️ Error al limpiar player anterior:', error);
      }
    }
    
    console.log('📺 Configurando nuevo YouTube player para:', this.cancionData.youtubeId);
    
    // Verificar que el contenedor existe
    const container = document.getElementById('youtube-player-container');
    if (!container) {
      console.error('❌ Contenedor youtube-player-container no encontrado');

      // Intentar nuevamente después de un delay (puede que el DOM no esté listo)
      setTimeout(() => {
        if (this.cancionData) {
          this.setupPlayer();
        }
      }, 500);
      return;
    }
  
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    try {
      this.youtubePlayer = new (window as any).YT.Player('youtube-player-container', {
        height: '100%',
        width: '100%',
        videoId: this.cancionData.youtubeId,
        playerVars: { 
          'autoplay': 0, 
          'controls': 0, 
          'modestbranding': 1, 
          'rel': 0, 
          'disablekb': 1,
          'enablejsapi': 1
        },
        events: {
          'onReady': () => this.ngZone.run(() => this.onPlayerReady()),
          'onStateChange': (event: any) => this.ngZone.run(() => this.onPlayerStateChange(event)),
          'onError': (event: any) => this.ngZone.run(() => this.onPlayerError(event))
        }
      });
    } catch (error) {
      console.error('❌ Error al crear YouTube player:', error);
    }
  }
  
  onPlayerReady() {
    this.isPlayerReady = true;
    setTimeout(() => this.inicializarJuego(), 1000);
  }

  // NUEVA FUNCIÓN: Manejar errores del player
  onPlayerError(event: any) {
    console.error('❌ Error en YouTube player:', event);
    
    // Intentar recargar después de un delay
    setTimeout(() => {
      if (this.cancionData) {
        console.log('🔄 Intentando recargar el player...');
        this.setupPlayer();
      }
    }, 2000);
  }
  
  onPlayerStateChange(event: any) {
    if (event.data === (window as any).YT.PlayerState.ENDED) {
        this.terminarJuego(true);
    }
  }


 // MEJORAR: Función cargarCancion con mejor manejo de errores
  cargarCancion(songId: string) {
    console.log('📀 Cargando canción:', songId);
    
    this.cancionData = this.cancionesService.obtenerCancionPorId(songId);
    
    if (this.cancionData) {
      console.log('✅ Canción cargada:', this.cancionData.titulo, 'de', this.cancionData.artista);
      this.prepararLetra();
      
      // IMPORTANTE: Solo setup del player después de cargar la canción
      setTimeout(() => {
        if (this.cancionData) {
          this.setupPlayer();
        }
      }, 100);
    } else {
      console.error('❌ Canción no encontrada:', songId);
      console.log('🎵 Canciones disponibles:', this.cancionesService.obtenerIdsCanciones());
      // Opcional: Redirigir a la lista de canciones
      this.router.navigate(['/canciones']);
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
            const tiempoPalabra = linea.tiempoInicio; // Pequeño delay después de que aparezca la línea
            
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

// MÉTODO HANDLEGLLOBALINPUT CORREGIDO
handleGlobalInput(event: KeyboardEvent) {
    if (!this.palabraActualCompletando) return;

    const { key } = event;
    
    if (event.type !== 'keydown') return;
    
    if (key === 'Enter' || key === ' ' || key === 'Escape') {
      event.preventDefault();
    }

    const palabraId = this.palabraActualCompletando.id;
    const respuestaActual = this.respuestasUsuario[palabraId] || '';
    const palabraCompleta = this.palabraActualCompletando.textoNormalizado;

    if (key === 'Backspace') {
      if (respuestaActual.length > 0) {
        this.respuestasUsuario[palabraId] = respuestaActual.slice(0, -1);
        console.log('🔙 Backspace - Nueva respuesta:', this.respuestasUsuario[palabraId]);
        this.forzarActualizacionHTML();
      }
    } else if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
      if (respuestaActual.length < palabraCompleta.length) {
        this.respuestasUsuario[palabraId] = respuestaActual + key.toLowerCase();
        const nuevaRespuesta = this.respuestasUsuario[palabraId];
        
        console.log('⌨️ Tecla presionada:', key, '- Nueva respuesta:', nuevaRespuesta, '- Esperada:', palabraCompleta);
        
        // INMEDIATAMENTE forzar actualización para mostrar el cambio
        this.forzarActualizacionHTML();
        
        if (nuevaRespuesta.length === palabraCompleta.length) {
          // Palabra completa - verificar si es correcta
          if (this.normalizarTexto(nuevaRespuesta) === palabraCompleta) {
            // ✅ CORRECTA
            this.palabraActualCompletando.completada = true;
            this.hits++;
            this.score += 10;
            this.vida = 100;
            
            console.log('✅ PALABRA CORRECTA! Marcando como completada');
            this.forzarActualizacionHTML();
            
            // Delay antes de continuar
            setTimeout(() => {
              if (this.cancionPausada) {
                this.reanudarCancion();
              } else {
                this.palabraActualCompletando = null;
                this.detenerDecrementoVida();
                this.forzarActualizacionHTML();
              }
            }, 1500);
            
          } else {
            // ❌ INCORRECTA
            this.vida = Math.max(0, this.vida - 15);
            console.log('❌ PALABRA INCORRECTA! Mostrando error');
            this.forzarActualizacionHTML();
            
            // Limpiar después del delay para permitir reintentar
            setTimeout(() => {
              if (this.respuestasUsuario[palabraId] === nuevaRespuesta) {
                this.respuestasUsuario[palabraId] = '';
                console.log('🧹 Limpiando respuesta incorrecta');
                this.forzarActualizacionHTML();
              }
            }, 2000);
          }
        }
      }
    }
}


// MÉTODO FORZARACTUALIZACIONHTML MÁS AGRESIVO
forzarActualizacionHTML() {
    console.log('🔄 Forzando actualización HTML...');
    
    if (this.lineaActualIndex !== -1) {
        const lineaActiva = this.letraProcesada[this.lineaActualIndex];
        if (lineaActiva) {
            // Regenerar HTML completamente
            const nuevoHtml = this.generarHtmlParaLinea(lineaActiva, this.lineaActualMostrandoHasta);
            lineaActiva.htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(nuevoHtml);
            
            // Múltiples ciclos de detección de cambios
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            
            // Forzar en múltiples ticks para asegurar renderizado
            setTimeout(() => this.cdRef.detectChanges(), 0);
            setTimeout(() => this.cdRef.detectChanges(), 10);
            setTimeout(() => this.cdRef.detectChanges(), 50);
            
            console.log('✅ HTML actualizado');
        }
    }
}

// MÉTODO GENERARHTMLPARALINEA MEJORADO
generarHtmlParaLinea(linea: LineaLetra, mostrarSoloHastaPalabra: number = -1): string {
    
    if (!linea.palabraCompletable) {
      if (mostrarSoloHastaPalabra >= 0 && mostrarSoloHastaPalabra < linea.palabras.length) {
        return linea.palabras.slice(0, mostrarSoloHastaPalabra + 1).join(' ');
      }
      return linea.textoOriginal;
    }

    const palabra = linea.palabraCompletable;
    const esPalabraActual = this.palabraActualCompletando?.id === palabra.id;
    const respuestaUsuario = this.respuestasUsuario[palabra.id] || '';
    
    // Crear el display visual
    let displayText = '';
    const palabraLength = palabra.textoNormalizado.length;
    
    for (let i = 0; i < palabraLength; i++) {
      if (i < respuestaUsuario.length) {
        displayText += respuestaUsuario[i];
      } else {
        displayText += '•';
      }
    }
    
    // LÓGICA DE ESTADOS SIMPLIFICADA Y CLARA
    let claseEstado = '';
    
    if (palabra.completada) {
      // 🟢 COMPLETADA CORRECTAMENTE
      claseEstado = 'word-completed';
      console.log('🟢 Aplicando word-completed a:', palabra.textoOriginal);
      
    } else if (esPalabraActual) {
      
      if (respuestaUsuario.length === palabraLength) {
        // Palabra completa - verificar si es correcta
        const esCorrecta = this.normalizarTexto(respuestaUsuario) === palabra.textoNormalizado;
        if (esCorrecta) {
          claseEstado = 'word-completed'; // Verde
          console.log('🟢 Aplicando word-completed (recién completada) a:', palabra.textoOriginal);
        } else {
          claseEstado = 'word-error'; // Rojo
          console.log('🔴 Aplicando word-error a:', palabra.textoOriginal);
        }
        
      } else if (respuestaUsuario.length > 0) {
        // Verificar si lo escrito es correcto hasta ahora
        const textoCorrectoParcial = palabra.textoNormalizado.substring(0, respuestaUsuario.length);
        const respuestaNormalizada = this.normalizarTexto(respuestaUsuario);
        
        if (respuestaNormalizada === textoCorrectoParcial) {
          claseEstado = 'word-active'; // Amarillo
          console.log('🟡 Aplicando word-active a:', palabra.textoOriginal, '- Parcial correcto:', respuestaUsuario);
        } else {
          claseEstado = 'word-warning'; // Naranja
          console.log('🟠 Aplicando word-warning a:', palabra.textoOriginal, '- Parcial incorrecto:', respuestaUsuario);
        }
        
      } else {
        // Sin respuesta aún
        claseEstado = 'word-active'; // Amarillo
        console.log('🟡 Aplicando word-active (vacío) a:', palabra.textoOriginal);
      }
    }

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
    
    if (mostrarSoloHastaPalabra >= 0) {
      palabrasHtml = palabrasHtml.slice(0, mostrarSoloHastaPalabra + 1);
    }
    
    const resultado = palabrasHtml.join(' ');
    console.log('📝 HTML final con clase:', claseEstado);
    return resultado;
}


  // Función para procesar línea - usado por el template
  procesarLinea(linea: LineaLetra): SafeHtml {
    return linea.htmlSeguro || this.sanitizer.bypassSecurityTrustHtml(linea.textoOriginal);
  }

  // Función para actualizar el HTML de la línea activa (necesaria para la clase 'active')
actualizarHtmlActivo() {
    this.forzarActualizacionHTML();
}
// ...existing code...

pausarCancion() {
    if (this.cancionPausada || !this.isPlayerReady) return;
    
    this.cancionPausada = true;
    this.youtubePlayer.pauseVideo();
    
    // IMPORTANTE: Asegurar que el decremento de vida esté corriendo cuando se pausa
    if (!this.vidaDecrementoInterval) {
        this.iniciarDecrementoVida();
    }
    
    this.lineaActualMostrandoHasta = -1;
    console.log(`⏸️ JUEGO PAUSADO - Verso terminó sin completar palabra`);
    
    this.ngZone.run(() => {
      this.actualizarHtmlActivo(); 
      this.cdRef.detectChanges();
      
      // Enfocar el input para que el usuario pueda continuar escribiendo
      setTimeout(() => {
        if (this.isBrowser) {
          const input = document.querySelector('.word-input-invisible[tabindex="0"]') as HTMLInputElement;
          if (input) {
            input.focus();
          }
        }
      }, 200);
    });
}

reanudarCancion() {
    if (!this.cancionPausada || !this.isPlayerReady) return;
    
    this.cancionPausada = false;
    this.youtubePlayer.playVideo();
    
    // IMPORTANTE: Restaurar vida al reanudar
    this.vida = 100;
    
    this.lineaActualMostrandoHasta = -1;
    this.actualizarHtmlActivo();
    
    // Solo limpiar palabraActualCompletando si realmente se completó
    if (this.palabraActualCompletando?.completada) {
        this.palabraActualCompletando = null;
        this.detenerDecrementoVida();
    }
    
    this.cdRef.detectChanges();
    console.log('▶️ Canción reanudada');
}


  // --- El resto de las funciones (inicializarJuego, actualizarJuego, etc.) permanecen sin cambios significativos ---
  // ... (incluir el resto de funciones del archivo original como iniciarSimulacionTiempo, terminarJuego, etc.)
  inicializarJuego() {
    this.juegoActivo = true;
    this.cancionPausada = false;
    this.score = 0;
    this.hits = 0;
    this.vida = 100;
    this.vidas = 3;
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

// ...existing code...

actualizarJuego() {
  if (!this.juegoActivo || this.cancionPausada) return;

  // DEBUG: Log cada 5 segundos para monitorear
  if (Math.floor(this.tiempoActual) % 5 === 0 && Math.floor(this.tiempoActual * 10) % 50 === 0) {
    console.log(`⏰ Tiempo: ${this.tiempoActual.toFixed(1)}s, Línea: ${this.lineaActualIndex}, Palabra activa: ${this.palabraActualCompletando?.textoOriginal || 'ninguna'}`);
  }

  // CAMBIO: Encontrar la línea actual basada en el tiempo
  const nuevaLineaIndex = this.letraProcesada.findIndex(linea => 
      this.tiempoActual >= linea.tiempoInicio && this.tiempoActual <= linea.tiempoFin
  );

  // Cambiar a nueva línea si es necesario
  if (nuevaLineaIndex !== -1 && this.lineaActualIndex !== nuevaLineaIndex) {
      console.log(`🎵 Transición de línea ${this.lineaActualIndex} → ${nuevaLineaIndex} en tiempo ${this.tiempoActual}s`);
      
      // CRÍTICO: Solo limpiar palabra anterior si realmente se completó
      if (this.palabraActualCompletando?.completada) {
          console.log('✅ Limpiando palabra completada anterior');
          this.palabraActualCompletando = null;
          this.detenerDecrementoVida();
      }
      
      this.lineaActualIndex = nuevaLineaIndex;
      this.lineaActualMostrandoHasta = -1;
      
      // ACTIVAR palabra inmediatamente cuando aparece el verso (SIN PAUSAR)
      const lineaActual = this.letraProcesada[this.lineaActualIndex];
      if (lineaActual.palabraCompletable && 
          !lineaActual.palabraCompletable.completada && 
          !this.palabraActualCompletando) {
          
          console.log('🎯 Nueva línea - Activando palabra para completar:', lineaActual.palabraCompletable.textoOriginal);
          this.palabraActualCompletando = lineaActual.palabraCompletable;
          this.iniciarDecrementoVida();
          this.forzarActualizacionHTML();
          return;
      }
      
      this.forzarActualizacionHTML();
  }

  // SIMPLIFICADA: Lógica básica - pausar cuando termine el verso y no esté completada
  if (this.palabraActualCompletando && !this.palabraActualCompletando.completada) {
      const lineaActual = this.letraProcesada[this.lineaActualIndex];
      
      // CAMBIO: Verificar si la línea actual ha terminado (más simple)
      if (lineaActual && this.tiempoActual > lineaActual.tiempoFin) {
          console.log('⏸️ Verso terminó y palabra NO completada - PAUSANDO');
          this.pausarCancion();
          return;
      }
  }

  // REMOVER toda la lógica compleja de verificar siguiente línea próxima
  // REMOVER la verificación de períodos largos entre versos
  
  // Verificar si el juego ha terminado
  if (this.tiempoActual >= (this.cancionData?.duracion || 0)) {
      this.terminarJuego(true);
  }

  // Verificar si se han acabado las vidas
  if (this.vida <= 0 && this.vidas <= 0) {
      this.terminarJuego(false);
  }
}

iniciarDecrementoVida() {
    this.detenerDecrementoVida();
    this.vidaDecrementoInterval = setInterval(() => {
      // CAMBIO CRÍTICO: Solo decrementar vida cuando esté PAUSADO
      if (this.cancionPausada) {
          this.vida = Math.max(0, this.vida - 1);
          this.cdRef.detectChanges();
          
          // Cuando la vida llega a 0, perder una vida y completar automáticamente
          if (this.vida === 0 && this.palabraActualCompletando) {
              this.perderVida();
          }
      }
      // Si no está pausado, mantener la vida en 100%
      else if (this.vida < 100) {
          this.vida = 100;
          this.cdRef.detectChanges();
      }
    }, 150);
}
// ...existing code...

perderVida() {
  if (this.vidas > 0) {
    this.vidas--;
    console.log(`💔 Vida perdida! Vidas restantes: ${this.vidas}`);
    
    // Completar automáticamente la palabra
    if (this.palabraActualCompletando) {
      const palabraId = this.palabraActualCompletando.id;
      this.respuestasUsuario[palabraId] = this.palabraActualCompletando.textoNormalizado;
      this.palabraActualCompletando.completada = true;
      
      console.log('🤖 Palabra completada automáticamente:', this.palabraActualCompletando.textoOriginal);
      
      // CRÍTICO: Forzar actualización para mostrar el verde
      this.forzarActualizacionHTML();
      
      // CAMBIO: Restaurar vida inmediatamente
      this.vida = 100;
      
      // Si estaba pausado, reanudar; si no, solo limpiar
      if (this.cancionPausada) {
        setTimeout(() => this.reanudarCancion(), 2000);
      } else {
        setTimeout(() => {
          this.palabraActualCompletando = null;
          this.detenerDecrementoVida();
          this.forzarActualizacionHTML();
        }, 2000);
      }
    }
  } else {
    // No quedan vidas, terminar el juego
    console.log('💀 Sin vidas restantes - Game Over');
    this.terminarJuego(false);
  }
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
      this.score += this.vidas * 50;
    }
    
    this.cdRef.detectChanges();
  }

  reiniciarJuego() {
    this.limpiarIntervalos();
    this.respuestasUsuario = {};
    this.vidas = 3; // Reiniciar vidas
    
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
  
  // MEJORAR: Función volverACanciones
  volverACanciones() {
    console.log('🔙 Volviendo a canciones...');
    this.reiniciarComponente();
    this.router.navigate(['/canciones']);
  }

  navigateToProfile() { this.router.navigate(['/profile']); }
  logout() { this.router.navigate(['/login']); }
}