#!/usr/bin/env node
// Screenshots + layout checks for the media kit at 390 and 1366, plus a Letter-size PDF render.
//   node deploy/media-kit/shoot.mjs
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(join(execSync('npm root -g').toString().trim(), 'playwright'));
const SHOTS = join(HERE, 'shots');
mkdirSync(SHOTS, { recursive: true });
const url = pathToFileURL(join(HERE, 'index.html')).href;
let fail = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) fail++; };

const browser = await chromium.launch();
for (const w of [390, 1366]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: w < 500 ? 2 : 1 });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${w}: no horizontal scroll`);
  ok(await p.evaluate(() => document.fonts.check('16px Barlow')), `${w}: Barlow loaded`);
  const fills = await p.locator('.fill').count();
  ok(fills > 0, `${w}: ${fills} [FILL] markers visible`);
  await p.screenshot({ path: join(SHOTS, `media-kit-${w}.png`), fullPage: true });
  await ctx.close();
}
const ctx = await browser.newContext();
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
await p.emulateMedia({ media: 'print' });
await p.pdf({ path: join(SHOTS, 'media-kit-print.pdf'), format: 'Letter', printBackground: true, margin: { top: '0.45in', bottom: '0.45in', left: '0.45in', right: '0.45in' } });
ok(true, 'print PDF rendered (Letter)');
await browser.close();
process.exit(fail ? 1 : 0);
