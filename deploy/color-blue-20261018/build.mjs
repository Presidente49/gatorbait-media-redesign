// Build sports-live/broadcast-home-color.js = the live pin's skin (base-10bf364.js) + color-add.css appended to its CSS string.
// Run: node deploy/color-blue-20261018/build.mjs [--check]
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const R = fileURLToPath(new URL('../../', import.meta.url)), D = R + 'deploy/color-blue-20261018/';
const base = fs.readFileSync(D + 'base-10bf364.js', 'utf8');
const css = fs.readFileSync(D + 'color-add.css', 'utf8');
if (/[`]|\$\{/.test(css)) throw new Error('css must not contain backticks or ${');
const anchor = '\n`;\nfunction css(){';
if (base.split(anchor).length !== 2) throw new Error('anchor not unique');
const out = base.replace(anchor, () => '\n`;\nC += `\n' + css + '`;\nfunction css(){');
const f = R + 'sports-live/broadcast-home-color.js';
if (process.argv.includes('--check')) { if (fs.readFileSync(f, 'utf8') !== out) { console.error('STALE'); process.exit(1); } console.log('current', out.length); }
else { fs.writeFileSync(f, out); console.log('wrote', f, out.length); }
