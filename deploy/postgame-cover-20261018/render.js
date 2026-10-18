const { chromium } = require(process.env.PLAYWRIGHT_PKG);
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 1600 } });
  await p.goto('file://' + path.join(__dirname, 'cover.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(__dirname, 'postgame-cover-1200x1600.jpg'), type: 'jpeg', quality: 92 });
  await b.close();
})();
