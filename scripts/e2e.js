// Prueba de extremo a extremo en un iPad simulado (Chromium + Playwright).
// Uso: npm run e2e   (genera dist/ y capturas en shots/)
const path = require('path');
const fs = require('fs');
if (!process.env.FP_URL) require('./build-preview.js');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const url = process.env.FP_URL || 'file://' + path.join(__dirname, '..', 'dist', 'index.html');
const shots = path.join(__dirname, '..', 'shots');
fs.mkdirSync(shots, { recursive: true });

let failures = 0;
function check(cond, msg) { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) failures++; }

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1180, height: 820 }, hasTouch: true, locale: 'es-ES', timezoneId: 'Europe/Madrid' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_|net::/.test(m.text())) errors.push(m.text()); });
  const balance = async name => Number(await page.locator('.mcard', { hasText: name }).locator('.balance .n').innerText());
  const settle = () => page.waitForTimeout(700);

  console.log('Fase 1 · Primer arranque y datos de ejemplo');
  await page.goto(url);
  await page.getByRole('button', { name: 'Empezar con un ejemplo' }).click();
  await settle();
  check(await page.locator('.mcard').count() === 3, '3 miembros en el panel');
  const st = await page.evaluate(() => ({ r: window.__FP_APP__.S.rules.size, w: window.__FP_APP__.S.rewards.size }));
  check(st.r === 10 && st.w === 5, '10 reglas y 5 premios cargados');
  await page.screenshot({ path: path.join(shots, '1-panel.png') });

  console.log('Fase 2 · Asignar puntos');
  await page.locator('.mcard', { hasText: 'Lucía' }).click();
  await page.getByRole('button', { name: /^Hacer la cama/ }).click();
  await page.getByRole('button', { name: /^Hacer los deberes/ }).click();
  await page.getByRole('button', { name: /^Pelearse/ }).click();
  await page.screenshot({ path: path.join(shots, '2-asignar.png') });
  await page.locator('summary', { hasText: 'Otros puntos' }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: 'Más puntos' }).click();
  await page.fill('#custom-reason', 'Ayudó a la abuela');
  check(await page.evaluate(() => document.querySelector('.app').inert), 'El fondo queda inerte con la hoja abierta');
  await page.getByRole('button', { name: 'Dar puntos', exact: true }).click();
  await page.getByRole('button', { name: 'Deshacer' }).click();
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await settle();
  check(await balance('Lucía') === 1, 'Lucía: +1 +2 −2, +5 deshecho → 1 estrella');
  const rank = await page.locator('.rank-list li').first().getAttribute('aria-label');
  check(/Lucía/.test(rank), 'Lucía encabeza el ranking semanal');

  console.log('Fase 4 · Premios y canjes');
  await page.getByRole('button', { name: 'Premios', exact: true }).click();
  await page.locator('.who .chip', { hasText: 'Lucía' }).click();
  await page.getByRole('button', { name: /^30 min de tablet/ }).click();
  await page.waitForTimeout(200);
  check(/faltan 9/i.test(await page.locator('.toast').innerText()), 'Sin saldo suficiente no deja canjear (faltan 9)');
  await page.evaluate(() => {}); // dar más puntos desde el panel
  await page.getByRole('button', { name: 'Panel', exact: true }).click();
  await page.locator('.mcard', { hasText: 'Lucía' }).click();
  for (let i = 0; i < 6; i++) await page.getByRole('button', { name: /^Ayudar en casa/ }).click(); // +12
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await settle();
  check(await balance('Lucía') === 13, 'Lucía tiene 13 estrellas');
  await page.getByRole('button', { name: 'Premios', exact: true }).click();
  await page.getByRole('button', { name: /^30 min de tablet/ }).click();
  await page.screenshot({ path: path.join(shots, '3-canje.png') });
  await page.locator('.sheet').getByRole('button', { name: 'Canjear' }).click();
  await settle();
  await page.getByRole('button', { name: 'Panel', exact: true }).click();
  await settle();
  check(await balance('Lucía') === 3, 'Canje descuenta 10 → 3 estrellas');

  console.log('Fase 5 · Ajustes, PIN y reinicio');
  await page.getByRole('button', { name: 'Ajustes', exact: true }).click();
  await page.locator('.banner').getByRole('button', { name: 'Crear PIN' }).click();
  for (const d of '12341234') await page.getByRole('button', { name: 'Cifra ' + d, exact: true }).click();
  await settle();
  check(await page.evaluate(() => !!window.__FP_APP__.S.settings.pinHash && window.__FP_APP__.S.settings.pinHash !== '1234'), 'PIN guardado como hash');
  await page.getByRole('button', { name: 'Bloquear ahora' }).click();
  await page.getByRole('button', { name: 'Ajustes', exact: true }).click();
  for (const d of '1111') await page.getByRole('button', { name: 'Cifra ' + d, exact: true }).click();
  await page.waitForTimeout(500);
  check(/incorrecto/.test(await page.locator('.pin-msg').innerText()), 'PIN incorrecto rechazado');
  for (const d of '1234') await page.getByRole('button', { name: 'Cifra ' + d, exact: true }).click();
  await settle();
  check(await page.locator('h1', { hasText: 'Ajustes' }).count() === 1, 'PIN correcto abre Ajustes');
  await page.screenshot({ path: path.join(shots, '4-ajustes.png'), fullPage: true });
  // Añadir una regla nueva
  await page.locator('.set-card', { hasText: 'Reglas' }).getByRole('button', { name: 'Añadir' }).click();
  await page.fill('#r-title', 'Regar las plantas');
  await page.locator('.sheet').getByRole('button', { name: 'Guardar' }).click();
  await settle();
  check(await page.evaluate(() => [...window.__FP_APP__.S.rules.values()].some(r => r.title === 'Regar las plantas')), 'Regla nueva creada');
  // Reordenar: subir la última regla
  const before = await page.evaluate(() => [...window.__FP_APP__.S.rules.values()].sort((a, b) => a.order - b.order).map(r => r.title));
  await page.getByRole('button', { name: 'Subir Regar las plantas' }).click();
  await settle();
  const after = await page.evaluate(() => [...window.__FP_APP__.S.rules.values()].sort((a, b) => a.order - b.order).map(r => r.title));
  check(after[after.length - 2] === 'Regar las plantas' && after[after.length - 1] === before[before.length - 2], 'Reordenar reglas');
  await page.getByRole('button', { name: /Reiniciar ahora/ }).click();
  await page.locator('.sheet').getByRole('button', { name: 'Reiniciar ahora' }).click();
  await settle();
  await page.getByRole('button', { name: 'Panel', exact: true }).click();
  await settle();
  check(await balance('Lucía') === 0, 'Reinicio manual deja el saldo a 0');

  console.log('Fase 3 · Historial');
  await page.locator('#tabs').getByRole('button', { name: 'Más', exact: true }).click();
  await page.locator('.more-tile', { hasText: 'Historial' }).click();
  await settle();
  const rows = await page.locator('.list .row').count();
  check(rows === 11, 'Historial con 11 entradas (9 movimientos + 1 canje + 1 reinicio): ' + rows);
  await page.locator('.seg button', { hasText: 'Canjes' }).click();
  check(await page.locator('.list .row').count() === 1, 'Filtro por tipo: canjes');
  await page.locator('.seg button', { hasText: 'Todo' }).first().click();
  await page.locator('.filters .chip', { hasText: 'Mateo' }).click();
  check(await page.locator('.list .row').count() === 0, 'Filtro por miembro: Mateo sin movimientos');
  await page.locator('.filters .chip', { hasText: 'Todos' }).click();
  // Editar un movimiento (PIN aún desbloqueado)
  await page.locator('.list .row', { hasText: 'Pelearse' }).click();
  await page.fill('#e-note', 'Con su hermano');
  await page.locator('.sheet').getByRole('button', { name: 'Guardar' }).click();
  await settle();
  check(/Con su hermano/.test(await page.locator('.list .row', { hasText: 'Pelearse' }).innerText()), 'Editar nota de un movimiento');
  await page.locator('.list .row', { hasText: 'Pelearse' }).click();
  await page.locator('.sheet').getByRole('button', { name: 'Borrar' }).click();
  await settle();
  check(await page.locator('.list .row', { hasText: 'Pelearse' }).count() === 0, 'Borrar movimiento');
  await page.getByRole('button', { name: 'Deshacer' }).click();
  await settle();
  check(await page.locator('.list .row', { hasText: 'Pelearse' }).count() === 1, 'Deshacer el borrado');
  await page.screenshot({ path: path.join(shots, '5-historial.png') });

  console.log('Fase 6 · Estadísticas');
  await page.locator('#tabs').getByRole('button', { name: 'Más', exact: true }).click();
  await page.locator('.more-tile', { hasText: 'Gráficos' }).click();
  await settle();
  check(await page.locator('.chart-wrap polyline').count() === 3, 'Gráfico con una línea por miembro');
  check(await page.locator('.bar-row').count() > 0, 'Comportamientos más frecuentes');
  await page.locator('.seg button', { hasText: 'Días' }).click();
  await page.waitForTimeout(300);
  check(await page.locator('.chart-wrap polyline').first().getAttribute('points').then(p => p.trim().split(' ').length) === 30, 'Botón «Días»: 30 puntos por línea');
  check(/últimos 30/.test(await page.locator('#evo-h + .sub').innerText()), 'Subtítulo de los últimos 30 días');
  await page.screenshot({ path: path.join(shots, '6b-estadisticas-dias.png') });
  await page.locator('.chart-wrap rect').hover();
  check(await page.locator('.tip').isVisible(), 'Tooltip al pasar el dedo por el gráfico');
  await page.screenshot({ path: path.join(shots, '6-estadisticas.png') });

  console.log('Fase 9 · Retos, confirmación e insignias');
  const pinIfAsked = async () => { await page.waitForTimeout(300); if (await page.locator('.pin-pad').count()) { for (const d of '1234') await page.getByRole('button', { name: 'Cifra ' + d, exact: true }).click(); await page.waitForTimeout(400); } };
  const sheet = () => page.locator('.sheet').last();
  await page.getByRole('button', { name: 'Retos', exact: true }).click(); await settle();
  await page.getByRole('button', { name: 'Crear retos de ejemplo' }).click(); await pinIfAsked(); await settle();
  check(await page.locator('.chal').count() === 3, 'Retos de ejemplo: constancia, semana limpia y en familia');
  await page.getByRole('button', { name: 'Panel', exact: true }).click(); await settle();
  const bal0 = await balance('Lucía');
  await page.locator('.mcard', { hasText: 'Lucía' }).click();
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /^Hacer la cama/ }).click();
  await sheet().getByRole('button', { name: 'Cerrar' }).click(); await settle();
  check(/1 reto conseguido esperando confirmación/.test(await page.locator('.banners').innerText()), 'Aviso en el panel: reto conseguido, falta confirmar');
  check(await balance('Lucía') === bal0 + 4, 'Las estrellas extra no se dan sin confirmar');
  await page.locator('.banners').getByRole('button', { name: 'Revisar' }).click();
  await sheet().getByRole('button', { name: /Confirmar/ }).click(); await pinIfAsked(); await settle();
  check(await sheet().locator('.celebrate').count() === 1 && /Lucía/.test(await sheet().innerText()), 'Celebración con insignia al confirmar');
  await page.screenshot({ path: path.join(shots, '13-celebracion.png') });
  await sheet().getByRole('button', { name: '¡Genial!' }).click();
  await page.waitForTimeout(900);
  const lvl = sheet().locator('.celebrate', { hasText: 'Lucía llega al Bosque' });
  check(await lvl.count() === 1, 'Subida de nivel: Lucía llega al Bosque (20 estrellas ganadas)');
  await page.screenshot({ path: path.join(shots, '13b-nivel.png') });
  if (await lvl.count()) await sheet().getByRole('button', { name: '¡Genial!' }).click();
  await sheet().getByRole('button', { name: 'Cerrar' }).click(); await settle();
  check(/Nivel 2 · Bosque/.test(await page.locator('.mcard', { hasText: 'Lucía' }).innerText()), 'La tarjeta muestra el nuevo nivel');
  check(await page.locator('.mcard', { hasText: 'Lucía' }).locator('.trail .stop').count() > 0, 'Camino de premios en la tarjeta');
  check(await page.locator('img.emo').count() > 10, 'Iconos 3D en el panel');
  check(await balance('Lucía') === bal0 + 4 + 5, 'Al confirmar se suman las 5 estrellas extra');
  check(!(await page.locator('.banners').innerText()).includes('esperando'), 'El aviso desaparece tras confirmar');
  await page.getByRole('button', { name: 'Premios', exact: true }).click();
  await page.locator('.seg button', { hasText: 'Insignias' }).click(); await settle();
  check(await page.locator('.badge').count() === 1 && /Hacer la cama/.test(await page.locator('.badge').innerText()), 'Insignia en la colección de Lucía');
  // Reto libre para Mateo, marcado por un adulto
  await page.getByRole('button', { name: 'Retos', exact: true }).click(); await settle();
  await page.getByRole('button', { name: /Nuevo reto/ }).click(); await pinIfAsked();
  await sheet().locator('.seg button', { hasText: 'Libre' }).click();
  await page.fill('#c-title', 'Atarse los cordones');
  await sheet().locator('.chip', { hasText: 'Mateo' }).click();
  await sheet().getByRole('button', { name: 'Guardar' }).click(); await settle();
  const free = page.locator('.chal', { hasText: 'Atarse los cordones' });
  check(await free.count() === 1 && /Mateo/.test(await free.innerText()), 'Reto libre creado solo para Mateo');
  await free.getByRole('button', { name: '¡Conseguido!' }).click();
  await sheet().getByRole('button', { name: 'Confirmar' }).click(); await pinIfAsked(); await settle();
  await sheet().getByRole('button', { name: '¡Genial!' }).click(); await settle();
  check(await page.evaluate(() => window.__FP_APP__.achievements().filter(a => a.status === 'confirmed').length) === 2, 'Mateo recibe su insignia del reto libre');
  check(/Superado/.test(await free.innerText()), 'El reto libre aparece como superado');
  await page.screenshot({ path: path.join(shots, '14-retos.png'), fullPage: true });
  // El editor de retos no muestra «null» con ningún tipo
  await page.getByRole('button', { name: /Nuevo reto/ }).click(); await pinIfAsked();
  const nulls = [];
  for (const tp of ['Constancia', 'Racha', 'Semana limpia', 'En familia', 'Libre']) {
    await sheet().locator('.seg button', { hasText: tp }).click(); await page.waitForTimeout(150);
    if (/\bnull\b|undefined/.test(await sheet().innerText())) nulls.push(tp);
  }
  check(!nulls.length, 'Editor de retos sin «null» en ningún tipo' + (nulls.length ? ': ' + nulls.join(', ') : ''));
  await page.screenshot({ path: path.join(shots, '15-editor-reto.png') });
  await sheet().getByRole('button', { name: 'Cancelar' }).click(); await settle();
  check(await page.locator('text=Ruleta').count() === 0 && await page.locator('text=ruleta').count() === 0, 'No queda rastro de la ruleta en Retos');
  await page.getByRole('button', { name: 'Ajustes', exact: true }).click(); await pinIfAsked(); await settle();
  check(!/ruleta/i.test(await page.locator('#view').innerText()), 'No queda rastro de la ruleta en Ajustes');
  await page.getByRole('button', { name: 'Más', exact: true }).click(); await settle();
  check(await page.locator('.more-tile').count() >= 8 && !/ruleta/i.test(await page.locator('#view').innerText()), 'Pantalla «Más» con accesos y sin ruleta');
  // Ningún texto «null» en las pantallas principales
  const leaks = [];
  for (const tab of ['Panel', 'Retos', 'Premios', 'Más', 'Ajustes']) {
    await page.locator('#tabs').getByRole('button', { name: tab, exact: true }).click(); await pinIfAsked(); await page.waitForTimeout(200);
    if (/\bnull\b|undefined|NaN/.test(await page.locator('#view').innerText())) leaks.push(tab);
  }
  for (const tile of ['Historial', 'Gráficos']) {
    await page.locator('#tabs').getByRole('button', { name: 'Más', exact: true }).click(); await page.locator('.more-tile', { hasText: tile }).click(); await page.waitForTimeout(200);
    if (/\bnull\b|undefined|NaN/.test(await page.locator('#view').innerText())) leaks.push(tile);
  }
  check(await page.locator('#tabs .tab:visible').count() === 5 && await page.locator('#tabs .tab[aria-current="page"]', { hasText: 'Más' }).count() === 1, 'Barra lateral del iPad: 4 apartados + Ajustes, y «Más» marcado en Historial/Gráficos');
  await page.locator('.view-switch').getByRole('button', { name: /Más/ }).click(); await page.waitForTimeout(200);
  check(await page.locator('h1', { hasText: 'Más' }).count() === 1, 'Botón «‹ Más» para volver desde Historial/Gráficos');
  check(!leaks.length, 'Ninguna pantalla muestra «null», «undefined» o «NaN»' + (leaks.length ? ': ' + leaks.join(', ') : ''));

  console.log('Persistencia');
  await page.reload();
  await settle();
  check(await page.locator('.mcard').count() === 3, 'Los datos siguen tras recargar');

  console.log('Vertical y modo oscuro');
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.getByRole('button', { name: 'Panel', exact: true }).click();
  await settle();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  check(!overflow, 'Sin scroll horizontal en vertical');
  await page.screenshot({ path: path.join(shots, '7-vertical-oscuro.png') });
  await page.locator('.mcard', { hasText: 'Mateo' }).click();
  await page.screenshot({ path: path.join(shots, '8-asignar-oscuro.png') });

  // Accesibilidad básica: todo botón tiene nombre accesible
  const unnamed = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => !b.closest('[aria-hidden="true"]') && b.getAttribute('tabindex') !== '-1' && !(b.getAttribute('aria-label') || b.textContent.trim())).length);
  check(unnamed === 0, 'Todos los botones tienen etiqueta para VoiceOver');

  check(errors.length === 0, 'Sin errores de JavaScript' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await browser.close();
  console.log(failures ? `\n${failures} comprobaciones fallidas` : '\nTodo correcto');
  process.exit(failures ? 1 : 0);
})();
