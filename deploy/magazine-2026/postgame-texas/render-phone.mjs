#!/usr/bin/env node
// Render the phone-edition HTML to a 390 x 844 pt PDF with Chromium. Waits for fonts and every image; sets the PDF title.
//   PLAYWRIGHT_PKG=/opt/node22/lib/node_modules/playwright node render-phone.mjs <in.html> <out.pdf>
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PKG || 'playwright');
const [inHtml, outPdf] = process.argv.slice(2);
if (!outPdf) { console.error('usage: render-phone.mjs <in.html> <out.pdf>'); process.exit(2); }
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('file://' + path.resolve(inHtml), { waitUntil: 'load', timeout: 120000 });
const stats = await page.evaluate(async () => {
  await document.fonts.ready;
  const broken = [];
  await Promise.all([...document.images].map(async i => { try { await i.decode(); } catch (e) { broken.push(i.src); } if (!i.naturalWidth) broken.push(i.src); }));
  return { images: document.images.length, broken: [...new Set(broken)] };
});
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: outPdf, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, tagged: true, outline: true });
await browser.close();
console.log(JSON.stringify({ out: outPdf, bytes: fs.statSync(outPdf).size, ...stats }));
if (stats.broken.length) process.exit(1);
