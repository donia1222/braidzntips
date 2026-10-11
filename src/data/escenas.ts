// Los recorridos del hero. Imágenes generadas con ChatGPT (originales en imagenes/hero, ver PROMPTS.md), preparadas
// con scripts/escenas.mjs. La web usa "b"; "a" es la versión anterior, guardada por si se quiere volver.
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
  /** Forma de la abertura: círculo (el espejito), arco (la ventana) o almendra (la uña, con la punta arriba). */
  forma: 'kreis' | 'bogen' | 'mandel';
  /** Tamaño de la abertura: `w` en fracciones del ancho y `h` del alto (en el círculo, w es el diámetro). */
  w: number;
  h: number;
  /** Giro de la abertura en radianes (una uña que apunta hacia abajo y a un lado). */
  giro?: number;
  /** Giro con el que aparece la escena siguiente dentro de la abertura; se endereza durante el tramo. */
  giroLlegada?: number;
  /** Versión desenfocada de la escena siguiente: se ve así al principio, como un reflejo, y se enfoca al acercarse. */
  unscharf?: string;
  /** Tramo de `t` en el que la escena siguiente aparece dentro de la abertura. Por defecto [0.12, 0.4]. */
  fundido?: [number, number];
};

export type Recorrido = { escenas: Escena[]; tramos: Tramo[] };

const spiegel: Escena = {
  id: 'start',
  src: '/escenas/hero/1-spiegel.webp',
  alt: 'Eine Hand mit langen, nudefarbenen Mandelnägeln hält einen kleinen goldenen Taschenspiegel',
  lugar: 'Der Spiegel',
};
const studio = (id: string, lugar: string): Escena => ({
  id,
  src: '/escenas/hero/2-studio.webp',
  alt: 'Ein helles Beauty-Studio in Creme und Puderrosa mit Samtsesseln, Marmortisch und einem Bogenfenster',
  lugar,
});
const look = (id: string): Escena => ({
  id,
  src: '/escenas/hero/4-glanz.webp',
  alt: 'Eine junge Frau mit langen Knotless Braids mit Goldschmuck im warmen Abendlicht',
  lugar: 'Dein Look',
  foco: 0.62,
});

export const recorridos: Record<'a' | 'b', Recorrido> = {
  // Espejito → estudio → uña → la clienta terminada.
  a: {
    escenas: [
      spiegel,
      studio('studio', 'Das Studio'),
      { id: 'detail', src: '/escenas/hero/3-nagel.webp', alt: 'Makroaufnahme eines langen Mandelnagels in Perlmutt-Chrome', lugar: 'Das Detail' },
      look('look'),
    ],
    tramos: [
      // Por el cristal del espejito: dentro se ve el estudio.
      { portal: { x: 0.4939, y: 0.3093 }, llegada: { x: 0.5, y: 0.42 }, zoom: 5, forma: 'kreis', w: 0.1833, h: 0.33 },
      // Por la ventana en arco del fondo del estudio: dentro, la uña de cerca.
      { portal: { x: 0.5, y: 0.284 }, llegada: { x: 0.4961, y: 0.42 }, zoom: 4, forma: 'bogen', w: 0.16, h: 0.42 },
      // A través de la uña: dentro aparece su mano con las uñas terminadas, sobre las trenzas.
      { portal: { x: 0.4961, y: 0.405 }, llegada: { x: 0.49, y: 0.56 }, zoom: 3.2, forma: 'mandel', w: 0.159, h: 0.66 },
    ],
  },
  // Espejito con la chica reflejada → la chica → su uña, que gira hasta quedar hacia arriba → el estudio.
  b: {
    escenas: [
      spiegel,
      look('look'),
      { id: 'detail', src: '/escenas/hero/3-nagel.webp', alt: 'Makroaufnahme eines langen Mandelnagels in Perlmutt-Chrome', lugar: 'Das Detail' },
      studio('studio', 'Das Studio'),
    ],
    tramos: [
      // En el cristal del espejito se ve la chica, desenfocada como un reflejo; al acercarse se enfoca.
      {
        portal: { x: 0.4939, y: 0.3093 },
        llegada: { x: 0.56, y: 0.45 },
        zoom: 5,
        forma: 'kreis',
        w: 0.1833,
        h: 0.33,
        unscharf: '/escenas/hero/4-glanz-unscharf.webp',
        // Visible desde el principio (también va pintado en la imagen del espejito, ver scripts/escenas.mjs).
        fundido: [-1, 0],
      },
      // Por la uña del dedo corazón, que apunta hacia abajo y a la derecha: dentro aparece la uña macro girada igual y,
      // mientras la cámara entra, da la vuelta hasta quedar con la punta hacia arriba.
      {
        portal: { x: 0.5612, y: 0.6206 },
        llegada: { x: 0.4961, y: 0.405 },
        zoom: 11,
        forma: 'mandel',
        w: 0.0165,
        h: 0.072,
        giro: 2.482,
        giroLlegada: 2.482,
      },
      // Por la uña macro al estudio.
      { portal: { x: 0.4961, y: 0.405 }, llegada: { x: 0.5, y: 0.42 }, zoom: 3.2, forma: 'mandel', w: 0.159, h: 0.66 },
    ],
  },
};
