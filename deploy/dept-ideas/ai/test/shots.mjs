#!/usr/bin/env node
// Serves this folder locally and screenshots preview.html at 390 (ask + trivia) and 1365 into shots/.
// Usage: NODE_PATH=<scratchpad>/node_modules node deploy/dept-ideas/ai/test/shots.mjs
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const dir = join(dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const srv = createServer((req, res) => { try { const p = join(dir, new URL(req.url, 'http://x').pathname); res.setHeader('Content-Type', types[extname(p)] || 'text/plain'); res.end(readFileSync(p)); } catch (_) { res.statusCode = 404; res.end('nope'); } });
await new Promise((r) => srv.listen(0, r)); const port = srv.address().port;
const browser = await chromium.launch();
for (const [name, w, h, qs] of [['390-ask', 390, 844, ''], ['390-trivia', 390, 844, '?tab=trivia&answer=right'], ['1365', 1365, 900, '?answer=right']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  page.route('https://fonts.googleapis.com/**', (r) => r.abort());
  await page.goto(`http://127.0.0.1:${port}/preview.html${qs}`); await page.waitForTimeout(900);
  const sec = await page.$('.fp-ask'); const box = await sec.boundingBox();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  const answers = await page.$$eval('.fp-ask-a', (n) => n.map((x) => x.textContent.trim().slice(0, 60)));
  await page.screenshot({ path: join(dir, 'shots', `${name}.png`), fullPage: true });
  console.log(`${name}: section ${Math.round(box.width)}x${Math.round(box.height)}, horizontal overflow: ${overflow}, answers on page: ${answers.length}`);
  await page.close();
}
await browser.close(); srv.close();
