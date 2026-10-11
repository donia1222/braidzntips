import type { CSSProperties } from 'react';

// "Termin": tres pasos unidos por una trenza de tres mechones que se trenza con el scroll y enciende cada paso al
// llegar. Al lado, la tarjeta de contacto con horarios y precios.

const LARGO = 1000;
// Cada mechón es una onda desfasada un tercio de vuelta respecto a los otros dos: juntos parecen una trenza.
const mechon = (j: number) => {
  let d = '';
  for (let y = 0; y <= LARGO; y += 5) {
    const x = 30 + 17 * Math.sin((y / 110) * Math.PI * 2 + (j * Math.PI * 2) / 3);
    d += `${y ? 'L' : 'M'}${x.toFixed(1)} ${y}`;
  }
  return d;
};
const mechones = [0, 1, 2].map(mechon);

const schritte = [
  { titel: 'Schreib uns', text: 'Per WhatsApp oder Instagram, am besten mit einem Foto deines Wunschlooks.' },
  { titel: 'Wir beraten dich', text: 'Länge, Form und Farbe: Wir planen alles gemeinsam, ehrlich und ohne Stress.' },
  { titel: 'Zurücklehnen & geniessen', text: 'Kaffee, Musik, Wohlfühlen. Du gehst mit einem Look, der bleibt.' },
];

const zeiten = [
  ['Di – Fr', '09:00 – 19:00'],
  ['Samstag', '09:00 – 16:00'],
  ['So & Mo', 'nach Vereinbarung'],
];

const preise = [
  ['Gel-Nägel, neues Set', 'ab 75'],
  ['Auffüllen', 'ab 55'],
  ['Knotless Braids', 'ab 160'],
  ['Cornrows', 'ab 60'],
  ['Extensions', 'ab 280'],
];

const Icono = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

export default function Termin() {
  return (
    <section id="termin" data-termin aria-labelledby="termin-titel" className="relative bg-kakao px-6 py-28 text-creme md:px-16 md:py-40">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.1fr_1fr] md:gap-20">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.32em] text-rose uppercase" data-reveal>
            Termin
          </p>
          <h2 id="termin-titel" className="mt-3 text-4xl leading-[0.95] md:text-6xl" data-reveal style={{ '--d': '80ms' } as CSSProperties}>
            In drei Schritten zu <em>deinem Look</em>
          </h2>

          <div data-zopf-bereich className="relative mt-14 pl-20 md:pl-24">
            <svg viewBox={`0 0 60 ${LARGO}`} preserveAspectRatio="none" className="absolute top-0 left-0 h-full w-12 md:w-14" aria-hidden="true">
              {mechones.map((d, j) => (
                <path key={j} d={d} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              ))}
              {mechones.map((d, j) => (
                <path
                  key={`z${j}`}
                  data-zopf
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={['#e7a9a0', '#d8b27c', '#f2ddd6'][j]}
                  strokeWidth="5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                />
              ))}
            </svg>
            <ol className="flex flex-col gap-16 md:gap-24">
              {schritte.map((s, i) => (
                <li key={s.titel} data-schritt className="schritt">
                  <p className="font-display text-6xl leading-none text-rose italic md:text-7xl">0{i + 1}</p>
                  <h3 className="mt-3 text-2xl md:text-3xl">{s.titel}</h3>
                  <p className="mt-2 max-w-sm text-base text-creme/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="md:sticky md:top-28 md:self-start" data-reveal>
          <div className="rounded-[2rem] bg-creme/[0.06] p-7 ring-1 ring-creme/12 md:p-9">
            <p className="font-display text-3xl italic">Termin anfragen</p>
            <p className="mt-2 text-sm text-creme/65">Antwort meist am selben Tag.</p>
            <div className="mt-6 grid gap-3">
              <a href="#termin" className="btn btn-rose justify-center" data-magnet>
                <Icono d="M3 21l1.7-4.6A8.5 8.5 0 1 1 8 19.6L3 21Z M9 9.5c0 3 2.5 5.5 5.5 5.5" />
                WhatsApp schreiben
              </a>
              <a href="#termin" className="btn btn-glas justify-center">
                <Icono d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z M17.5 6.5h.01" />
                @braidzntips
              </a>
            </div>

            <div className="mt-8 border-t border-creme/12 pt-6">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-rose uppercase">Öffnungszeiten</p>
              <dl className="mt-3 grid gap-1.5 text-sm">
                {zeiten.map(([tag, zeit]) => (
                  <div key={tag} className="flex justify-between gap-4">
                    <dt className="text-creme/65">{tag}</dt>
                    <dd>{zeit}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 border-t border-creme/12 pt-6">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-rose uppercase">Preise in CHF</p>
              <dl className="mt-3 grid gap-1.5 text-sm">
                {preise.map(([was, preis]) => (
                  <div key={was} className="flex items-baseline gap-2">
                    <dt className="text-creme/65">{was}</dt>
                    <span aria-hidden="true" className="flex-1 border-b border-dotted border-creme/20" />
                    <dd>{preis}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
