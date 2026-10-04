// Genera la versión independiente (sin claude.ai) en docs/, lista para GitHub Pages.
// Se instala en iPhone/iPad con «Añadir a pantalla de inicio», funciona sin conexión
// y guarda los datos en el propio dispositivo.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..'), out = path.join(root, 'docs');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'icons'), { recursive: true });

const page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const split = page.indexOf('<div class="app">');
const head = page.slice(0, split), body = page.slice(split);
const files = ['app.js', 'logic.js'];
const version = crypto.createHash('sha1').update(page + files.map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('')).digest('hex').slice(0, 10);

fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#F5B301">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<link rel="icon" href="icons/icon-192.png">
<link rel="manifest" href="manifest.webmanifest">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${head}</head>
<body>
${body}
<script>
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
</script>
</body>
</html>
`);
for (const f of files) fs.copyFileSync(path.join(root, f), path.join(out, f));
for (const f of fs.readdirSync(path.join(root, 'icons'))) fs.copyFileSync(path.join(root, 'icons', f), path.join(out, 'icons', f));

fs.writeFileSync(path.join(out, 'manifest.webmanifest'), JSON.stringify({
  name: 'Family Points', short_name: 'Family Points', lang: 'es', start_url: './', scope: './',
  display: 'standalone', background_color: '#F3F5FA', theme_color: '#F5B301',
  icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }]
}, null, 2));

const assets = ['./', 'index.html', 'app.js', 'logic.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];
fs.writeFileSync(path.join(out, 'sw.js'), `// Generado por scripts/build-standalone.js — no editar a mano.
const CACHE = 'family-points-${version}';
const ASSETS = ${JSON.stringify(assets)};
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // Archivos de la app: primero la caché (funciona sin conexión)
    e.respondWith(caches.match(req.mode === 'navigate' ? 'index.html' : req, { ignoreSearch: true }).then(r => r || fetch(req)));
  } else {
    // Fuentes y librerías externas: red y, si no hay, la copia guardada
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req)));
  }
});
`);
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('docs/ listo · versión ' + version);
