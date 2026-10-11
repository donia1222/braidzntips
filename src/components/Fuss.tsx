// Pie: el nombre enorme, con un brillo de esmalte que lo recorre al llegar y se repite de vez en cuando.
export default function Fuss() {
  return (
    <footer data-fuss className="relative overflow-hidden bg-kakao px-6 pt-10 pb-8 text-creme md:px-16">
      <div className="mx-auto max-w-6xl border-t border-creme/12 pt-14 md:pt-20">
        <p data-wortmarke className="wortmarke font-display text-[19vw] leading-[0.85] tracking-[-0.04em] md:text-[12.5vw] md:whitespace-nowrap">
          Braidz<em>&apos;n</em> Tips
        </p>
        <div className="mt-10 flex flex-col gap-4 text-sm text-creme/60 md:flex-row md:items-center md:justify-between">
          <p>Braids · Nails · Extensions · Liechtenstein</p>
          <nav className="flex gap-6" aria-label="Fusszeile">
            <a href="#leistungen" className="hover:text-creme">Leistungen</a>
            <a href="#termin" className="hover:text-creme">Termin</a>
            <a href="#start" className="hover:text-creme">Nach oben</a>
          </nav>
          <p>© 2026 braidzntips.li · Website von Lweb</p>
        </div>
      </div>
    </footer>
  );
}
