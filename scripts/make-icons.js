// Genera los iconos PNG de la app (pantalla de inicio de iPhone/iPad y manifiesto).
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const STAR = 'M12 2.6l2.85 5.95 6.55.9-4.78 4.55 1.2 6.5L12 17.38 6.18 20.5l1.2-6.5L2.6 9.45l6.55-.9z';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const size of [180, 192, 512]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0"><svg width="${size}" height="${size}" viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#F5B301"/>
      <g transform="translate(12 12.4) scale(.72) translate(-12 -12)">
        <path d="${STAR}" fill="#7A5600" transform="translate(0 .7)" opacity=".35"/>
        <path d="${STAR}" fill="#FFFFFF" stroke="#FFFFFF" stroke-width=".9" stroke-linejoin="round"/>
      </g></svg></body></html>`);
    await page.screenshot({ path: path.join(__dirname, '..', 'icons', `icon-${size}.png`), omitBackground: false });
  }
  await browser.close();
  console.log('iconos generados');
})();
