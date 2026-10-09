// Genera los iconos PNG de la app (pantalla de inicio de iPhone/iPad y manifiesto) con las ilustraciones del juego:
// el globo, el avión y la estrella de art/iconos sobre el fondo de rayos azul. Si faltan, una estrella blanca sobre amarillo.
// El dibujo queda dentro del 80 % central para que sirva como icono «maskable».
const fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const STAR = 'M12 2.6l2.85 5.95 6.55.9-4.78 4.55 1.2 6.5L12 17.38 6.18 20.5l1.2-6.5L2.6 9.45l6.55-.9z';
const art = f => { const p = path.join(__dirname, '..', 'art', 'iconos', f + '.webp'); return fs.existsSync(p) ? 'data:image/webp;base64,' + fs.readFileSync(p).toString('base64') : null; };
const globe = art('1f30d'), plane = art('2708'), star = art('2b50');
const page = size => globe && plane && star ? `<html><body style="margin:0"><div style="width:${size}px;height:${size}px;position:relative;overflow:hidden;
  background: radial-gradient(circle at 50% 55%, rgba(255,255,255,.35), transparent 60%), repeating-conic-gradient(from 0deg at 50% 55%, #2E8BFF 0 10deg, #4A9DFF 10deg 20deg)">
  <img src="${globe}" style="position:absolute;left:19%;top:21%;width:62%;height:62%;object-fit:contain;filter:drop-shadow(0 ${size * .02}px 0 rgba(29,18,64,.35))">
  <img src="${plane}" style="position:absolute;left:47%;top:3%;width:42%;height:42%;object-fit:contain;transform:rotate(-14deg);filter:drop-shadow(0 ${size * .015}px 0 rgba(29,18,64,.3))">
  <img src="${star}" style="position:absolute;left:12%;top:12%;width:26%;height:26%;object-fit:contain;transform:rotate(-12deg);filter:drop-shadow(0 ${size * .012}px 0 rgba(29,18,64,.3))">
  </div></body></html>`
  : `<html><body style="margin:0"><svg width="${size}" height="${size}" viewBox="0 0 24 24"><rect width="24" height="24" fill="#F5B301"/>
      <g transform="translate(12 12.4) scale(.72) translate(-12 -12)"><path d="${STAR}" fill="#7A5600" transform="translate(0 .7)" opacity=".35"/>
      <path d="${STAR}" fill="#FFFFFF" stroke="#FFFFFF" stroke-width=".9" stroke-linejoin="round"/></g></svg></body></html>`;
(async () => {
  const browser = await chromium.launch();
  const p = await browser.newPage();
  for (const size of [180, 192, 512]) {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(page(size));
    await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(__dirname, '..', 'icons', `icon-${size}.png`) });
  }
  await browser.close();
  console.log('iconos generados');
})();
