import type { ReactNode } from 'react';
import type { Escena } from '../data/escenas';

interface Props {
  escena: Escena;
  eyebrow: string;
  children: ReactNode;
}

// Una parada del recorrido. El artículo marca la distancia de scroll; el texto se queda centrado abajo.
export default function Stop({ escena, eyebrow, children }: Props) {
  return (
    <article id={escena.id} data-stop data-lugar={escena.lugar} className="stop pointer-events-none flex min-h-[220svh] flex-col justify-end">
      <div className="stop-body pointer-events-auto sticky bottom-0 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-32 pb-28 text-center md:pb-24">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-rose uppercase">{eyebrow}</p>
        {children}
      </div>
    </article>
  );
}
