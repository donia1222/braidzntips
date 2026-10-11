import Stop from './Stop';
import NagelLeiste from './NagelLeiste';
import { escenas } from '../data/escenas';

const title = 'mt-4 text-5xl leading-[0.95] md:text-7xl';
const body = 'mt-5 max-w-lg text-base text-creme/80 md:text-lg';

export default function PortalWorld() {
  return (
    <section data-world aria-label="Eine Reise ins Studio" className="relative">
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

        <NagelLeiste />
      </div>

      <div className="relative z-10 -mt-[100lvh]">
        <Stop index={0} eyebrow="Braids · Nails · Extensions">
          <h1 className={title}>
            Schönheit bis in die <em>Fingerspitzen</em>
          </h1>
          <p className={body}>Willkommen bei Braidz&apos;n Tips in Liechtenstein. Scroll dich hinein.</p>
        </Stop>

        <Stop index={1} eyebrow="Das Studio">
          <h2 className={title}>
            Ein Ort zum <em>Durchatmen</em>
          </h2>
          <p className={body}>Lehn dich zurück: Kaffee, gute Musik und Hände, die genau wissen, was sie tun.</p>
        </Stop>

        <Stop index={2} eyebrow="Das Detail">
          <h2 className={title}>
            Jeder Nagel ein <em>kleines Kunstwerk</em>
          </h2>
          <p className={body}>Gel, Tips, Chrome und Nail Art, präzise geformt und lange haltbar.</p>
        </Stop>

        <Stop index={3} eyebrow="Dein Look">
          <h2 className={title}>
            Gemacht, um <em>aufzufallen</em>
          </h2>
          <p className={body}>Knotless Braids, Nails und Extensions: dein Look, ganz für dich gemacht.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#termin" className="btn btn-rose">
              Termin anfragen
            </a>
            <a href="#leistungen" className="btn btn-glas">
              Leistungen ansehen
            </a>
          </div>
        </Stop>
      </div>
    </section>
  );
}
