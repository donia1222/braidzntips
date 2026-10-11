import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { recorridos, type Tramo } from '../data/escenas';

// Recorrido por portales. Cada tramo lleva de una escena a la siguiente: la cámara se acerca a la abertura de la
// escena actual (el espejito, la ventana en arco, la uña) y la escena siguiente, que ya se ve dentro, crece hasta
// ocupar la pantalla. La abertura tiene la forma del objeto y un borde de luz champán.
//
// Todo se calcula en fracciones del marco 16:9 de cada escena. Un punto `x` de una escena se pinta en `c + k · (x − p)`,
// donde `p` es el portal, `k` el zoom y `c` el punto de la pantalla hacia el que viaja la cámara (del portal de esta
// escena al punto de llegada de la siguiente). La escena siguiente usa la misma cámara con zoom `k / K`, así que al
// final del tramo (k = K) queda exactamente en su sitio y sin escalar.
//
// Se pinta en un único canvas del tamaño de la pantalla y de cada escena solo se dibuja el trozo visible: con capas
// del DOM, cada escena sería una textura enorme y en iOS se acaba la memoria gráfica.

type Key = { y: number; v: number };
type Fuente = ImageBitmap | HTMLImageElement;
type Plano = { tx: number; ty: number; k: number; alpha: number };

const piecewise = (y: number, keys: Key[]) => {
  if (y <= keys[0].y) return keys[0].v;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (y <= b.y) return a.v + (b.v - a.v) * ((y - a.y) / (b.y - a.y || 1));
  }
  return keys[keys.length - 1].v;
};

const clamp01 = gsap.utils.clamp(0, 1);
const smooth = (t: number) => t * t * (3 - 2 * t);
const range = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const RATIO = 16 / 9;
const FONDO = '#24150f';

async function cargar(src: string): Promise<Fuente> {
  const img = new Image();
  img.src = src;
  await img.decode();
  // ImageBitmap queda decodificada en memoria: dibujarla no vuelve a decodificar el WebP.
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(img);
    } catch {
      return img;
    }
  }
  return img;
}

// Traza la abertura centrada en (cx, cy) con ancho w y alto h, en píxeles.
function trazar(c: CanvasRenderingContext2D, forma: Tramo['forma'], gx: number, gy: number, w: number, h: number, giro = 0) {
  // Se traza centrada en el origen y girada; el contexto vuelve a su sitio al final.
  c.save();
  c.translate(gx, gy);
  c.rotate(giro);
  const cx = 0;
  const cy = 0;
  c.beginPath();
  if (forma === 'kreis') {
    c.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
  } else if (forma === 'bogen') {
    // Ventana: rectángulo con medio círculo arriba.
    const r = w / 2;
    const top = cy - h / 2;
    c.moveTo(cx - r, cy + h / 2);
    c.lineTo(cx - r, top + r);
    c.arc(cx, top + r, r, Math.PI, 0);
    c.lineTo(cx + r, cy + h / 2);
    c.closePath();
  } else {
    // Uña en almendra: punta arriba, base redondeada abajo.
    const t = cy - h / 2;
    const b = cy + h / 2;
    c.moveTo(cx, t);
    c.bezierCurveTo(cx + w * 0.22, t + h * 0.05, cx + w / 2, cy - h * 0.2, cx + w / 2, cy + h * 0.15);
    c.bezierCurveTo(cx + w / 2, cy + h * 0.42, cx + w * 0.3, b, cx, b);
    c.bezierCurveTo(cx - w * 0.3, b, cx - w / 2, cy + h * 0.42, cx - w / 2, cy + h * 0.15);
    c.bezierCurveTo(cx - w / 2, cy - h * 0.2, cx - w * 0.22, t + h * 0.05, cx, t);
    c.closePath();
  }
  c.restore();
}

