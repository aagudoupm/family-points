// Family Points — iconos propios dibujados a mano (SVG), con el trazo grueso del avatar.
// Sustituyen al emoji 3D de Microsoft con el mismo carácter: emo('⭐') usa este dibujo si existe.
// Las claves van sin el selector de variación (U+FE0F).
(function (root) {
  'use strict';
  const K = '#1D1240', SW = 'stroke="' + K + '" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"';
  const grad = (id, a, b) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>';
  const shine = (x, y, rx, ry, r) => '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" opacity=".6" transform="rotate(' + (r == null ? -25 : r) + ' ' + x + ' ' + y + ')"/>';
  const svg = (body, defs) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' + (defs ? '<defs>' + defs + '</defs>' : '') + body + '</svg>';
  const RAW = {
    '⭐': svg('<path d="M32 5 L39.6 22.2 L58 23.8 L44 36 L48.2 54.2 L32 44.6 L15.8 54.2 L20 36 L6 23.8 L24.4 22.2Z" fill="url(#g)" ' + SW + '/>' + shine(25, 27, 5, 2.6), grad('g', '#FFE680', '#FFAE00')),
    '🪙': svg('<circle cx="32" cy="34" r="25" fill="#E39200" ' + SW + '/><circle cx="32" cy="31" r="25" fill="url(#g)" ' + SW + '/><circle cx="32" cy="31" r="17" fill="none" stroke="#E39200" stroke-width="3"/>' +
      '<path d="M32 21 L35 28 L42 28.5 L36.6 33 L38.4 40 L32 36.2 L25.6 40 L27.4 33 L22 28.5 L29 28Z" fill="#FFF3B0" stroke="#E39200" stroke-width="2" stroke-linejoin="round"/>' + shine(20, 18, 5, 2.5), grad('g', '#FFE680', '#FFC21A')),
    '✈': svg('<path d="M14 28 L9 12 L18 12 L27 27Z" fill="#FF5A8A" ' + SW + '/>' +
      '<path d="M7 34 C7 29 12 27 20 27 L47 27 C55 27 60 30.5 60 33.5 C60 36.5 55 39 47 39 L17 39 C11 39 7 37.5 7 34Z" fill="#fff" ' + SW + '/>' +
      '<path d="M50 28 C55 28.5 58.5 31 59.5 33 L50 33Z" fill="#2E8BFF"/><path d="M29 35 L20 52 L29 52 L42 35Z" fill="#2E8BFF" ' + SW + '/>' +
      '<circle cx="26" cy="32" r="2.2" fill="#2E8BFF"/><circle cx="33" cy="32" r="2.2" fill="#2E8BFF"/><circle cx="40" cy="32" r="2.2" fill="#2E8BFF"/>'),
    '👑': svg('<path d="M10 46 L7 18 L21 29 L32 10 L43 29 L57 18 L54 46Z" fill="url(#g)" ' + SW + '/><rect x="9" y="44" width="46" height="11" rx="4" fill="#FFAE00" ' + SW + '/>' +
      '<circle cx="32" cy="49.5" r="3.6" fill="#FF3D6E" stroke="' + K + '" stroke-width="2.5"/><circle cx="20" cy="49.5" r="2.6" fill="#2E8BFF" stroke="' + K + '" stroke-width="2"/><circle cx="44" cy="49.5" r="2.6" fill="#2E8BFF" stroke="' + K + '" stroke-width="2"/>' +
      '<circle cx="7" cy="17" r="3" fill="#FFE680" ' + SW + '/><circle cx="32" cy="9" r="3" fill="#FFE680" ' + SW + '/><circle cx="57" cy="17" r="3" fill="#FFE680" ' + SW + '/>' + shine(20, 34, 4, 2), grad('g', '#FFE680', '#FFB000')),
    '🔒': svg('<path d="M20 30 L20 22 C20 14 25 9 32 9 C39 9 44 14 44 22 L44 30" fill="none" stroke="' + K + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M20 30 L20 22 C20 14 25 9 32 9 C39 9 44 14 44 22 L44 30" fill="none" stroke="#B9C2D6" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="12" y="28" width="40" height="29" rx="8" fill="url(#g)" ' + SW + '/><circle cx="32" cy="40" r="4" fill="' + K + '"/><path d="M32 42 L32 49" stroke="' + K + '" stroke-width="4" stroke-linecap="round"/>' + shine(20, 33, 4, 2, 0),
      grad('g', '#FFD95A', '#F2A300')),
    '🃏': svg('<rect x="10" y="12" width="32" height="44" rx="6" fill="#9B4DFF" transform="rotate(-12 26 34)" ' + SW + '/>' +
      '<rect x="22" y="8" width="32" height="44" rx="6" fill="#fff" transform="rotate(8 38 30)" ' + SW + '/>' +
      '<path d="M38 20 L41 27 L48 27.5 L42.6 32 L44.4 39 L38 35.2 L31.6 39 L33.4 32 L28 27.5 L35 27Z" fill="#FFC21A" stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round" transform="rotate(8 38 30)"/>')
  };
  const OWN = {};
  for (const k in RAW) OWN[k] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(RAW[k]);
  if (typeof module !== 'undefined' && module.exports) module.exports = OWN;
  else root.FP_OWN_ICONS = OWN;
})(typeof globalThis !== 'undefined' ? globalThis : this);
