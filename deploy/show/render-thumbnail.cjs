// Renders deploy/show/thumbnail.html to PNG at YouTube (1280x720) and Facebook (1200x630) sizes.
// Usage: node deploy/show/render-thumbnail.cjs --big "MISSOURI WEEK" --sub "Buddy on Bloody Tuesday" [--photo URL] [--credit "Photo: Chris Spears"] [--out dir]
const { chromium } = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
const args = {}; const a = process.argv.slice(2);
for (let i = 0; i < a.length; i += 2) args[a[i].replace(/^--/, '')] = a[i + 1];
if (!args.big) { console.error('need --big'); process.exit(2); }
const out = args.out || path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
const q = new URLSearchParams({ big: args.big, sub: args.sub || '', photo: args.photo || '', credit: args.credit || '' });
const url = 'file://' + path.join(__dirname, 'thumbnail.html') + '?' + q.toString();
(async () => {
  const exe = process.env.CHROME_PATH; // set when the preinstalled browser differs from the package's build
  const b = await chromium.launch(exe ? { executablePath: exe } : {});
  const slug = args.big.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  for (const [name, w, h] of [['youtube', 1280, 720], ['facebook', 1200, 630]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'load', timeout: 30000 });
    await p.evaluate(() => document.fonts.ready).catch(() => {});
    await p.waitForTimeout(800);
    const file = path.join(out, `${slug}-${name}-${w}x${h}.png`);
    await p.screenshot({ path: file, type: 'png' });
    console.log(file);
    await ctx.close();
  }
  await b.close();
})();
