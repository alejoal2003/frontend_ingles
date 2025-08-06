export interface PalabraCompletable {
  textoOriginal: string;
  textoNormalizado: string;
  tiempo: number;
  lineaIndex: number;
  palabraIndex: number;
  id: string;
  completada: boolean;
}

export interface LineaLetra {
  textoOriginal: string;
  tiempoInicio: number;
  tiempoFin: number;
  palabras: string[];
  palabraCompletable?: PalabraCompletable;
  htmlSeguro?: any; // SafeHtml se importará donde se use
}

export interface CancionData {
  id: string;
  titulo: string;
  artista: string;
  youtubeId: string;
  letraCompleta: { texto: string; tiempoInicio: number; tiempoFin: number }[];
  duracion: number;
}