import PortalWorld from '../components/PortalWorld';
import Leistungen from '../components/Leistungen';
import Farbstudio from '../components/Farbstudio';
import Termin from '../components/Termin';
import Fuss from '../components/Fuss';

// Cada parte con su propio efecto: recorrido por aberturas (espejito, ventana, uña) · abanico de tarjetas ·
// probador de esmaltes · trenza que se trenza con el scroll · brillo de esmalte sobre el nombre.
export function Seite({ version = 'a' }: { version?: 'a' | 'b' }) {
  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 pt-4 md:px-8 md:pt-6">
        <a href="#start" className="kopf-pille pointer-events-auto font-display text-xl leading-none md:text-2xl">
          Braidz<em>&apos;n</em> Tips
        </a>
        <a href="#termin" className="btn btn-rose pointer-events-auto">
          Termin
          <span className="hidden md:inline">anfragen</span>
        </a>
      </header>
      <main>
        <PortalWorld version={version} />
        <Leistungen />
        <Farbstudio />
        <Termin />
      </main>
      <Fuss />
      {/* Temporal, para comparar las dos versiones del hero. */}
      <nav aria-label="Hero-Versionen" className="fixed bottom-4 left-4 z-50 flex gap-1 rounded-full bg-kakao/80 p-1 text-xs font-semibold text-creme ring-1 ring-creme/15">
        <a href="/" className={`rounded-full px-3 py-2 ${version === 'a' ? 'bg-rose text-kakao' : ''}`}>
          Hero 1
        </a>
        <a href="/v2/" className={`rounded-full px-3 py-2 ${version === 'b' ? 'bg-rose text-kakao' : ''}`}>
          Hero 2
        </a>
      </nav>
    </>
  );
}

export default function Home() {
  return <Seite />;
}
