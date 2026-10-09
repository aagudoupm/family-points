// Genera dist/index.html con el esqueleto que añade el visor de Claude al publicar,
// para poder probar la página en local (npm run e2e).
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
const page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
fs.writeFileSync(path.join(dist, 'index.html'),
  '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover">' +
  '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>' +
  '</head><body>' + page + '</body></html>');
const ART_FILES = require('./build-art.js');
for (const f of ['logic.js', 'app.js', 'emoji-map.js', 'countries.js', 'avatar.js', 'icons.js', 'characters.js', 'art.js', 'world-map.js']) fs.copyFileSync(path.join(root, f), path.join(dist, f));
fs.rmSync(path.join(dist, 'emoji'), { recursive: true, force: true });
fs.cpSync(path.join(root, 'emoji'), path.join(dist, 'emoji'), { recursive: true });
fs.rmSync(path.join(dist, 'art'), { recursive: true, force: true });
for (const f of ART_FILES) { fs.mkdirSync(path.dirname(path.join(dist, f)), { recursive: true }); fs.copyFileSync(path.join(root, f), path.join(dist, f)); }
console.log('dist/index.html listo');
