import type { CSSProperties } from 'react';
import type { Escena } from '../data/escenas';

export const MANDEL = 'M12 1C15 2 22 10 22 22C22 31 18 37 12 37C6 37 2 31 2 22C2 10 9 2 12 1Z';

// Indicador de progreso: una uña por escena. Se esmaltan una a una con el scroll (la variable --f la pone portal.ts).
export default function NagelLeiste({ escenas }: { escenas: Escena[] }) {
  return (
    <div className="pointer-events-none absolute right-5 bottom-6 flex items-end gap-4 md:right-8 md:bottom-8">
      <p data-nagel-label className="hidden pb-1 text-xs font-medium tracking-[0.2em] text-creme/75 uppercase md:block">
        {escenas[0].lugar}
      </p>
      <div className="flex items-end gap-1.5">
        {escenas.map((e, i) => (
          <svg key={e.id} viewBox="0 0 24 38" className="h-7 w-[18px] md:h-8 md:w-5" style={{ marginBottom: [4, 0, 2, 7][i] }} aria-hidden="true">
            <defs>
              <clipPath id={`nagel-${i}`}>
                <path d={MANDEL} />
              </clipPath>
            </defs>
            <path d={MANDEL} fill="rgb(248 239 232 / 0.12)" stroke="rgb(248 239 232 / 0.55)" strokeWidth="1.2" />
            <g clipPath={`url(#nagel-${i})`}>
              <rect data-nagel x="0" y="0" width="24" height="38" className="nagel-lack" style={{ '--f': i === 0 ? 1 : 0 } as CSSProperties} />
              <path d="M8 8C6.5 13 6 18 6.4 24" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
}
