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
      id: 'lose-yourself',
      titulo: 'Lose Yourself',
      artista: 'Eminem',
      youtubeId: 'xFYQQPAOz7Y',
      duracion: 320,
      letraCompleta: [
        // Verso 1
        { texto: "Look, if you had one shot or one opportunity", tiempoInicio: 34, tiempoFin: 43 },
        { texto: "To seize everything you ever wanted in one moment", tiempoInicio: 43.5, tiempoFin: 48 },
        { texto: "Would you capture it or just let it slip?", tiempoInicio: 48.5, tiempoFin: 53 },
        { texto: "His palms are sweaty, knees weak, arms are heavy", tiempoInicio: 53.5, tiempoFin: 57 },
        { texto: "There's vomit on his sweater already, mom's spaghetti", tiempoInicio: 57.5, tiempoFin: 60 },
        { texto: "He's nervous, but on the surface he looks calm and ready", tiempoInicio: 60.5, tiempoFin: 62.5 },
        { texto: "To drop bombs, but he keeps on forgettin'", tiempoInicio: 63, tiempoFin: 65 },
        { texto: "What he wrote down, the whole crowd goes so loud", tiempoInicio: 65.5, tiempoFin: 68 },
        { texto: "He opens his mouth, but the words won't come out", tiempoInicio: 68.5, tiempoFin: 71 },
        { texto: "He's chokin', how, everybody's jokin' now", tiempoInicio: 71.5, tiempoFin: 73.5 },
        { texto: "The clocks run out, times up, over, blaow!", tiempoInicio: 74, tiempoFin: 77 },
        { texto: "Snap back to reality, ope there goes gravity", tiempoInicio: 77.5, tiempoFin: 79.5 },
        { texto: "Ope, there goes Rabbit, he choked", tiempoInicio: 80, tiempoFin: 81.5 },
        { texto: "He's so mad, but he won't give up that easy? No", tiempoInicio: 82, tiempoFin: 84 },
        { texto: "He won't have it, he knows his whole back's to these ropes", tiempoInicio: 84.5, tiempoFin: 87 },
        { texto: "It don't matter, he's dope, he knows that, but he's broke", tiempoInicio: 87.5, tiempoFin: 90 },
        { texto: "He's so stagnant, he knows, when he goes back to this mobile home", tiempoInicio: 90.5, tiempoFin: 93 },
        { texto: "That's when it's back to the lab again, yo", tiempoInicio: 93.5, tiempoFin: 95.5 },
        { texto: "This whole rhapsody, he better go capture this moment and hope it don't pass him", tiempoInicio: 96, tiempoFin: 99 },
        
        // Coro 1
        { texto: "You better lose yourself in the music, the moment", tiempoInicio: 99.5, tiempoFin: 101.5 },
        { texto: "You own it, you better never let it go", tiempoInicio: 102, tiempoFin: 104 },
        { texto: "You only get one shot, do not miss your chance to blow", tiempoInicio: 104.5, tiempoFin: 107 },
        { texto: "This opportunity comes once in a lifetime", tiempoInicio: 107.5, tiempoFin: 110 },
        { texto: "You better lose yourself in the music, the moment", tiempoInicio: 110.5, tiempoFin: 112.5 },
        { texto: "You own it, you better never let it go", tiempoInicio: 113, tiempoFin: 115 },
        { texto: "You only get one shot, do not miss your chance to blow", tiempoInicio: 115.5, tiempoFin: 118 },
        { texto: "This opportunity comes once in a lifetime", tiempoInicio: 118.5, tiempoFin: 121 },

        // Verso 2
        { texto: "His soul's escapin' through this hole that is gapin'", tiempoInicio: 122, tiempoFin: 124.5 },
        { texto: "This world is mine for the takin', make me king", tiempoInicio: 125, tiempoFin: 127.5 },
        { texto: "As we move toward a new world order", tiempoInicio: 128, tiempoFin: 130 },
        { texto: "A normal life is borin', but superstardom's", tiempoInicio: 130.5, tiempoFin: 133 },
        { texto: "Close to postmortem, it only grows harder", tiempoInicio: 133.5, tiempoFin: 135.5 },
        { texto: "Homie grows hotter, he blows, it's all over", tiempoInicio: 136, tiempoFin: 138 },
        { texto: "These hoes is all on him, coast-to-coast shows", tiempoInicio: 138.5, tiempoFin: 141 },
        { texto: "He's known as the Globetrotter, lonely roads", tiempoInicio: 141.5, tiempoFin: 143.5 },
        { texto: "God only knows he's grown farther from home, he's no father", tiempoInicio: 144, tiempoFin: 146.5 },
        { texto: "He goes home and barely knows his own daughter", tiempoInicio: 147, tiempoFin: 149.5 },
        { texto: "But hold your nose, 'cause here goes the cold water", tiempoInicio: 150, tiempoFin: 152 },
        { texto: "These hoes don't want him no more, he's cold product", tiempoInicio: 152.5, tiempoFin: 155 },
        { texto: "They moved on to the next schmoe who flows", tiempoInicio: 155.5, tiempoFin: 157.5 },
        { texto: "He nose-dove and sold nada, and so the soap opera", tiempoInicio: 158, tiempoFin: 160 },
        { texto: "Is told, it unfolds, I suppose it's old, partner", tiempoInicio: 160.5, tiempoFin: 163.5  },
        { texto: "But the beat goes on, da-da-dom, da-dom, dah-dah, dah-dah", tiempoInicio: 164, tiempoFin: 166 },

        // Coro 2
        { texto: "You better lose yourself in the music, the moment", tiempoInicio: 166.5, tiempoFin: 168.5 },
        { texto: "You own it, you better never let it go", tiempoInicio: 169, tiempoFin: 171.5 },
        { texto: "You only get one shot, do not miss your chance to blow", tiempoInicio: 172, tiempoFin: 174.5 },
        { texto: "This opportunity comes once in a lifetime", tiempoInicio: 175, tiempoFin: 177.5 },
        { texto: "You better lose yourself in the music, the moment", tiempoInicio: 178, tiempoFin: 180 },
        { texto: "You own it, you better never let it go", tiempoInicio: 180.5, tiempoFin: 182.5 },
        { texto: "You only get one shot, do not miss your chance to blow", tiempoInicio: 183, tiempoFin: 185.5 },
        { texto: "This opportunity comes once in a lifetime", tiempoInicio: 186, tiempoFin: 188.5 },

       // Verso 3
        { texto: "No more games, I'ma change what you call rage", tiempoInicio: 188.7, tiempoFin: 191.2 },
        { texto: "Tear this motherfuckin' roof off like two dogs caged", tiempoInicio: 191.7, tiempoFin: 194.2 },
        { texto: "I was playin' in the beginnin', the mood all changed", tiempoInicio: 194.7, tiempoFin: 197.2 },
        { texto: "I've been chewed up and spit out and booed off stage", tiempoInicio: 197.7, tiempoFin: 200.2 },
        { texto: "But I kept rhymin' and stepped right in the next cypher", tiempoInicio: 200.7, tiempoFin: 203.2 },
        { texto: "Best believe somebody's payin' the Pied Piper", tiempoInicio: 203.7, tiempoFin: 206.2 },
        { texto: "All the pain inside amplified by the", tiempoInicio: 206.7, tiempoFin: 208.7 },
        { texto: "Fact that I can't get by with my nine-to-five", tiempoInicio: 209.2, tiempoFin: 211.7 },
        { texto: "And I can't provide the right type of life for my family", tiempoInicio: 212.5, tiempoFin: 215 },
        { texto: "'Cause, man, these goddamn food stamps don't buy diapers", tiempoInicio: 215.5, tiempoFin: 218 },
        { texto: "And there's no movie, there's no Mekhi Phifer, this is my life", tiempoInicio: 218.5, tiempoFin: 221.5 },
        { texto: "And these times are so hard and it's gettin' even harder", tiempoInicio: 222, tiempoFin: 224.5 },
        { texto: "Tryna feed and water my seed, plus teeter-totter", tiempoInicio: 225, tiempoFin: 227.5 },
        { texto: "Caught up between being a father and a prima donna", tiempoInicio: 228, tiempoFin: 230.5 },
        { texto: "Baby mama drama, screamin' on her, too much for me to wanna", tiempoInicio: 231, tiempoFin: 233.5 },
        { texto: "Stay in one spot, another day of monotony's", tiempoInicio: 234, tiempoFin: 236.5 },
        { texto: "Gotten me to the point I'm like a snail, I've got", tiempoInicio: 237, tiempoFin: 239 },
        { texto: "To formulate a plot or end up in jail or shot", tiempoInicio: 239.5, tiempoFin: 242 },
        { texto: "Success is my only motherfuckin' option, failure's not", tiempoInicio: 242.5, tiempoFin: 245 },
        { texto: "Mom, I love you, but this trailer's got to go", tiempoInicio: 245.5, tiempoFin: 247.5 },
        { texto: "I cannot grow old in Salem's Lot", tiempoInicio: 248, tiempoFin: 250 },
        { texto: "So here I go, it's my shot, feet, fail me not", tiempoInicio: 250.5, tiempoFin: 252.5 },
        { texto: "This may be the only opportunity that I got", tiempoInicio: 253, tiempoFin: 255.5 },

        // Coro Final
        { texto: "You better lose yourself in the music, the moment", tiempoInicio: 256, tiempoFin: 258 },
        { texto: "You own it, you better never let it go", tiempoInicio: 258.5, tiempoFin: 260.5 },
        { texto: "You only get one shot, do not miss your chance to blow", tiempoInicio: 261, tiempoFin: 263.5 },
        { texto: "This opportunity comes once in a lifetime", tiempoInicio: 264, tiempoFin: 266.5 },
        { texto: "You better lose yourself in the music, the moment", tiempoInicio: 267, tiempoFin: 269 },
        { texto: "You own it, you better never let it go", tiempoInicio: 269.5, tiempoFin: 271.5 },
        { texto: "You only get one shot, do not miss your chance to blow", tiempoInicio: 272, tiempoFin: 274.5 },
        { texto: "This opportunity comes once in a lifetime", tiempoInicio: 275, tiempoFin: 277.5 },

        // Outro
        { texto: "You can do anything you set your mind to, man", tiempoInicio: 280, tiempoFin: 283 }
      ]
    },
    'bohemian-rhapsody': {
      id: 'bohemian-rhapsody', titulo: 'Bohemian Rhapsody', artista: 'Queen', youtubeId: 'fJ9rUzIMcZQ', duracion: 354,
      letraCompleta: [
        // Comienza en 0:01 como indicaste - la balada empieza inmediatamente
        { texto: "Is this the real life? Is this just fantasy?", tiempoInicio: 1, tiempoFin: 8.5 },
        { texto: "Caught in a landslide, no escape from reality", tiempoInicio: 9, tiempoFin: 16 },
        { texto: "Open your eyes, look up to the skies and see", tiempoInicio: 16.5, tiempoFin: 26 },
        { texto: "I'm just a poor boy, I need no sympathy", tiempoInicio: 27, tiempoFin: 32 },
        { texto: "Because I'm easy come, easy go, little high, little low", tiempoInicio: 32.5, tiempoFin: 40 },
        { texto: "Any way the wind blows doesn't really matter to me, to me", tiempoInicio: 40.5, tiempoFin: 54 },
        // Segunda parte
        { texto: "Mama, just killed a man", tiempoInicio: 57, tiempoFin: 62.5 },
        { texto: "Put a gun against his head, pulled my trigger, now he's dead", tiempoInicio: 63, tiempoFin: 70 },
        { texto: "Mama, life had just begun", tiempoInicio: 70.5, tiempoFin: 77 },
        { texto: "But now I've gone and thrown it all away", tiempoInicio: 77.5, tiempoFin: 82 },
        { texto: "Mama, ooh, didn't mean to make you cry", tiempoInicio: 83, tiempoFin: 94 },
        { texto: "If I'm not back again this time tomorrow", tiempoInicio: 94.5, tiempoFin: 99 },
        { texto: "Carry on, carry on as if nothing really matters", tiempoInicio: 99.5, tiempoFin: 107 },
        // Tercera parte
        { texto: "Too late, my time has come", tiempoInicio: 116, tiempoFin: 122 },
        { texto: "Sends shivers down my spine, body's aching all the time", tiempoInicio: 122.5, tiempoFin: 129.5 },
        { texto: "Goodbye, everybody, I've got to go", tiempoInicio: 130, tiempoFin: 136 },
        { texto: "Gotta leave you all behind and face the truth", tiempoInicio: 136.5, tiempoFin: 143 },
        { texto: "Mama, ooh, I don't wanna die", tiempoInicio: 143.5, tiempoFin: 153 },
        { texto: "I sometimes wish I'd never been born at all", tiempoInicio: 153.5, tiempoFin: 159 },
        // Parte opera rock
        { texto: "I see a little silhouetto of a man", tiempoInicio: 187, tiempoFin: 190 },
        { texto: "Scaramouche, Scaramouche, will you do the Fandango?", tiempoInicio: 190.5, tiempoFin: 194 },
        { texto: "Thunderbolt and lightning, very, very frightening me", tiempoInicio: 194.5, tiempoFin: 197.5 },
        { texto: "(Galileo) Galileo, (Galileo) Galileo, Galileo Figaro magnifico", tiempoInicio: 198, tiempoFin: 204 },
        { texto: "I'm just a poor boy, nobody loves me", tiempoInicio: 204.5, tiempoFin: 207.5 },
        { texto: "He's just a poor boy from a poor family", tiempoInicio: 208, tiempoFin: 210.9 },
        { texto: "Spare him his life from this monstrosity", tiempoInicio: 211, tiempoFin: 214 },
        { texto: "Easy come, easy go, will you let me go?", tiempoInicio: 215, tiempoFin: 218.5 },
        { texto: "Bismillah! No, we will not let you go (Let him go!)", tiempoInicio: 219, tiempoFin: 222 },
        { texto: "Bismillah! We will not let you go (Let him go!)", tiempoInicio: 222.5, tiempoFin: 225 },
        { texto: "Bismillah! We will not let you go (Let me go!)", tiempoInicio: 225.5, tiempoFin: 228 },
        { texto: "Will not let you go (Let me go!)", tiempoInicio: 228.5, tiempoFin: 230 },
        { texto: "Never let you go (Never, never, never, never let me go)", tiempoInicio: 230.5, tiempoFin: 233.5 },
        { texto: "No, no, no, no, no, no, no", tiempoInicio: 234, tiempoFin: 235.5 },
        { texto: "Oh, mamma mia, mamma mia (Mamma mia, let me go)", tiempoInicio: 236, tiempoFin: 238.5 },
        { texto: "Beelzebub has a devil put aside for me, for me, for me!", tiempoInicio: 239, tiempoFin: 250 },
        // Parte rock
        { texto: "So you think you can stone me and spit in my eye?", tiempoInicio: 256, tiempoFin: 262 },
        { texto: "So you think you can love me and leave me to die?", tiempoInicio: 263, tiempoFin: 267.5 },
        { texto: "Oh, baby, can't do this to me, baby!", tiempoInicio: 268, tiempoFin: 274 },
        { texto: "Just gotta get out, just gotta get right outta here", tiempoInicio: 274.5, tiempoFin: 279 },
        // Final
        { texto: "Nothing really matters, anyone can see", tiempoInicio: 313, tiempoFin: 320 },
        { texto: "Nothing really matters", tiempoInicio: 320.5, tiempoFin: 324 },
        { texto: "Nothing really matters to me", tiempoInicio: 324.5, tiempoFin: 332 }
      ]
    },
    'hotel-california': {
      id: 'hotel-california', titulo: 'Hotel California', artista: 'Eagles', youtubeId: '09839DpTctU', duracion: 390,
      letraCompleta: [
        // Primer verso comienza en 0:54 como indicaste
        { texto: "On a dark desert highway, cool wind in my hair", tiempoInicio: 54, tiempoFin: 59 },
        { texto: "Warm smell of colitas, rising up through the air", tiempoInicio: 60, tiempoFin: 67 },
        { texto: "Up ahead in the distance, I saw a shimmering light", tiempoInicio: 67.5, tiempoFin: 73 },
        { texto: "My head grew heavy and my sight grew dim", tiempoInicio: 73.5, tiempoFin: 76 },
        { texto: "I had to stop for the night", tiempoInicio: 76.5, tiempoFin: 79 },
        { texto: "There she stood in the doorway; I heard the mission bell", tiempoInicio: 80, tiempoFin: 86 },
        { texto: "And I was thinking to myself, 'This could be Heaven or this could be Hell'", tiempoInicio: 87, tiempoFin: 93 },
        { texto: "Then she lit up a candle and she showed me the way", tiempoInicio: 94, tiempoFin: 99 },
        { texto: "There were voices down the corridor, I thought I heard them say", tiempoInicio: 100, tiempoFin: 105.5 },
        // Coro
        { texto: "Welcome to the Hotel California", tiempoInicio: 106.5, tiempoFin: 111.5 },
        { texto: "Such a lovely place (Such a lovely place), Such a lovely face", tiempoInicio: 112, tiempoFin: 117.5 },
        { texto: "Plenty of room at the Hotel California", tiempoInicio: 118, tiempoFin: 123 },
        { texto: "Any time of year (Any time of year), you can find it here", tiempoInicio: 123.5, tiempoFin: 131 },
        // Segundo verso
        { texto: "Her mind is Tiffany-twisted, she got the Mercedes-Benz", tiempoInicio: 132, tiempoFin: 139 },
        { texto: "She got a lot of pretty, pretty boys she calls friends", tiempoInicio: 139.5, tiempoFin: 145 },
        { texto: "How they dance in the courtyard, sweet summer sweat", tiempoInicio: 146, tiempoFin: 151 },
        { texto: "Some dance to remember, some dance to forget", tiempoInicio: 151.5, tiempoFin: 159.5 },
        { texto: "So I called up the Captain, 'Please bring me my wine'", tiempoInicio: 160, tiempoFin: 164.5 },
        { texto: "He said, 'We haven't had that spirit here since nineteen sixty-nine'", tiempoInicio: 165, tiempoFin: 171.5 },
        { texto: "And still those voices are calling from far away", tiempoInicio: 172, tiempoFin: 178 },
        { texto: "Wake you up in the middle of the night, just to hear them say", tiempoInicio: 178.5, tiempoFin: 184 },
        // Segundo coro
        { texto: "Welcome to the Hotel California", tiempoInicio: 185, tiempoFin: 190 },
        { texto: "Such a lovely place (Such a lovely place), Such a lovely face", tiempoInicio: 190.5, tiempoFin: 196 },
        { texto: "They livin' it up at the Hotel California", tiempoInicio: 197.5, tiempoFin: 202 },
        { texto: "What a nice surprise (what a nice surprise), bring your alibis", tiempoInicio: 204, tiempoFin: 210 },
        // Tercer verso
        { texto: "Mirrors on the ceiling, the pink champagne on ice", tiempoInicio: 210.5, tiempoFin: 216.5 },
        { texto: "And she said, 'We are all just prisoners here, of our own device'", tiempoInicio: 217, tiempoFin: 224 },
        { texto: "And in the master's chambers, they gathered for the feast", tiempoInicio: 224.5, tiempoFin: 230.5 },
        { texto: "They stab it with their steely knives, but they just can't kill the beast", tiempoInicio: 231, tiempoFin: 237.5 },
        { texto: "Last thing I remember, I was running for the door", tiempoInicio: 238, tiempoFin: 244 },
        { texto: "I had to find the passage back to the place I was before", tiempoInicio: 244.5, tiempoFin: 250 },
        { texto: "'Relax,' said the night man, 'We are programmed to receive'", tiempoInicio: 250.5, tiempoFin: 257.5 },
        { texto: "You can check out any time you like, but you can never leave!", tiempoInicio: 258, tiempoFin: 263.5 }
      ]
    },
    'shape-of-you': {
      id: 'shape-of-you',
      titulo: 'Shape of You',
      artista: 'Ed Sheeran',
      youtubeId: 'JGwWNGJdvx8',
      duracion: 233,
      letraCompleta: [
        // Verso 1
        { texto: "The club isn't the best place to find a lover", tiempoInicio: 15, tiempoFin: 18 },
        { texto: "So the bar is where I go", tiempoInicio: 18.5, tiempoFin: 20 },
        { texto: "Me and my friends at the table doing shots", tiempoInicio: 20.5, tiempoFin: 23.2 },
        { texto: "Drinking fast and then we talk slow", tiempoInicio: 23.4, tiempoFin: 25.2 },
        { texto: "And you come over and start up a conversation with just me", tiempoInicio: 25.5, tiempoFin: 28.2 },
        { texto: "And trust me I'll give it a chance now", tiempoInicio: 28.5, tiempoFin: 30.5 },
        { texto: "Take my hand, stop, put Van the Man on the jukebox", tiempoInicio: 30.7, tiempoFin: 33.5 },
        { texto: "And then we start to dance, and now I'm singing like", tiempoInicio: 33.8, tiempoFin: 35.8 },
        
        // Pre-coro 1
        { texto: "Girl, you know I want your love", tiempoInicio: 36, tiempoFin: 38.2 },
        { texto: "Your love was handmade for somebody like me", tiempoInicio: 38.5, tiempoFin: 41.5 },
        { texto: "Come on now, follow my lead", tiempoInicio: 41.7, tiempoFin: 43.5 },
        { texto: "I may be crazy, don't mind me", tiempoInicio: 43.7, tiempoFin: 45.7 },
        { texto: "Say, boy, let's not talk too much", tiempoInicio: 46, tiempoFin: 48.2 },
        { texto: "Grab on my waist and put that body on me", tiempoInicio: 48.5, tiempoFin: 51.2 },
        { texto: "Come on now, follow my lead", tiempoInicio: 51.4, tiempoFin: 53.2 },
        { texto: "Come, come on now, follow my lead", tiempoInicio: 54.4, tiempoFin: 56 },
        
        // Coro 1
        { texto: "I'm in love with the shape of you", tiempoInicio: 56.5, tiempoFin: 59 },
        { texto: "We push and pull like a magnet do", tiempoInicio: 59.2, tiempoFin: 61.5 },
        { texto: "Although my heart is falling too", tiempoInicio: 62, tiempoFin: 64 },
        { texto: "I'm in love with your body", tiempoInicio: 64.2, tiempoFin: 66.5 },
        { texto: "And last night you were in my room", tiempoInicio: 67, tiempoFin: 69 },
        { texto: "And now my bedsheets smell like you", tiempoInicio: 69.2, tiempoFin: 71.3 },
        { texto: "Every day discovering something brand new", tiempoInicio: 71.5, tiempoFin: 74 },
        { texto: "I'm in love with your body", tiempoInicio: 74.2, tiempoFin: 76.5 },
        { texto: "(Oh-I-oh-I-oh-I-oh-I)", tiempoInicio: 77, tiempoFin: 79 },
        { texto: "I'm in love with your body", tiempoInicio: 79.2, tiempoFin: 81.5 },
        { texto: "(Oh-I-oh-I-oh-I-oh-I)", tiempoInicio: 82, tiempoFin: 84 },
        { texto: "I'm in love with your body", tiempoInicio: 84.2, tiempoFin: 86.5 },
        { texto: "(Oh-I-oh-I-oh-I-oh-I)", tiempoInicio: 87, tiempoFin: 89 },
        { texto: "I'm in love with your body", tiempoInicio: 89.2, tiempoFin: 91.5 },
        { texto: "Every day discovering something brand new", tiempoInicio: 91.7, tiempoFin: 94 },
        { texto: "I'm in love with the shape of you", tiempoInicio: 94.2, tiempoFin: 96.5 },

        // Verso 2
        { texto: "One week in we let the story begin", tiempoInicio: 96.1, tiempoFin: 97.8 },
        { texto: "We're going out on our first date", tiempoInicio: 98, tiempoFin: 100 },
        { texto: "You and me are thrifty, so go all you can eat", tiempoInicio: 100.5, tiempoFin: 103 },
        { texto: "Fill up your bag and I fill up a plate", tiempoInicio: 103.3, tiempoFin: 105 },
        { texto: "We talk for hours and hours about the sweet and the sour", tiempoInicio: 105.5, tiempoFin: 108 },
        { texto: "And how your family is doing okay", tiempoInicio: 108.2, tiempoFin: 110 },
        { texto: "And leave and get in a taxi, then kiss in the backseat", tiempoInicio: 110.3, tiempoFin: 113 },
        { texto: "Tell the driver make the radio play, and I'm singing like", tiempoInicio: 113.3, tiempoFin: 115.5 },

        // Pre-coro 2
        { texto: "Girl, you know I want your love", tiempoInicio: 115.7, tiempoFin: 118.2 },
        { texto: "Your love was handmade for somebody like me", tiempoInicio: 118.5, tiempoFin: 121 },
        { texto: "Come on now, follow my lead", tiempoInicio: 121.3, tiempoFin: 123 },
        { texto: "I may be crazy, don't mind me", tiempoInicio: 123.3, tiempoFin: 125.5 },
        { texto: "Say, boy, let's not talk too much", tiempoInicio: 125.8, tiempoFin: 128.5 },
        { texto: "Grab on my waist and put that body on me", tiempoInicio: 128.8, tiempoFin: 131.2 },
        { texto: "Come on now, follow my lead", tiempoInicio: 131.5, tiempoFin: 133 },
        { texto: "Come, come on now, follow my lead", tiempoInicio: 133.3, tiempoFin: 136 },

        // Coro 2
        { texto: "I'm in love with the shape of you", tiempoInicio: 136.5, tiempoFin: 139 },
        { texto: "We push and pull like a magnet do", tiempoInicio: 139.2, tiempoFin: 141.8 },
        { texto: "Although my heart is falling too", tiempoInicio: 142, tiempoFin: 144 },
        { texto: "I'm in love with your body", tiempoInicio: 144.2, tiempoFin: 146.2 },
        { texto: "And last night you were in my room", tiempoInicio: 146.5, tiempoFin: 149 },
        { texto: "And now my bedsheets smell like you", tiempoInicio: 149.2, tiempoFin: 151.2 },
        { texto: "Every day discovering something brand new", tiempoInicio: 151.5, tiempoFin: 154 },
        { texto: "I'm in love with your body", tiempoInicio: 154.2, tiempoFin: 156 },
        { texto: "(Oh-I-oh-I-oh-I-oh-I)", tiempoInicio: 156.5, tiempoFin: 159 },
        { texto: "I'm in love with your body", tiempoInicio: 159.2, tiempoFin: 161.2 },
        { texto: "(Oh-I-oh-I-oh-I-oh-I)", tiempoInicio: 161.5, tiempoFin: 164 },
        { texto: "I'm in love with your body", tiempoInicio: 164.2, tiempoFin: 166 },
        { texto: "(Oh-I-oh-I-oh-I-oh-I)", tiempoInicio: 166.2, tiempoFin: 169 },
        { texto: "I'm in love with your body", tiempoInicio: 169.2, tiempoFin: 171.2 },
        { texto: "Every day discovering something brand new", tiempoInicio: 171.5, tiempoFin: 174 },
        { texto: "I'm in love with the shape of you", tiempoInicio: 174.2, tiempoFin: 176 },
        
        // Puente
        { texto: "Come on, be my baby, come on", tiempoInicio: 176.5, tiempoFin: 178.5 },
        { texto: "Come on, be my baby, come on", tiempoInicio: 178.8, tiempoFin: 180.8 },
        { texto: "Come on, be my baby, come on", tiempoInicio: 181.1, tiempoFin: 183.1 },
        { texto: "Come on, be my baby, come on", tiempoInicio: 183.4, tiempoFin: 185.4 },
        { texto: "Come on, be my baby, come on", tiempoInicio: 185.7, tiempoFin: 187.7 },
        { texto: "Come on, be my baby, come on", tiempoInicio: 188.0, tiempoFin: 190.0 },
        { texto: "Come on, be my baby, come on", tiempoInicio: 190.3, tiempoFin: 193 },
        { texto: "Come on, be my baby, come on", tiempoInicio: 193.2, tiempoFin: 196 },


        // Coro Final
        { texto: "I'm in love with the shape of you", tiempoInicio: 198, tiempoFin: 200.5 },
        { texto: "We push and pull like a magnet do", tiempoInicio: 200.8, tiempoFin: 202.8 },
        { texto: "Although my heart is falling too", tiempoInicio: 203, tiempoFin: 205 },
        { texto: "I'm in love with your body", tiempoInicio: 205.5, tiempoFin: 207.5 },
        { texto: "And last night you were in my room", tiempoInicio: 208, tiempoFin: 210.5 },
        { texto: "And now my bedsheets smell like you", tiempoInicio: 210.7, tiempoFin: 212.5 },
        { texto: "Every day discovering something brand new", tiempoInicio: 212.7, tiempoFin: 215.3 },
        { texto: "I'm in love with your body", tiempoInicio: 215.5, tiempoFin: 217.2 },
        { texto: "Come on, be my baby, come on", tiempoInicio: 217.5, tiempoFin: 220 },
        { texto: "Come on (I'm in love with your body), be my baby, come on", tiempoInicio: 220.2, tiempoFin: 224.8 },
        { texto: "Come on (I'm in love with your body), be my baby, come on", tiempoInicio: 225 , tiempoFin: 230 },
        { texto: "Come on (I'm in love with your body)", tiempoInicio: 230.3, tiempoFin: 232.2 },
        { texto: "Every day discovering something brand new", tiempoInicio: 232.5, tiempoFin: 235 },
        { texto: "I'm in love with the shape of you", tiempoInicio: 235.2, tiempoFin: 238 }
      ]
    },
    'imagine': {
      id: 'imagine', titulo: 'Imagine', artista: 'John Lennon', youtubeId: 'YkgkThdzX-8', duracion: 183,
      letraCompleta: [
        // Piano intro hasta 0:54, entonces comienza la voz como indicaste
        { texto: "Imagine there's no heaven", tiempoInicio: 54, tiempoFin: 57.5 },
        { texto: "It's easy if you try", tiempoInicio: 60, tiempoFin: 64 },
        { texto: "No hell below us", tiempoInicio: 67, tiempoFin: 70 },
        { texto: "Above us, only sky", tiempoInicio: 74, tiempoFin: 77 },
        { texto: "Imagine all the people livin' for today", tiempoInicio: 79.5, tiempoFin: 92 },
        // Segundo verso
        { texto: "Imagine there's no countries", tiempoInicio: 93, tiempoFin: 96.5 },
        { texto: "It isn't hard to do", tiempoInicio: 99, tiempoFin: 102 },
        { texto: "Nothing to kill or die for", tiempoInicio: 105, tiempoFin: 109 },
        { texto: "And no religion, too", tiempoInicio: 112, tiempoFin: 115 },
        { texto: "Imagine all the people livin' life in peace", tiempoInicio: 118, tiempoFin: 130 },
        // Coro
        { texto: "You may say I'm a dreamer", tiempoInicio: 130.5, tiempoFin: 135 },
        { texto: "But I'm not the only one", tiempoInicio: 137.5, tiempoFin: 140.5 },
        { texto: "I hope someday you'll join us", tiempoInicio: 143, tiempoFin: 148 },
        { texto: "And the world will be as one", tiempoInicio: 150, tiempoFin: 154 },
        // Tercer verso
        { texto: "Imagine no possessions", tiempoInicio: 156, tiempoFin: 159.5 },
        { texto: "I wonder if you can", tiempoInicio: 162, tiempoFin: 166 },
        { texto: "No need for greed or hunger", tiempoInicio: 168, tiempoFin: 172.5 },
        { texto: "A brotherhood of man", tiempoInicio: 175, tiempoFin: 178 },
        { texto: "Imagine all the people sharin' all the world", tiempoInicio: 181, tiempoFin: 193 },
        // Coro final
        { texto: "You may say I'm a dreamer", tiempoInicio: 194, tiempoFin: 198 },
        { texto: "But I'm not the only one", tiempoInicio: 200, tiempoFin: 203 },
        { texto: "I hope someday you'll join us", tiempoInicio: 206.5, tiempoFin: 211 },
        { texto: "And the world will live as one", tiempoInicio: 213, tiempoFin: 220 }
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