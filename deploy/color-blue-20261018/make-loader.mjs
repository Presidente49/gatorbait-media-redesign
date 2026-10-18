// node make-loader.mjs <40-hex main commit> -> 0c13f955-rev19.html (live rev 18 text with the pin and path changed). Prints length and djb2.
import fs from 'node:fs';
const sha = process.argv[2]; if (!/^[0-9a-f]{40}$/.test(sha || '')) { console.error('need 40-hex'); process.exit(1); }
const d = new URL('.', import.meta.url).pathname;
const live = fs.readFileSync(d + 'rollback/0c13f955-rev18.html', 'utf8');
const old = '10bf36420faa2f3d5a631ce8c7a47518b5183c10/sports-live/broadcast-home.js';
if (live.split(old).length !== 2) throw new Error('pin not found once');
let out = live.replace(old, () => sha + '/sports-live/broadcast-home-color.js').replace('src=10bf364 Broadcast S1', () => 'src=' + sha.slice(0, 7) + ' Broadcast S1 color pass');
const h = s => { let x = 5381; for (const c of s) x = ((x * 33) ^ c.charCodeAt(0)) >>> 0; return x.toString(16); };
fs.writeFileSync(d + '0c13f955-rev19.html', out); console.log(out.length, h(out));
