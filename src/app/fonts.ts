import { Bodoni_Moda, Manrope } from 'next/font/google';

// Titulares: Bodoni, de revista de moda. Texto: Manrope, limpia y joven.
export const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
});

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});
