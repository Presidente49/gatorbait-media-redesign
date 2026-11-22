// Renders the DRAFT MeldonLaw.com PNGs from creative.html. Local only; publishes nothing.
// Usage: node deploy/ads/meldon/render.cjs [extraOutDir]
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const sizes = ['1200x628', '1080x1080', '728x90', '320x100'];
const src = 'file://' + path.join(__dirname, 'creative.html');
const extra = process.argv[2];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const s of sizes) {
    const [w, h] = s.split('x').map(Number);
    await page.setViewportSize({ width: w, height: h });
    await page.goto(src + '?s=' + s, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const fam = await page.evaluate(() => document.fonts.check('700 20px Barlow'));
    if (!fam) throw new Error('Barlow did not load');
    const out = path.join(__dirname, `meldon-${s}.png`);
    await page.locator('#ad').screenshot({ path: out });
    if (extra) { fs.mkdirSync(extra, { recursive: true }); fs.copyFileSync(out, path.join(extra, path.basename(out))); }
    console.log('wrote', out);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
