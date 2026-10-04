// node card.mjs data.json out.jpg  -> 1600x900 branded scorecard
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const [,, dataPath, out, mode] = process.argv;
const SAFE = mode === 'safe';
const D = JSON.parse(readFileSync(dataPath, 'utf8'));
const logo = 'data:image/webp;base64,' + readFileSync(new URL('./logo.webp', import.meta.url)).toString('base64');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const q = (arr, n) => Array.from({ length: n }, (_, i) => arr[i] ?? '–');
const nq = Math.max(4, D.fla.q.length);
const head = q([], nq).map((_, i) => `<th>${i < 4 ? i + 1 : 'OT'}</th>`).join('');
const row = (t) => `<tr class="${t.win ? 'w' : ''}"><td class="tn">${esc(t.name)}</td>${q(t.q, nq).map((v) => `<td>${v}</td>`).join('')}<td class="t">${t.score}</td></tr>`;
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@600;700;800&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:1600px;height:900px;background:radial-gradient(ellipse at 30% 20%,#14306b 0%,#081b35 55%,#050f22 100%);color:#fff;font-family:Barlow,sans-serif;position:relative;overflow:hidden}
.bar{position:absolute;top:0;left:0;right:0;height:14px;background:#fa4616}
.stripe{position:absolute;right:-180px;top:-120px;width:620px;height:1200px;background:repeating-linear-gradient(135deg,rgba(250,70,22,.10) 0 26px,transparent 26px 70px);transform:rotate(0deg)}
.top{position:absolute;top:58px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:center}
.plate{display:flex;flex-direction:column;gap:10px}
.wm{font:800 64px/.9 'Barlow Condensed',sans-serif;letter-spacing:.06em;color:#fff;text-transform:uppercase}
.wm em{font-style:normal;color:#fa4616}
.wm-sub{font:700 18px/1 Barlow,sans-serif;letter-spacing:.32em;color:#9fb3d9;text-transform:uppercase;padding-top:10px;border-top:3px solid #fa4616;align-self:flex-start}
.kick{font:800 28px/1 'Barlow Condensed',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#ffb08f;text-align:right}
.kick b{display:block;font:800 74px/1 'Barlow Condensed',sans-serif;letter-spacing:.04em;color:#fff;margin-top:10px}
.score{position:absolute;top:250px;left:72px;right:72px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:30px}
.tm{font:800 64px/1 'Barlow Condensed',sans-serif;letter-spacing:.02em;text-transform:uppercase}
.tm small{display:block;font:700 24px/1 Barlow,sans-serif;letter-spacing:.14em;color:#9fb3d9;margin-bottom:12px}
.tm.r{text-align:right}
.num{font:800 190px/0.9 'Barlow Condensed',sans-serif;display:flex;gap:34px;align-items:center}
.num i{font-style:normal;width:46px;height:12px;background:#fa4616;display:block}
.num .lose{color:#8fa3c9}
table{position:absolute;left:72px;top:560px;width:720px;border-collapse:collapse;font:700 30px/1 'Barlow Condensed',sans-serif}
th{font:700 20px/1 Barlow,sans-serif;letter-spacing:.14em;color:#9fb3d9;padding:0 0 14px;text-align:center}
td{padding:14px 0;text-align:center;border-top:2px solid rgba(255,255,255,.14)}
td.tn{text-align:left;letter-spacing:.06em;text-transform:uppercase}
td.t{font-size:40px;color:#fa4616}
tr.w td.tn{color:#fff}
.lead{position:absolute;left:870px;right:72px;top:556px;display:grid;gap:18px}
.lead h3{font:700 20px/1 Barlow,sans-serif;letter-spacing:.14em;color:#9fb3d9}
.ld{border-left:6px solid #fa4616;padding:6px 0 6px 18px}
.ld b{display:block;font:800 30px/1.1 'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:.02em}
.ld span{font:600 22px/1.3 Barlow,sans-serif;color:#d6def0}
.foot{position:absolute;left:72px;right:72px;bottom:34px;display:flex;justify-content:space-between;font:700 18px/1 Barlow,sans-serif;letter-spacing:.14em;color:#7f93bb;text-transform:uppercase}
${SAFE ? 'body{background:#050f22}#c{position:absolute;left:200px;top:0;width:1200px;height:900px;overflow:hidden;background:radial-gradient(ellipse at 30% 20%,#14306b 0%,#081b35 55%,#050f22 100%)}#c .top,#c .score,#c .foot{left:56px;right:56px}#c table{left:56px;width:600px}#c .lead{left:700px;right:56px;top:530px;gap:12px}#c table{top:540px}#c .num{font-size:170px}#c .tm{font-size:56px}' : '#c{position:absolute;inset:0}'}</style></head><body><div id="c">
<div class="stripe"></div><div class="bar"></div>
<div class="top"><div class="plate"><div class="wm">Gator<em>Bait</em></div><div class="wm-sub">Live Game Desk</div></div><div class="kick">${esc(D.kicker)}<b>${esc(D.label)}</b></div></div>
<div class="score">
 <div class="tm"><small>${esc(D.fla.tag)}</small>Florida</div>
 <div class="num"><span class="${D.fla.score < D.opp.score ? 'lose' : ''}">${D.fla.score}</span><i></i><span class="${D.opp.score < D.fla.score ? 'lose' : ''}">${D.opp.score}</span></div>
 <div class="tm r"><small>${esc(D.opp.tag)}</small>${esc(D.opp.name)}</div>
</div>
<table><thead><tr><th style="text-align:left">SCORING</th>${head}<th>T</th></tr></thead><tbody>${row({ ...D.fla, name: 'Florida', win: D.fla.score > D.opp.score })}${row({ ...D.opp, win: D.opp.score > D.fla.score })}</tbody></table>
<div class="lead"><h3>LEADERS</h3>${D.leaders.map((l) => `<div class="ld"><b>${esc(l.name)}</b><span>${esc(l.line)}</span></div>`).join('')}</div>
<div class="foot"><span>${esc(D.where)}</span><span>Stats: ESPN · gatorbaitmedia.com</span></div>
</div></body></html>`;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: out, type: 'jpeg', quality: 88 });
await b.close();
console.log('ok', out);
