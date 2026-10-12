'use client';

import { useEffect, useRef } from 'react';

// Aviso "en construcción": se abre cada vez que se entra a la página. Al cerrarlo se ve todo como siempre.
// Mientras está abierto, el scroll de la página se detiene (motion.ts escucha los eventos baustelle:*).
export default function Baustelle() {
  const ref = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const modal = ref.current;
    if (!modal) return;
    const vorher = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = 'hidden';
    window.dispatchEvent(new Event('baustelle:auf'));
    boton.current?.focus();

    const schliessen = () => {
      modal.classList.add('is-zu');
      document.documentElement.style.overflow = '';
      window.dispatchEvent(new Event('baustelle:zu'));
      setTimeout(() => (modal.hidden = true), 450);
      vorher?.focus?.();
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') schliessen();
      // El foco no sale del aviso mientras está abierto.
      if (e.key === 'Tab') {
        const foco = [...modal.querySelectorAll<HTMLElement>('button')];
        const i = foco.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        foco[(i + (e.shiftKey ? foco.length - 1 : 1)) % foco.length]?.focus();
      }
    };
    modal.querySelectorAll('[data-baustelle-zu]').forEach((el) => el.addEventListener('click', schliessen));
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, []);

  return (
    <div ref={ref} className="baustelle" role="dialog" aria-modal="true" aria-labelledby="baustelle-titel" aria-describedby="baustelle-text">
      <div className="baustelle-velo" data-baustelle-zu aria-hidden="true" />
      <div className="baustelle-karte">
        <button type="button" className="baustelle-x" aria-label="Hinweis schliessen" data-baustelle-zu>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <span className="baustelle-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" />
          </svg>
        </span>
        <p className="baustelle-eyebrow">Braidz&apos;n Tips</p>
        <h2 id="baustelle-titel">
          Diese Website ist <em>im Aufbau</em>
        </h2>
        <p id="baustelle-text">
          Wir arbeiten gerade mit viel Liebe daran. Einige Inhalte, Preise und Kontaktdaten sind noch nicht endgültig. Schau dich trotzdem schon um!
        </p>
        <button ref={boton} type="button" className="btn btn-rose baustelle-ok" data-baustelle-zu>
          Trotzdem ansehen
        </button>
      </div>
    </div>
  );
}
