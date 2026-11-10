#!/usr/bin/env node
// Phone PDF edition of a postgame web issue (layout "postgame"), built from the issue JSON only.
// Same sections and order as the web edition; nothing is written here that is not in the JSON
// (apart from fixed furniture: masthead, running head, "Read at gatorbaitmedia.com", page numbers).
//
//   node tools/magazine-pdf/phone-edition/build.mjs <issue.json> <out.html> [cacheDir]
//
// Output is ONE self-contained HTML file: Barlow / Barlow Condensed and every photo are embedded as data
// URIs (fetched once with curl into cacheDir, so the egress proxy is honored). Pages are fixed 390 x 844 pt
// boxes; a small inline packer moves whole blocks onto pages, so nothing is ever split across a page.
// Print it with render.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const [issuePath, outHtml, cacheArg] = process.argv.slice(2);
if (!outHtml) { console.error('usage: build.mjs <issue.json> <out.html> [cacheDir]'); process.exit(2); }
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../..');
const CACHE = path.resolve(cacheArg || path.join(path.dirname(outHtml), 'cache'));
fs.mkdirSync(CACHE, { recursive: true });
const I = JSON.parse(fs.readFileSync(issuePath, 'utf8'));
const SITE = 'https://www.gatorbaitmedia.com';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (u) => (/^https?:\/\//.test(u) ? u : SITE + (u.startsWith('/') ? u : '/' + u));
const shown = (u) => abs(u).replace(/^https?:\/\/(www\.)?/, '');
const curl = (url, file) => {
  if (!fs.existsSync(file) || !fs.statSync(file).size) execFileSync('curl', ['-sS', '--fail', '-L', '-A', UA, '-o', file, url], { stdio: 'inherit' });
  return file;
};
const dataUri = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;

// ---- fonts: Barlow + Barlow Condensed only (latin subset), embedded --------------------------------------------
const FONT_CSS_URL = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap';
const gcss = fs.readFileSync(curl(FONT_CSS_URL, path.join(CACHE, 'fonts.css')), 'utf8');
let fontCss = '';
for (const m of gcss.matchAll(/\/\* ([\w-]+) \*\/\s*@font-face \{([^}]*)\}/g)) {
  if (m[1] !== 'latin') continue;
  const fam = /font-family: '([^']+)'/.exec(m[2])[1], w = /font-weight: (\d+)/.exec(m[2])[1], url = /url\((https[^)]+)\)/.exec(m[2])[1];
  const f = curl(url, path.join(CACHE, `${fam.replace(/ /g, '')}-${w}.woff2`));
  fontCss += `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};src:url(${dataUri(f, 'font/woff2')}) format('woff2')}\n`;
}
if ((fontCss.match(/@font-face/g) || []).length !== 7) { console.error('expected 7 font faces'); process.exit(1); }

// ---- photos: Wix media by id, as filed in the issue JSON ---------------------------------------------------------
const photo = (im, w = 1100) => {
  const h = Math.round(w * (im.height / im.width)), ext = im.ext || 'jpg';
  const f = curl(`https://static.wixstatic.com/media/${im.id}~mv2.${ext}/v1/fit/w_${w},h_${h},q_80/x.${ext}`, path.join(CACHE, `${im.id}-${w}.${ext}`));
  return dataUri(f, ext === 'png' ? 'image/png' : 'image/jpeg');
};
const usedCredits = [];
const fig = (im, cls = '') => {
  if (!im || !im.id) return '';
  if (im.credit && !usedCredits.includes(im.credit)) usedCredits.push(im.credit);
  return `<figure class="ph ${cls}"><img src="${photo(im)}" alt="${esc(im.alt)}"><figcaption>${esc(im.credit)}</figcaption></figure>`;
};

