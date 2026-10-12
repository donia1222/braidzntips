import { leistungen, vorteile } from '../data/leistungen';

// Hilo dorado bajo las tarjetas: una onda suave de lado a lado.
const hilo = (() => {
  let d = '';
  for (let x = 0; x <= 1000; x += 10) d += `${x ? 'L' : 'M'}${x} ${30 + Math.sin((x / 1000) * Math.PI * 4) * 22}`;
  return d;
})();

// "Leistungen": las tres tarjetas empiezan juntas en abanico, como uñas en una mano, y con el scroll se abren
// hasta quedar en fila (escritorio). En el móvil entran una tras otra y se apilan como una baraja.
export default function Leistungen() {
  return (
    <section id="leistungen" data-leistungen aria-labelledby="leistungen-titel" className="relative h-[320svh] bg-creme text-kakao">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden pt-20 pb-6 md:pt-20">
        <div className="px-6 text-center">
          <p className="text-[11px] font-semibold tracking-[0.32em] text-mokka uppercase">Leistungen</p>
          <h2 id="leistungen-titel" className="mt-2 text-[clamp(1.9rem,5svh,2.25rem)] leading-[0.95] md:mt-3 md:text-6xl">
            Alles für deinen <em>Look</em>
          </h2>
        </div>

        <div data-faecher className="relative mt-[2.5svh] h-[min(92.5vw,412px,45svh)] w-full shrink-0 md:mt-10 md:h-[min(33.75vw,500px,60svh)]">
          {leistungen.map((l, i) => (
            <article
              key={l.id}
              data-karte
              className="karte absolute top-0 left-1/2 w-[min(74vw,330px,36svh)] md:w-[min(27vw,400px,48svh)]"
              style={{ zIndex: i + 1 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] bg-blush shadow-[0_30px_60px_-25px_rgb(36_21_15/0.55)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-karte-bild src={l.bild} alt={l.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full scale-[1.15] object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-kakao/85 via-kakao/30 to-transparent" />
                <div data-karte-text className="absolute inset-x-0 bottom-0 p-5 text-creme md:p-6">
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-rose uppercase">0{i + 1}</p>
                  <h3 className="mt-1 text-3xl leading-none md:text-4xl">{l.name}</h3>
                  <p className="mt-2 text-sm leading-snug text-creme/80 max-md:[@media(max-height:680px)]:hidden">{l.text}</p>
                  <p className="mt-3 inline-block rounded-full bg-creme/15 px-3 py-1 text-xs font-semibold ring-1 ring-creme/25">{l.preis}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bajo las tarjetas: un hilo dorado se dibuja de lado a lado y a su paso aparecen las ventajas. */}
        <div data-vorteile className="relative mt-[3svh] w-full max-w-5xl px-6 md:mt-12">
          <div data-hilo-box className="absolute inset-x-6 top-1/2 h-16 -translate-y-1/2" aria-hidden="true">
            <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="size-full">
              <defs>
                <linearGradient id="hilo-verlauf" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#e7a9a0" />
                  <stop offset="0.5" stopColor="#d8b27c" />
                  <stop offset="1" stopColor="#e7a9a0" />
                </linearGradient>
              </defs>
              <path data-hilo d={hilo} pathLength={1} fill="none" stroke="url(#hilo-verlauf)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
            </svg>
            {/* Punto de luz en la punta del hilo mientras se dibuja. */}
            <span data-hilo-punkt className="absolute top-0 left-0 size-3 -translate-1/2 rounded-full bg-[#fff3df] opacity-0 shadow-[0_0_12px_4px_rgb(216_178_124/0.8)]" />
          </div>
          <ul className="relative grid grid-cols-2 gap-x-3 gap-y-[2svh] md:grid-cols-4 md:gap-12">
            {vorteile.map((v) => (
              <li key={v.text} data-vorteil className="flex items-center gap-3 rounded-full bg-creme px-4 py-[min(12px,1.4svh)] text-[13px] font-semibold md:py-3 shadow-[0_10px_30px_-18px_rgb(36_21_15/0.5)] ring-1 ring-kakao/8 md:justify-center md:text-[15px]">
                <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-mokka" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path data-vorteil-icono d={v.icono} pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
                </svg>
                <span className="leading-tight">{v.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
