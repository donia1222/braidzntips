// Pie: una última llamada a pedir cita y el nombre en grande, que primero es solo un contorno y se llena de esmalte
// rosa dorado al bajar, como un líquido con la superficie ondulando. Lleno, un brillo lo recorre de vez en cuando.

const NAME = "Braidz'n Tips";
// El nombre con la 'n en cursiva, como en la cabecera.
const Nombre = () => (
  <>
    Braidz<tspan fontStyle="italic">&apos;n</tspan> Tips
  </>
);

// Superficie del esmalte: una onda suave del doble de ancho que el nombre, para desplazarla en bucle.
const onda = (() => {
  let d = 'M0 40';
  for (let x = 0; x <= 2000; x += 20) d += `L${x} ${40 + Math.sin((x / 250) * Math.PI * 2) * 7}`;
  return `${d}L2000 400L0 400Z`;
})();

export default function Fuss() {
  return (
    <footer data-fuss className="relative overflow-hidden bg-kakao px-6 pt-16 pb-8 text-creme md:px-16 md:pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-6 border-t border-creme/12 pt-14 md:flex-row md:items-end md:justify-between md:pt-20" data-reveal>
          <h2 className="text-4xl leading-[0.95] md:text-6xl">
            Bereit für deinen <em>neuen Look?</em>
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href="#termin" className="btn btn-rose">
              Termin anfragen
            </a>
            <a href="#termin" className="btn btn-glas">
              @braidzntips
            </a>
          </div>
        </div>

        <svg data-wortmarke-lack viewBox="0 0 1000 200" className="mt-14 block w-full md:mt-20" role="img" aria-label={NAME}>
          <defs>
            <clipPath id="name-form">
              <text x="500" y="160" textAnchor="middle" textLength="990" lengthAdjust="spacingAndGlyphs" className="wortmarke-text">
                <Nombre />
              </text>
            </clipPath>
            <linearGradient id="lack-verlauf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6d3c4" />
              <stop offset="0.45" stopColor="#e7a9a0" />
              <stop offset="1" stopColor="#c98a63" />
            </linearGradient>
            <linearGradient id="lack-glanz" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Contorno de las letras, siempre visible. */}
          <text
            x="500"
            y="160"
            textAnchor="middle"
            textLength="990"
            lengthAdjust="spacingAndGlyphs"
            className="wortmarke-text"
            fill="none"
            stroke="rgb(248 239 232 / 0.35)"
            strokeWidth="1.2"
          >
            <Nombre />
          </text>
          <g clipPath="url(#name-form)">
            {/* El esmalte: sube con el scroll (data-lack-stand) y su superficie ondula sin parar. */}
            <g data-lack-stand style={{ transform: 'translateY(170px)' }}>
              <path className="lack-welle lack-welle-hinten" d={onda} fill="#c98a63" opacity="0.55" />
              <path className="lack-welle" d={onda} fill="url(#lack-verlauf)" transform="translate(0 6)" />
            </g>
            <rect className="lack-glanz" x="-300" y="0" width="220" height="200" fill="url(#lack-glanz)" transform="skewX(-20)" />
          </g>
        </svg>

        <div className="mt-10 flex flex-col gap-4 border-t border-creme/12 pt-6 text-sm text-creme/60 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-3">
            <svg viewBox="0 0 20 40" className="h-6 w-3 text-rose" aria-hidden="true">
              <path d="M3 2C17 10 3 18 17 26S3 34 10 38M17 2C3 10 17 18 3 26S17 34 10 38" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Braids · Nails · Extensions · Liechtenstein
          </p>
          <nav className="flex gap-6" aria-label="Fusszeile">
            <a href="#leistungen" className="hover:text-creme">
              Leistungen
            </a>
            <a href="#termin" className="hover:text-creme">
              Termin
            </a>
            <a href="#start" className="hover:text-creme">
              Nach oben
            </a>
          </nav>
          <p>© 2026 braidzntips.li · Website von Lweb</p>
        </div>
      </div>
    </footer>
  );
}
