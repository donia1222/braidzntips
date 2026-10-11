// Las escenas del recorrido del hero. Imágenes generadas con ChatGPT (originales en imagenes/hero, ver PROMPTS.md),
// preparadas con scripts/escenas.mjs. Mientras falten, se usan provisionales.
//
// Coordenadas en fracciones de la imagen 16:9: `x` del ancho, `y` del alto. `portal` es la abertura por la que se
// entra a la escena siguiente; `llegada` es el punto de la escena siguiente que queda dentro de ese portal, y `zoom`
// cuánto se acerca la cámara en el tramo.

export type Punto = { x: number; y: number };

export type Escena = {
  id: string;
  src: string;
  alt: string;
  lugar: string;
  /** Punto (fracción del ancho) que queda centrado en pantallas estrechas, donde la imagen se recorta a los lados. */
  foco?: number;
};

export type Tramo = {
  portal: Punto;
  llegada: Punto;
  zoom: number;
  /** Forma de la abertura: círculo (el espejito), arco (la ventana) o almendra (la uña). */
  forma: 'kreis' | 'bogen' | 'mandel';
  /** Tamaño de la abertura: `w` en fracciones del ancho y `h` del alto (en el círculo, w es el diámetro). */
  w: number;
  h: number;
  /** Tramo de `t` en el que la escena siguiente aparece dentro de la abertura. Por defecto [0.12, 0.4]. */
  fundido?: [number, number];
};

export const escenas: Escena[] = [
  {
    id: 'start',
    src: '/escenas/hero/1-spiegel.webp',
    alt: 'Eine Hand mit langen, nudefarbenen Mandelnägeln hält einen kleinen goldenen Taschenspiegel',
    lugar: 'Der Spiegel',
  },
  {
    id: 'studio',
    src: '/escenas/hero/2-studio.webp',
    alt: 'Ein helles Beauty-Studio in Creme und Puderrosa mit Samtsesseln, Marmortisch und einem Bogenfenster',
    lugar: 'Das Studio',
  },
  {
    id: 'detail',
    src: '/escenas/hero/3-nagel.webp',
    alt: 'Makroaufnahme eines langen Mandelnagels in Perlmutt-Chrome',
    lugar: 'Das Detail',
  },
  {
    id: 'look',
    src: '/escenas/hero/4-glanz.webp',
    alt: 'Eine junge Frau mit langen Knotless Braids mit Goldschmuck im warmen Abendlicht',
    lugar: 'Dein Look',
    foco: 0.62,
  },
];

// tramos[i] lleva de escenas[i] a escenas[i + 1]. Aberturas medidas sobre las imágenes reales.
export const tramos: Tramo[] = [
  // Por el cristal del espejito: dentro se ve el estudio.
  { portal: { x: 0.4939, y: 0.3093 }, llegada: { x: 0.5, y: 0.42 }, zoom: 5, forma: 'kreis', w: 0.1833, h: 0.33 },
  // Por la ventana en arco del fondo del estudio: dentro, la uña de cerca.
  { portal: { x: 0.5, y: 0.284 }, llegada: { x: 0.4961, y: 0.42 }, zoom: 4, forma: 'bogen', w: 0.16, h: 0.42 },
  // A través de la uña: dentro aparece su mano con las uñas terminadas, sobre las trenzas.
  { portal: { x: 0.4961, y: 0.405 }, llegada: { x: 0.49, y: 0.56 }, zoom: 3.2, forma: 'mandel', w: 0.159, h: 0.66 },
];
