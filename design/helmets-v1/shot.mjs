import { chromium } from 'playwright';
const [f, out, sel] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
await (sel ? p.locator(sel).screenshot({ path: out }) : p.screenshot({ path: out, fullPage: true }));
await b.close();
