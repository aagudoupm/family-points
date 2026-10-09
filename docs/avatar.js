// Family Points — avatar del viajero: niño o niña dibujado en SVG, con el mismo trazo grueso que los iconos propios.
// look: { g: 'boy'|'girl', hair, hairColor, eyes, skin }. outfit: { head, eyes, neck, back, top, feet } (ids de ITEMS).
// La ropa empieza siendo básica (camiseta del color del miembro, pantalón y zapatillas) y las prendas se desbloquean
// por nivel (país) y se compran con monedas.
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

  // ── Ropa que se desbloquea con los países (lv = nivel en el que se desbloquea)
  const ITEMS = [
    { id: 'gorra', n: 'Gorra', slot: 'head', lv: 2, p: 30, r: 'common',
      front: () => '<path d="M58 40 C72 35 93 35 101 42 C93 47 72 47 58 45Z" fill="#C93636" ' + S() + '/><path d="M31 41 C31 23 44 14 60 14 C76 14 89 23 89 41Z" fill="#FF4F4F" ' + S() + '/><circle cx="60" cy="14" r="3" fill="#FF4F4F" ' + S(2.5) + '/><path d="M40 26 C44 21 50 19 55 19" stroke="#fff" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/>' },
    { id: 'mochila', n: 'Mochila', slot: 'back', lv: 4, p: 40, r: 'common',
      back: () => '<rect x="29" y="88" width="62" height="36" rx="11" fill="#FFAE00" ' + S() + '/>',
      front: () => '<path d="M46 85 L44 114 M74 85 L76 114" stroke="' + K + '" stroke-width="7" stroke-linecap="round"/><path d="M46 85 L44 114 M74 85 L76 114" stroke="#E08A00" stroke-width="3.5" stroke-linecap="round"/>' },
    { id: 'bufanda', n: 'Bufanda', slot: 'neck', lv: 6, p: 40, r: 'common',
      front: () => '<path d="M66 86 L74 106 L66 108 L60 88Z" fill="#E0306A" ' + S() + '/><path d="M43 80 C52 87 68 87 77 80 L79 88 C69 95 51 95 41 88Z" fill="#FF4F7A" ' + S() + '/><path d="M48 87 L48 91 M56 89 L56 93 M64 89 L64 93 M72 87 L72 91" stroke="#fff" stroke-width="2" opacity=".6"/>' },
    { id: 'sudadera', n: 'Sudadera', slot: 'top', lv: 9, p: 60, r: 'rare', color: '#8B45FF' },
    { id: 'gafas', n: 'Gafas de sol', slot: 'eyes', lv: 11, p: 60, r: 'rare',
      front: () => '<rect x="39" y="48" width="19" height="14" rx="6" fill="' + K + '"/><rect x="62" y="48" width="19" height="14" rx="6" fill="' + K + '"/><path d="M57 53 L63 53" ' + S(3) + '/><path d="M43 52 L48 51 M66 52 L71 51" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>' },
    { id: 'sombrero', n: 'Sombrero', slot: 'head', lv: 15, p: 80, r: 'rare',
      front: () => '<ellipse cx="60" cy="35" rx="45" ry="9" fill="#E8B04A" ' + S() + '/><path d="M39 35 C39 17 47 10 60 10 C73 10 81 17 81 35Z" fill="#F2C462" ' + S() + '/><path d="M40 29 L80 29" stroke="#C93636" stroke-width="5"/>' },
    { id: 'salacot', n: 'Sombrero de explorador', slot: 'head', lv: 21, p: 100, r: 'epic',
      front: () => '<ellipse cx="60" cy="38" rx="41" ry="8" fill="#D9C99A" ' + S() + '/><path d="M31 38 C31 18 45 8 60 8 C75 8 89 18 89 38Z" fill="#EFE3BC" ' + S() + '/><path d="M32 32 L88 32" stroke="#7A5B2E" stroke-width="5"/><path d="M42 20 C47 15 53 13 58 13" stroke="#fff" stroke-width="3" opacity=".6" fill="none" stroke-linecap="round"/>' },
    { id: 'botas', n: 'Botas de explorador', slot: 'feet', lv: 24, p: 90, r: 'rare' },
    { id: 'camara', n: 'Cámara de fotos', slot: 'neck', lv: 31, p: 120, r: 'epic',
      front: () => '<path d="M48 82 L54 98 M72 82 L66 98" stroke="' + K + '" stroke-width="2.5"/><rect x="49" y="96" width="22" height="15" rx="4" fill="#3B3F55" ' + S(3) + '/><circle cx="60" cy="103.5" r="5" fill="#9ED0FF" ' + S(2.5) + '/><rect x="64" y="93" width="5" height="4" rx="1" fill="#3B3F55" ' + S(2) + '/>' },
    { id: 'buceo', n: 'Gafas de buceo', slot: 'eyes', lv: 41, p: 120, r: 'epic',
      front: () => '<path d="M29 54 C40 50 80 50 91 54" stroke="#2E8BFF" stroke-width="5" fill="none"/><rect x="37" y="45" width="46" height="21" rx="10" fill="#9EE2FF" fill-opacity=".75" ' + S() + '/><path d="M43 50 L50 49" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>' },
    { id: 'capa', n: 'Capa de gran viajero', slot: 'back', lv: 46, p: 250, r: 'legend',
      back: () => '<path d="M39 86 L22 142 C40 149 80 149 98 142 L81 86Z" fill="#D62F4F" ' + S() + '/><path d="M30 130 C44 136 76 136 90 130" stroke="#FFD43B" stroke-width="3" fill="none"/>',
      front: () => '<path d="M40 84 L50 92 L60 86 L70 92 L80 84" fill="none" stroke="#FFD43B" stroke-width="4" stroke-linejoin="round"/>' },
    { id: 'corona', n: 'Corona de la vuelta al mundo', slot: 'head', lv: 50, p: 400, r: 'legend',
      front: () => '<path d="M37 32 L34 9 L46 19 L60 3 L74 19 L86 9 L83 32Z" fill="#FFD43B" ' + S() + '/><rect x="36" y="29" width="48" height="9" rx="3" fill="#FFAE00" ' + S() + '/><circle cx="60" cy="33.5" r="3" fill="#FF3D6E" ' + S(2) + '/><circle cx="34" cy="8" r="2.5" fill="#FFE680" ' + S(2) + '/><circle cx="60" cy="3" r="2.5" fill="#FFE680" ' + S(2) + '/><circle cx="86" cy="8" r="2.5" fill="#FFE680" ' + S(2) + '/>' }
  ];
  const item = id => ITEMS.find(x => x.id === id);

  // ── Cuerpo
  function body(look, outfit, shirt) {
    const skin = SKINS[look.skin] || SKINS[1];
    const top = outfit.top && item(outfit.top), tc = top ? top.color : shirt, tcd = shade(tc, .22);
    const pants = '#3E5BA9';
    const boots = outfit.feet === 'botas';
    const arm = (x, rot) => '<g transform="rotate(' + rot + ' ' + (x + 6.5) + ' 88)"><rect x="' + x + '" y="86" width="13" height="32" rx="6.5" fill="' + (top ? tc : skin) + '" ' + S() + '/>' +
      (top ? '<circle cx="' + (x + 6.5) + '" cy="117" r="5.5" fill="' + skin + '" ' + S(3) + '/>' : '<rect x="' + (x - 1) + '" y="85" width="15" height="14" rx="6" fill="' + tc + '" ' + S() + '/>') + '</g>';
    const shoes = boots
      ? '<path d="M40 132 L58 132 L59 147 C59 149 57 150 55 150 L41 150 C39 150 38 149 38 147Z" fill="#8A5A2B" ' + S() + '/><path d="M62 132 L80 132 L82 147 C82 149 81 150 79 150 L65 150 C63 150 61 149 61 147Z" fill="#8A5A2B" ' + S() + '/><path d="M40 138 L58 138 M62 138 L80 138" stroke="#5E3B19" stroke-width="2.5"/>'
      : '<path d="M39 147 C39 141 42 139 49 139 C56 139 59 141 59 145 L59 147 C59 149 57 150 55 150 L42 150 C40 150 39 149 39 147Z" fill="#fff" ' + S() + '/><path d="M61 145 C61 141 64 139 71 139 C78 139 81 141 81 147 C81 149 80 150 78 150 L65 150 C63 150 61 149 61 147Z" fill="#fff" ' + S() + '/>';
    return '<rect x="41" y="117" width="38" height="11" rx="4" fill="' + pants + '" ' + S() + '/>' +
      '<rect x="43" y="120" width="15" height="24" rx="5" fill="' + pants + '" ' + S() + '/><rect x="62" y="120" width="15" height="24" rx="5" fill="' + pants + '" ' + S() + '/>' + shoes +
      arm(26, 14) + arm(81, -14) +
      '<path d="M38 92 C38 84 46 82 60 82 C74 82 82 84 82 92 L84 121 C84 124 82 126 79 126 L41 126 C38 126 36 124 36 121Z" fill="' + tc + '" ' + S() + '/>' +
      '<path d="M44 92 C44 89 46 88 49 88" stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity=".45"/>' +
      (top ? '<path d="M46 108 L74 108 L72 120 L48 120Z" fill="' + tcd + '" ' + S(2.5) + '/><path d="M41 86 C45 76 75 76 79 86 C70 82 50 82 41 86Z" fill="' + tcd + '" ' + S(3) + '/>' : '');
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
  function svg(look, outfit, shirt, opts) {
    look = look || {}; outfit = outfit || {}; opts = opts || {};
    const h = hair(look), it = s => outfit[s] && item(outfit[s]);
    const part = (s, k) => { const x = it(s); return x && x[k] ? x[k]() : ''; };
    return '<svg viewBox="' + (opts.viewBox || '0 0 120 160') + '" aria-hidden="true" overflow="' + (opts.viewBox ? 'hidden' : 'visible') + '">' +
      '<ellipse cx="60" cy="153" rx="30" ry="5" fill="rgba(29,18,64,.22)"/>' +
      h.back + part('back', 'back') + body(look, outfit, shirt || '#2E8BFF') + part('back', 'front') +
      head(look) + part('neck', 'front') + h.front + part('eyes', 'front') + part('head', 'front') + '</svg>';
  }

  // Dibujo de una prenda suelta, para la tienda
  const PREVIEW = { head: '14 0 92 52', eyes: '30 36 60 36', neck: '34 74 52 42', back: '16 80 88 70', top: '20 74 80 62', feet: '34 129 52 23' };
  function itemSvg(id) {
    const x = item(id);
    if (!x) return '';
    let inner;
    if (x.slot === 'top' || x.slot === 'feet') inner = body({ skin: 1 }, { [x.slot]: id }, '#fff');
    else inner = (x.back ? x.back() : '') + (x.front ? x.front() : '');
    return '<svg viewBox="' + PREVIEW[x.slot] + '" aria-hidden="true" overflow="' + (x.slot === 'top' || x.slot === 'feet' ? 'hidden' : 'visible') + '">' + inner + '</svg>';
  }

  const api = { svg, itemSvg, ITEMS, HAIRS, HAIR_COLORS, EYE_COLORS, SKINS, item };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FP_AVATAR = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
