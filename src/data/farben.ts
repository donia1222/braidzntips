// Los tonos del probador. `lack` es el fondo CSS de la capa de esmalte (color o degradado), que se multiplica sobre
// las uñas blancas de la foto; `fondo` es el tinte de la sección.
export const farben = [
  { id: 'rose', name: 'Rosé Nude', text: 'Der Klassiker. Passt immer und zu allem.', lack: '#e2a79c', fondo: '#f6e2dc' },
  {
    id: 'pearl',
    name: 'Milky Pearl',
    text: 'Clean, zart und edel, wie frisch poliert.',
    lack: 'linear-gradient(135deg, #fdf3ee 0%, #f0d9d3 45%, #fbefe9 70%, #ecd6d0 100%)',
    fondo: '#efe8e3',
  },
  { id: 'cherry', name: 'Cherry Mocha', text: 'Für den grossen Auftritt am Abend.', lack: '#741c27', fondo: '#f1dcda' },
  {
    id: 'chrome',
    name: 'Champagne Chrome',
    text: 'Spiegelglanz wie flüssiges Gold.',
    lack: '#e2b38a',
    fondo: '#f3e7d5',
  },
  { id: 'cocoa', name: 'Cocoa Brown', text: 'Warm, erdig und elegant, das ganze Jahr.', lack: '#6a4232', fondo: '#ece0d8' },
];
