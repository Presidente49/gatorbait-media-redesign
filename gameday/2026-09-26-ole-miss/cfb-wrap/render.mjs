import { chromium } from 'playwright';
const dir = new URL('.', import.meta.url).pathname;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.goto('file://' + dir + 'cover.html');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
console.log('fonts', await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length),
 'overflow', await p.evaluate(() => [...document.querySelectorAll('.t,.c')].filter(e => e.scrollHeight > e.clientHeight+1 || e.scrollWidth > e.clientWidth+1).length));
await p.locator('.c').screenshot({ path: dir + 'cfb-wrap-cover.png' });
await b.close();
