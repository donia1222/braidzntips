import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { farben } from '../data/farben';

// Animaciones del cuerpo. Cada una va ligada al scroll y se puede recorrer hacia atrás; ninguna se repite.

// Leistungen: abanico → fila en escritorio; baraja que se apila en el móvil.
function leistungen(reduceMotion: boolean) {
  const seccion = document.querySelector<HTMLElement>('[data-leistungen]');
  if (!seccion) return;
  const karten = gsap.utils.toArray<HTMLElement>('[data-karte]', seccion);
  const bilder = karten.map((k) => k.querySelector('[data-karte-bild]'));
  const texte = karten.map((k) => k.querySelector('[data-karte-text]'));
  const hilo = seccion.querySelector<SVGPathElement>('[data-hilo]');
  const punkt = seccion.querySelector<HTMLElement>('[data-hilo-punkt]');
  const vorteile = gsap.utils.toArray<HTMLElement>('[data-vorteil]', seccion);
  const iconos = gsap.utils.toArray<SVGPathElement>('[data-vorteil-icono]', seccion);
  gsap.set(karten, { xPercent: -50 });
  if (reduceMotion) {
    gsap.set(karten, { xPercent: (i) => [-165, -50, 65][i] });
    gsap.set([hilo, ...iconos], { strokeDashoffset: 0 });
    return;
  }
  // Al final: el hilo se dibuja y, a su paso, cada ventaja sube y traza su icono.
  gsap.set(vorteile, { autoAlpha: 0, y: 26, scale: 0.92 });
  const cierre = (tl: gsap.core.Timeline, desde: number) =>
    tl
      .to(
        hilo,
        {
          strokeDashoffset: 0,
          duration: 1,
          ease: 'none',
          // El punto de luz va en la punta del hilo (en % de su caja, que el SVG estira sin conservar proporción).
          onUpdate() {
            if (!hilo || !punkt) return;
            const p = this.progress();
            const largo = hilo.getTotalLength();
            const pt = hilo.getPointAtLength(largo * p);
            punkt.style.left = `${pt.x / 10}%`;
            punkt.style.top = `${(pt.y / 60) * 100}%`;
            punkt.style.opacity = String(p > 0.01 && p < 0.99 ? 1 : 0);
          },
        },
        desde,
      )
      .to(vorteile, { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.2, ease: 'back.out(1.6)' }, desde + 0.1)
      .to(iconos, { strokeDashoffset: 0, duration: 0.4, stagger: 0.2, ease: 'power1.inOut' }, desde + 0.2);
  const scroll = { trigger: seccion, start: 'top top', end: 'bottom bottom', scrub: 0.6 };
  const mm = gsap.matchMedia();

  mm.add('(min-width: 768px)', () => {
    // Abanico desde la base, como uñas de una mano; luego se abren en fila y aparece el texto.
    gsap.set(karten, { transformOrigin: '50% 150%', rotation: (i) => [-12, 0, 12][i], scale: 0.9 });
    gsap.set(texte, { autoAlpha: 0, y: 24 });
    const tl = gsap.timeline({ scrollTrigger: scroll, defaults: { ease: 'power2.inOut' } });
    tl.to(karten, { xPercent: (i) => [-165, -50, 65][i], rotation: 0, scale: 1, duration: 1 })
      .to(bilder, { scale: 1, duration: 1.2 }, 0)
      .to(texte, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.4, ease: 'power2.out' }, 0.75);
    cierre(tl, 1.15);
    tl.to({}, { duration: 0.3 });
  });

  mm.add('(max-width: 767px)', () => {
    // Baraja: cada tarjeta sube desde abajo y se posa sobre la anterior, que se inclina y se hunde un poco.
    gsap.set(karten.slice(1), { y: () => innerHeight, rotation: 7 });
    const tl = gsap.timeline({ scrollTrigger: scroll, defaults: { ease: 'power2.inOut' } });
    tl.to(bilder[0], { scale: 1, duration: 1 }, 0)
      .to(karten[1], { y: 0, rotation: -2, duration: 1 }, 0.3)
      .to(karten[0], { scale: 0.92, rotation: -7, yPercent: -4, duration: 1 }, 0.3)
      .to(bilder[1], { scale: 1, duration: 1 }, 0.3)
      .to(karten[2], { y: 0, rotation: 2, duration: 1 }, 1.5)
      .to(karten[1], { scale: 0.95, rotation: 5, yPercent: -2, duration: 1 }, 1.5)
      .to(bilder[2], { scale: 1, duration: 1 }, 1.5);
    cierre(tl, 2.4);
    tl.to({}, { duration: 0.3 });
  });
}