// ---- blocks ------------------------------------------------------------------------------------------------------
const B = [];                                   // flow blocks, packed onto pages in the browser
const blk = (html, o = {}) => B.push(`<div class="b${o.cls ? ' ' + o.cls : ''}"${o.id ? ` id="${o.id}"` : ''}${o.brk ? ' data-break="1"' : ''}${o.kwn ? ' data-kwn="1"' : ''}>${html}</div>`);
const head = (S, id, brk = false) => blk(`<p class="kick">${esc(S.kicker)}</p><h2>${esc(S.title)}</h2>${S.dek ? `<p class="dek">${esc(S.dek)}</p>` : ''}`, { cls: 'sh', id, brk, kwn: true });
const src = (t) => t && blk(`<p class="src">${esc(t)}</p>`, { cls: 'srcb' });
const readLink = (url, label = 'Read at gatorbaitmedia.com') => `<p class="go"><a class="btn" href="${esc(abs(url))}">${esc(label)}</a></p><p class="url"><a href="${esc(abs(url))}">${esc(shown(url))}</a></p>`;

const { cover: C, final: F, contents: T, damage: D, scoring: S, box: X, flow: W, quotes: Q, watch: V, next: N, reference: R, credits: K } = I;

// cover (its own full page)
const coverImg = (() => { if (C.image.credit) usedCredits.push(C.image.credit); return photo(C.image, 1600); })();
const coverHtml = `<section class="page cover" id="cover">
<img class="bg" src="${coverImg}" alt="${esc(C.image.alt)}"><div class="shade"></div>
<div class="top"><p class="mast">Gator<span>Bait</span></p><p class="mag">Magazine</p><p class="date">${esc(I.issue.number)} · ${esc(I.issue.date)}</p></div>
<div class="low"><p class="kick">${esc(C.kicker)}</p><h1>${esc(C.coverTitle)}</h1>
<p class="chip"><span>${esc(C.score.away)} <b>${esc(C.score.awayScore)}</b></span><span>${esc(C.score.home)} <b>${esc(C.score.homeScore)}</b></span><em>${esc(C.score.label)}</em></p>
<p class="wk">${esc(I.issue.week)}</p>
<ul class="tz">${C.teasers.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
<p class="cr">${esc(C.image.credit)}</p></div></section>`;

