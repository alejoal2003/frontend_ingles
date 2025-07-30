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

// ============== BASE DE DATOS DE CANCIONES COMPLETA Y SINCRONIZADA (VERSIÓN CORREGIDA) ==============
cargarCancion(songId: string) {
  const cancionesDb: { [key: string]: CancionData } = {
    'stairway-to-heaven': {
      id: 'stairway-to-heaven', titulo: 'Stairway to Heaven', artista: 'Led Zeppelin', youtubeId: 'QkF3oxziUI4', duracion: 482,
      letraCompleta: [
        { texto: "There's a lady who's sure all that glitters is gold", tiempoInicio: 53, tiempoFin: 58.5 },
        { texto: "And she's buying a stairway to heaven", tiempoInicio: 59, tiempoFin: 65 },
        { texto: "When she gets there she knows, if the stores are all closed", tiempoInicio: 66, tiempoFin: 72 },
        { texto: "With a word she can get what she came for", tiempoInicio: 73, tiempoFin: 78.5 },
        { texto: "Ooh, ooh, and she's buying a stairway to heaven", tiempoInicio: 79, tiempoFin: 85 },
        { texto: "There's a sign on the wall but she wants to be sure", tiempoInicio: 86, tiempoFin: 91.5 },
        { texto: "'Cause you know sometimes words have two meanings", tiempoInicio: 92, tiempoFin: 97.5 },
        { texto: "In a tree by the brook, there's a songbird who sings", tiempoInicio: 98, tiempoFin: 103.5 },
        { texto: "Sometimes all of our thoughts are misgiven", tiempoInicio: 104, tiempoFin: 109.5 },
        { texto: "Ooh, it makes me wonder", tiempoInicio: 110.5, tiempoFin: 115.5 },
        { texto: "Ooh, it makes me wonder", tiempoInicio: 116.5, tiempoFin: 121.5 },
        { texto: "There's a feeling I get when I look to the west", tiempoInicio: 122, tiempoFin: 127.5 },
        { texto: "And my spirit is crying for leaving", tiempoInicio: 128, tiempoFin: 133.5 },
        { texto: "In my thoughts I have seen rings of smoke through the trees", tiempoInicio: 134, tiempoFin: 139.5 },
        { texto: "And the voices of those who stand looking", tiempoInicio: 140, tiempoFin: 145.5 },
        { texto: "Ooh, it makes me wonder", tiempoInicio: 146.5, tiempoFin: 151.5 },
        { texto: "Ooh, it really makes me wonder", tiempoInicio: 152.5, tiempoFin: 157.5 },
        { texto: "And it's whispered that soon, if we all call the tune", tiempoInicio: 158, tiempoFin: 163.5 },
        { texto: "Then the piper will lead us to reason", tiempoInicio: 164, tiempoFin: 169.5 },
        { texto: "And a new day will dawn for those who stand long", tiempoInicio: 170, tiempoFin: 175.5 },
        { texto: "And the forests will echo with laughter", tiempoInicio: 176, tiempoFin: 181.5 },
        { texto: "If there's a bustle in your hedgerow, don't be alarmed now", tiempoInicio: 242.5, tiempoFin: 247.5 },
        { texto: "It's just a spring clean for the May queen", tiempoInicio: 248, tiempoFin: 253.5 },
        { texto: "Yes, there are two paths you can go by, but in the long run", tiempoInicio: 254, tiempoFin: 259.5 },
        { texto: "There's still time to change the road you're on", tiempoInicio: 260, tiempoFin: 265.5 },
        { texto: "And it makes me wonder", tiempoInicio: 266.5, tiempoFin: 271.5 },
        { texto: "Your head is humming and it won't go, in case you don't know", tiempoInicio: 272, tiempoFin: 277.5 },
        { texto: "The piper's calling you to join him", tiempoInicio: 278, tiempoFin: 283.5 },
        { texto: "Dear lady, can you hear the wind blow, and did you know", tiempoInicio: 284, tiempoFin: 289.5 },
        { texto: "Your stairway lies on the whispering wind", tiempoInicio: 290, tiempoFin: 296 },
        { texto: "And as we wind on down the road", tiempoInicio: 361.5, tiempoFin: 366 },
        { texto: "Our shadows taller than our soul", tiempoInicio: 367, tiempoFin: 371.5 },
        { texto: "There walks a lady we all know", tiempoInicio: 372, tiempoFin: 376.5 },
        { texto: "Who shines white light and wants to show", tiempoInicio: 377, tiempoFin: 381.5 },
        { texto: "How everything still turns to gold", tiempoInicio: 382, tiempoFin: 386.5 },
        { texto: "And if you listen very hard", tiempoInicio: 387, tiempoFin: 391.5 },
        { texto: "The tune will come to you at last", tiempoInicio: 392, tiempoFin: 396.5 },
        { texto: "When all are one and one is all", tiempoInicio: 397, tiempoFin: 401.5 },
        { texto: "To be a rock and not to roll", tiempoInicio: 402, tiempoFin: 407 },
        { texto: "And she's buying a stairway to heaven", tiempoInicio: 408, tiempoFin: 414 }
      ]
    },
    'lose-yourself': {
      id: 'lose-yourself', titulo: 'Lose Yourself', artista: 'Eminem', youtubeId: 'xFYQQPAOz7Y', duracion: 320,
      letraCompleta: [
        { texto: "Look, if you had one shot or one opportunity", tiempoInicio: 8, tiempoFin: 11 },
        { texto: "To seize everything you ever wanted in one moment", tiempoInicio: 11.5, tiempoFin: 14 },
        { texto: "Would you capture it or just let it slip?", tiempoInicio: 14.5, tiempoFin: 17 },
        { texto: "His palms are sweaty, knees weak, arms are heavy", tiempoInicio: 18, tiempoFin: 21 },
        { texto: "There's vomit on his sweater already, mom's spaghetti", tiempoInicio: 21.5, tiempoFin: 25 },
        { texto: "He's nervous, but on the surface he looks calm and ready", tiempoInicio: 25.5, tiempoFin: 28.5 },
        { texto: "To drop bombs, but he keeps on forgettin'", tiempoInicio: 29, tiempoFin: 31.5 },
        { texto: "What he wrote down, the whole crowd goes so loud", tiempoInicio: 32, tiempoFin: 35 },
        { texto: "He opens his mouth, but the words won't come out", tiempoInicio: 35.5, tiempoFin: 38.5 },
        { texto: "He's chokin', how, everybody's jokin' now", tiempoInicio: 39, tiempoFin: 42 },
        { texto: "The clocks run out, times up, over, blaow!", tiempoInicio: 42.5, tiempoFin: 45.5 },
        { texto: "Snap back to reality, ope there goes gravity", tiempoInicio: 46, tiempoFin: 49 },
        { texto: "Ope, there goes Rabbit, he choked", tiempoInicio: 49.5, tiempoFin: 52 },
        { texto: "He's so mad, but he won't give up that easy? No", tiempoInicio: 52.5, tiempoFin: 55 },
        { texto: "He won't have it, he knows his whole back's to these ropes", tiempoInicio: 55.5, tiempoFin: 58.5 },
        { texto: "It don't matter, he's dope, he knows that, but he's broke", tiempoInicio: 59, tiempoFin: 102 },
        { texto: "He's so stagnant, he knows, when he goes back to this mobile home", tiempoInicio: 102.5, tiempoFin: 106 },
        { texto: "That's when it's back to the lab again, yo", tiempoInicio: 106.5, tiempoFin: 109 },
        { texto: "This whole rhapsody, he better go capture this moment and hope it don't pass him", tiempoInicio: 109.5, tiempoFin: 114 },
        { texto: "You better lose yourself in the music, the moment", tiempoInicio: 114.5, tiempoFin: 117.5 },
        { texto: "You own it, you better never let it go", tiempoInicio: 118, tiempoFin: 120.5 },
        { texto: "You only get one shot, do not miss your chance to blow", tiempoInicio: 121, tiempoFin: 124 },
        { texto: "This opportunity comes once in a lifetime", tiempoInicio: 124.5, tiempoFin: 127.5 }
      ]
    },
    'bohemian-rhapsody': {
      id: 'bohemian-rhapsody', titulo: 'Bohemian Rhapsody', artista: 'Queen', youtubeId: 'fJ9rUzIMcZQ', duracion: 354,
      letraCompleta: [
        { texto: "Is this the real life? Is this just fantasy?", tiempoInicio: 14, tiempoFin: 19.5 },
        { texto: "Caught in a landslide, no escape from reality", tiempoInicio: 20, tiempoFin: 25 },
        { texto: "Open your eyes, look up to the skies and see", tiempoInicio: 26, tiempoFin: 31 },
        { texto: "I'm just a poor boy, I need no sympathy", tiempoInicio: 32, tiempoFin: 37 },
        { texto: "Because I'm easy come, easy go, little high, little low", tiempoInicio: 38, tiempoFin: 43.5 },
        { texto: "Any way the wind blows doesn't really matter to me, to me", tiempoInicio: 44, tiempoFin: 51 },
        { texto: "Mama, just killed a man", tiempoInicio: 67, tiempoFin: 70.5 },
        { texto: "Put a gun against his head, pulled my trigger, now he's dead", tiempoInicio: 71, tiempoFin: 75.5 },
        { texto: "Mama, life had just begun", tiempoInicio: 76, tiempoFin: 80 },
        { texto: "But now I've gone and thrown it all away", tiempoInicio: 80.5, tiempoFin: 85 },
        { texto: "Mama, ooh, didn't mean to make you cry", tiempoInicio: 86, tiempoFin: 92 },
        { texto: "If I'm not back again this time tomorrow", tiempoInicio: 92.5, tiempoFin: 95.5 },
        { texto: "Carry on, carry on as if nothing really matters", tiempoInicio: 96, tiempoFin: 101.5 },
        { texto: "Too late, my time has come", tiempoInicio: 109, tiempoFin: 113 },
        { texto: "Sends shivers down my spine, body's aching all the time", tiempoInicio: 113.5, tiempoFin: 118 },
        { texto: "Goodbye, everybody, I've got to go", tiempoInicio: 119, tiempoFin: 123.5 },
        { texto: "Gotta leave you all behind and face the truth", tiempoInicio: 124, tiempoFin: 129.5 },
        { texto: "Mama, ooh, I don't wanna die", tiempoInicio: 130, tiempoFin: 136 },
        { texto: "I sometimes wish I'd never been born at all", tiempoInicio: 136.5, tiempoFin: 141.5 },
        { texto: "I see a little silhouetto of a man", tiempoInicio: 184, tiempoFin: 187 },
        { texto: "Scaramouche, Scaramouche, will you do the Fandango?", tiempoInicio: 187.5, tiempoFin: 191 },
        { texto: "Thunderbolt and lightning, very, very frightening me", tiempoInicio: 191.5, tiempoFin: 195 },
        { texto: "(Galileo) Galileo, (Galileo) Galileo, Galileo Figaro magnifico", tiempoInicio: 195.5, tiempoFin: 202 },
        { texto: "I'm just a poor boy, nobody loves me", tiempoInicio: 202.5, tiempoFin: 205.5 },
        { texto: "He's just a poor boy from a poor family", tiempoInicio: 206, tiempoFin: 209 },
        { texto: "Spare him his life from this monstrosity", tiempoInicio: 209.5, tiempoFin: 212.5 },
        { texto: "Easy come, easy go, will you let me go?", tiempoInicio: 213, tiempoFin: 216 },
        { texto: "Bismillah! No, we will not let you go (Let him go!)", tiempoInicio: 216.5, tiempoFin: 219.5 },
        { texto: "Bismillah! We will not let you go (Let him go!)", tiempoInicio: 220, tiempoFin: 222.5 },
        { texto: "Bismillah! We will not let you go (Let me go!)", tiempoInicio: 223, tiempoFin: 225.5 },
        { texto: "Will not let you go (Let me go!)", tiempoInicio: 226, tiempoFin: 228 },
        { texto: "Never let you go (Never, never, never, never let me go)", tiempoInicio: 228.5, tiempoFin: 232 },
        { texto: "No, no, no, no, no, no, no", tiempoInicio: 232.5, tiempoFin: 235 },
        { texto: "Oh, mamma mia, mamma mia (Mamma mia, let me go)", tiempoInicio: 235.5, tiempoFin: 239 },
        { texto: "Beelzebub has a devil put aside for me, for me, for me!", tiempoInicio: 239.5, tiempoFin: 245 },
        { texto: "So you think you can stone me and spit in my eye?", tiempoInicio: 252, tiempoFin: 256 },
        { texto: "So you think you can love me and leave me to die?", tiempoInicio: 257, tiempoFin: 301.5 },
        { texto: "Oh, baby, can't do this to me, baby!", tiempoInicio: 302, tiempoFin: 306 },
        { texto: "Just gotta get out, just gotta get right outta here", tiempoInicio: 306.5, tiempoFin: 311 },
        { texto: "Nothing really matters, anyone can see", tiempoInicio: 323, tiempoFin: 328 },
        { texto: "Nothing really matters", tiempoInicio: 329, tiempoFin: 332 },
        { texto: "Nothing really matters to me", tiempoInicio: 333, tiempoFin: 338 }
      ]
    },
    'hotel-california': {
      id: 'hotel-california', titulo: 'Hotel California', artista: 'Eagles', youtubeId: '09839DpTctU', duracion: 390,
      letraCompleta: [
        { texto: "On a dark desert highway, cool wind in my hair", tiempoInicio: 25, tiempoFin: 30 },
        { texto: "Warm smell of colitas, rising up through the air", tiempoInicio: 31, tiempoFin: 36 },
        { texto: "Up ahead in the distance, I saw a shimmering light", tiempoInicio: 37, tiempoFin: 42 },
        { texto: "My head grew heavy and my sight grew dim", tiempoInicio: 42.5, tiempoFin: 47 },
        { texto: "I had to stop for the night", tiempoInicio: 47.5, tiempoFin: 50 },
        { texto: "There she stood in the doorway; I heard the mission bell", tiempoInicio: 53.5, tiempoFin: 58.5 },
        { texto: "And I was thinking to myself, 'This could be Heaven or this could be Hell'", tiempoInicio: 59, tiempoFin: 64.5 },
        { texto: "Then she lit up a candle and she showed me the way", tiempoInicio: 65, tiempoFin: 70 },
        { texto: "There were voices down the corridor, I thought I heard them say", tiempoInicio: 71, tiempoFin: 76.5 },
        { texto: "Welcome to the Hotel California", tiempoInicio: 77.5, tiempoFin: 82.5 },
        { texto: "Such a lovely place (Such a lovely place), Such a lovely face", tiempoInicio: 83, tiempoFin: 88.5 },
        { texto: "Plenty of room at the Hotel California", tiempoInicio: 89, tiempoFin: 94 },
        { texto: "Any time of year (Any time of year), you can find it here", tiempoInicio: 94.5, tiempoFin: 100 },
        { texto: "Her mind is Tiffany-twisted, she got the Mercedes-Benz", tiempoInicio: 119, tiempoFin: 124 },
        { texto: "She got a lot of pretty, pretty boys she calls friends", tiempoInicio: 125, tiempoFin: 130 },
        { texto: "How they dance in the courtyard, sweet summer sweat", tiempoInicio: 130.5, tiempoFin: 135.5 },
        { texto: "Some dance to remember, some dance to forget", tiempoInicio: 136, tiempoFin: 141.5 },
        { texto: "So I called up the Captain, 'Please bring me my wine'", tiempoInicio: 142, tiempoFin: 147 },
        { texto: "He said, 'We haven't had that spirit here since nineteen sixty-nine'", tiempoInicio: 148, tiempoFin: 153.5 },
        { texto: "And still those voices are calling from far away", tiempoInicio: 154, tiempoFin: 159 },
        { texto: "Wake you up in the middle of the night, just to hear them say", tiempoInicio: 159.5, tiempoFin: 205 },
        { texto: "Welcome to the Hotel California", tiempoInicio: 206, tiempoFin: 211 },
        { texto: "Such a lovely place (Such a lovely place), Such a lovely face", tiempoInicio: 211.5, tiempoFin: 217 },
        { texto: "They livin' it up at the Hotel California", tiempoInicio: 217.5, tiempoFin: 222.5 },
        { texto: "What a nice surprise (what a nice surprise), bring your alibis", tiempoInicio: 223, tiempoFin: 228.5 },
        { texto: "Mirrors on the ceiling, the pink champagne on ice", tiempoInicio: 245, tiempoFin: 250 },
        { texto: "And she said, 'We are all just prisoners here, of our own device'", tiempoInicio: 250.5, tiempoFin: 256 },
        { texto: "And in the master's chambers, they gathered for the feast", tiempoInicio: 257, tiempoFin: 302 },
        { texto: "They stab it with their steely knives, but they just can't kill the beast", tiempoInicio: 302.5, tiempoFin: 308 },
        { texto: "Last thing I remember, I was running for the door", tiempoInicio: 309, tiempoFin: 314 },
        { texto: "I had to find the passage back to the place I was before", tiempoInicio: 314.5, tiempoFin: 320 },
        { texto: "'Relax,' said the night man, 'We are programmed to receive'", tiempoInicio: 320.5, tiempoFin: 325.5 },
        { texto: "You can check out any time you like, but you can never leave!", tiempoInicio: 326, tiempoFin: 332 }
      ]
    },
    'shape-of-you': {
      id: 'shape-of-you', titulo: 'Shape of You', artista: 'Ed Sheeran', youtubeId: 'JGwWNGJdvx8', duracion: 233,
      letraCompleta: [
        { texto: "The club isn't the best place to find a lover", tiempoInicio: 9, tiempoFin: 12 },
        { texto: "So the bar is where I go", tiempoInicio: 12.5, tiempoFin: 14.5 },
        { texto: "Me and my friends at the table doing shots", tiempoInicio: 15, tiempoFin: 18 },
        { texto: "Drinking fast and then we talk slow", tiempoInicio: 18.5, tiempoFin: 21 },
        { texto: "And you come over and start up a conversation with just me", tiempoInicio: 21.5, tiempoFin: 25 },
        { texto: "And trust me I'll give it a chance now", tiempoInicio: 25.5, tiempoFin: 28 },
        { texto: "Take my hand, stop, put Van the Man on the jukebox", tiempoInicio: 28.5, tiempoFin: 31.5 },
        { texto: "And then we start to dance, and now I'm singing like", tiempoInicio: 32, tiempoFin: 35 },
        { texto: "Girl, you know I want your love", tiempoInicio: 35.5, tiempoFin: 38 },
        { texto: "Your love was handmade for somebody like me", tiempoInicio: 38.5, tiempoFin: 41.5 },
        { texto: "Come on now, follow my lead", tiempoInicio: 42, tiempoFin: 44.5 },
        { texto: "I may be crazy, don't mind me", tiempoInicio: 45, tiempoFin: 48 },
        { texto: "Say, boy, let's not talk too much", tiempoInicio: 48.5, tiempoFin: 51 },
        { texto: "Grab on my waist and put that body on me", tiempoInicio: 51.5, tiempoFin: 54.5 },
        { texto: "Come on now, follow my lead", tiempoInicio: 55, tiempoFin: 57.5 },
        { texto: "Come, come on now, follow my lead", tiempoInicio: 58, tiempoFin: 61 },
        { texto: "I'm in love with the shape of you", tiempoInicio: 61.5, tiempoFin: 64 },
        { texto: "We push and pull like a magnet do", tiempoInicio: 64.5, tiempoFin: 67 },
        { texto: "Although my heart is falling too", tiempoInicio: 67.5, tiempoFin: 70 },
        { texto: "I'm in love with your body", tiempoInicio: 70.5, tiempoFin: 73.5 },
        { texto: "And last night you were in my room", tiempoInicio: 74, tiempoFin: 76.5 },
        { texto: "And now my bedsheets smell like you", tiempoInicio: 77, tiempoFin: 79.5 },
        { texto: "Every day discovering something brand new", tiempoInicio: 80, tiempoFin: 83 },
        { texto: "I'm in love with your body", tiempoInicio: 83.5, tiempoFin: 86 }
      ]
    },
    'imagine': {
      id: 'imagine', titulo: 'Imagine', artista: 'John Lennon', youtubeId: 'YkgkThdzX-8', duracion: 183,
      letraCompleta: [
        { texto: "Imagine there's no heaven", tiempoInicio: 14.5, tiempoFin: 17.5 },
        { texto: "It's easy if you try", tiempoInicio: 19, tiempoFin: 21.5 },
        { texto: "No hell below us", tiempoInicio: 23, tiempoFin: 26 },
        { texto: "Above us, only sky", tiempoInicio: 27.5, tiempoFin: 30.5 },
        { texto: "Imagine all the people livin' for today", tiempoInicio: 32, tiempoFin: 38 },
        { texto: "Imagine there's no countries", tiempoInicio: 41, tiempoFin: 44.5 },
        { texto: "It isn't hard to do", tiempoInicio: 46, tiempoFin: 49 },
        { texto: "Nothing to kill or die for", tiempoInicio: 50.5, tiempoFin: 54 },
        { texto: "And no religion, too", tiempoInicio: 55, tiempoFin: 58 },
        { texto: "Imagine all the people livin' life in peace", tiempoInicio: 60, tiempoFin: 66.5 },
        { texto: "You may say I'm a dreamer", tiempoInicio: 69.5, tiempoFin: 73.5 },
        { texto: "But I'm not the only one", tiempoInicio: 74.5, tiempoFin: 78 },
        { texto: "I hope someday you'll join us", tiempoInicio: 79, tiempoFin: 82.5 },
        { texto: "And the world will be as one", tiempoInicio: 83.5, tiempoFin: 87 },
        { texto: "Imagine no possessions", tiempoInicio: 96, tiempoFin: 99.5 },
        { texto: "I wonder if you can", tiempoInicio: 100.5, tiempoFin: 103.5 },
        { texto: "No need for greed or hunger", tiempoInicio: 105, tiempoFin: 108.5 },
        { texto: "A brotherhood of man", tiempoInicio: 110, tiempoFin: 113 },
        { texto: "Imagine all the people sharin' all the world", tiempoInicio: 114.5, tiempoFin: 121 },
        { texto: "You may say I'm a dreamer", tiempoInicio: 124.5, tiempoFin: 128 },
        { texto: "But I'm not the only one", tiempoInicio: 129, tiempoFin: 132.5 },
        { texto: "I hope someday you'll join us", tiempoInicio: 133.5, tiempoFin: 137 },
        { texto: "And the world will live as one", tiempoInicio: 138, tiempoFin: 142 }
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

// ...existing code...

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
        this.forzarActualizacionHTML();
      }
    } else if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
      if (respuestaActual.length < palabraCompleta.length) {
        this.respuestasUsuario[palabraId] = respuestaActual + key.toLowerCase();
        
        const nuevaRespuesta = this.respuestasUsuario[palabraId];
        
        if (nuevaRespuesta.length === palabraCompleta.length) {
          if (this.normalizarTexto(nuevaRespuesta) === palabraCompleta) {
            // ✅ CORRECTO - Completar y continuar
            this.hits++;
            this.score += 10;
            this.palabraActualCompletando.completada = true;
            
            console.log('✅ Palabra correcta:', nuevaRespuesta);
            
            // CRÍTICO: Forzar actualización inmediata del HTML
            this.forzarActualizacionHTML();
            
            // CAMBIO: Restaurar vida inmediatamente y limpiar
            this.vida = 100;
            
            // Delay antes de continuar para que se vea el verde
            if (this.cancionPausada) {
                setTimeout(() => {
                    this.reanudarCancion();
                }, 2000);
            } else {
                // Si no estaba pausado, simplemente limpiar después del delay visual
                setTimeout(() => {
                    this.palabraActualCompletando = null;
                    this.detenerDecrementoVida();
                    this.forzarActualizacionHTML();
                }, 2000);
            }
            
          } else {
            // ❌ INCORRECTO - Mostrar error y permitir reintentar
            this.vida = Math.max(0, this.vida - 15);
            console.log('❌ Palabra incorrecta:', nuevaRespuesta, 'vs', palabraCompleta);
            
            // CRÍTICO: Forzar actualización inmediata del HTML para mostrar el rojo
            this.forzarActualizacionHTML();
            
            // Limpiar para permitir reintentar con más tiempo para ver el rojo
            setTimeout(() => {
              if (this.respuestasUsuario[palabraId] === nuevaRespuesta) {
                this.respuestasUsuario[palabraId] = '';
                this.forzarActualizacionHTML();
              }
            }, 2500);
          }
        } else {
          // Palabra no completa aún
          this.forzarActualizacionHTML();
        }
      }
    }
}

