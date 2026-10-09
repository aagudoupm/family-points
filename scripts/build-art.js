// Genera art.js con las ilustraciones que existen en art/ (personajes, recuerdos, trofeos y baúl).
// Nombres: art/personajes/<id del personaje>.webp · art/recuerdos/<código del país>.webp · art/trofeos/<id del continente>.webp
//          art/baul/cerrado.webp y art/baul/abierto.webp · art/iconos/<código del emoji sin FE0F>.webp (p. ej. 2b50 = ⭐) · art/mapa/mundo.webp (fondo del mapa del mundo). Lo que falte se dibuja con el dibujo provisional.
// Uso: node scripts/build-art.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), dir = path.join(root, 'art');
const out = {};
for (const group of ['personajes', 'recuerdos', 'trofeos', 'baul', 'iconos', 'mapa']) {
  out[group] = {};
  const d = path.join(dir, group);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).sort()) {
    const m = /^([A-Za-z0-9_-]+)\.(webp|png|jpg)$/.exec(f);
    if (m) out[group][m[1]] = 'art/' + group + '/' + f;
  }
}
fs.writeFileSync(path.join(root, 'art.js'),
  '// Generado por scripts/build-art.js — no editar a mano. Ilustraciones disponibles en art/.\nwindow.FP_ART = ' + JSON.stringify(out) + ';\n');
const n = Object.values(out).reduce((a, g) => a + Object.keys(g).length, 0);
console.log('art.js: ' + n + ' ilustraciones');
// Lista de archivos para publicar (build-standalone y el Artifact)
module.exports = Object.values(out).flatMap(g => Object.values(g));
