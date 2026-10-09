// Recorta una fila de figuras (recuerdos, trofeos, baúl) detectando cada una sola, aunque no estén igual de separadas,
// y descarta los textos que la IA haya escrito debajo. Quita el fondo blanco y guarda cada figura en art/<grupo>/<id>.webp.
// Uso: node scripts/cut-row.js <imagen> <grupo> <id1,id2,...>
//   p. ej. node scripts/cut-row.js europa1.jpg recuerdos ES,DE,GB,FR,IT
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const [src, group, ids] = process.argv.slice(2);
if (!src || !group || !ids) { console.error('Uso: node scripts/cut-row.js <imagen> <grupo> <ids>'); process.exit(1); }
const list = ids.split(',');
const [w, h] = execFileSync('identify', ['-format', '%w %h', src]).toString().split(' ').map(Number);
const px = execFileSync('convert', [src, '-colorspace', 'gray', '-depth', '8', 'gray:-'], { maxBuffer: 64e6 });
const ink = (x, y) => px[y * w + x] < 225;
// 1) Banda de las figuras: el primer bloque de filas con contenido (los textos van debajo, tras un hueco)
const rowHas = y => { let n = 0; for (let x = 0; x < w; x++) if (ink(x, y)) n++; return n > 2; };
let y0 = 0; while (y0 < h && !rowHas(y0)) y0++;
let y1 = y0, gap = 0;
for (let y = y0; y < h; y++) { if (rowHas(y)) { y1 = y; gap = 0; } else if (++gap > 10) break; }
// 2) Columnas con contenido dentro de esa banda → tramos separados por huecos
const colHas = x => { let n = 0; for (let y = y0; y <= y1; y++) if (ink(x, y)) n++; return n > 1; };
let runs = [], start = -1;
for (let x = 0; x <= w; x++) {
  const on = x < w && colHas(x);
  if (on && start < 0) start = x;
  if (!on && start >= 0) { runs.push([start, x - 1]); start = -1; }
}
runs = runs.filter(r => r[1] - r[0] > 4);
// Si hay más tramos que figuras, se juntan los más cercanos (una figura con partes separadas)
while (runs.length > list.length) {
  let best = 0;
  for (let i = 1; i < runs.length - 1; i++) if (runs[i + 1][0] - runs[i][1] < runs[best + 1][0] - runs[best][1]) best = i;
  runs.splice(best, 2, [runs[best][0], runs[best + 1][1]]);
}
if (runs.length !== list.length) { console.error('Se esperaban ' + list.length + ' figuras y hay ' + runs.length); process.exit(1); }
const out = path.join(__dirname, '..', 'art', group);
fs.mkdirSync(out, { recursive: true });
runs.forEach(([a, b], k) => {
  // Margen de hasta 6 px, sin pasar de la mitad del hueco con la figura vecina
  const padL = k ? Math.min(6, Math.floor((a - runs[k - 1][1]) / 2)) : 6, padR = k < runs.length - 1 ? Math.min(6, Math.floor((runs[k + 1][0] - b) / 2)) : 6;
  const x = Math.max(0, a - padL), cw = Math.min(w, b + 1 + padR) - x, top = Math.max(0, y0 - 6), ch = Math.min(h, y1 + 7) - top;
  execFileSync('convert', [src, '-crop', `${cw}x${ch}+${x}+${top}`, '+repage', '-bordercolor', 'white', '-border', '4', '-alpha', 'set',
    '-fuzz', '12%', '-fill', 'none', '-draw', 'color 0,0 floodfill', '-shave', '4x4', '-trim', '+repage',
    '-resize', '480x480', '-background', 'none', '-gravity', 'south', '-extent', '512x512', '-quality', '85', path.join(out, list[k] + '.webp')]);
  console.log('art/' + group + '/' + list[k] + '.webp  (x ' + a + '–' + b + ', y ' + y0 + '–' + y1 + ')');
});
