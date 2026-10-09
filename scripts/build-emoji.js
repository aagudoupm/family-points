// Copia a emoji/ los iconos 3D (Fluent Emoji 3D de Microsoft, licencia MIT) de todos los emojis que usa la app
// y genera emoji-map.js ({emoji: archivo}). Uso:
//   npm pack @lobehub/fluent-emoji-3d && tar xzf lobehub-fluent-emoji-3d-*.tgz
//   node scripts/build-emoji.js <carpeta package/assets>
// Si se añaden emojis nuevos a las listas de app.js o logic.js, vuelve a ejecutarlo.
const fs = require('fs'), path = require('path');
const assets = process.argv[2];
if (!assets || !fs.existsSync(assets)) { console.error('Indica la carpeta assets del paquete @lobehub/fluent-emoji-3d'); process.exit(1); }
const root = path.join(__dirname, '..'), out = path.join(root, 'emoji');
// Iconos de la interfaz que no aparecen literalmente en el código, y las banderas de la vuelta al mundo
const EXTRA = '🏠 🧭 ✨ 🗺️ 🚩 🎉 📊 ⚙️ 👋 🔐 📅 🔔 📦 🥳 😊 😢';
const W = require(path.join(root, 'countries.js'));
const FLAGS = W.COUNTRIES.map(c => W.flag(c.code)).join(' ');
const src = ['app.js', 'logic.js', 'countries.js'].map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n') + ' ' + EXTRA;
const re = /(?:\p{Extended_Pictographic}(?:️|[\u{1F3FB}-\u{1F3FF}])?(?:‍\p{Extended_Pictographic}️?)*|[0-9#*]️⃣)/gu;
const FLAG_RE = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;
const list = [...new Set(src.match(re).concat(FLAGS.match(FLAG_RE)))].filter(e => e !== '★');
const code = e => [...e].map(c => c.codePointAt(0).toString(16)).join('-');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
const map = {}, missing = [];
for (const e of list) {
  const full = code(e), bare = full.replace(/-fe0f/g, '');
  const cands = [full, bare, bare + '-fe0f', full.replace(/-fe0f$/, '')];
  const hit = cands.find(c => fs.existsSync(path.join(assets, c + '.webp')));
  if (!hit) { missing.push(e); continue; }
  fs.copyFileSync(path.join(assets, hit + '.webp'), path.join(out, hit + '.webp'));
  map[e] = hit + '.webp';
  map[e.replace(/️/g, '')] = hit + '.webp'; // también sin el selector de variación
}
fs.writeFileSync(path.join(root, 'emoji-map.js'),
  '// Generado por scripts/build-emoji.js — no editar a mano. Iconos: Fluent Emoji 3D (Microsoft, MIT).\nwindow.FP_EMOJI_MAP = ' + JSON.stringify(map) + ';\n');
console.log(Object.keys(map).length + ' entradas, ' + fs.readdirSync(out).length + ' archivos' + (missing.length ? '. Sin icono 3D: ' + missing.join(' ') : ''));
