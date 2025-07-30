import { Injectable } from '@angular/core';
import { CancionData } from '../interfaces/cancion.interface';

@Injectable({
  providedIn: 'root'
})
export class CancionesService {

    private readonly cancionesDb: { [key: string]: CancionData } = {
    'stairway-to-heaven': {
      id: 'stairway-to-heaven', titulo: 'Stairway to Heaven', artista: 'Led Zeppelin', youtubeId: 'QkF3oxziUI4', duracion: 482,
      letraCompleta: [
        { texto: "There's a lady who's sure all that glitters is gold", tiempoInicio: 52, tiempoFin: 59.5 },
        { texto: "And she's buying a stairway to heaven", tiempoInicio: 60, tiempoFin: 65 },
        { texto: "When she gets there she knows, if the stores are all closed", tiempoInicio: 66, tiempoFin: 72.5 },
        { texto: "With a word she can get what she came for", tiempoInicio: 73, tiempoFin: 79 },
        { texto: "Ooh, ooh, and she's buying a stairway to heaven", tiempoInicio: 79.5, tiempoFin: 91.5 },
        { texto: "There's a sign on the wall but she wants to be sure", tiempoInicio: 92, tiempoFin: 99.5 },
        { texto: "'Cause you know sometimes words have two meanings", tiempoInicio: 100, tiempoFin: 105.5 },
        { texto: "In a tree by the brook, there's a songbird who sings", tiempoInicio: 106, tiempoFin: 112.5 },
        { texto: "Sometimes all of our thoughts are misgiven", tiempoInicio: 113, tiempoFin: 119},
        { texto: "Ooh, it makes me wonder", tiempoInicio: 139, tiempoFin: 143 },
        { texto: "Ooh, it makes me wonder", tiempoInicio: 147, tiempoFin: 154 },
        { texto: "There's a feeling I get when I look to the west", tiempoInicio: 158, tiempoFin: 164 },
        { texto: "And my spirit is crying for leaving", tiempoInicio: 164.5, tiempoFin: 170 },
        { texto: "In my thoughts I have seen rings of smoke through the trees", tiempoInicio: 170.5, tiempoFin: 176.5 },
        { texto: "And the voices of those who stand looking", tiempoInicio: 177, tiempoFin: 181.5 },
        { texto: "Ooh, it makes me wonder", tiempoInicio: 187, tiempoFin: 192 },
        { texto: "Ooh, it really makes me wonder", tiempoInicio: 198, tiempoFin: 204 },
        { texto: "And it's whispered that soon, if we all call the tune", tiempoInicio: 209, tiempoFin: 215 },
        { texto: "Then the piper will lead us to reason", tiempoInicio: 215.5, tiempoFin: 220.5 },
        { texto: "And a new day will dawn for those who stand long", tiempoInicio: 221.5, tiempoFin: 227 },
        { texto: "And the forests will echo with laughter", tiempoInicio: 227.5, tiempoFin: 232 },
        { texto: "If there's a bustle in your hedgerow, don't be alarmed now", tiempoInicio: 259, tiempoFin: 265 },
        { texto: "It's just a spring clean for the May queen", tiempoInicio: 265, tiempoFin: 270 },
        { texto: "Yes, there are two paths you can go by, but in the long run", tiempoInicio: 271, tiempoFin: 276 },
        { texto: "There's still time to change the road you're on", tiempoInicio: 277, tiempoFin: 281 },
        { texto: "And it makes me wonder", tiempoInicio: 288, tiempoFin: 292 },
        { texto: "Your head is humming and it won't go, in case you don't know", tiempoInicio: 307, tiempoFin: 312 },
        { texto: "The piper's calling you to join him", tiempoInicio: 312.5, tiempoFin: 317.5 },
        { texto: "Dear lady, can you hear the wind blow, and did you know", tiempoInicio: 318, tiempoFin: 323.5 },
        { texto: "Your stairway lies on the whispering wind", tiempoInicio: 324, tiempoFin: 330 },
        { texto: "And as we wind on down the road", tiempoInicio: 404, tiempoFin: 407.5 },
        { texto: "Our shadows taller than our soul", tiempoInicio: 408, tiempoFin: 412 },
        { texto: "There walks a lady we all know", tiempoInicio: 412.5, tiempoFin: 417 },
        { texto: "Who shines white light and wants to show", tiempoInicio: 418, tiempoFin: 422.5 },
        { texto: "How everything still turns to gold", tiempoInicio: 423, tiempoFin: 427 },
        { texto: "And if you listen very hard", tiempoInicio: 427.5, tiempoFin: 431 },
        { texto: "The tune will come to you at last", tiempoInicio: 432, tiempoFin: 436 },
        { texto: "When all are one and one is all", tiempoInicio: 436.5, tiempoFin: 441 },
        { texto: "To be a rock and not to roll", tiempoInicio: 441.5, tiempoFin: 447 },
        { texto: "And she's buying a stairway to heaven", tiempoInicio: 465, tiempoFin: 480 }
      ]
    },
    'lose-yourself': {
      id: 'lose-yourself', titulo: 'Lose Yourself', artista: 'Eminem', youtubeId: 'xFYQQPAOz7Y', duracion: 320,
      letraCompleta: [
        // Primer verso comienza en 0:34 como indicaste
        { texto: "Look, if you had one shot or one opportunity", tiempoInicio: 34, tiempoFin: 37 },
        { texto: "To seize everything you ever wanted in one moment", tiempoInicio: 37.5, tiempoFin: 40 },
        { texto: "Would you capture it or just let it slip?", tiempoInicio: 40.5, tiempoFin: 43 },
        { texto: "His palms are sweaty, knees weak, arms are heavy", tiempoInicio: 44, tiempoFin: 47 },
        { texto: "There's vomit on his sweater already, mom's spaghetti", tiempoInicio: 47.5, tiempoFin: 51 },
        { texto: "He's nervous, but on the surface he looks calm and ready", tiempoInicio: 51.5, tiempoFin: 54.5 },
        { texto: "To drop bombs, but he keeps on forgettin'", tiempoInicio: 55, tiempoFin: 57.5 },
        { texto: "What he wrote down, the whole crowd goes so loud", tiempoInicio: 58, tiempoFin: 61 },
        { texto: "He opens his mouth, but the words won't come out", tiempoInicio: 61.5, tiempoFin: 64.5 },
        { texto: "He's chokin', how, everybody's jokin' now", tiempoInicio: 65, tiempoFin: 68 },
        { texto: "The clocks run out, times up, over, blaow!", tiempoInicio: 68.5, tiempoFin: 71.5 },
        { texto: "Snap back to reality, ope there goes gravity", tiempoInicio: 72, tiempoFin: 75 },
        { texto: "Ope, there goes Rabbit, he choked", tiempoInicio: 75.5, tiempoFin: 78 },
        { texto: "He's so mad, but he won't give up that easy? No", tiempoInicio: 78.5, tiempoFin: 81 },
        { texto: "He won't have it, he knows his whole back's to these ropes", tiempoInicio: 81.5, tiempoFin: 84.5 },
        { texto: "It don't matter, he's dope, he knows that, but he's broke", tiempoInicio: 85, tiempoFin: 88 },
        { texto: "He's so stagnant, he knows, when he goes back to this mobile home", tiempoInicio: 88.5, tiempoFin: 92 },
        { texto: "That's when it's back to the lab again, yo", tiempoInicio: 92.5, tiempoFin: 95 },
        { texto: "This whole rhapsody, he better go capture this moment and hope it don't pass him", tiempoInicio: 95.5, tiempoFin: 100 },
        // Coro
        { texto: "You better lose yourself in the music, the moment", tiempoInicio: 100.5, tiempoFin: 103.5 },
        { texto: "You own it, you better never let it go", tiempoInicio: 104, tiempoFin: 106.5 },
        { texto: "You only get one shot, do not miss your chance to blow", tiempoInicio: 107, tiempoFin: 110 },
        { texto: "This opportunity comes once in a lifetime", tiempoInicio: 110.5, tiempoFin: 113.5 }
      ]
    },
    'bohemian-rhapsody': {
      id: 'bohemian-rhapsody', titulo: 'Bohemian Rhapsody', artista: 'Queen', youtubeId: 'fJ9rUzIMcZQ', duracion: 354,
      letraCompleta: [
        // Comienza en 0:01 como indicaste - la balada empieza inmediatamente
        { texto: "Is this the real life? Is this just fantasy?", tiempoInicio: 1, tiempoFin: 6.5 },
        { texto: "Caught in a landslide, no escape from reality", tiempoInicio: 7, tiempoFin: 12 },
        { texto: "Open your eyes, look up to the skies and see", tiempoInicio: 13, tiempoFin: 18 },
        { texto: "I'm just a poor boy, I need no sympathy", tiempoInicio: 19, tiempoFin: 24 },
        { texto: "Because I'm easy come, easy go, little high, little low", tiempoInicio: 25, tiempoFin: 30.5 },
        { texto: "Any way the wind blows doesn't really matter to me, to me", tiempoInicio: 31, tiempoFin: 38 },
        // Segunda parte
        { texto: "Mama, just killed a man", tiempoInicio: 54, tiempoFin: 57.5 },
        { texto: "Put a gun against his head, pulled my trigger, now he's dead", tiempoInicio: 58, tiempoFin: 62.5 },
        { texto: "Mama, life had just begun", tiempoInicio: 63, tiempoFin: 67 },
        { texto: "But now I've gone and thrown it all away", tiempoInicio: 67.5, tiempoFin: 72 },
        { texto: "Mama, ooh, didn't mean to make you cry", tiempoInicio: 73, tiempoFin: 79 },
        { texto: "If I'm not back again this time tomorrow", tiempoInicio: 79.5, tiempoFin: 82.5 },
        { texto: "Carry on, carry on as if nothing really matters", tiempoInicio: 83, tiempoFin: 88.5 },
        // Tercera parte
        { texto: "Too late, my time has come", tiempoInicio: 96, tiempoFin: 100 },
        { texto: "Sends shivers down my spine, body's aching all the time", tiempoInicio: 100.5, tiempoFin: 105 },
        { texto: "Goodbye, everybody, I've got to go", tiempoInicio: 106, tiempoFin: 110.5 },
        { texto: "Gotta leave you all behind and face the truth", tiempoInicio: 111, tiempoFin: 116.5 },
        { texto: "Mama, ooh, I don't wanna die", tiempoInicio: 117, tiempoFin: 123 },
        { texto: "I sometimes wish I'd never been born at all", tiempoInicio: 123.5, tiempoFin: 128.5 },
        // Parte opera rock
        { texto: "I see a little silhouetto of a man", tiempoInicio: 171, tiempoFin: 174 },
        { texto: "Scaramouche, Scaramouche, will you do the Fandango?", tiempoInicio: 174.5, tiempoFin: 178 },
        { texto: "Thunderbolt and lightning, very, very frightening me", tiempoInicio: 178.5, tiempoFin: 182 },
        { texto: "(Galileo) Galileo, (Galileo) Galileo, Galileo Figaro magnifico", tiempoInicio: 182.5, tiempoFin: 189 },
        { texto: "I'm just a poor boy, nobody loves me", tiempoInicio: 189.5, tiempoFin: 192.5 },
        { texto: "He's just a poor boy from a poor family", tiempoInicio: 193, tiempoFin: 196 },
        { texto: "Spare him his life from this monstrosity", tiempoInicio: 196.5, tiempoFin: 199.5 },
        { texto: "Easy come, easy go, will you let me go?", tiempoInicio: 200, tiempoFin: 203 },
        { texto: "Bismillah! No, we will not let you go (Let him go!)", tiempoInicio: 203.5, tiempoFin: 206.5 },
        { texto: "Bismillah! We will not let you go (Let him go!)", tiempoInicio: 207, tiempoFin: 209.5 },
        { texto: "Bismillah! We will not let you go (Let me go!)", tiempoInicio: 210, tiempoFin: 212.5 },
        { texto: "Will not let you go (Let me go!)", tiempoInicio: 213, tiempoFin: 215 },
        { texto: "Never let you go (Never, never, never, never let me go)", tiempoInicio: 215.5, tiempoFin: 219 },
        { texto: "No, no, no, no, no, no, no", tiempoInicio: 219.5, tiempoFin: 222 },
        { texto: "Oh, mamma mia, mamma mia (Mamma mia, let me go)", tiempoInicio: 222.5, tiempoFin: 226 },
        { texto: "Beelzebub has a devil put aside for me, for me, for me!", tiempoInicio: 226.5, tiempoFin: 232 },
        // Parte rock
        { texto: "So you think you can stone me and spit in my eye?", tiempoInicio: 239, tiempoFin: 243 },
        { texto: "So you think you can love me and leave me to die?", tiempoInicio: 244, tiempoFin: 248 },
        { texto: "Oh, baby, can't do this to me, baby!", tiempoInicio: 249, tiempoFin: 253 },
        { texto: "Just gotta get out, just gotta get right outta here", tiempoInicio: 253.5, tiempoFin: 258 },
        // Final
        { texto: "Nothing really matters, anyone can see", tiempoInicio: 310, tiempoFin: 315 },
        { texto: "Nothing really matters", tiempoInicio: 316, tiempoFin: 319 },
        { texto: "Nothing really matters to me", tiempoInicio: 320, tiempoFin: 325 }
      ]
    },
    'hotel-california': {
      id: 'hotel-california', titulo: 'Hotel California', artista: 'Eagles', youtubeId: '09839DpTctU', duracion: 390,
      letraCompleta: [
        // Primer verso comienza en 0:54 como indicaste
        { texto: "On a dark desert highway, cool wind in my hair", tiempoInicio: 54, tiempoFin: 59 },
        { texto: "Warm smell of colitas, rising up through the air", tiempoInicio: 60, tiempoFin: 65 },
        { texto: "Up ahead in the distance, I saw a shimmering light", tiempoInicio: 66, tiempoFin: 71 },
        { texto: "My head grew heavy and my sight grew dim", tiempoInicio: 71.5, tiempoFin: 76 },
        { texto: "I had to stop for the night", tiempoInicio: 76.5, tiempoFin: 79 },
        { texto: "There she stood in the doorway; I heard the mission bell", tiempoInicio: 82.5, tiempoFin: 87.5 },
        { texto: "And I was thinking to myself, 'This could be Heaven or this could be Hell'", tiempoInicio: 88, tiempoFin: 93.5 },
        { texto: "Then she lit up a candle and she showed me the way", tiempoInicio: 94, tiempoFin: 99 },
        { texto: "There were voices down the corridor, I thought I heard them say", tiempoInicio: 100, tiempoFin: 105.5 },
        // Coro
        { texto: "Welcome to the Hotel California", tiempoInicio: 106.5, tiempoFin: 111.5 },
        { texto: "Such a lovely place (Such a lovely place), Such a lovely face", tiempoInicio: 112, tiempoFin: 117.5 },
        { texto: "Plenty of room at the Hotel California", tiempoInicio: 118, tiempoFin: 123 },
        { texto: "Any time of year (Any time of year), you can find it here", tiempoInicio: 123.5, tiempoFin: 129 },
        // Segundo verso
        { texto: "Her mind is Tiffany-twisted, she got the Mercedes-Benz", tiempoInicio: 148, tiempoFin: 153 },
        { texto: "She got a lot of pretty, pretty boys she calls friends", tiempoInicio: 154, tiempoFin: 159 },
        { texto: "How they dance in the courtyard, sweet summer sweat", tiempoInicio: 159.5, tiempoFin: 164.5 },
        { texto: "Some dance to remember, some dance to forget", tiempoInicio: 165, tiempoFin: 170.5 },
        { texto: "So I called up the Captain, 'Please bring me my wine'", tiempoInicio: 171, tiempoFin: 176 },
        { texto: "He said, 'We haven't had that spirit here since nineteen sixty-nine'", tiempoInicio: 177, tiempoFin: 182.5 },
        { texto: "And still those voices are calling from far away", tiempoInicio: 183, tiempoFin: 188 },
        { texto: "Wake you up in the middle of the night, just to hear them say", tiempoInicio: 188.5, tiempoFin: 194 },
        // Segundo coro
        { texto: "Welcome to the Hotel California", tiempoInicio: 195, tiempoFin: 200 },
        { texto: "Such a lovely place (Such a lovely place), Such a lovely face", tiempoInicio: 200.5, tiempoFin: 206 },
        { texto: "They livin' it up at the Hotel California", tiempoInicio: 206.5, tiempoFin: 211.5 },
        { texto: "What a nice surprise (what a nice surprise), bring your alibis", tiempoInicio: 212, tiempoFin: 217.5 },
        // Tercer verso
        { texto: "Mirrors on the ceiling, the pink champagne on ice", tiempoInicio: 234, tiempoFin: 239 },
        { texto: "And she said, 'We are all just prisoners here, of our own device'", tiempoInicio: 239.5, tiempoFin: 245 },
        { texto: "And in the master's chambers, they gathered for the feast", tiempoInicio: 246, tiempoFin: 251 },
        { texto: "They stab it with their steely knives, but they just can't kill the beast", tiempoInicio: 251.5, tiempoFin: 257 },
        { texto: "Last thing I remember, I was running for the door", tiempoInicio: 258, tiempoFin: 263 },
        { texto: "I had to find the passage back to the place I was before", tiempoInicio: 263.5, tiempoFin: 269 },
        { texto: "'Relax,' said the night man, 'We are programmed to receive'", tiempoInicio: 269.5, tiempoFin: 274.5 },
        { texto: "You can check out any time you like, but you can never leave!", tiempoInicio: 275, tiempoFin: 281 }
      ]
    },
    'shape-of-you': {
      id: 'shape-of-you', titulo: 'Shape of You', artista: 'Ed Sheeran', youtubeId: 'JGwWNGJdvx8', duracion: 233,
      letraCompleta: [
        // Primer verso comienza en 0:16 como indicaste
        { texto: "The club isn't the best place to find a lover", tiempoInicio: 16, tiempoFin: 19 },
        { texto: "So the bar is where I go", tiempoInicio: 19.5, tiempoFin: 21.5 },
        { texto: "Me and my friends at the table doing shots", tiempoInicio: 22, tiempoFin: 25 },
        { texto: "Drinking fast and then we talk slow", tiempoInicio: 25.5, tiempoFin: 28 },
        { texto: "And you come over and start up a conversation with just me", tiempoInicio: 28.5, tiempoFin: 32 },
        { texto: "And trust me I'll give it a chance now", tiempoInicio: 32.5, tiempoFin: 35 },
        { texto: "Take my hand, stop, put Van the Man on the jukebox", tiempoInicio: 35.5, tiempoFin: 38.5 },
        { texto: "And then we start to dance, and now I'm singing like", tiempoInicio: 39, tiempoFin: 42 },
        // Pre-coro
        { texto: "Girl, you know I want your love", tiempoInicio: 42.5, tiempoFin: 45 },
        { texto: "Your love was handmade for somebody like me", tiempoInicio: 45.5, tiempoFin: 48.5 },
        { texto: "Come on now, follow my lead", tiempoInicio: 49, tiempoFin: 51.5 },
        { texto: "I may be crazy, don't mind me", tiempoInicio: 52, tiempoFin: 55 },
        { texto: "Say, boy, let's not talk too much", tiempoInicio: 55.5, tiempoFin: 58 },
        { texto: "Grab on my waist and put that body on me", tiempoInicio: 58.5, tiempoFin: 61.5 },
        { texto: "Come on now, follow my lead", tiempoInicio: 62, tiempoFin: 64.5 },
        { texto: "Come, come on now, follow my lead", tiempoInicio: 65, tiempoFin: 68 },
        // Coro
        { texto: "I'm in love with the shape of you", tiempoInicio: 68.5, tiempoFin: 71 },
        { texto: "We push and pull like a magnet do", tiempoInicio: 71.5, tiempoFin: 74 },
        { texto: "Although my heart is falling too", tiempoInicio: 74.5, tiempoFin: 77 },
        { texto: "I'm in love with your body", tiempoInicio: 77.5, tiempoFin: 80.5 },
        { texto: "And last night you were in my room", tiempoInicio: 81, tiempoFin: 83.5 },
        { texto: "And now my bedsheets smell like you", tiempoInicio: 84, tiempoFin: 86.5 },
        { texto: "Every day discovering something brand new", tiempoInicio: 87, tiempoFin: 90 },
        { texto: "I'm in love with your body", tiempoInicio: 90.5, tiempoFin: 93 }
      ]
    },
    'imagine': {
      id: 'imagine', titulo: 'Imagine', artista: 'John Lennon', youtubeId: 'YkgkThdzX-8', duracion: 183,
      letraCompleta: [
        // Piano intro hasta 0:54, entonces comienza la voz como indicaste
        { texto: "Imagine there's no heaven", tiempoInicio: 54, tiempoFin: 57.5 },
        { texto: "It's easy if you try", tiempoInicio: 59, tiempoFin: 61.5 },
        { texto: "No hell below us", tiempoInicio: 63, tiempoFin: 66 },
        { texto: "Above us, only sky", tiempoInicio: 67.5, tiempoFin: 70.5 },
        { texto: "Imagine all the people livin' for today", tiempoInicio: 72, tiempoFin: 78 },
        // Segundo verso
        { texto: "Imagine there's no countries", tiempoInicio: 81, tiempoFin: 84.5 },
        { texto: "It isn't hard to do", tiempoInicio: 86, tiempoFin: 89 },
        { texto: "Nothing to kill or die for", tiempoInicio: 90.5, tiempoFin: 94 },
        { texto: "And no religion, too", tiempoInicio: 95, tiempoFin: 98 },
        { texto: "Imagine all the people livin' life in peace", tiempoInicio: 100, tiempoFin: 106.5 },
        // Coro
        { texto: "You may say I'm a dreamer", tiempoInicio: 109.5, tiempoFin: 113.5 },
        { texto: "But I'm not the only one", tiempoInicio: 114.5, tiempoFin: 118 },
        { texto: "I hope someday you'll join us", tiempoInicio: 119, tiempoFin: 122.5 },
        { texto: "And the world will be as one", tiempoInicio: 123.5, tiempoFin: 127 },
        // Tercer verso
        { texto: "Imagine no possessions", tiempoInicio: 136, tiempoFin: 139.5 },
        { texto: "I wonder if you can", tiempoInicio: 140.5, tiempoFin: 143.5 },
        { texto: "No need for greed or hunger", tiempoInicio: 145, tiempoFin: 148.5 },
        { texto: "A brotherhood of man", tiempoInicio: 150, tiempoFin: 153 },
        { texto: "Imagine all the people sharin' all the world", tiempoInicio: 154.5, tiempoFin: 161 },
        // Coro final
        { texto: "You may say I'm a dreamer", tiempoInicio: 164.5, tiempoFin: 168 },
        { texto: "But I'm not the only one", tiempoInicio: 169, tiempoFin: 172.5 },
        { texto: "I hope someday you'll join us", tiempoInicio: 173.5, tiempoFin: 177 },
        { texto: "And the world will live as one", tiempoInicio: 178, tiempoFin: 182 }
      ]
    },
  };

  constructor() { }

  /**
   * Obtiene una canción por su ID
   * @param songId ID de la canción
   * @returns CancionData o null si no se encuentra
   */
  obtenerCancionPorId(songId: string): CancionData | null {
    return this.cancionesDb[songId] || null;
  }

  /**
   * Obtiene todas las canciones disponibles
   * @returns Array de todas las canciones
   */
  obtenerTodasLasCanciones(): CancionData[] {
    return Object.values(this.cancionesDb);
  }

  /**
   * Obtiene los IDs de todas las canciones
   * @returns Array de IDs de canciones
   */
  obtenerIdsCanciones(): string[] {
    return Object.keys(this.cancionesDb);
  }

  /**
   * Verifica si una canción existe
   * @param songId ID de la canción
   * @returns true si existe, false si no
   */
  existeCancion(songId: string): boolean {
    return songId in this.cancionesDb;
  }
}