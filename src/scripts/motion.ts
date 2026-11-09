import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initPortal } from './portal';
import { initSecciones } from './secciones';

export function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  // En móvil la barra del navegador cambia el alto de la pantalla al hacer scroll: no recalcular todo por eso.
  ScrollTrigger.config({ ignoreMobileResize: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    const lenis = new Lenis({ autoRaf: false, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        reveal.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));

  const world = document.querySelector<HTMLElement>('[data-world]');
  if (world) initPortal(world, reduceMotion);
  initSecciones(reduceMotion);
}
