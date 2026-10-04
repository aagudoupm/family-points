// Prueba la versión con nube (Firebase) con dos dispositivos: iPad e iPhone con la misma cuenta familiar.
// Firebase se sustituye por tests/fake-firebase.js, conectado a un almacén compartido en Node.
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'fp-cloud-'));
const cfg = path.join(out, '..', 'fp-test-config.js');
fs.writeFileSync(cfg, 'window.FP_FIREBASE = { apiKey: "test", projectId: "test" };');
process.env.FP_OUT = out; process.env.FP_FIREBASE_CONFIG = cfg;
require('./build-standalone.js');
const fake = fs.readFileSync(path.join(__dirname, '..', 'tests', 'fake-firebase.js'), 'utf8');

// «Nube» compartida
const accounts = {}, docs = new Map();
let nextUid = 1;
async function cloud(op, a, b) {
  if (op === 'signup') { if (accounts[a]) return { error: 'auth/email-already-in-use' }; if (String(b).length < 6) return { error: 'auth/weak-password' }; accounts[a] = { pass: b, uid: 'u' + nextUid++ }; return { uid: accounts[a].uid }; }
  if (op === 'signin') { const ac = accounts[a]; if (!ac || ac.pass !== b) return { error: 'auth/invalid-credential' }; return { uid: ac.uid }; }
  if (op === 'set') { docs.set(a, b); return null; }
  if (op === 'del') { docs.delete(a); return null; }
  if (op === 'list') { const depth = a.split('/').length + 1; return [...docs.keys()].filter(p => p.startsWith(a + '/') && p.split('/').length === depth).sort().map(p => ({ id: p.split('/').pop(), data: docs.get(p) })); }
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(out, p);
  if (!f.startsWith(out) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
let failures = 0;
const check = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) failures++; };

server.listen(0, async () => {
  const url = 'http://localhost:' + server.address().port + '/';
  const browser = await chromium.launch();
  const errors = [];
  async function device(viewport, mobile) {
    const ctx = await browser.newContext({ viewport, hasTouch: true, isMobile: mobile, locale: 'es-ES', serviceWorkers: 'block' });
    await ctx.exposeFunction('__fb', cloud);
    await ctx.route('**/vendor/firebase/firebase-app-compat.js', r => r.fulfill({ contentType: 'text/javascript', body: fake }));
    await ctx.route('**/vendor/firebase/firebase-{auth,firestore}-compat.js', r => r.fulfill({ contentType: 'text/javascript', body: '' }));
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    return page;
  }
  const bal = (page, name) => page.locator('.mcard', { hasText: name }).locator('.balance .n').innerText().then(Number);
  const wait = ms => new Promise(r => setTimeout(r, ms));

  console.log('iPad: crear la cuenta de la familia');
  const ipad = await device({ width: 1180, height: 820 }, false);
  await ipad.waitForSelector('#l-email');
  check(await ipad.locator('#tabs').isHidden(), 'Pantalla de entrada sin pestañas');
  await ipad.getByRole('button', { name: /Primera vez/ }).click();
  await ipad.fill('#l-email', 'familia@example.com');
  await ipad.fill('#l-pass', 'estrellas1');
  await ipad.fill('#l-pass2', 'otra-cosa');
  await ipad.getByRole('button', { name: 'Crear la cuenta' }).click();
  check(/no coinciden/.test(await ipad.locator('.pin-msg').innerText()), 'Avisa si las contraseñas no coinciden');
  await ipad.fill('#l-pass2', 'estrellas1');
  await ipad.getByRole('button', { name: 'Crear la cuenta' }).click();
  await ipad.getByRole('button', { name: 'Empezar con un ejemplo' }).click();
  await wait(800);
  await ipad.locator('.mcard', { hasText: 'Lucía' }).click();
  await ipad.getByRole('button', { name: /^Hacer los deberes/ }).click();
  await ipad.getByRole('button', { name: 'Cerrar' }).click();
  await wait(800);
  check(await bal(ipad, 'Lucía') === 2, 'iPad: Lucía tiene 2 estrellas');
  check([...docs.keys()].every(k => k.startsWith('users/u1/')), 'Los datos se guardan en el espacio de la cuenta (users/<id>/)');

  console.log('iPhone: entrar con la misma cuenta');
  const iphone = await device({ width: 390, height: 844 }, true);
  await iphone.waitForSelector('#l-email');
  await iphone.fill('#l-email', 'familia@example.com');
  await iphone.fill('#l-pass', 'incorrecta');
  await iphone.getByRole('button', { name: 'Entrar', exact: true }).click();
  await wait(300);
  check(/incorrectos/.test(await iphone.locator('.pin-msg').innerText()), 'Contraseña incorrecta rechazada');
  await iphone.fill('#l-pass', 'estrellas1');
  await iphone.getByRole('button', { name: 'Entrar', exact: true }).click();
  await iphone.waitForSelector('.mcard');
  await wait(800);
  check(await bal(iphone, 'Lucía') === 2, 'iPhone ve las 2 estrellas de Lucía puestas en el iPad');
  await iphone.locator('.mcard', { hasText: 'Mateo' }).click();
  await iphone.getByRole('button', { name: /^Hacer la cama/ }).click();
  await iphone.getByRole('button', { name: 'Cerrar' }).click();
  await wait(1500);
  check(await bal(ipad, 'Mateo') === 1, 'El iPad recibe al momento el punto dado desde el iPhone');
  await iphone.screenshot({ path: path.join(__dirname, '..', 'shots', '11-nube-iphone.png') });

  console.log('Sesión y separación de cuentas');
  await ipad.reload(); await ipad.waitForSelector('.mcard'); await wait(800);
  check(await bal(ipad, 'Lucía') === 2, 'Tras recargar sigue la sesión abierta y los datos');
  await iphone.getByRole('button', { name: 'Ajustes' }).click();
  await iphone.getByRole('button', { name: 'Cerrar sesión' }).click();
  await iphone.locator('.sheet').getByRole('button', { name: 'Cerrar sesión' }).click();
  await iphone.waitForSelector('#l-email');
  check(true, 'Cerrar sesión vuelve a la pantalla de entrada');
  await iphone.getByRole('button', { name: /Primera vez/ }).click();
  await iphone.fill('#l-email', 'otra@example.com'); await iphone.fill('#l-pass', 'secreta1'); await iphone.fill('#l-pass2', 'secreta1');
  await iphone.getByRole('button', { name: 'Crear la cuenta' }).click();
  await iphone.waitForSelector('text=Empezar con un ejemplo');
  check(await iphone.evaluate(() => !window.__FP_APP__.S.settings.pinHash && window.__FP_APP__.S.members.size === 0), 'Otra cuenta empieza vacía: no ve los datos ni los ajustes de la familia');
  await ipad.screenshot({ path: path.join(__dirname, '..', 'shots', '12-nube-ipad.png') });

  check(errors.length === 0, 'Sin errores de JavaScript' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await browser.close(); server.close(); fs.rmSync(out, { recursive: true, force: true }); fs.rmSync(cfg, { force: true });
  console.log(failures ? `\n${failures} comprobaciones fallidas` : '\nTodo correcto');
  process.exit(failures ? 1 : 0);
});