// final + game story + contents
blk(`<p class="kick">${esc(F.label)}</p><div class="fs">${F.teams.map((t) => `<p class="${t.won ? 'won' : ''}"><span>${esc(t.name)}</span><b>${esc(t.score)}</b></p>`).join('')}</div><ul class="meta">${F.meta.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>`, { cls: 'final', id: 'final' });
blk(`<h2 class="lead">${esc(C.headline)}</h2><p class="by">${esc(C.byline)}</p><p class="dek">${esc(C.dek)}</p>${readLink(C.url, C.cta)}`, { cls: 'story' });
blk(`<p class="kick">${esc(T.label)}</p><ol class="toc">${T.items.map((t) => `<li><a href="#${esc(t.id)}"><span>${esc(t.label)}</span><i data-pg="${esc(t.id)}"></i></a></li>`).join('')}</ol>${C.lines ? `<p class="kick sub">${esc(C.linesLabel)}</p><ul class="lines">${C.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}`, { cls: 'tocb' });

// columns + more coverage
for (const key of ['columns', 'coverage']) {
  const P = I[key]; head(P, key);
  for (const it of P.items) blk(`${fig(it.image)}<p class="rub">${esc(it.rubric)}</p><h3>${esc(it.title)}</h3><p class="by">By ${esc(it.author)}</p><p class="dek">${esc(it.dek)}</p>${readLink(it.url)}`, { cls: 'card' });
}

// by the numbers
head(D, 'damage');
const ymax = Math.max(...D.yards.rows.map((r) => r.value));
blk(`<p class="lab">${esc(D.yards.label)}</p>${D.yards.rows.map((r) => `<div class="bar${r.us ? ' us' : ''}"><span>${esc(r.name)}</span><div><i style="width:${(100 * r.value / ymax).toFixed(1)}%"></i></div><b>${esc(r.value)}</b></div>`).join('')}`, { cls: 'yards' });
for (const s of D.stats) blk(`<p class="v">${esc(s.value)}</p><div><p class="l">${esc(s.label)}</p><p class="d">${esc(s.detail)}</p></div>`, { cls: 'stat' });
src(D.source);

// score by score
head(S, 'scoring');
blk(`<table class="ls"><thead><tr><th></th>${S.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${S.rows.map((r) => `<tr class="${r.us ? 'us' : ''}"><th>${esc(r.team)}</th>${r.q.map((q) => `<td>${esc(q)}</td>`).join('')}<td class="f">${esc(r.f)}</td></tr>`).join('')}</tbody></table>`, { cls: 'lsb' });
for (const p of S.plays) blk(`<p class="w">${esc(p.when)}</p><div><p class="p">${esc(p.play)}</p><p class="s">${esc(p.score)}</p></div>`, { cls: 'play' + (p.uf ? ' uf' : '') });
src(S.source);

// box score
head(X, 'box');
blk(`<table class="bx"><thead><tr><th></th>${X.cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${X.rows.map((r) => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</tbody></table>`, { cls: 'bxb' });
for (const L of X.leaders) blk(`<p class="lab">${esc(L.team)}</p><dl>${L.items.map((i) => `<dt>${esc(i[0])}</dt><dd>${esc(i[1])}</dd>`).join('')}</dl>`, { cls: 'lead' });
src(X.source);

// game flow: static SVG from the win-probability points
head(W, 'flow');
{
  const pts = W.points, n = pts.length, x0 = 38, x1 = 346, y0 = 12, y1 = 204;
  const x = (i) => x0 + (x1 - x0) * i / (n - 1), y = (v) => y0 + (y1 - y0) * (1 - v / 100);
  const line = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join('');
  const qs = W.quarterStarts, qe = [...qs.slice(1), n - 1];
  const svg = `<svg viewBox="0 0 350 232" role="img" aria-label="${esc(W.summary)}"><desc>${esc(W.summary)}</desc>
${qs.map((q, k) => (k % 2 ? `<rect x="${x(q).toFixed(1)}" y="${y0}" width="${(x(qe[k]) - x(q)).toFixed(1)}" height="${y1 - y0}" fill="#f1f4f8"/>` : '')).join('')}
${W.axis.map((a) => { const v = parseFloat(a); return `<line x1="${x0}" x2="${x1}" y1="${y(v)}" y2="${y(v)}" stroke="${v === 50 ? '#8a96a8' : '#c9d1dc'}" stroke-width="${v === 50 ? 1 : .75}"${v === 50 ? ' stroke-dasharray="4 3"' : ''}/><text x="${x0 - 5}" y="${y(v) + 4}" text-anchor="end" class="ax">${esc(a)}</text>`; }).join('')}
${qs.map((q, k) => `<text x="${((x(q) + x(qe[k])) / 2).toFixed(1)}" y="${y1 + 19}" text-anchor="middle" class="qx">${esc(W.quarters[k])}</text>`).join('')}
<path d="${line}L${x1} ${y1}L${x0} ${y1}Z" fill="#10264b" opacity=".08"/>
<path d="${line}" fill="none" stroke="#10264b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
${W.marks.map((m, k) => `<circle cx="${x(m.i).toFixed(1)}" cy="${y(pts[m.i]).toFixed(1)}" r="8" fill="#fa4616" stroke="#fff" stroke-width="1.5"/><text x="${x(m.i).toFixed(1)}" y="${(y(pts[m.i]) + 3.8).toFixed(1)}" text-anchor="middle" class="mk">${k + 1}</text>`).join('')}
</svg>`;
  blk(svg, { cls: 'chart' });
  W.marks.forEach((m, k) => blk(`<p class="n">${k + 1}</p><div><p class="t">${esc(m.title)}</p><p class="d">${esc(m.note)}</p></div>`, { cls: 'mark' }));
  src(W.source);
}

// in their words
head(Q, 'quotes');
for (const q of Q.items) blk(`<blockquote>“${esc(q.text)}”</blockquote><p class="who">${esc(q.who)}</p><p class="role">${esc(q.role)}</p>`, { cls: 'quote' });

// watch
if (V && V.items && V.items.length) {
  head(V, 'watch');
  for (const v of V.items) {
    const poster = path.join(REPO, 'sports-live/reels', v.poster || '');
    if (v.credit && !usedCredits.includes(v.credit)) usedCredits.push(v.credit);
    blk(`${v.poster && fs.existsSync(poster) ? `<figure class="ph vid"><a href="${esc(v.url)}"><img src="${dataUri(poster, 'image/jpeg')}" alt="${esc(v.title)}"></a><figcaption>${esc(v.credit)}</figcaption></figure>` : ''}<p class="rub">${esc(v.meta)}</p><h3>${esc(v.title)}</h3><p class="dek">${esc(v.caption)}</p><p class="go"><a class="btn" href="${esc(v.url)}">Watch on YouTube</a></p><p class="url"><a href="${esc(v.url)}">${esc(shown(v.url))}</a></p>`, { cls: 'card' });
  }
}

// up next
blk(`<p class="kick">${esc(N.kicker)}</p><h2>${esc(N.title)}</h2><ul class="meta">${N.meta.map((m) => `<li>${esc(m)}</li>`).join('')}</ul><p class="dek">${esc(N.note)}</p>`, { cls: 'sh nx', id: "next", kwn: true });
if (N.pickem) blk(`<p class="badge">${esc(N.pickem.badge)}</p><h3>${esc(N.pickem.title)}</h3><p class="dek">${esc(N.pickem.text)}</p>`, { cls: 'pick' });

// more GatorBait, credits, sources
blk(`<p class="kick">${esc(R.label)}</p><ul class="more">${R.links.map((l) => `<li><a href="${esc(abs(l.url))}"><b>${esc(l.label)}</b><span>${esc(shown(l.url))}</span></a></li>`).join('')}</ul>`, { cls: 'ref', id: 'more' });
const creditLines = [...new Set([...usedCredits, ...(K.other || [])])];
blk(`<p class="kick">${esc(K.label)}</p>${creditLines.map((c) => `<p class="cl">${esc(c)}</p>`).join('')}<p class="src">${esc(I.asOf)}</p><p class="back"><a href="#cover">${esc(R.top)}</a></p>`, { cls: 'creds', id: 'credits' });

// ---- page shell ---------------------------------------------------------------------------------------------------
const css = `
${fontCss}
@page{size:390pt 844pt;margin:0}
*{box-sizing:border-box;margin:0;padding:0;font-style:normal}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#5b6472}
body{font:400 15pt/1.42 Barlow,sans-serif;color:#16233a;width:390pt;margin:0 auto}
a{color:inherit;text-decoration:none}
i,em{font-style:normal}
.page{width:390pt;height:844pt;position:relative;overflow:hidden;background:#fff;break-after:page;page-break-after:always}
.page:last-of-type{break-after:auto;page-break-after:auto}
#gb-src{position:absolute;left:-9999pt;top:0;width:350pt}
.rh{position:absolute;left:0;right:0;top:0;height:40pt;background:#10264b;color:#fff;padding:0 20pt;display:flex;align-items:center;justify-content:space-between;font:700 13pt/1 'Barlow Condensed',sans-serif;letter-spacing:.08em;text-transform:uppercase}
.rh b{font-weight:800;font-size:17pt;letter-spacing:.02em}.rh b span{color:#fa4616}
.rh:after{content:'';position:absolute;left:0;right:0;bottom:-3pt;height:3pt;background:#fa4616}
.body{position:absolute;left:20pt;right:20pt;top:58pt;height:746pt;overflow:hidden}
.pn{position:absolute;left:20pt;right:20pt;bottom:12pt;display:flex;justify-content:space-between;font:600 11.5pt/1 'Barlow Condensed',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#5f6b7d}
.b{padding-bottom:16pt}
.kick{font:700 13pt/1.1 'Barlow Condensed',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#fa4616}
.kick.sub{margin-top:16pt}
h2{font:800 30pt/1.02 'Barlow Condensed',sans-serif;color:#10264b;margin-top:5pt;text-wrap:balance}
h3{font:700 23pt/1.08 'Barlow Condensed',sans-serif;color:#10264b;margin-top:3pt;text-wrap:balance}
.dek{font-size:15pt;line-height:1.4;margin-top:7pt;color:#27364f}
.sh{border-top:4pt solid #10264b;padding-top:11pt;padding-bottom:16pt}
.by{font:700 14pt/1.2 Barlow,sans-serif;color:#10264b;margin-top:6pt}
.rub{font:700 12.5pt/1.1 'Barlow Condensed',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#fa4616;margin-top:9pt}
.go{margin-top:10pt}
.btn{display:inline-block;background:#10264b;color:#fff;font:700 14pt/1 'Barlow Condensed',sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:9pt 14pt 8pt;border-radius:3pt}
.url{font:500 11.5pt/1.3 Barlow,sans-serif;color:#44546c;margin-top:6pt;overflow-wrap:anywhere}
.url a{text-decoration:underline;text-decoration-color:#b9c2cf}
.ph img{display:block;width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:3pt;background:#dfe4eb}
.ph.vid img{aspect-ratio:16/9}
.ph figcaption{font:500 11pt/1.3 Barlow,sans-serif;color:#5f6b7d;margin-top:4pt}
.card{border-bottom:1pt solid #d5dbe4;margin-bottom:16pt;padding-bottom:18pt}
.card .ph+.rub{margin-top:11pt}.card>.rub:first-child{margin-top:0}
.src{font:500 11.5pt/1.35 Barlow,sans-serif;color:#5f6b7d}
.lab{font:700 13pt/1.1 'Barlow Condensed',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#10264b;margin-bottom:8pt}
.meta{list-style:none;margin-top:10pt}.meta li{font:600 15pt/1.35 Barlow,sans-serif;color:#10264b;padding:5pt 0;border-bottom:1pt solid #d5dbe4}
/* cover */
.cover{background:#10264b;color:#fff}
.cover .bg{position:absolute;left:0;top:40pt;width:390pt;height:390pt;object-fit:cover;object-position:56% 100%}
.cover .shade{position:absolute;left:0;top:0;width:390pt;height:431pt;background:linear-gradient(180deg,rgba(16,38,75,.94) 0,rgba(16,38,75,.78) 17%,rgba(16,38,75,.2) 36%,rgba(16,38,75,0) 56%,rgba(16,38,75,.7) 86%,#10264b 100%)}
.cover .top{position:absolute;left:20pt;right:20pt;top:22pt}
.mast{font:800 58pt/.86 'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:-.005em}.mast span{color:#fa4616}
.mag{font:700 19pt/1 'Barlow Condensed',sans-serif;letter-spacing:.42em;text-transform:uppercase;margin-top:5pt}
.date{font:600 12.5pt/1.2 'Barlow Condensed',sans-serif;letter-spacing:.1em;text-transform:uppercase;margin-top:8pt;color:#e6ebf3}
.cover .low{position:absolute;left:20pt;right:20pt;top:392pt;bottom:16pt;display:flex;flex-direction:column}
.cover .kick{color:#fff;background:#fa4616;align-self:flex-start;padding:5pt 8pt 4pt}
.cover h1{font:800 76pt/.86 'Barlow Condensed',sans-serif;text-transform:uppercase;margin-top:10pt;letter-spacing:-.01em}
.chip{display:flex;align-items:center;gap:12pt;margin-top:12pt;font:700 21pt/1 'Barlow Condensed',sans-serif;text-transform:uppercase;letter-spacing:.03em}
.chip b{color:#fa4616;font-weight:800;font-size:26pt;margin-left:3pt}.chip em{font-size:12.5pt;letter-spacing:.14em;border:1pt solid rgba(255,255,255,.55);padding:4pt 7pt 3pt;border-radius:2pt}
.wk{font:600 13pt/1.2 'Barlow Condensed',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#cfd8e6;margin-top:8pt}
.tz{list-style:none;margin-top:12pt;border-top:1pt solid rgba(255,255,255,.3)}
.tz li{font:600 15pt/1.25 Barlow,sans-serif;padding:7.5pt 0 7.5pt 14pt;border-bottom:1pt solid rgba(255,255,255,.3);position:relative}
.tz li:before{content:'';position:absolute;left:0;top:13pt;width:6pt;height:6pt;background:#fa4616}
.cover .cr{margin-top:auto;font:500 11pt/1.2 Barlow,sans-serif;color:#b9c5d8}
/* final */
.final .fs{margin-top:8pt;border-top:4pt solid #10264b}
.fs p{display:flex;justify-content:space-between;align-items:baseline;font:700 34pt/1 'Barlow Condensed',sans-serif;text-transform:uppercase;color:#5f6b7d;padding:9pt 0 6pt;border-bottom:1pt solid #d5dbe4}
.fs p b{font-weight:800;font-size:50pt}.fs p.won{color:#10264b}.fs p.won b{color:#fa4616}
.story{background:#f1f4f8;border-left:4pt solid #fa4616;padding:14pt 14pt 14pt;margin-bottom:18pt}
.story h2{margin-top:0;font-size:27pt}
.toc{list-style:none;margin-top:8pt;border-top:2pt solid #10264b}
.toc a{display:flex;justify-content:space-between;align-items:baseline;font:600 16pt/1.2 Barlow,sans-serif;color:#10264b;padding:6.5pt 0;border-bottom:1pt solid #d5dbe4}
.toc i{font:700 15pt/1 'Barlow Condensed',sans-serif;color:#fa4616}
.lines{list-style:none;margin-top:6pt}.lines li{font-size:15pt;line-height:1.3;padding:4pt 0 4pt 13pt;position:relative}
.lines li:before{content:'';position:absolute;left:0;top:11pt;width:5pt;height:5pt;background:#fa4616}
/* numbers */
.bar{display:grid;grid-template-columns:82pt 1fr 46pt;align-items:center;gap:8pt;margin-bottom:7pt;font:700 17pt/1 'Barlow Condensed',sans-serif;text-transform:uppercase;color:#10264b}
.bar div{height:22pt;background:#e9edf3}.bar i{display:block;height:100%;background:#10264b}.bar.us i{background:#fa4616}.bar b{font:800 24pt/1 'Barlow Condensed',sans-serif;text-align:right}
.stat{display:grid;grid-template-columns:92pt 1fr;gap:12pt;align-items:start;border-top:1pt solid #d5dbe4;padding-top:11pt;padding-bottom:11pt}
.stat .v{font:800 38pt/.95 'Barlow Condensed',sans-serif;color:#fa4616}
.stat .l{font:700 16pt/1.2 Barlow,sans-serif;color:#10264b}.stat .d{font-size:15pt;line-height:1.38;margin-top:3pt}
/* tables */
table{width:100%;border-collapse:collapse}
.ls th,.ls td{font:700 19pt/1 'Barlow Condensed',sans-serif;padding:10pt 4pt 8pt;text-align:center;border-bottom:1pt solid #d5dbe4;color:#10264b}
.ls thead th{font-size:13pt;letter-spacing:.1em;color:#5f6b7d;border-bottom:2pt solid #10264b}
.ls tbody th{text-align:left;text-transform:uppercase}.ls .f{font-weight:800;font-size:23pt}.ls .us .f{color:#fa4616}
.play{display:grid;grid-template-columns:62pt 1fr;gap:10pt;border-top:1pt solid #d5dbe4;padding-top:10pt;padding-bottom:10pt}
.play .w{font:700 16pt/1.25 'Barlow Condensed',sans-serif;letter-spacing:.04em;color:#10264b}
.play .p{font-size:15pt;line-height:1.35}.play .s{font:700 15pt/1.3 'Barlow Condensed',sans-serif;letter-spacing:.06em;color:#5f6b7d;margin-top:2pt}
.play.uf .w,.play.uf .s{color:#fa4616}.play.uf .p{font-weight:600}
.bx th,.bx td{padding:8pt 4pt 7pt;border-bottom:1pt solid #d5dbe4;vertical-align:top;text-align:left}
.bx thead th{font:700 14pt/1 'Barlow Condensed',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#10264b;border-bottom:2pt solid #10264b}
.bx tbody th{font:500 15pt/1.25 Barlow,sans-serif;color:#44546c;width:36%}
.bx td{font:700 16.5pt/1.2 'Barlow Condensed',sans-serif;color:#10264b;width:32%}
.lead dl{border-top:2pt solid #10264b}.lead dt{font:700 12.5pt/1 'Barlow Condensed',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#fa4616;padding-top:8pt}
.lead dd{font-size:15pt;line-height:1.35;padding:2pt 0 7pt;border-bottom:1pt solid #d5dbe4}
/* flow */
.chart svg{display:block;width:350pt;height:232pt}
.chart .ax{font:600 10.5px 'Barlow Condensed',sans-serif;fill:#5f6b7d}.chart .qx{font:700 11.5px 'Barlow Condensed',sans-serif;fill:#10264b;letter-spacing:.08em}.chart .mk{font:800 10.5px 'Barlow Condensed',sans-serif;fill:#fff}
.mark{display:grid;grid-template-columns:26pt 1fr;gap:10pt;border-top:1pt solid #d5dbe4;padding-top:10pt;padding-bottom:10pt}
.mark .n{width:24pt;height:24pt;border-radius:50%;background:#fa4616;color:#fff;font:800 15pt/24pt 'Barlow Condensed',sans-serif;text-align:center}
.mark .t{font:800 20pt/1 'Barlow Condensed',sans-serif;color:#10264b}.mark .d{font-size:15pt;line-height:1.36;margin-top:3pt}
/* quotes */
.quote{border-left:4pt solid #fa4616;padding:2pt 0 2pt 14pt;margin-bottom:20pt}
.quote blockquote{font:600 18.5pt/1.3 Barlow,sans-serif;color:#10264b}
.quote .who{font:800 16pt/1.1 'Barlow Condensed',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#fa4616;margin-top:9pt}
.quote .role{font:500 13pt/1.3 Barlow,sans-serif;color:#44546c;margin-top:2pt}
/* next */
.pick{background:#10264b;color:#fff;padding:14pt;margin-bottom:18pt}
.pick .badge{display:inline-block;background:#fa4616;font:700 12.5pt/1 'Barlow Condensed',sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:5pt 8pt 4pt}
.pick h3{color:#fff;margin-top:9pt}.pick .dek{color:#fff}
.more{list-style:none;margin-top:6pt;border-top:2pt solid #10264b}
.more a{display:block;padding:7pt 0;border-bottom:1pt solid #d5dbe4}.more b{display:block;font:700 16pt/1.2 Barlow,sans-serif;color:#10264b}
.more span{display:block;font:500 11.5pt/1.3 Barlow,sans-serif;color:#44546c;overflow-wrap:anywhere;text-decoration:underline;text-decoration-color:#b9c2cf}
.creds .cl{font:500 13pt/1.35 Barlow,sans-serif;margin-top:4pt}.creds .src{margin-top:12pt}
.back{margin-top:14pt}.back a{font:700 14pt/1 'Barlow Condensed',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#fa4616}
@media screen{.page{margin:12pt auto}}
`;

// Packer: whole blocks only. A heading (data-kwn) never ends a page; data-break starts a new one.
const packer = `
(async function(){
  await document.fonts.ready;
  await Promise.all([...document.images].map(function(i){return i.decode().catch(function(){});}));
  var flow=document.getElementById("gb-src"), blocks=[].slice.call(flow.children), n=1, cur=null;
  var HEAD=${JSON.stringify(`<div class="rh"><b>Gator<span>Bait</span></b><span>${esc(I.issue.number)}</span></div>`)};
  var FOOT=${JSON.stringify(esc(I.cover.score.away + ' ' + I.cover.score.awayScore + ', ' + I.cover.score.home + ' ' + I.cover.score.homeScore))};
  function page(){ n++; var p=document.createElement('section'); p.className='page'; p.dataset.n=n;
    p.innerHTML=HEAD+'<div class="body"></div><div class="pn"><span>'+FOOT+'</span><span>'+n+'</span></div>'; document.body.insertBefore(p,flow); cur=p.querySelector('.body'); return cur; }
  function over(){ return cur.scrollHeight>cur.clientHeight+1; }
  page();
  blocks.forEach(function(b){
    if(b.dataset.break&&cur.children.length) page();
    cur.appendChild(b);
    if(over()&&cur.children.length>1){
      var mv=[b], prev=b.previousElementSibling;
      while(prev&&prev.dataset.kwn&&prev.previousElementSibling){ mv.unshift(prev); prev=prev.previousElementSibling; }
      var old=cur; page(); mv.forEach(function(m){cur.appendChild(m);}); void old;
    }
  });
  flow.remove();
  [].forEach.call(document.querySelectorAll('[data-pg]'),function(e){ var t=document.getElementById(e.dataset.pg), p=t&&t.closest('.page'); e.textContent=p?p.dataset.n:''; });
  document.documentElement.dataset.ready='1';
})();`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(I.issue.pageTitle)}</title><style>${css}</style></head><body>
${coverHtml.replace('class="page cover"', 'class="page cover" data-n="1"')}
<div id="gb-src">${B.join('\n')}</div>
<script>${packer}</script></body></html>`;
fs.writeFileSync(outHtml, html);
console.log(JSON.stringify({ out: outHtml, bytes: html.length, blocks: B.length, credits: creditLines }, null, 1));
