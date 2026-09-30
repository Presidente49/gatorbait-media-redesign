#!/usr/bin/env node
// Builds header-v2.html and footer-v2.html from src/*.src.html: minifies every <style> and <script> body with esbuild
// (no syntax lowering, so :has() and ES5 stay as written) and reports length + djb2 (h=5381; h=((h*33)^c)>>>0).
// Usage: NODE_PATH=<dir with esbuild> node deploy/shell-2026/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const esbuild = require('esbuild');
const here = dirname(fileURLToPath(import.meta.url));
const CAP = +(process.env.CAP || 15000);
export const djb2 = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h; };
// A <style data-pack id=X> block ships as a tiny script that rebuilds the identical CSS text into <style id=X> at the script's
// own position during parse (same cascade order, same timing). Markers: ^ = 'html:has(#gbm-site-header) ', ` = '#gbm-site-header',
// $ = '!important'. The build refuses CSS that already contains a marker, a quote or a backslash.
const PACK = [['html:has(#gbm-site-header) ', '^'], ['#gbm-site-header', '`'], ['!important', '$']];
export const unpack = (c) => c.replace(/\^/g, 'html:has(`) ').replace(/`/g, '#gbm-site-header').replace(/\$/g, '!important');
const pack = (html) => html.replace(/<style data-pack id="([^"]+)">([\s\S]*?)<\/style>/g, (_, id, css) => {
  const m = esbuild.transformSync(css, { loader: 'css', minify: true, target: 'chrome120' }).code.trim();
  if (/[\^`$'\\]/.test(m)) throw new Error('pack: CSS contains a marker, quote or backslash');
  let c = m; for (const [a, b] of PACK) c = c.split(a).join(b);
  if (unpack(c) !== m) throw new Error('pack: round trip failed');
  packed[id] = m;
  return '<script>(function(d,x,s){if(d.getElementById(' + JSON.stringify(id) + '))return;s=d.createElement("style");s.id=' + JSON.stringify(id) +
    ';s.textContent=' + JSON.stringify(c) + '.replace(/\\^/g,"html:has(`) ").replace(/`/g,"#gbm-site-header").replace(/\\$/g,"!important");' +
    'x&&x.parentNode?x.parentNode.insertBefore(s,x):d.head.appendChild(s)})(document,document.currentScript)</script>';
});
export const packed = {};
const min = (src) => pack(src)
  .replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (_, a, css, b) => a + esbuild.transformSync(css, { loader: 'css', minify: true, target: 'chrome120' }).code.trim() + b)
  .replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/g, (_, a, js, b) => a + esbuild.transformSync(js, { loader: 'js', minify: true, target: 'es2015', charset: 'utf8' }).code.trim() + b)
  .replace(/>\s+</g, '><').trim();
const out = {};
for (const [src, dest] of [['src/header.src.html', 'header-v2.html'], ['src/footer.src.html', 'footer-v2.html']]) {
  const html = min(readFileSync(join(here, src), 'utf8'));
  if (html.length > CAP) throw new Error(`${dest} is ${html.length} chars, over the ${CAP} cap`);
  writeFileSync(join(here, dest), html);
  out[dest] = { length: html.length, djb2: djb2(html), headroom: CAP - html.length };
}
for (const f of ['header-live.html', 'footer-live.html']) { const s = readFileSync(join(here, f), 'utf8'); out[f] = { length: s.length, djb2: djb2(s) }; }
console.log(JSON.stringify(out, null, 2));
