import Stop from './Stop';
import NagelLeiste from './NagelLeiste';
import type { ReactNode } from 'react';
import { recorridos } from '../data/escenas';

const title = 'mt-3 text-[clamp(2.1rem,6.2svh,3rem)] leading-[0.95] md:mt-4 md:text-7xl';
const body = 'mt-[min(1.25rem,2svh)] max-w-lg text-[15px] text-creme/80 md:mt-5 md:text-lg';

// Texto de cada parada, por id de escena: así sirve para los dos órdenes del recorrido.
const textos: Record<string, { eyebrow: string; inhalt: ReactNode }> = {
  start: {
    eyebrow: 'Braids · Nails · Extensions',
    inhalt: (
      <>
        <h1 className={title}>
          Schönheit bis in die <em>Fingerspitzen</em>
        </h1>
        <p className={body}>Willkommen bei Braidz&apos;n Tips in Liechtenstein. Scroll dich hinein.</p>
      </>
    ),
  },
  studio: {
    eyebrow: 'Das Studio',
    inhalt: (
      <>
        <h2 className={title}>
          Ein Ort zum <em>Durchatmen</em>
        </h2>
        <p className={body}>Lehn dich zurück: Kaffee, gute Musik und Hände, die genau wissen, was sie tun.</p>
      </>
    ),
  },
  detail: {
    eyebrow: 'Das Detail',
    inhalt: (
      <>
        <h2 className={title}>
          Jeder Nagel ein <em>kleines Kunstwerk</em>
        </h2>
        <p className={body}>Gel, Tips, Chrome und Nail Art, präzise geformt und lange haltbar.</p>
      </>
    ),
  },
  look: {
    eyebrow: 'Dein Look',
    inhalt: (
      <>
        <h2 className={title}>
          Gemacht, um <em>aufzufallen</em>
        </h2>
        <p className={body}>Knotless Braids, Nails und Extensions: dein Look, ganz für dich gemacht.</p>
      </>
    ),
  },
};

const botones = (
  <div className="mt-[min(2rem,3.5svh)] flex flex-wrap justify-center gap-3">
    <a href="#termin" className="btn btn-rose">
      Termin anfragen
    </a>
    <a href="#leistungen" className="btn btn-glas">
      Leistungen ansehen
    </a>
  </div>
);

export default function PortalWorld({ version = 'b' }: { version?: 'a' | 'b' }) {
  const { escenas } = recorridos[version];
  return (
    <section data-world data-recorrido={version} aria-label="Eine Reise ins Studio" className="relative">
      <div data-stage className="sticky top-0 h-lvh overflow-hidden bg-kakao">
        {/* Primera escena como imagen normal: se ve al instante mientras el canvas carga las demás. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-poster
          src={escenas[0].src}
          alt=""
          aria-hidden="true"
          width={1672}
          height={941}
          fetchPriority="high"
          className="absolute inset-0 size-full scale-[1.04] object-cover transition-opacity duration-700"
        />
        <canvas data-portal aria-hidden="true" className="absolute inset-0 size-full opacity-0 transition-opacity duration-700" />

        {/* Velos cálidos: viñeta suave y degradado inferior para leer el texto. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgb(36_21_15/0.45)_100%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-kakao/90 via-kakao/35 to-transparent" />

        <div data-hint aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="text-[10px] font-semibold tracking-[0.3em] text-creme/60 uppercase">Scroll</span>
          <span className="hint-line block h-10 w-px bg-creme/50" />
        </div>

        <NagelLeiste escenas={escenas} />
      </div>

      <div className="relative z-10 -mt-[100lvh]">
        {escenas.map((e, i) => (
          <Stop key={e.id} escena={e} eyebrow={textos[e.id].eyebrow}>
            {textos[e.id].inhalt}
            {/* La última parada lleva los botones. */}
            {i === escenas.length - 1 && botones}
          </Stop>
        ))}
      </div>
    </section>
  );
}
