// Recorta una imagen generada con varias figuras en cuadrícula, quita el fondo blanco y guarda cada figura en art/.
// Uso: node scripts/cut-art.js <imagen> <columnas>x<filas> <grupo> <id1,id2,...>
//   p. ej. node scripts/cut-art.js personajes1.jpg 2x2 personajes leo,hugo,omar,kenji
//          node scripts/cut-art.js europa1.png 5x1 recuerdos ES,DE,GB,FR,IT
// Necesita ImageMagick (convert). Personajes: lienzo 384×512 (3:4); el resto: 512×512.
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const [src, grid, group, ids] = process.argv.slice(2);
if (!src || !/^\d+x\d+$/.test(grid || '') || !group || !ids) { console.error('Uso: node scripts/cut-art.js <imagen> <cols>x<filas> <grupo> <ids>'); process.exit(1); }
const [cols, rows] = grid.split('x').map(Number), list = ids.split(',');
const [w, h] = execFileSync('identify', ['-format', '%w %h', src]).toString().split(' ').map(Number);
const cw = Math.floor(w / cols), chh = Math.floor(h / rows);
const out = path.join(__dirname, '..', 'art', group);
fs.mkdirSync(out, { recursive: true });
const size = group === 'personajes' ? ['372x496', '384x512'] : ['496x496', '512x512'];
list.forEach((id, k) => {
  const x = (k % cols) * cw, y = Math.floor(k / cols) * chh;
  // Relleno desde el borde: solo se quita el blanco conectado con el fondo (los blancos de dentro de la figura se conservan)
  execFileSync('convert', [src, '-crop', `${cw}x${chh}+${x}+${y}`, '+repage', '-bordercolor', 'white', '-border', '4', '-alpha', 'set',
    '-fuzz', '12%', '-fill', 'none', '-draw', 'color 0,0 floodfill', '-shave', '4x4', '-trim', '+repage',
    '-resize', size[0], '-background', 'none', '-gravity', group === 'personajes' ? 'south' : 'center', '-extent', size[1], '-quality', '85', path.join(out, id + '.webp')]);
  console.log('art/' + group + '/' + id + '.webp');
});
