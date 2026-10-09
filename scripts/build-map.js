// Genera world-map.js: el mapa del mundo ya proyectado (Miller) como trazados SVG, a partir de world-atlas (Natural Earth, dominio público).
// Uso: node scripts/build-map.js   (lo hacen también los builds)
// El mapa va de la longitud -168 a 192 (así Samoa y Tonga quedan junto a Oceanía) y de la latitud 80 a -56 (sin la Antártida).
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const topo = JSON.parse(fs.readFileSync(path.join(root, 'vendor/world-atlas/countries-110m.json'), 'utf8'));
const LON_MIN = -168, LAT_TOP = 80, LAT_BOT = -56, W = 1000;
const K = W / (2 * Math.PI), rad = d => d * Math.PI / 180;
const miller = lat => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * rad(lat)));
const H = Math.round((miller(LAT_TOP) - miller(LAT_BOT)) * K);
const px = lon => rad(lon - LON_MIN) * K, py = lat => (miller(LAT_TOP) - miller(Math.max(-85, Math.min(85, lat)))) * K;
// Arcos de TopoJSON: cuantizados y en diferencias
const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
const arcs = topo.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
const ring = idxs => { const pts = []; for (const i of idxs) { const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; pts.push(...(pts.length ? a.slice(1) : a)); } return pts; };
const r1 = n => Math.round(n * 10) / 10;
const paths = [];
for (const g of topo.objects.countries.geometries) {
  if (g.id === '010') continue; // Antártida
  const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
  let d = '';
  for (const poly of polys) for (const rr of poly) {
    let pts = ring(rr);
    // Países que cruzan la línea de 180° (Rusia, Fiyi) o que quedan al oeste del borde: se pasan los puntos al lado este
    // cuando la mayor parte del trazado está en el este, para que no salga una raya de lado a lado del mapa.
    const east = pts.filter(([lon]) => lon > 0 || lon < LON_MIN).length > pts.length / 2;
    if (east) pts = pts.map(([lon, lat]) => [lon < LON_MIN ? lon + 360 : lon, lat]);
    let last = '', seg = '';
    pts.forEach(([lon, lat], k) => { const p = r1(px(lon)) + ',' + r1(py(lat)); if (p !== last) { seg += (k ? 'L' : 'M') + p; last = p; } });
    d += seg + 'Z';
  }
  if (d) paths.push([g.id || '', d]);
}
fs.writeFileSync(path.join(root, 'world-map.js'),
  '// Generado por scripts/build-map.js — no editar a mano. Datos: Natural Earth vía world-atlas (ISC).\n' +
  'window.FP_MAP = ' + JSON.stringify({ w: W, h: H, lonMin: LON_MIN, latTop: LAT_TOP, K, paths }) + ';\n');
console.log('world-map.js: ' + paths.length + ' países, ' + W + '×' + H + ', ' + Math.round(fs.statSync(path.join(root, 'world-map.js')).size / 1024) + ' KB');