export function initPortal(world: HTMLElement, reduceMotion: boolean) {
  const { escenas, tramos } = recorridos[world.dataset.recorrido === 'b' ? 'b' : 'a'];
  const stage = world.querySelector<HTMLElement>('[data-stage]');
  const canvas = stage?.querySelector<HTMLCanvasElement>('[data-portal]');
  const ctx = canvas?.getContext('2d', { alpha: false });
  if (!stage || !canvas || !ctx) return;
  const poster = stage.querySelector<HTMLElement>('[data-poster]');
  const stops = [...world.querySelectorAll<HTMLElement>('[data-stop]')];
  const naegel = [...document.querySelectorAll<HTMLElement>('[data-nagel]')];
  const label = document.querySelector<HTMLElement>('[data-nagel-label]');
  const hint = stage.querySelector<HTMLElement>('[data-hint]');
  const last = stops.length - 1;
  const marks = stops.map((stop) => ScrollTrigger.create({ trigger: stop, start: 'top top' }));

  // Hay que volver a pintar (en movimiento reducido solo se pinta cuando cambia algo).
  let sucio = true;
  const fuentes: (Fuente | null)[] = escenas.map(() => null);
  // Versiones desenfocadas de la escena siguiente, por tramo (si las hay).
  const unscharf: (Fuente | null)[] = tramos.map(() => null);
  (async () => {
    for (let i = 0; i < escenas.length; i++) {
      try {
        fuentes[i] = await cargar(escenas[i].src);
      } catch {
        fuentes[i] = null;
      }
      if (i === 0) {
        canvas.style.opacity = '1';
        if (poster) {
          poster.style.opacity = '0';
          // Fuera del todo tras el fundido: una imagen invisible a pantalla completa sigue gastando memoria gráfica.
          setTimeout(() => (poster.style.display = 'none'), 800);
        }
      }
      sucio = true;
      const u = tramos[i]?.unscharf;
      if (u) {
        try {
          unscharf[i] = await cargar(u);
        } catch {
          unscharf[i] = null;
        }
      }
    }
  })();

  let current = -2;
  const setCurrent = (index: number) => {
    if (index === current) return;
    current = index;
    stops.forEach((stop, i) => stop.classList.toggle('is-current', i === index));
    if (index >= 0 && label) label.textContent = stops[index].dataset.lugar ?? '';
  };

  let tramo = 0;
  let t = 0;

  const render = (self: ScrollTrigger) => {
    const y = self.scroll();
    const w = piecewise(y, [...marks.map((mark, i) => ({ y: mark.start, v: i })), { y: self.end, v: last + 0.5 }]);
    const at = Math.min(w, last);
    // Las uñas del indicador se pintan una a una, como un esmaltado.
    naegel.forEach((n, i) => n.style.setProperty('--f', String(clamp01(at - i + 1))));
    if (hint) hint.style.opacity = String(clamp01(1 - w * 5));
    tramo = Math.min(Math.floor(at), last - 1);
    // Cada tramo deja quietas las escenas al principio y al final para que se pueda leer el texto.
    t = at >= last ? 1 : range(at - tramo, 0.18, 0.88);
    setCurrent(t < 0.06 ? tramo : t > 0.94 ? tramo + 1 : -1);
    sucio = true;
  };

  const span = ScrollTrigger.create({
    trigger: world,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: render,
    onRefresh: render,
  });
  render(span);

  let W = 0;
  let H = 0;
  let dpr = 1;
  const medir = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = stage.clientWidth;
    H = stage.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    sucio = true;
  };
  medir();
  new ResizeObserver(medir).observe(stage);

  // Dibuja solo la parte visible de una escena colocada en (x0, y0) con tamaño (w, h) en píxeles CSS.
  // Con la escena girada se ve más allá de las esquinas: el margen de lo que se dibuja crece con el giro.
  let giroActual = 0;
  const dibujar = (img: Fuente, x0: number, y0: number, w: number, h: number) => {
    const margen = 0.06 + Math.abs(giroActual) * 0.8;
    const ax = Math.max(x0, -W * margen);
    const ay = Math.max(y0, -H * margen);
    const bx = Math.min(x0 + w, W * (1 + margen));
    const by = Math.min(y0 + h, H * (1 + margen));
    if (bx <= ax || by <= ay) return;
    const sx = ((ax - x0) / w) * img.width;
    const sy = ((ay - y0) / h) * img.height;
    const sw = ((bx - ax) / w) * img.width;
    const sh = ((by - ay) / h) * img.height;
    ctx.drawImage(img, sx, sy, sw, sh, ax, ay, bx - ax, by - ay);
  };

  // Movimiento ambiente: el escenario respira un poco y sigue al puntero.
  const objetivo = { x: 0, y: 0 };
  const puntero = { x: 0, y: 0 };
  if (!reduceMotion) {
    window.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      objetivo.x = event.clientX / innerWidth - 0.5;
      objetivo.y = event.clientY / innerHeight - 0.5;
    });
  }

  const funkeln = reduceMotion ? null : crearFunkeln();

  let visible = true;
  new IntersectionObserver(([entry]) => (visible = entry.isIntersecting)).observe(world);

  let prev = 0;
  gsap.ticker.add((time) => {
    const dt = Math.min(time - prev, 0.05);
    prev = time;
    if (!visible) return;
    if (!sucio && reduceMotion) return;

    puntero.x += (objetivo.x - puntero.x) * 0.04;
    puntero.y += (objetivo.y - puntero.y) * 0.04;
    const respira = reduceMotion ? 1.02 : 1.04 + Math.sin(time * 0.35) * 0.012;

    // Marco 16:9 que cubre la pantalla, como object-fit: cover.
    const boxW = Math.max(W, H * RATIO);
    const boxH = boxW / RATIO;
    const oy = (H - boxH) / 2;
    let ox = (W - boxW) / 2;

    const { portal: p, llegada: q, zoom: K, forma, w: fw, h: fh, giro = 0, giroLlegada = 0, fundido = [0.12, 0.4] } = tramos[tramo];
    const a = fuentes[tramo];
    const b = fuentes[tramo + 1];

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = FONDO;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.translate(W / 2 - puntero.x * 18, H / 2 - puntero.y * 12);
    ctx.scale(respira, respira);
    ctx.translate(-W / 2, -H / 2);

    const pintar = (img: Fuente | null, plano: Plano) => {
      if (!img || plano.alpha <= 0.002) return;
      ctx.globalAlpha = plano.alpha;
      dibujar(img, ox + plano.tx * boxW, oy + plano.ty * boxH, plano.k * boxW, plano.k * boxH);
      ctx.globalAlpha = 1;
    };

    if (reduceMotion) {
      ox = Math.min(0, Math.max(W - boxW, W / 2 - (escenas[t > 0.5 ? tramo + 1 : tramo].foco ?? 0.5) * boxW));
      pintar(a, { tx: 0, ty: 0, k: 1, alpha: 1 });
      pintar(b, { tx: 0, ty: 0, k: 1, alpha: smooth(range(t, 0.3, 0.7)) });
      sucio = false;
      return;
    }

    const e = smooth(t);
    const k = Math.pow(K, e);
    // En pantallas estrechas el marco se desplaza hacia el punto de interés de cada escena (en escritorio no cambia).
    const foco = (escenas[tramo].foco ?? 0.5) + ((escenas[tramo + 1].foco ?? 0.5) - (escenas[tramo].foco ?? 0.5)) * e;
    ox = Math.min(0, Math.max(W - boxW, W / 2 - foco * boxW));
    const cx = p.x + (q.x - p.x) * e;
    const cy = p.y + (q.y - p.y) * e;

    // Escena actual: se acerca a la abertura y al final pasa junto a la cámara.
    const ko = k * (1 + 0.6 * smooth(range(t, 0.6, 1)));
    pintar(a, { tx: cx - ko * p.x, ty: cy - ko * p.y, k: ko, alpha: 1 - smooth(range(t, 0.86, 1)) });

    // Escena siguiente, recortada por la abertura. Primero se ve el objeto real (el cristal, la ventana, el esmalte);
    // después la escena siguiente aparece dentro y, al final del tramo, la abertura se abre hasta cubrir la vista.
    const alphaB = smooth(range(t, fundido[0], fundido[1]));
    // Al empezar, la escena siguiente se ve algo más grande de lo que le toca para que llene la abertura sin dejar
    // bordes vacíos; llega a su tamaño exacto al final del tramo.
    const llena = (1.06 + Math.abs(giroLlegada) * 0.5) * Math.max(1, (fh * K) / (2 * Math.min(q.y, 1 - q.y)), (fw * K) / (2 * Math.min(q.x, 1 - q.x)));
    // Si llega girada, mientras gira crece lo justo para que sus bordes no asomen por las esquinas de la pantalla.
    const gira = giroLlegada * (1 - smooth(range(t, 0.15, 0.9)));
    const esquinas = Math.max(1, Math.abs(Math.cos(gira)) + Math.abs(Math.sin(gira)) * RATIO);
    const ki = (k / K) * (1 + (llena - 1) * (1 - smooth(range(t, 0.2, 1)))) * esquinas;
    const plano = { tx: cx - ki * q.x, ty: cy - ki * q.y, k: ki, alpha: alphaB };
    const gx = ox + cx * boxW;
    const gy = oy + cy * boxH;
    if (t >= 1) {
      pintar(b, plano);
    } else if (b && alphaB > 0.002) {
      // La abertura sigue al objeto de la escena actual, que al final del tramo se acerca algo más deprisa (ko).
      const pw = ko * fw * boxW;
      const ph = ko * fh * boxH;
      const abre = smooth(range(t, 0.5, 1));
      // Escala a la que la abertura cubre toda la pantalla aunque se estreche en la punta.
      const cubre = (2.4 * Math.hypot(W, H)) / Math.min(K * fw * boxW, K * fh * boxH);
      const s = 1 + (cubre - 1) * abre * abre;
      ctx.save();
      trazar(ctx, forma, gx, gy, pw * s, ph * s, giro);
      ctx.clip();
      // La escena de dentro puede llegar girada (alineada con la uña) y se endereza durante el tramo.
      giroActual = gira;
      if (gira) {
        ctx.translate(gx, gy);
        ctx.rotate(gira);
        ctx.translate(-gx, -gy);
      }
      pintar(b, plano);
      // Primero desenfocada, como un reflejo; se enfoca al acercarse.
      const borroso = unscharf[tramo];
      if (borroso) pintar(borroso, { ...plano, alpha: 1 - smooth(range(t, 0.1, 0.6)) });
      giroActual = 0;
      ctx.restore();
      // Borde de luz champán, que se apaga al abrirse.
      const brillo = alphaB * (1 - range(t, 0.55, 0.85));
      if (brillo > 0.01) {
        ctx.save();
        trazar(ctx, forma, gx, gy, pw * s, ph * s, giro);
        ctx.strokeStyle = `rgba(255, 228, 200, ${0.85 * brillo})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = `rgba(240, 190, 140, ${brillo})`;
        ctx.shadowBlur = 28;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Destellos dorados y rosados: salen despedidos desde la abertura al acercarse.
    if (funkeln) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      funkeln(ctx, W, H, time, dt, 0.35 + 0.65 * Math.sin(Math.PI * t), k, gx, gy);
    }
    sucio = false;
  });
}

type Destello = { x: number; y: number; z: number; vx: number; vy: number; fase: number; rosa: boolean };

function crearFunkeln() {
  const cantidad = innerWidth < 768 ? 46 : 80;
  const destellos: Destello[] = Array.from({ length: cantidad }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: 0.25 + Math.random() * 0.75,
    vx: (Math.random() - 0.5) * 0.012,
    vy: -0.004 - Math.random() * 0.012,
    fase: Math.random() * Math.PI * 2,
    rosa: Math.random() < 0.4,
  }));
  return (ctx: CanvasRenderingContext2D, W: number, H: number, time: number, dt: number, cantidad: number, zoom: number, ox: number, oy: number) => {
    if (cantidad <= 0.01) return;
    for (const d of destellos) {
      d.x = (d.x + d.vx * dt * d.z + 1) % 1;
      d.y = (d.y + d.vy * dt * d.z + 1) % 1;
      // Los cercanos (z alto) se separan antes del centro al hacer zoom: sensación de atravesar una nube de brillo.
      const s = Math.pow(zoom, 0.3 + d.z * 0.9);
      const x = ox + (d.x * W - ox) * s;
      const y = oy + (d.y * H - oy) * s;
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
      // Parpadeo: cada destello se enciende y se apaga a su ritmo.
      const chispa = Math.pow(0.5 + 0.5 * Math.sin(time * (1.5 + d.z * 2) + d.fase), 3);
      const r = (1.2 + d.z * 3.2) * Math.min(s, 2.5) * (0.4 + chispa * 0.6);
      ctx.globalAlpha = cantidad * (0.15 + 0.85 * chispa) * (0.35 + d.z * 0.65);
      ctx.fillStyle = d.rosa ? '#ffd2cb' : '#ffe7bf';
      // Estrella de cuatro puntas.
      ctx.beginPath();
      ctx.moveTo(x, y - r * 2.2);
      ctx.quadraticCurveTo(x, y, x + r * 2.2, y);
      ctx.quadraticCurveTo(x, y, x, y + r * 2.2);
      ctx.quadraticCurveTo(x, y, x - r * 2.2, y);
      ctx.quadraticCurveTo(x, y, x, y - r * 2.2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}