// Farbstudio: el scroll elige el tono; las muestras también. El tono nuevo se pinta encima del anterior.
function farbstudio() {
  const seccion = document.querySelector<HTMLElement>('[data-farbstudio]');
  if (!seccion) return;
  const namen = [...seccion.querySelectorAll<HTMLElement>('[data-farbe-name]')];
  const muster = [...seccion.querySelectorAll<HTMLButtonElement>('[data-muster]')];
  const lagen = [...seccion.querySelectorAll<HTMLElement>('[data-lack]')];
  let aktiv = 0;
  let oben = 1;
  const marcar = () => {
    namen.forEach((n, j) => n.toggleAttribute('data-aktiv', j % farben.length === aktiv));
    muster.forEach((m) => m.setAttribute('aria-pressed', String(Number(m.dataset.muster) === aktiv)));
  };
  const setzen = (i: number) => {
    if (i === aktiv) return;
    aktiv = i;
    seccion.style.backgroundColor = farben[i].fondo;
    const lage = lagen[i];
    // La capa sube encima de todas y vuelve a pintarse desde la base.
    lage.style.zIndex = String(++oben);
    lage.classList.remove('gemalt', 'sofort');
    void lage.offsetWidth;
    lage.classList.add('gemalt');
    marcar();
  };
  marcar();
  // Tocar una muestra la aplica hasta que el scroll pase al tono siguiente.
  muster.forEach((m) => m.addEventListener('click', () => setzen(Number(m.dataset.muster))));
  let porScroll = 0;
  ScrollTrigger.create({
    trigger: seccion,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const i = Math.min(farben.length - 1, Math.floor(self.progress * farben.length));
      if (i === porScroll) return;
      porScroll = i;
      setzen(i);
    },
  });
}

// Termin: la trenza se trenza con el scroll y enciende cada paso al llegar a él.
function termin(reduceMotion: boolean) {
  const bereich = document.querySelector<HTMLElement>('[data-zopf-bereich]');
  if (!bereich) return;
  const zopf = bereich.querySelectorAll<SVGPathElement>('[data-zopf]');
  const schritte = [...bereich.querySelectorAll<HTMLElement>('[data-schritt]')];
  if (reduceMotion) {
    gsap.set(zopf, { strokeDashoffset: 0 });
    schritte.forEach((s) => s.classList.add('is-on'));
    return;
  }
  ScrollTrigger.create({
    trigger: bereich,
    start: 'top 70%',
    end: 'bottom 55%',
    onUpdate: (self) => {
      const p = self.progress;
      zopf.forEach((z) => (z.style.strokeDashoffset = String(1 - p)));
      const alto = bereich.offsetHeight;
      schritte.forEach((s) => s.classList.toggle('is-on', p * alto >= s.offsetTop + 24));
    },
  });
}

// Pie: el esmalte sube dentro del nombre mientras se baja hasta el final de la página.
function fuss(reduceMotion: boolean) {
  const svg = document.querySelector<SVGSVGElement>('[data-wortmarke-lack]');
  const stand = svg?.querySelector<SVGGElement>('[data-lack-stand]');
  if (!svg || !stand) return;
  // De 170 (vacío, por debajo de las letras) a -20 (lleno, la onda por encima).
  const llenar = (p: number) => {
    stand.style.transform = `translateY(${170 - 190 * p}px)`;
    svg.classList.toggle('is-voll', p > 0.98);
  };
  if (reduceMotion) return llenar(1);
  ScrollTrigger.create({
    trigger: svg,
    start: 'top 95%',
    end: () => `+=${Math.max(200, document.documentElement.scrollHeight - innerHeight - (svg.getBoundingClientRect().top + scrollY - innerHeight * 0.95))}`,
    onUpdate: (self) => llenar(self.progress),
    onRefresh: (self) => llenar(self.progress),
  });
}

export function initSecciones(reduceMotion: boolean) {
  leistungen(reduceMotion);
  farbstudio();
  termin(reduceMotion);
  fuss(reduceMotion);
  // Los pins y alturas ya están: recalcular en orden.
  ScrollTrigger.sort();
  requestAnimationFrame(() => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
