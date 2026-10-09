// Family Points — dibujo provisional de los personajes (SVG), con el trazo grueso de los iconos propios.
// Se usa mientras no exista la ilustración del personaje en art/personajes/. look: { g: 'boy'|'girl', hair, hairColor, eyes, skin }.
(function (root) {
  'use strict';
  const K = '#1D1240';
  const S = (w) => 'stroke="' + K + '" stroke-width="' + (w || 3.5) + '" stroke-linejoin="round" stroke-linecap="round"';

  const HAIR_COLORS = [
    { id: 'negro', n: 'Negro', c: '#2B2230' }, { id: 'castano', n: 'Castaño', c: '#6B3E26' }, { id: 'claro', n: 'Castaño claro', c: '#A86B3C' },
    { id: 'rubio', n: 'Rubio', c: '#F2C14E' }, { id: 'pelirrojo', n: 'Pelirrojo', c: '#D9572B' }, { id: 'azul', n: 'Azul', c: '#3E7BFA' }, { id: 'rosa', n: 'Rosa', c: '#FF6FB5' }
  ];
  const EYE_COLORS = [
    { id: 'marron', n: 'Marrones', c: '#7A4A2A' }, { id: 'avellana', n: 'Avellana', c: '#A0752E' }, { id: 'verde', n: 'Verdes', c: '#3FA34D' },
    { id: 'azul', n: 'Azules', c: '#3E8EF0' }, { id: 'gris', n: 'Grises', c: '#7D8A99' }
  ];
  const SKINS = ['#FFE0C7', '#F6C9A0', '#D9A06F', '#A8693F', '#6E4428'];
  const HAIRS = {
    boy: [{ id: 'corto', n: 'Corto' }, { id: 'pincho', n: 'De punta' }, { id: 'flequillo', n: 'Flequillo' }, { id: 'rizado', n: 'Rizado' }],
    girl: [{ id: 'coleta', n: 'Coleta' }, { id: 'trenzas', n: 'Trenzas' }, { id: 'melena', n: 'Melena' }, { id: 'mono', n: 'Moño' }, { id: 'rizos', n: 'Rizos largos' }]
  };
  const pick = (list, id) => (list.find(x => x.id === id) || list[0]).c;
  // Oscurece un color para sombras y cejas
  const shade = (hex, f) => {
    const n = parseInt(hex.slice(1), 16), k = 1 - f;
    const ch = s => Math.round(((n >> s) & 255) * k).toString(16).padStart(2, '0');
    return '#' + ch(16) + ch(8) + ch(0);
  };

  // ── Pelo: parte de detrás (antes de la cabeza) y parte de delante (encima)
  const curls = (from, to, step, r, ry, cy) => {
    let o = '';
    for (let a = from; a <= to; a += step) {
      const t = a * Math.PI / 180;
      o += '<circle cx="' + (60 + 31 * Math.cos(t)).toFixed(1) + '" cy="' + (cy + ry * Math.sin(t)).toFixed(1) + '" r="' + r + '"/>';
    }
    return o;
  };
  const FRONT_SMOOTH = 'M29 54 C26 30 40 18 60 18 C80 18 94 30 91 54 C88 42 76 35 60 35 C44 35 32 42 29 54Z';
  const FRONT_SIDE = 'M29 54 C26 30 40 18 60 18 C80 18 94 30 91 54 C88 44 82 36 72 33 C62 38 46 40 36 42 C33 45 31 49 29 54Z';
  function hair(look) {
    const c = pick(HAIR_COLORS, look.hairColor), d = shade(c, .28);
    const f = 'fill="' + c + '" ' + S();
    const shineH = '<path d="M42 26 C48 22 56 21 62 22" stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".45"/>';
    switch (look.hair) {
      case 'pincho': return { back: '', front: '<path d="M29 54 C27 38 31 29 37 25 L36 13 L46 19 L52 7 L60 17 L69 7 L74 19 L84 13 L83 25 C89 29 93 38 91 54 C89 46 86 41 82 38 C76 42 66 41 60 36 C54 41 44 42 38 38 C34 41 31 46 29 54Z" ' + f + '/>' + shineH };
      case 'flequillo': return { back: '', front: '<path d="M27 58 C24 30 40 17 60 17 C80 17 96 30 93 58 L88 56 C87 50 85 45 82 43 C70 46 50 46 38 43 C35 45 33 50 32 56Z" ' + f + '/>' + shineH };
      case 'rizado': return { back: '', front: '<g fill="' + c + '" ' + S(3) + '>' + curls(180, 360, 22.5, 9, 30, 48) + '</g><path d="M31 48 C34 32 46 24 60 24 C74 24 86 32 89 48 C80 40 70 38 60 38 C50 38 40 40 31 48Z" fill="' + c + '"/>' };
      case 'coleta': return {
        back: '<path d="M84 30 C101 27 107 45 103 62 C101 73 95 81 90 85 C93 70 93 56 85 44Z" ' + f + '/><circle cx="88" cy="32" r="4.5" fill="#FF4FA3" ' + S(2.5) + '/>',
        front: '<path d="' + FRONT_SIDE + '" ' + f + '/>' + shineH };
      case 'trenzas': {
        let b = '';
        [27, 93].forEach(x => { [62, 72, 82, 92].forEach(y => { b += '<circle cx="' + x + '" cy="' + y + '" r="6.5" fill="' + c + '" ' + S(3) + '/>'; }); b += '<circle cx="' + x + '" cy="100" r="3.5" fill="#FF4FA3" ' + S(2.5) + '/>'; });
        return { back: b, front: '<path d="M29 56 C26 30 40 18 60 18 C80 18 94 30 91 56 C89 44 78 34 61 33 L60 26 L59 33 C42 34 31 44 29 56Z" ' + f + '/>' + shineH };
      }
      case 'melena': return {
        back: '<path d="M26 56 C22 28 40 15 60 15 C80 15 98 28 94 56 L97 100 C90 104 82 103 78 98 L42 98 C38 103 30 104 23 100Z" fill="' + d + '" ' + S() + '/>',
        front: '<path d="' + FRONT_SIDE + '" ' + f + '/>' + shineH };
      case 'mono': return { back: '<circle cx="60" cy="15" r="11" fill="' + c + '" ' + S() + '/>', front: '<path d="' + FRONT_SMOOTH + '" ' + f + '/>' + shineH };
      case 'rizos': return {
        back: '<g fill="' + d + '" ' + S(3) + '>' + [[24, 62], [22, 76], [24, 90], [96, 62], [98, 76], [96, 90]].map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9"/>').join('') + '</g>',
        front: '<g fill="' + c + '" ' + S(3) + '>' + curls(170, 370, 20, 9, 30, 48) + '</g><path d="M31 48 C34 32 46 24 60 24 C74 24 86 32 89 48 C80 40 70 38 60 38 C50 38 40 40 31 48Z" fill="' + c + '"/>' };
      default: return { back: '', front: '<path d="M29 54 C26 30 40 18 60 18 C80 18 94 30 91 54 C89 46 86 41 82 38 C76 42 66 41 60 36 C54 41 44 42 38 38 C34 41 31 46 29 54Z" ' + f + '/>' + shineH };
    }
  }

  // ── Cuerpo
  function body(look, shirt) {
    const skin = SKINS[look.skin] || SKINS[1], pants = '#3E5BA9';
    const arm = (x, rot) => '<g transform="rotate(' + rot + ' ' + (x + 6.5) + ' 88)"><rect x="' + x + '" y="86" width="13" height="32" rx="6.5" fill="' + skin + '" ' + S() + '/>' +
      '<rect x="' + (x - 1) + '" y="85" width="15" height="14" rx="6" fill="' + shirt + '" ' + S() + '/></g>';
    const shoes = '<path d="M39 147 C39 141 42 139 49 139 C56 139 59 141 59 145 L59 147 C59 149 57 150 55 150 L42 150 C40 150 39 149 39 147Z" fill="#fff" ' + S() + '/>' +
      '<path d="M61 145 C61 141 64 139 71 139 C78 139 81 141 81 147 C81 149 80 150 78 150 L65 150 C63 150 61 149 61 147Z" fill="#fff" ' + S() + '/>';
    return '<rect x="41" y="117" width="38" height="11" rx="4" fill="' + pants + '" ' + S() + '/>' +
      '<rect x="43" y="120" width="15" height="24" rx="5" fill="' + pants + '" ' + S() + '/><rect x="62" y="120" width="15" height="24" rx="5" fill="' + pants + '" ' + S() + '/>' + shoes +
      arm(26, 14) + arm(81, -14) +
      '<path d="M38 92 C38 84 46 82 60 82 C74 82 82 84 82 92 L84 121 C84 124 82 126 79 126 L41 126 C38 126 36 124 36 121Z" fill="' + shirt + '" ' + S() + '/>' +
      '<path d="M44 92 C44 89 46 88 49 88" stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".45"/>';
  }

  function head(look) {
    const skin = SKINS[look.skin] || SKINS[1], eye = pick(EYE_COLORS, look.eyes), brow = shade(pick(HAIR_COLORS, look.hairColor), .3);
    const girl = look.g === 'girl';
    return '<rect x="53" y="76" width="14" height="10" fill="' + skin + '" ' + S() + '/>' +
      '<circle cx="30" cy="57" r="7" fill="' + skin + '" ' + S() + '/><circle cx="90" cy="57" r="7" fill="' + skin + '" ' + S() + '/>' +
      '<ellipse cx="60" cy="52" rx="31" ry="30" fill="' + skin + '" ' + S() + '/>' +
      '<ellipse cx="48" cy="55" rx="6.5" ry="7.5" fill="#fff" ' + S(2.5) + '/><ellipse cx="72" cy="55" rx="6.5" ry="7.5" fill="#fff" ' + S(2.5) + '/>' +
      '<circle cx="49" cy="56" r="4.6" fill="' + eye + '"/><circle cx="73" cy="56" r="4.6" fill="' + eye + '"/>' +
      '<circle cx="49" cy="56.5" r="2.2" fill="' + K + '"/><circle cx="73" cy="56.5" r="2.2" fill="' + K + '"/>' +
      '<circle cx="50.6" cy="54" r="1.5" fill="#fff"/><circle cx="74.6" cy="54" r="1.5" fill="#fff"/>' +
      (girl ? '<path d="M42 50 L39 47.5 M78 50 L81 47.5" ' + S(2.5) + '/>' : '') +
      '<path d="M42 45 Q48 42 54 45 M66 45 Q72 42 78 45" stroke="' + brow + '" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<path d="M52 66 Q60 74 68 66 Q60 69 52 66Z" fill="#8C2F39" ' + S(2.5) + '/>' +
      '<ellipse cx="40" cy="65" rx="5" ry="3" fill="#FF7A9A" opacity=".45"/><ellipse cx="80" cy="65" rx="5" ry="3" fill="#FF7A9A" opacity=".45"/>';
  }

  // SVG completo. opts.viewBox permite recortar (por ejemplo, solo la cabeza)
  function svg(look, shirt, opts) {
    look = look || {}; opts = opts || {};
    const h = hair(look);
    return '<svg viewBox="' + (opts.viewBox || '0 0 120 160') + '" aria-hidden="true" overflow="' + (opts.viewBox ? 'hidden' : 'visible') + '">' +
      '<ellipse cx="60" cy="153" rx="30" ry="5" fill="rgba(29,18,64,.22)"/>' +
      h.back + body(look, shirt || '#2E8BFF') + head(look) + h.front + '</svg>';
  }

  const api = { svg, HAIRS, HAIR_COLORS, EYE_COLORS, SKINS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FP_AVATAR = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
