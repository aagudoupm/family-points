// Family Points — personajes fijos (8 chicos y 8 chicas) y rangos del viaje.
// Cada niño elige un personaje. Lo que cambia con el viaje es el rango (uno por continente), que se ve en el marco del retrato.
// Mientras no haya ilustración (art/personajes/<id>.webp, ver art.js), se dibuja con avatar.js usando `look`.
// `desc` sirve para pedir la ilustración a la IA de imágenes.
(function (root) {
  'use strict';
  const P = (id, name, g, role, desc, color, look) => ({ id, name, g, role, desc, color, look: Object.assign({ g }, look) });
  const CHARACTERS = [
    P('leo', 'Leo', 'boy', 'el explorador', 'pelo castaño de punta, ojos marrones, piel clara, mochila y brújula', '#FF7A3D', { hair: 'pincho', hairColor: 'castano', eyes: 'marron', skin: 1 }),
    P('hugo', 'Hugo', 'boy', 'el deportista', 'pelo rubio rizado, ojos azules, piel muy clara, balón de fútbol', '#2E8BFF', { hair: 'rizado', hairColor: 'rubio', eyes: 'azul', skin: 0 }),
    P('omar', 'Omar', 'boy', 'el inventor', 'pelo negro corto, gafas redondas, piel morena, llave inglesa y un pequeño robot', '#8B45FF', { hair: 'corto', hairColor: 'negro', eyes: 'marron', skin: 3 }),
    P('kenji', 'Kenji', 'boy', 'el fotógrafo', 'pelo negro con flequillo, ojos marrones, piel clara, cámara de fotos', '#18C3B0', { hair: 'flequillo', hairColor: 'negro', eyes: 'marron', skin: 1 }),
    P('marco', 'Marco', 'boy', 'el cocinero', 'pelo pelirrojo corto, pecas, ojos verdes, gorro de cocinero pequeño', '#FF4F5E', { hair: 'corto', hairColor: 'pelirrojo', eyes: 'verde', skin: 0 }),
    P('dani', 'Dani', 'boy', 'el músico', 'pelo castaño claro rizado, ojos avellana, piel media, guitarra', '#FFB300', { hair: 'rizado', hairColor: 'claro', eyes: 'avellana', skin: 2 }),
    P('bruno', 'Bruno', 'boy', 'el científico', 'pelo castaño con flequillo, ojos grises, piel clara, bata y lupa', '#3FA34D', { hair: 'flequillo', hairColor: 'castano', eyes: 'gris', skin: 1 }),
    P('kofi', 'Kofi', 'boy', 'el guía de safari', 'pelo negro rizado muy corto, ojos marrones, piel oscura, prismáticos', '#E39200', { hair: 'rizado', hairColor: 'negro', eyes: 'marron', skin: 4 }),
    P('sofia', 'Sofía', 'girl', 'la aventurera', 'coleta castaña, ojos verdes, piel clara, mapa enrollado', '#FF4FA3', { hair: 'coleta', hairColor: 'castano', eyes: 'verde', skin: 1 }),
    P('vera', 'Vera', 'girl', 'la astrónoma', 'melena rubia, ojos azules, piel muy clara, telescopio pequeño', '#2E8BFF', { hair: 'melena', hairColor: 'rubio', eyes: 'azul', skin: 0 }),
    P('aitana', 'Aitana', 'girl', 'la artista', 'trenzas pelirrojas, pecas, ojos verdes, pincel y paleta de colores', '#9B4DFF', { hair: 'trenzas', hairColor: 'pelirrojo', eyes: 'verde', skin: 0 }),
    P('nora', 'Nora', 'girl', 'la deportista', 'moño castaño claro, ojos avellana, piel media, patín', '#18C3B0', { hair: 'mono', hairColor: 'claro', eyes: 'avellana', skin: 2 }),
    P('amaia', 'Amaia', 'girl', 'la bióloga', 'melena negra, ojos marrones, piel clara, lupa y una mariposa', '#3FA34D', { hair: 'melena', hairColor: 'negro', eyes: 'marron', skin: 1 }),
    P('lina', 'Lina', 'girl', 'la exploradora del desierto', 'rizos largos negros, ojos marrones, piel morena, pañuelo y cantimplora', '#FFB300', { hair: 'rizos', hairColor: 'negro', eyes: 'marron', skin: 3 }),
    P('zoe', 'Zoe', 'girl', 'la inventora', 'coleta rosa, ojos grises, piel clara, gafas de aviador en la frente', '#FF7A3D', { hair: 'coleta', hairColor: 'rosa', eyes: 'gris', skin: 1 }),
    P('ayo', 'Ayo', 'girl', 'la cantante', 'trenzas negras, ojos marrones, piel oscura, micrófono', '#FF4F5E', { hair: 'trenzas', hairColor: 'negro', eyes: 'marron', skin: 4 })
  ];
  // Rangos: uno por continente (en el orden del viaje). Cada uno con el color de su marco.
  const RANKS = [
    { id: 'turista', boy: 'Turista', girl: 'Turista', color: '#CD7F32', light: '#F3C08C' },
    { id: 'explorador', boy: 'Explorador', girl: 'Exploradora', color: '#9AA6BC', light: '#E4E9F2' },
    { id: 'aventurero', boy: 'Aventurero', girl: 'Aventurera', color: '#F2A900', light: '#FFE38A' },
    { id: 'trotamundos', boy: 'Trotamundos', girl: 'Trotamundos', color: '#16A37F', light: '#9BEBD3' },
    { id: 'granviajero', boy: 'Gran viajero', girl: 'Gran viajera', color: '#7A4DFF', light: '#D6C6FF' }
  ];
  // Rango según el índice del país (0..49): 10 países por continente
  const rankFor = countryIndex => RANKS[Math.min(RANKS.length - 1, Math.floor(Math.max(0, countryIndex) / 10))];
  const api = { CHARACTERS, RANKS, rankFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FP_CHARACTERS = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
