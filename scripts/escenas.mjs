// Prepara las imágenes: las de ChatGPT que haya en imagenes/ pasan a WebP en public/escenas.
// Las que aún faltan se sustituyen por una provisional con su nombre y el portal marcado, para que la web funcione
// mientras se generan.
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';

const OUT = 'public/escenas';
const HERO = [1672, 941];
const BODY = [1080, 1350];

// nombre (sin extensión) → [tamaño, forma del portal provisional]
const imagenes = {
  'hero/1-spiegel': [HERO, 'kreis'],
  'hero/2-studio': [HERO, 'bogen'],
  'hero/3-nagel': [HERO, 'mandel'],
  'hero/4-glanz': [HERO, null],
  'body/nails': [BODY, null],
  'body/braids': [BODY, null],
  'body/extensions': [BODY, null],
};

const figura = (forma, W, H) => {
  const cx = W / 2;
  const cy = H / 2;
  const trazo = 'fill="#f3dcd5" stroke="#c99b6a" stroke-width="3" stroke-dasharray="14 10"';
  if (forma === 'kreis') return `<circle cx="${cx}" cy="${cy}" r="${0.08 * W}" ${trazo}/>`;
  if (forma === 'bogen') {
    const w = 0.2 * W;
    const h = 0.5 * H;
    const x = cx - w / 2;
    const y = cy - h / 2;
    return `<path d="M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z" ${trazo}/>`;
  }
  if (forma === 'mandel') {
    const w = 0.14 * W;
    const h = 0.55 * H;
    const t = cy - h / 2;
    const b = cy + h / 2;
    return `<path d="M${cx} ${t}C${cx + w * 0.22} ${t + h * 0.05} ${cx + w / 2} ${cy - h * 0.2} ${cx + w / 2} ${cy + h * 0.15}C${cx + w / 2} ${cy + h * 0.42} ${cx + w * 0.3} ${b} ${cx} ${b}C${cx - w * 0.3} ${b} ${cx - w / 2} ${cy + h * 0.42} ${cx - w / 2} ${cy + h * 0.15}C${cx - w / 2} ${cy - h * 0.2} ${cx - w * 0.22} ${t + h * 0.05} ${cx} ${t}Z" ${trazo}/>`;
  }
  return '';
};

const provisional = (nombre, [W, H], forma) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="g" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#f6e4dc"/><stop offset="0.6" stop-color="#d9b2a4"/><stop offset="1" stop-color="#7a5446"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${figura(forma, W, H)}
  <text x="50%" y="${H * 0.86}" fill="#2a1a15" font-family="Helvetica, Arial" font-size="${W / 44}" text-anchor="middle">${nombre}</text>
  <text x="50%" y="${H * 0.86 + W / 30}" fill="#5c4038" font-family="Helvetica, Arial" font-size="${W / 70}" text-anchor="middle">imagen pendiente · imagenes/${nombre}.png</text>
