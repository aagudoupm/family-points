// Recorta figuras en una o varias filas (recuerdos, trofeos, baúl, iconos) detectando cada una sola, aunque no estén igual
// de separadas, y descarta los textos que la IA haya escrito debajo. Quita el fondo blanco y guarda cada figura en art/<grupo>/<id>.webp.
// Uso: node scripts/cut-row.js <imagen> <grupo> <id1,id2,...>
//   p. ej. node scripts/cut-row.js europa1.jpg recuerdos ES,DE,GB,FR,IT
// Con varias filas (p. ej. 4 filas de 5), los ids van en orden de lectura y se reparten a partes iguales entre las filas.
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const [src, group, ids] = process.argv.slice(2);
if (!src || !group || !ids) { console.error('Uso: node scripts/cut-row.js <imagen> <grupo> <ids>'); process.exit(1); }
const list = ids.split(',');
const [w, h] = execFileSync('identify', ['-format', '%w %h', src]).toString().split(' ').map(Number);
const px = execFileSync('convert', [src, '-colorspace', 'gray', '-depth', '8', 'gray:-'], { maxBuffer: 64e6 });
const ink = (x, y) => px[y * w + x] < 225;
// 1) Bandas de filas con contenido separadas por huecos; las muy bajas son textos y se descartan
const rowHas = y => { let n = 0; for (let x = 0; x < w; x++) if (ink(x, y)) n++; return n > 2; };
let bands = [], bs = -1, gap = 0, last = -1;
for (let y = 0; y <= h; y++) {
  const on = y < h && rowHas(y);
  if (on) { if (bs < 0) bs = y; last = y; gap = 0; }
  else if (bs >= 0 && ++gap > 10) { bands.push([bs, last]); bs = -1; }
}
if (bs >= 0) bands.push([bs, last]);
const tallest = Math.max(...bands.map(([p, q]) => q - p));
bands = bands.filter(([p, q]) => q - p > tallest * 0.45);
if (list.length % bands.length) { console.error(bands.length + ' filas de figuras, pero ' + list.length + ' ids no se reparten igual'); process.exit(1); }
const per = list.length / bands.length;
// 2) En cada banda, columnas con contenido → tramos separados por huecos
const pieces = [];
bands.forEach(([y0, y1], bi) => {
  const colHas = x => { let n = 0; for (let y = y0; y <= y1; y++) if (ink(x, y)) n++; return n > 1; };
  let runs = [], start = -1;
  for (let x = 0; x <= w; x++) {
    const on = x < w && colHas(x);
    if (on && start < 0) start = x;
    if (!on && start >= 0) { runs.push([start, x - 1]); start = -1; }
  }
  runs = runs.filter(r => r[1] - r[0] > 4);
  // Si hay más tramos que figuras, se juntan los más cercanos (una figura con partes separadas)
  while (runs.length > per) {
    let best = 0;
    for (let i = 1; i < runs.length - 1; i++) if (runs[i + 1][0] - runs[i][1] < runs[best + 1][0] - runs[best][1]) best = i;
    runs.splice(best, 2, [runs[best][0], runs[best + 1][1]]);
  }
  if (runs.length !== per) { console.error('Fila ' + (bi + 1) + ': se esperaban ' + per + ' figuras y hay ' + runs.length); process.exit(1); }
  runs.forEach((r, k) => pieces.push({ a: r[0], b: r[1], y0, y1, prev: k ? runs[k - 1][1] : null, next: k < runs.length - 1 ? runs[k + 1][0] : null }));
});
const out = path.join(__dirname, '..', 'art', group);
fs.mkdirSync(out, { recursive: true });
pieces.forEach(({ a, b, y0, y1, prev, next }, k) => {
  // Margen de hasta 6 px, sin pasar de la mitad del hueco con la figura vecina
  const padL = prev != null ? Math.min(6, Math.floor((a - prev) / 2)) : 6, padR = next != null ? Math.min(6, Math.floor((next - b) / 2)) : 6;
  const x = Math.max(0, a - padL), cw = Math.min(w, b + 1 + padR) - x, top = Math.max(0, y0 - 6), ch = Math.min(h, y1 + 7) - top;
  execFileSync('convert', [src, '-crop', `${cw}x${ch}+${x}+${top}`, '+repage', '-bordercolor', 'white', '-border', '4', '-alpha', 'set',
    '-fuzz', '12%', '-fill', 'none', '-draw', 'color 0,0 floodfill', '-shave', '4x4', '-trim', '+repage',
    '-resize', '480x480', '-background', 'none', '-gravity', 'south', '-extent', '512x512', '-quality', '85', path.join(out, list[k] + '.webp')]);
  console.log('art/' + group + '/' + list[k] + '.webp  (x ' + a + '–' + b + ', y ' + y0 + '–' + y1 + ')');
});
