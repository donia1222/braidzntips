import type { CSSProperties } from 'react';
import { farben } from '../data/farben';

// Nombre del tono y muestras (se repiten en escritorio y móvil, en sitios distintos del diseño).
function Muestras({ className = '' }: { className?: string }) {
  return (
    <ul className={`flex gap-3 ${className}`} aria-label="Farben">
      {farben.map((f, i) => (
        <li key={f.id}>
          <button type="button" data-muster={i} aria-label={f.name} className="muster" style={{ background: f.lack }} />
        </li>
      ))}
    </ul>
  );
}

function Namen({ grande }: { grande: boolean }) {
  return farben.map((f, i) => (
    <div key={f.id} data-farbe-name className="farbe-name absolute inset-0" data-aktiv={i === 0 ? '' : undefined}>
      <p className={`font-display italic ${grande ? 'text-5xl lg:text-6xl' : 'text-4xl'}`}>{f.name}</p>
      <p className={`text-kakao/70 ${grande ? 'mt-3 text-lg' : 'mt-2 text-sm'}`}>{f.text}</p>
    </div>
  ));
}

// "Farbstudio": un probador de esmaltes sobre una foto real. Las uñas de la foto son blancas; encima, una capa por
// tono se multiplica sobre ellas (conserva sombras) recortada con la máscara de las uñas, y los brillos originales van
// por encima. Al cambiar de tono, el esmalte nuevo se pinta de la base a la punta. Lo eligen el scroll o las muestras.
export default function Farbstudio() {
  return (
    <section data-farbstudio aria-labelledby="farben-titel" className="relative h-[420svh] text-kakao" style={{ backgroundColor: farben[0].fondo }}>
      <div className="sticky top-0 grid h-svh grid-rows-[auto_1fr_auto] items-center gap-4 overflow-hidden px-6 pt-24 pb-8 md:grid-cols-[1fr_1fr] md:grid-rows-1 md:gap-16 md:px-16 md:pt-0 md:pb-0">
        <div className="text-center md:order-2 md:text-left">
          <p className="text-[11px] font-semibold tracking-[0.32em] text-mokka uppercase">Farbstudio</p>
          <h2 id="farben-titel" className="mt-3 text-4xl leading-[0.95] md:text-6xl">
            Finde deine <em>Farbe</em>
          </h2>
          <p className="mt-4 hidden max-w-sm text-base text-kakao/65 md:block">Scroll weiter oder tippe auf eine Farbe: So sieht sie auf echten Nägeln aus.</p>
          <div className="relative mt-8 hidden h-28 md:block">
            <Namen grande />
          </div>
          <Muestras className="mt-6 hidden md:flex" />
        </div>

        <div className="relative mx-auto aspect-square h-full max-h-[min(86vw,46svh)] md:order-1 md:max-h-[min(42vw,76svh)]">
          <div className="hand-rahmen relative size-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/escenas/farbstudio/hand.webp"
              alt="Eine Hand mit langen Mandelnägeln, die je nach gewählter Farbe lackiert sind"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
            {/* Las capas se tapan entre ellas con normalidad; solo el conjunto se multiplica sobre la foto. */}
            <div aria-hidden="true" className="absolute inset-0 mix-blend-multiply">
            {farben.map((f, i) => (
              <div
                key={f.id}
                data-lack={i}
                aria-hidden="true"
                className={`lack-lage absolute inset-0 ${i === 0 ? 'gemalt sofort' : ''}`}
                style={{ background: f.lack, zIndex: i === 0 ? 1 : 0 } as CSSProperties}
              />
            ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/escenas/farbstudio/glanz.png" alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute inset-0 z-10 size-full object-cover" />
            {/* Un destello recorre las uñas de vez en cuando. */}
            <div aria-hidden="true" className="glanz-lauf pointer-events-none absolute inset-0 z-10" />
          </div>
        </div>

        {/* Móvil: nombre y muestras debajo de la mano. */}
        <div className="text-center md:hidden">
          <div className="relative h-[4.5rem]">
            <Namen grande={false} />
          </div>
          <Muestras className="mt-3 justify-center" />
        </div>
      </div>
    </section>
  );
}
