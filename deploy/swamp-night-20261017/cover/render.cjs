// Render the existing cover template at its original 2204 x 2854 trim.
// Run from any directory: CHROME_PATH=/usr/bin/chromium node <this file>.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const repo = path.resolve(__dirname, '../../..');

(async () => {
  const executablePath = process.env.CHROME_PATH;
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  try {
    const page = await browser.newPage({ viewport: { width: 1102, height: 1427 }, deviceScaleFactor: 2 });
    await page.route('https://qa.local/**', async route => {
      const file = path.resolve(repo, '.' + new URL(route.request().url()).pathname);
      if (!file.startsWith(repo + path.sep)) return route.abort();
      const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.jpg') ? 'image/jpeg' : file.endsWith('.ttf') ? 'font/ttf' : 'font/woff2';
      await route.fulfill({ body: fs.readFileSync(file), contentType: type });
    });
    await page.goto('https://qa.local/deploy/swamp-night-20261017/cover/cover.html');
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode()));
    });
    const checks = await page.evaluate(() => ({
      condensed: document.fonts.check('800 118px "Barlow Condensed"'),
      barlow: document.fonts.check('700 13px Barlow'),
      photos: [...document.images].every(image => image.naturalWidth === 3000 && image.naturalHeight === 1688),
      noOverflow: document.documentElement.scrollWidth === 1102
    }));
    if (Object.values(checks).some(value => !value)) throw new Error(JSON.stringify(checks));
    await page.screenshot({ path: path.join(__dirname, 'cover.jpg'), type: 'jpeg', quality: 94 });
    console.log(JSON.stringify({ width: 2204, height: 2854, ...checks }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
