// Los tres servicios. Precios de ejemplo ("ab"): los ajusta ella.
export const leistungen = [
  {
    id: 'nails',
    name: 'Nails & Tips',
    bild: '/escenas/body/nails.webp',
    alt: 'Gepflegte Hände mit langen Mandelnägeln, milchig-rosa mit goldenen French Tips',
    text: 'Gel, Acryl, Tips und Nail Art. Von natürlich-elegant bis Chrome und Glitzer.',
    preis: 'Neues Set ab CHF 75',
  },
  {
    id: 'braids',
    name: 'Braids',
    bild: '/escenas/body/braids.webp',
    alt: 'Lange Knotless Braids mit kleinen Goldringen, von hinten',
    text: 'Knotless Braids, Box Braids und Cornrows. Sauber geflochten und schonend für dein Haar.',
    preis: 'ab CHF 160',
  },
  {
    id: 'extensions',
    name: 'Extensions',
    bild: '/escenas/body/extensions.webp',
    alt: 'Lange, glänzende, gewellte Haarverlängerung in Schokobraun',
    text: 'Mehr Länge, mehr Volumen. Echthaar, perfekt auf deine Farbe abgestimmt.',
    preis: 'ab CHF 280',
  },
];

// Ventajas bajo las tarjetas, con su icono (trazos SVG en una caja de 24 × 24).
export const vorteile = [
  { text: 'Persönliche Beratung', icono: 'M4 5h16v10H9l-5 4V5Z M8 9h8 M8 12h5' },
  { text: 'Hochwertige Produkte', icono: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7L12 3Z' },
  { text: 'Schonend für Haar & Nägel', icono: 'M12 21c-4.5-3-8-6.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 4.5-3.5 8-8 11Z' },
  { text: 'Termine auch samstags', icono: 'M4 6h16v14H4V6Z M4 10h16 M8 3v5 M16 3v5 M9 15l2 2 4-4' },
];
