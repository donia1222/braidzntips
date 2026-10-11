import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import 'lenis/dist/lenis.css';
import '../styles/global.css';
import { bodoni, manrope } from './fonts';
import Motion from '../components/Motion';

export const metadata: Metadata = {
  title: "Braidz'n Tips · Braids, Nails & Extensions in Liechtenstein",
  description:
    "Braidz'n Tips: Knotless Braids, Gel-Nägel, Tips, Nail Art und Extensions in Liechtenstein. Termin per WhatsApp oder Instagram.",
  robots: 'noindex, follow',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#24150f',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de-CH" className={`${bodoni.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" }} />
      </head>
      <body className="min-h-svh overflow-x-clip">
        {children}
        <Motion />
      </body>
    </html>
  );
}