// NUEVA FUNCIÓN: Forzar actualización del HTML
forzarActualizacionHTML() {
    if (this.lineaActualIndex !== -1) {
        const lineaActiva = this.letraProcesada[this.lineaActualIndex];
        if (lineaActiva) {
            // Regenerar HTML completamente
            const nuevoHtml = this.generarHtmlParaLinea(lineaActiva, this.lineaActualMostrandoHasta);
            lineaActiva.htmlSeguro = this.sanitizer.bypassSecurityTrustHtml(nuevoHtml);
            
            // Forzar múltiples ciclos de detección de cambios
            this.cdRef.markForCheck();
            this.cdRef.detectChanges();
            
            // Forzar actualización adicional en el siguiente tick
            setTimeout(() => {
                this.cdRef.detectChanges();
            }, 0);
        }
    }
}


  // ...existing code...

generarHtmlParaLinea(linea: LineaLetra, mostrarSoloHastaPalabra: number = -1): string {
    
    if (!linea.palabraCompletable) {
      if (mostrarSoloHastaPalabra >= 0 && mostrarSoloHastaPalabra < linea.palabras.length) {
        const resultado = linea.palabras.slice(0, mostrarSoloHastaPalabra + 1).join(' ');
        return resultado;
      }
      return linea.textoOriginal;
    }

    const palabra = linea.palabraCompletable;
    const esPalabraActual = this.palabraActualCompletando?.id === palabra.id;
    const respuestaUsuario = this.respuestasUsuario[palabra.id] || '';
    
    // Crear el display visual con puntos y letras
    let displayText = '';
    const palabraLength = palabra.textoNormalizado.length;
    
    for (let i = 0; i < palabraLength; i++) {
      if (i < respuestaUsuario.length) {
        displayText += respuestaUsuario[i];
      } else {
        displayText += '•';
      }
    }
    
    // MEJORAR: Lógica de estados más clara con debug
    let claseEstado = '';
    
    if (palabra.completada) {
      claseEstado = 'word-completed'; // Verde - palabra completada correctamente
      console.log('🟢 Aplicando clase word-completed para palabra:', palabra.textoOriginal);
    } else if (esPalabraActual) {
      if (respuestaUsuario.length === palabraLength) {
        // Palabra completa, verificar si es correcta
        if (this.normalizarTexto(respuestaUsuario) === palabra.textoNormalizado) {
          claseEstado = 'word-completed'; // Verde - correcta
          console.log('🟢 Aplicando clase word-completed (correcta) para palabra:', palabra.textoOriginal);
        } else {
          claseEstado = 'word-error'; // Rojo - incorrecta
          console.log('🔴 Aplicando clase word-error para palabra:', palabra.textoOriginal);
        }
      } else if (respuestaUsuario.length > 0) {
        // Verificar si lo que se ha escrito hasta ahora es correcto
        const textoCorrectoParcial = palabra.textoNormalizado.substring(0, respuestaUsuario.length);
        if (this.normalizarTexto(respuestaUsuario) === textoCorrectoParcial) {
          claseEstado = 'word-active'; // Amarillo - escribiendo correctamente
          console.log('🟡 Aplicando clase word-active para palabra:', palabra.textoOriginal);
        } else {
          claseEstado = 'word-warning'; // Naranja - escribiendo incorrectamente
          console.log('🟠 Aplicando clase word-warning para palabra:', palabra.textoOriginal);
        }
      } else {
        claseEstado = 'word-active'; // Amarillo - esperando input
        console.log('🟡 Aplicando clase word-active (esperando) para palabra:', palabra.textoOriginal);
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
      const resultado = palabrasHtml.join(' ');
      return resultado;
    }
    
    const resultado = palabrasHtml.join(' ');
    console.log('📝 HTML generado con clase:', claseEstado, 'para palabra:', palabra.textoOriginal);
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
          this.actualizarHtmlActivo();
          return;
      }
      
      this.actualizarHtmlActivo();
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