</svg>`);

let reales = 0;
for (const [nombre, [[W, H], forma]] of Object.entries(imagenes)) {
  const destino = `${OUT}/${nombre}.webp`;
  await mkdir(destino.slice(0, destino.lastIndexOf('/')), { recursive: true });
  const fuente = ['png', 'jpg', 'jpeg', 'webp'].map((ext) => `imagenes/${nombre}.${ext}`).find(existsSync);
  if (fuente) {
    reales++;
    await sharp(fuente).resize(W, H, { fit: 'cover', kernel: 'lanczos3' }).sharpen({ sigma: 0.6 }).webp({ quality: 84 }).toFile(destino);
  } else {
    await sharp(provisional(nombre, [W, H], forma)).webp({ quality: 80 }).toFile(destino);
  }
}

console.log(`escenas: ${reales} de ${Object.keys(imagenes).length} imágenes reales, el resto provisionales`);

// Farbstudio: la mano con las uñas blancas. Se separan la máscara de las uñas (lo blanco y sin color de la foto) y sus
// brillos, para pintar encima cualquier esmalte conservando las sombras y los reflejos. Las cajas limitan la búsqueda
// a cada uña (en píxeles de la foto original de 1254 × 1254) para que el fondo claro no se cuele.
const UNYAS = [
  [335, 290, 85, 165],
  [462, 118, 100, 180],
  [572, 32, 105, 185],
  [700, 95, 98, 180],
  [895, 485, 125, 185],
];
if (existsSync('imagenes/body/hand.png')) {
  const N = 1000;
  const { data, info } = await sharp('imagenes/body/hand.png').resize(N, N).raw().toBuffer({ resolveWithObject: true });
  const f = N / 1254;
  const cajas = UNYAS.map(([x, y, w, h]) => [x * f, y * f, (x + w) * f, (y + h) * f]);
  const peso = new Float32Array(N * N);
  const luz = new Float32Array(N * N);
  const clamp = (v) => Math.max(0, Math.min(1, v));
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!cajas.some(([x0, y0, x1, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1)) continue;
      const i = (y * N + x) * info.channels;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const mn = Math.min(r, g, b);
      const sat = Math.max(r, g, b) - mn;
      // Uña: blanca o gris cálido (el lateral en sombra llega a saturación ~45); el fondo y la piel pasan de 55.
      peso[y * N + x] = clamp((mn - 128) / 20) * clamp((54 - sat) / 8);
      luz[y * N + x] = clamp((mn - 236) / 16);
    }
  }
  // Pared lateral de la uña: refleja la piel y tiene el color del fondo. En cada fila, lo que queda entre la uña y la
  // piel del dedo (a pocos píxeles) también es uña; si no hay piel cerca (la punta, sobre el fondo), no se toca.
  // Por filas y por columnas: así se cubre también el lateral en diagonal (el pulgar).
  const rellenar = (n0, n1, m0, m1, idx) => {
    for (let n = Math.ceil(n0); n <= Math.min(N - 1, n1); n++) {
      let L = -1;
      let R = -1;
      for (let m = Math.ceil(m0); m <= Math.min(N - 1, m1); m++)
        if (peso[idx(n, m)] > 0.5) {
          if (L < 0) L = m;
          R = m;
        }
      if (L < 0) continue;
      for (const [desde, paso] of [[R, 1], [L, -1]]) {
        for (let d = 1; d <= 16; d++) {
          const m = desde + paso * d;
          if (m < 0 || m >= N) break;
          const j = idx(n, m);
          if (data[j * info.channels] - data[j * info.channels + 1] > 55) {
            for (let e = 1; e < d; e++) peso[idx(n, desde + paso * e)] = 1;
            break;
          }
        }
      }
    }
  };
  for (const [x0, y0, x1, y1] of cajas) rellenar(y0, y1, x0, x1, (y, x) => y * N + x);

  // Contorno liso: una uña es convexa, así que su forma es la envolvente convexa de sus píxeles. Rellena las muescas
  // donde la sombra es demasiado oscura y deja el borde limpio, como un trazo vectorial, con medio píxel de transición.
  const lisa = new Float32Array(N * N);
  const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  for (const [x0, y0, x1, y1] of cajas) {
    const puntos = [];
    for (let y = Math.ceil(y0); y <= Math.min(N - 1, y1); y++) {
      let L = -1;
      let R = -1;
      for (let x = Math.ceil(x0); x <= Math.min(N - 1, x1); x++)
        if (peso[y * N + x] > 0.5) {
          if (L < 0) L = x;
          R = x;
        }
      if (L >= 0) puntos.push([L, y], [R + 1, y], [L, y + 1], [R + 1, y + 1]);
    }
    if (puntos.length < 3) continue;
    // Envolvente convexa (cadena monótona).
    puntos.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const abajo = [];
    for (const p of puntos) {
      while (abajo.length >= 2 && cruz(abajo[abajo.length - 2], abajo[abajo.length - 1], p) <= 0) abajo.pop();
      abajo.push(p);
    }
    const arriba = [];
    for (const p of [...puntos].reverse()) {
      while (arriba.length >= 2 && cruz(arriba[arriba.length - 2], arriba[arriba.length - 1], p) <= 0) arriba.pop();
      arriba.push(p);
    }
    const poli = [...abajo.slice(0, -1), ...arriba.slice(0, -1)];
    // Rellenar el polígono con 4 × 4 muestras por píxel.
    const xs = poli.map((p) => p[0]);
    const ys = poli.map((p) => p[1]);
    const dentroPoli = (px, py) => {
      let c = false;
      for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
        const [xi, yi] = poli[i];
        const [xj, yj] = poli[j];
        if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
    for (let y = Math.floor(Math.min(...ys)); y < Math.ceil(Math.max(...ys)); y++)
      for (let x = Math.floor(Math.min(...xs)); x < Math.ceil(Math.max(...xs)); x++) {
        let n = 0;
        for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) if (dentroPoli(x + (sx + 0.5) / 4, y + (sy + 0.5) / 4)) n++;
        if (n) lisa[y * N + x] = Math.max(lisa[y * N + x], n / 16);
      }
  }
  // Máximo (dilatar) o mínimo (erosionar) en un cuadrado de radio r, en dos pasadas.
  const filtro = (src, r, fn) => {
    const tmp = new Float32Array(N * N);
    const out = new Float32Array(N * N);
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        let v = src[y * N + x];
        for (let d = -r; d <= r; d++) v = fn(v, src[y * N + Math.max(0, Math.min(N - 1, x + d))]);
        tmp[y * N + x] = v;
      }
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        let v = tmp[y * N + x];
        for (let d = -r; d <= r; d++) v = fn(v, tmp[Math.max(0, Math.min(N - 1, y + d)) * N + x]);
        out[y * N + x] = v;
      }
    return out;
  };
  // Los brillos solo cuentan lejos del borde.
  const nitida = lisa;
  const dentro = filtro(nitida, 5, Math.min);
  const maske = Buffer.alloc(N * N * 4, 255);
  const glanz = Buffer.alloc(N * N * 4, 255);
  // El filo de la uña blanca es oscuro y queda justo fuera de la forma: bajo un esmalte claro se vería como un
  // contorno. La máscara se ensancha 2 px y, debajo, ese filo (no la piel) se aclara hasta el blanco de la uña.
  const ancha = filtro(nitida, 2, Math.max);
  for (let j = 0; j < N * N; j++) {
    const i = j * info.channels;
    const esPiel = data[i] - data[i + 1] > 55;
    if (ancha[j] > 0 && !esPiel)
      for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] + (Math.max(data[i + c], 228) - data[i + c]) * ancha[j]);
    maske[j * 4 + 3] = Math.round(ancha[j] * 255);
    glanz[j * 4 + 3] = Math.round(dentro[j] * luz[j] * 235);
  }
  await mkdir(`${OUT}/farbstudio`, { recursive: true });
  await sharp(data, { raw: { width: N, height: N, channels: info.channels } }).webp({ quality: 88 }).toFile(`${OUT}/farbstudio/hand.webp`);
  // Un pelo de desenfoque: borde suave, sin escalones.
  await sharp(maske, { raw: { width: N, height: N, channels: 4 } }).blur(1).png().toFile(`${OUT}/farbstudio/maske.png`);
  await sharp(glanz, { raw: { width: N, height: N, channels: 4 } }).blur(0.6).png().toFile(`${OUT}/farbstudio/glanz.png`);
}
