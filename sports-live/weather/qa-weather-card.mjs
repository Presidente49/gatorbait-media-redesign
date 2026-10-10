// QA: renders the card inside a mock #gbm-gd band at 390/430/1366 against the live NWS API. Usage: node qa-weather-card.mjs <outdir>
import { chromium } from 'playwright'; import { readFileSync } from 'node:fs'; import { dirname, join } from 'node:path'; import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)), out = process.argv[2] || '.', js = readFileSync(join(here, 'weather-card.js'), 'utf8');
const page_html = '<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&display=swap" rel=stylesheet><body style="margin:0;padding:12px;font-family:Barlow,sans-serif"><div id=gbm-gd style="border:2px solid #0021a5;padding:12px"><b>GAME-DAY BAND (mock)</b></div>';
const b = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}), res = {}, ctx = await b.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 700 } });
for (const w of [390, 430, 1366]) {
  const p = await ctx.newPage(); await p.setViewportSize({ width: w, height: 700 }); await p.setContent(page_html); await p.addScriptTag({ content: js });
  await p.waitForSelector('#gbm-wx', { timeout: 15000 }).catch(() => {});
  const m = await p.evaluate(() => { const c = document.getElementById('gbm-wx'); return c ? { cells: c.querySelectorAll('.wx-c').length, overflowX: document.documentElement.scrollWidth > innerWidth, w: c.getBoundingClientRect().width, text: c.querySelector('.wx-s').textContent } : null; });
  res[w] = m; if (m) await p.locator('#gbm-gd').screenshot({ path: join(out, `wx-${w}.png`) }); await p.close();
}
// failure path: blocked API must leave no card
const p = await ctx.newPage(); await p.route('**/api.weather.gov/**', r => r.abort()); await p.setContent(page_html); await p.addScriptTag({ content: js }); await p.waitForTimeout(3000);
res.failHidden = await p.evaluate(() => !document.getElementById('gbm-wx')); await b.close(); console.log(JSON.stringify(res, null, 1));
