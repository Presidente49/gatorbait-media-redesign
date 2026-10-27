// Render cover.html to the 1200x1600 portrait JPEG. Same recipe as deploy/postgame-cover-20261018/render.js.
//   PLAYWRIGHT_PKG=/opt/node22/lib/node_modules/playwright node deploy/pregame-cover-georgia-20261027/render.js
const { chromium } = require(process.env.PLAYWRIGHT_PKG);
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 1600 } });
  await p.goto('file://' + path.join(__dirname, 'cover.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(__dirname, 'pregame-cover-georgia-1200x1600.jpg'), type: 'jpeg', quality: 92 });
  await b.close();
})();
