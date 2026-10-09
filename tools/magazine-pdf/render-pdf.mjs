#!/usr/bin/env node
// Render a print HTML file to PDF with Chromium. Waits for web fonts and for EVERY image to decode
// before printing, so no figure comes out empty. Usage: node render-pdf.mjs <in.html> <out.pdf>
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PKG || 'playwright');
import path from 'node:path';
import fs from 'node:fs';

const [inHtml, outPdf] = process.argv.slice(2);
if (!outPdf) { console.error('usage: render-pdf.mjs <in.html> <out.pdf>'); process.exit(2); }
// Behind an egress proxy (HTTPS_PROXY with its own CA) Chromium needs the proxy passed explicitly.
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || '';
const browser = await chromium.launch(proxy ? { proxy: { server: proxy }, args: ['--ignore-certificate-errors'] } : {});
const page = await browser.newPage({ viewport: { width: 1100, height: 1400 }, ignoreHTTPSErrors: !!proxy });
const errors = [];
page.on('requestfailed', r => errors.push('request failed: ' + r.url()));
await page.goto('file://' + path.resolve(inHtml), { waitUntil: 'load', timeout: 120000 });
const stats = await page.evaluate(async () => {
  await document.fonts.ready;
  const imgs = [...document.images];
  const broken = [];
  await Promise.all(imgs.map(async i => {
    try { if (!i.complete) await new Promise((res, rej) => { i.onload = res; i.onerror = rej; }); await i.decode(); }
    catch (e) { broken.push(i.src); }
    if (!i.naturalWidth) broken.push(i.src);
  }));
  const fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight);
  return { images: imgs.length, broken: [...new Set(broken)], fonts: [...new Set(fonts)].length };
});
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: outPdf, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
await browser.close();
const size = fs.statSync(outPdf).size;
console.log(JSON.stringify({ out: outPdf, bytes: size, ...stats, requestErrors: errors.length }, null, 1));
if (stats.broken.length) { console.error('BROKEN IMAGES:\n' + stats.broken.join('\n')); process.exit(1); }
