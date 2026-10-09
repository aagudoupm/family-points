// Prueba la versión independiente (docs/) servida por HTTP en un iPhone simulado:
// recorrido completo, instalación (manifiesto e icono), modo sin conexión y copia de seguridad.
const http = require('http'), fs = require('fs'), path = require('path');
const { spawn } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
// Esta prueba cubre el modo «datos en el dispositivo» (sin nube): se construye aparte, en una carpeta temporal
const docs = fs.mkdtempSync(path.join(require('os').tmpdir(), 'fp-local-'));
process.env.FP_OUT = docs; process.env.FP_FIREBASE_CONFIG = path.join(docs, 'sin-nube.js');
require('./build-standalone.js');
const shots = path.join(__dirname, '..', 'shots');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(docs, p);
  if (!f.startsWith(docs) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
let failures = 0;
const check = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) failures++; };

server.listen(0, async () => {
  const url = 'http://localhost:' + server.address().port + '/';
  console.log('Recorrido completo sobre la versión independiente');
  const code = await new Promise(r => spawn('node', [path.join(__dirname, 'e2e.js')], { env: { ...process.env, FP_URL: url }, stdio: 'inherit' }).on('exit', r));
  if (code !== 0) failures++;

  console.log('Instalación, sin conexión y copia de seguridad (iPhone)');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, locale: 'es-ES', acceptDownloads: true });
  // La hoja de compartir de iOS no se puede automatizar: se prueba la descarga directa
  await ctx.addInitScript(() => { try { Object.defineProperty(navigator, 'canShare', { value: undefined }); } catch (e) {} });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  check(await page.locator('link[rel="apple-touch-icon"]').count() === 1, 'Icono para la pantalla de inicio');
  const man = await (await page.request.get(url + 'manifest.webmanifest')).json();
  check(man.display === 'standalone' && man.name === 'Family Points', 'Manifiesto: se abre a pantalla completa');
  await page.getByRole('button', { name: 'Empezar con un ejemplo' }).click();
  await page.waitForTimeout(500);
  await page.locator('.mcard', { hasText: 'Mateo' }).click();
  await page.getByRole('button', { name: /^Hacer los deberes/ }).click();
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); await page.waitForTimeout(500);
  check(await page.evaluate(() => !!navigator.serviceWorker.controller), 'Service worker activo');
  await page.screenshot({ path: path.join(shots, '9-iphone.png') });
  let wide = [];
  for (const tab of ['Panel', 'Retos', 'Premios', 'Más']) {
    await page.getByRole('button', { name: tab, exact: true }).click(); await page.waitForTimeout(250);
    if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) wide.push(tab);
  }
  await page.getByRole('button', { name: 'Panel', exact: true }).click(); await page.waitForTimeout(250);
  await page.locator('.mcard', { hasText: 'Mateo' }).click(); await page.waitForTimeout(500);
  if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) wide.push('Perfil');
  await page.screenshot({ path: path.join(shots, '21-iphone-perfil.png') });
  await page.locator('.sheet').getByRole('button', { name: 'Cerrar' }).click(); await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Retos', exact: true }).click(); await page.waitForTimeout(250);
  await page.getByRole('button', { name: 'Crear retos de ejemplo' }).click(); await page.waitForTimeout(600);
  if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) wide.push('Retos con tarjetas');
  await page.screenshot({ path: path.join(shots, '16-iphone-retos.png') });
  await page.getByRole('button', { name: 'Más', exact: true }).click(); await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(shots, '17-iphone-mas.png') });
  check(await page.locator('#tabs .tab:visible').count() === 4, 'Barra inferior del iPhone con 4 apartados');
  for (const tile of ['Historial', 'Gráficos']) {
    await page.getByRole('button', { name: 'Más', exact: true }).click(); await page.locator('.more-tile', { hasText: tile }).click(); await page.waitForTimeout(250);
    if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) wide.push(tile);
  }
  await page.screenshot({ path: path.join(shots, '18-iphone-graficos.png') });
  check(!wide.length, 'Sin desbordamiento horizontal en iPhone' + (wide.length ? ': ' + wide.join(', ') : ''));
  await page.getByRole('button', { name: 'Panel', exact: true }).click();
  await ctx.setOffline(true);
  await page.reload(); await page.waitForTimeout(800);
  check(await page.locator('.mcard').count() === 3, 'Funciona sin conexión y conserva los datos');
  await ctx.setOffline(false);
  // Copia de seguridad: guardar, borrar todo y restaurar
  await page.getByRole('button', { name: 'Abrir ajustes' }).click();
  await page.waitForTimeout(300);
  check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'Ajustes sin desbordamiento en iPhone');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Guardar copia/ }).click()]);
  const file = path.join(shots, 'copia.json'); await dl.saveAs(file);
  const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
  check(backup.app === 'family-points' && backup.members.length === 3, 'Copia de seguridad descargada');
  await page.getByRole('button', { name: 'Borrar todo el historial' }).click();
  await page.locator('.sheet').getByRole('button', { name: 'Borrar todo el historial' }).click();
  await page.waitForTimeout(300);
  await page.setInputFiles('#backup-file', file);
  await page.locator('.sheet').getByRole('button', { name: 'Restaurar' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Panel' }).click(); await page.waitForTimeout(800);
  check(Number(await page.locator('.mcard', { hasText: 'Mateo' }).locator('.balance .n').innerText()) === 2, 'Restaurar copia recupera las estrellas de Mateo (2)');
  await page.screenshot({ path: path.join(shots, '10-iphone-restaurado.png') });
  check(errors.length === 0, 'Sin errores de JavaScript' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await browser.close(); server.close();
  console.log(failures ? `\n${failures} comprobaciones fallidas` : '\nTodo correcto');
  process.exit(failures ? 1 : 0);
});
