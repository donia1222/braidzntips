import { leistungen } from '../data/leistungen';

// "Leistungen": las tres tarjetas empiezan juntas en abanico, como uñas en una mano, y con el scroll se abren
// hasta quedar en fila (escritorio). En el móvil entran una tras otra y se apilan como una baraja.
export default function Leistungen() {
  return (
    <section id="leistungen" data-leistungen aria-labelledby="leistungen-titel" className="relative h-[320svh] bg-creme text-kakao">
      <div className="sticky top-0 flex h-svh flex-col items-center overflow-hidden pt-24 md:pt-24">
        <div className="px-6 text-center">
          <p className="text-[11px] font-semibold tracking-[0.32em] text-mokka uppercase">Leistungen</p>
          <h2 id="leistungen-titel" className="mt-3 text-4xl leading-[0.95] md:text-6xl">
            Alles für deinen <em>Look</em>
          </h2>
        </div>

        <div data-faecher className="relative mt-6 w-full flex-1 md:mt-10">
          {leistungen.map((l, i) => (
            <article
              key={l.id}
              data-karte
              className="karte absolute top-0 left-1/2 w-[min(74vw,330px,52svh)] md:w-[min(27vw,400px,52svh)]"
              style={{ zIndex: i + 1 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] bg-blush shadow-[0_30px_60px_-25px_rgb(36_21_15/0.55)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-karte-bild src={l.bild} alt={l.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full scale-[1.15] object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-kakao/85 via-kakao/30 to-transparent" />
                <div data-karte-text className="absolute inset-x-0 bottom-0 p-5 text-creme md:p-6">
                  <p className="text-[10px] font-semibold tracking-[0.3em] text-rose uppercase">0{i + 1}</p>
                  <h3 className="mt-1 text-3xl leading-none md:text-4xl">{l.name}</h3>
                  <p className="mt-2 text-sm leading-snug text-creme/80">{l.text}</p>
                  <p className="mt-3 inline-block rounded-full bg-creme/15 px-3 py-1 text-xs font-semibold ring-1 ring-creme/25">{l.preis}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
