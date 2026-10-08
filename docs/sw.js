// Generado por scripts/build-standalone.js — no editar a mano.
const CACHE = 'family-points-282f63da94';
const ASSETS = ["./","index.html","app.js","logic.js","manifest.webmanifest","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","vendor/firebase/firebase-app-compat.js","vendor/firebase/firebase-auth-compat.js","vendor/firebase/firebase-firestore-compat.js","firebase-config.js"];
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
  } else if (/^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/.test(url.hostname)) {
    // Fuentes y librerías externas: red y, si no hay, la copia guardada.
    // La sincronización con la nube (Firebase) nunca pasa por aquí.
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req)));
  }
});
