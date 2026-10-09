#!/usr/bin/env node
// Build the standalone print edition of a GatorBait Magazine issue.
//   node build-print.mjs <issue.json> <posts.json> <out.html>
// issue.json is the same file the live /magazine loader renders; posts.json comes from extract-posts.py
// (full article bodies). Every image is a Wix media id rendered through static.wixstatic.com.
// Pure data in, one self-contained HTML out. render-pdf.mjs turns it into the PDF.
import fs from 'node:fs';

const [issuePath, postsPath, outPath] = process.argv.slice(2);
if (!outPath) { console.error('usage: build-print.mjs <issue.json> <posts.json> <out.html>'); process.exit(2); }
const D = JSON.parse(fs.readFileSync(issuePath, 'utf8'));
const P = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
const byUrl = new Map(P.posts.map(p => [p.url, p]));

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const q = s => String(s == null ? '' : s).replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
const media = (img, w = 1600, h = 1600, mode = 'fit') => img && img.id ? `https://static.wixstatic.com/media/${img.id}~mv2.${img.ext || 'jpg'}/v1/${mode}/w_${w},h_${h},al_c,q_78/${img.id}.${img.ext === 'png' ? 'png' : 'jpg'}` : '';
const fig = (img, cls = '', w = 1600, h = 1600, mode = 'fit') => {
  if (!img || !img.id) return '';
  const credit = q(img.credit || '');
  return `<figure class="ph ${cls}"><img src="${media(img, w, h, mode)}" alt="${esc(q(img.alt || ''))}">${credit ? `<figcaption>${esc(credit)}</figcaption>` : ''}</figure>`;
};
const site = u => /^https?:/.test(u) ? u : 'https://www.gatorbaitmedia.com' + u;

// Article body: resolve inline Wix media, drop the duplicate cover image and a leading "By <author>" line.
function body(post) {
  let h = post.html || '';
  if (post.cover) h = h.replace(new RegExp(`<figure><img data-media="${post.cover.id}"[^>]*>(<figcaption>[^<]*</figcaption>)?</figure>`), '');
  h = h.replace(/<img data-media="([^"]+)" data-ext="([^"]+)" alt="([^"]*)">/g, (m, id, ext, alt) => `<img src="${media({ id, ext }, 1400, 1400)}" alt="${alt}">`);
  h = h.replace(new RegExp(`^(<p><strong>By ${esc(post.author)}\\.?</strong></p>|<p>By ${esc(post.author)}\\.?</p>)`), '');
  h = h.replace(/<a href="[^"]*">/g, '').replace(/<\/a>/g, '');   // links are not useful on paper
  return q(h);
}
const when = iso => { const d = new Date(iso); if (!iso || isNaN(d)) return ''; const m = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']; return `${m[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };

function story(post, { kicker, image, title, cls = '', lede = '' } = {}) {
  if (!post) return '';
  const cap = (post.html || '').match(/<figcaption>([^<]*)<\/figcaption>/);
  const img = image && image.id ? image : (post.cover ? { ...post.cover, credit: cap ? cap[1] : '' } : null);
  return `<article class="story ${cls}" id="${esc(post.url.replace(/[^a-z0-9]+/gi, '-'))}">
<header class="story-h">${kicker ? `<p class="kick">${esc(q(kicker))}</p>` : ''}<h2>${esc(q(title || post.title))}</h2>${lede ? `<p class="lede">${esc(q(lede))}</p>` : ''}<p class="by">By ${esc(post.author)} <span>${esc(when(post.published))}</span></p></header>
${fig(img, 'story-ph', 1300, 900)}
<div class="body">${body(post)}</div>
</article>`;
}

const I = D.issue || {}, C = D.cover || {}, G = D.game || {}, L = D.lead || {};
const teams = G.teams || [];
const cards = (D.cards && D.cards.items) || [];
const coverPost = byUrl.get(C.url), leadPost = byUrl.get(L.url);

const cover = `<section class="cover">
<img class="cover-img" src="${media(C.image, 2200, 1700, 'fill')}" alt="${esc(q(C.image && C.image.alt))}">
<div class="cover-shade"></div>
<div class="mast"><span class="wm">Gator<em>Bait</em></span><span class="mz">Magazine</span></div>
<div class="ed"><b>${esc(I.number)}</b><span>${esc(I.week)} · ${esc(I.date)}</span></div>
<div class="cover-type"><p class="kick">${esc(q(C.kicker))}</p><h1>${esc(q(C.headline))}</h1><p class="dek">${esc(q(C.dek))}</p></div>
<div class="cover-foot"><span>${esc(q(I.name))}</span><span>${esc(q(C.image && C.image.credit))}</span></div>
</section>`;

const chips = (G.chips || []).map(c => `<div class="chip"><b>${esc(c.k)}</b><span>${esc(q(c.v))}</span></div>`).join('');
const pred = G.predictor ? `<div class="chip"><b>${esc(G.predictor.label)}</b><span>Florida ${esc(G.predictor.florida)}%</span></div>` : '';
const tape = (D.tape && D.tape.rows || []).map(r => `<tr><td>${esc(r.label)}</td><td>${esc(r.fla)}</td><td>${esc(r.miz)}</td></tr>`).join('');
const keys = (D.keys && D.keys.items || []).map((k, i) => `<div class="key"><b>${i + 1}. ${esc(q(k.h))}</b><p>${esc(q(k.p))}</p></div>`).join('');
const watch = (D.watch && D.watch.items || []).map(w => `<tr><th>${esc(w.k)}</th><td>${esc(q(w.v))}</td></tr>`).join('');
const slate = (D.slate && D.slate.games || []).map(g => {
  const t = x => `${x.rank ? `No. ${x.rank} ` : ''}${x.name} (${x.rec})`;
  return `<tr class="${g.hero ? 'hero' : ''}"><td>${esc(g.time)}</td><td>${esc(t(g.away))} at ${esc(t(g.home))}${g.note ? ` <i>${esc(q(g.note))}</i>` : ''}</td><td>${esc(g.tv)}</td><td>${esc(g.line || '')}${g.ou ? ` · O/U ${esc(g.ou)}` : ''}</td></tr>`;
}).join('');

const briefing = `<section class="brief">
<h2 class="sec">${esc(G.label || 'The game')}</h2>
<div class="matchup">${teams.map(t => `<div class="team"><span class="rk">${esc(t.rank || t.role || '')}</span><b>${esc(t.name)}</b><span>${esc(t.record)} · ${esc(t.conf)}</span></div>`).join('<div class="at">at</div>')}</div>
<p class="line"><b>${esc(q(G.kickoff))}</b> · ${esc(G.tv)}<br>${esc(q(G.venue))}</p>
<p class="line">${esc(q(G.forecast))}</p>
<div class="chips">${chips}${pred}</div>
<p class="src">${esc(q(G.source))}</p>
<div class="two">
<div><h3>${esc(D.keys && D.keys.label || 'Keys')}</h3>${keys}<p class="src">${esc(q(D.keys && D.keys.source))}</p></div>
<div><h3>${esc(D.tape && D.tape.label || 'Tale of the tape')}</h3><p class="note">${esc(q(D.tape && D.tape.note))}</p><table class="tape"><thead><tr><th></th><th>Florida</th><th>S. Carolina</th></tr></thead><tbody>${tape}</tbody></table><p class="src">${esc(q(D.tape && D.tape.source))}</p>
<h3>${esc(D.series && D.series.label || 'The series')}</h3><p class="big">${esc(q(D.series && D.series.headline))}</p><p>${esc(q(D.series && D.series.line))}</p>
<h3>${esc(D.injuries && D.injuries.label || 'Availability')}</h3><p>${esc(q(D.injuries && D.injuries.asOf))}</p></div>
</div>
</section>`;
const watchSec = `<h3>${esc(D.watch && D.watch.label || 'How to watch')}</h3><table class="watch">${watch}</table><p class="src">${esc(q(D.watch && D.watch.source))}</p>`;

const slateSec = `<section class="slate"><h2 class="sec">${esc(D.slate && D.slate.label || 'Saturday in the SEC')}</h2><p class="note">${esc(q(D.slate && D.slate.note))}</p>
<table class="sl"><thead><tr><th>Time (ET)</th><th>Game</th><th>TV</th><th>Line</th></tr></thead><tbody>${slate}</tbody></table><p class="src">${esc(q(D.slate && D.slate.source))}</p>${watchSec}</section>`;

const shots = D.shots && D.shots.photos && D.shots.photos.length ? `<section class="shots"><h2 class="sec">${esc(D.shots.label)}</h2><p class="note">${esc(q(D.shots.note))} · ${esc(q(D.shots.credit))}</p>
<div class="grid">${D.shots.photos.map(p => `<figure class="ph"><img src="${media(p, 1400, 1000)}" alt="${esc(q(p.alt))}"><figcaption>${esc(q(p.caption))}</figcaption></figure>`).join('')}</div></section>` : '';

const cardStories = cards.map(c => story(byUrl.get(c.url), { kicker: c.kicker, image: c.image, title: c.title, cls: 'card' })).join('\n');
const next = D.reference && D.reference.next ? `<p class="next">${esc(q(D.reference.next))}</p>` : '';

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(q(I.pageTitle || 'GatorBait Magazine'))}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Barlow+Condensed:wght@600;700;800;900&display=block">
<style>
@page { size: 8.5in 11in; margin: 0.6in 0.58in 0.7in; background: #060f24; }
@page :first { margin: 0; }
@page { @bottom-center { content: "GatorBait Magazine · ${esc(q(I.number))} · ${esc(q(I.date))}   |   " counter(page); font: 500 8pt/1 Barlow, Arial, sans-serif; color: #9fb0cc; } }
:root { --navy: #081b35; --orange: #fa4616; --ink: #10172a; --mute: #5c6675; --rule: #d6dbe3; --paper: #fff; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { margin: 0; padding: 0; background: var(--paper); color: var(--ink); font: 10.4pt/1.42 Barlow, Arial, sans-serif; }
h1, h2, h3 { margin: 0; text-wrap: balance; }
p { margin: 0 0 7pt; orphans: 3; widows: 3; }
img { display: block; max-width: 100%; }
figure { margin: 0; break-inside: avoid; }
figcaption, .src, .note { font-size: 7.6pt; color: var(--mute); line-height: 1.3; }
figcaption { margin-top: 3pt; }
.src { margin: 4pt 0 8pt; }
.kick { font: 800 8.5pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: var(--orange); margin: 0 0 4pt; }
.sec { font: 800 22pt/1 "Barlow Condensed", Barlow, Arial, sans-serif; text-transform: uppercase; color: var(--navy); border-left: 6pt solid var(--orange); padding-left: 8pt; margin: 0 0 8pt; break-after: avoid; }
h3 { font: 800 11pt/1.2 Barlow, Arial, sans-serif; text-transform: uppercase; letter-spacing: .04em; color: var(--navy); margin: 10pt 0 5pt; break-after: avoid; }

/* Cover: one full-bleed page, navy plate so the white masthead keeps its contrast. */
.cover { width: 8.5in; height: 11in; background: var(--navy); color: #fff; display: grid; grid-template-rows: auto 1fr auto auto; break-after: page; overflow: hidden; }
.mast { display: flex; align-items: baseline; gap: 10pt; padding: 0.42in 0.5in 0.18in; }
.wm { font: 900 44pt/1 "Barlow Condensed", Barlow, Arial, sans-serif; text-transform: uppercase; letter-spacing: -.01em; color: #fff; }
.wm em { font-style: normal; color: var(--orange); }
.mz { font: 600 13pt/1 Barlow, Arial, sans-serif; text-transform: uppercase; letter-spacing: .3em; color: #fff; opacity: .9; }
.ed { margin-left: auto; font: 500 9pt/1.2 Barlow, Arial, sans-serif; color: #cfd6e2; text-align: right; }
.cover-ph { overflow: hidden; }
.cover-ph img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 35%; }
.cover-type { padding: 0.3in 0.5in 0.2in; }
.cover-type .kick { color: var(--orange); }
.cover-type h1 { font: 900 40pt/0.98 "Barlow Condensed", Barlow, Arial, sans-serif; text-transform: uppercase; color: #fff; margin: 0 0 8pt; }
.cover-type .dek { font: 400 12.5pt/1.35 Barlow, Arial, sans-serif; color: #e6eaf1; max-width: 6.6in; margin: 0 0 6pt; }
.cover-type .by { font: 700 10pt/1.2 Barlow, Arial, sans-serif; text-transform: uppercase; letter-spacing: .08em; color: #fff; margin: 0; }
.cover-foot { display: flex; justify-content: space-between; gap: 12pt; padding: 0 0.5in 0.3in; font: 500 8pt/1.3 Barlow, Arial, sans-serif; color: #b8c1cf; }

/* Briefing page */
.brief { break-after: page; font-size: 9.6pt; line-height: 1.38; }
.brief td, .brief th { padding: 2pt 4pt; }
.matchup { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10pt; margin: 4pt 0 8pt; }
.team { text-align: center; border: 1pt solid var(--rule); border-top: 4pt solid var(--navy); padding: 8pt 6pt; }
.team .rk { display: block; font: 800 8pt/1 Barlow, Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: var(--orange); min-height: 8pt; }
.team b { display: block; font: 800 20pt/1.05 "Barlow Condensed", Barlow, Arial, sans-serif; text-transform: uppercase; color: var(--navy); margin: 3pt 0; }
.team span:last-child { font-size: 9pt; color: var(--mute); }
.at { font: 700 11pt/1 Barlow, Arial, sans-serif; color: var(--mute); text-transform: uppercase; }
.line { margin: 0 0 4pt; }
.chips { display: flex; flex-wrap: wrap; gap: 6pt; margin: 6pt 0 2pt; }
.chip { border: 1pt solid var(--rule); padding: 4pt 8pt; font-size: 9pt; }
.chip b { display: block; font-size: 7.5pt; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.two { display: grid; grid-template-columns: 1.1fr 1fr; gap: 18pt; }
.key { margin: 0 0 6pt; break-inside: avoid; }
.key b { display: block; color: var(--navy); margin-bottom: 1pt; }
.key p { font-size: 9.1pt; margin: 0; }
.big { font: 800 16pt/1.1 "Barlow Condensed", Barlow, Arial, sans-serif; color: var(--navy); text-transform: uppercase; margin: 0 0 3pt; }
table { border-collapse: collapse; width: 100%; font-size: 9pt; font-variant-numeric: tabular-nums; }
td, th { padding: 2.5pt 4pt; border-bottom: 1pt solid var(--rule); text-align: left; vertical-align: top; }
th { font-size: 7.5pt; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.tape td:nth-child(n+2), .tape th:nth-child(n+2) { text-align: right; }
.watch th { width: 0.9in; color: var(--navy); font-size: 8.5pt; }

/* Stories */
.story { break-before: page; }
.story.card { break-before: auto; margin-top: 16pt; padding-top: 12pt; border-top: 3pt solid var(--navy); }
.story-h { break-after: avoid; break-inside: avoid; }
.story-h h2 { font: 800 24pt/1.02 "Barlow Condensed", Barlow, Arial, sans-serif; text-transform: uppercase; color: var(--navy); margin: 0 0 5pt; }
.story.card .story-h h2 { font-size: 20pt; }
.lede { font: 500 11.5pt/1.35 Barlow, Arial, sans-serif; color: #2b3445; margin: 0 0 5pt; }
.by { font: 700 9pt/1.2 Barlow, Arial, sans-serif; text-transform: uppercase; letter-spacing: .06em; color: var(--navy); margin: 0 0 8pt; }
.by span { font-weight: 500; color: var(--mute); letter-spacing: 0; text-transform: none; margin-left: 6pt; }
.story-ph { margin: 0 0 9pt; break-after: avoid; }
.story-ph img { width: 100%; max-height: 4.2in; object-fit: cover; }
.body { columns: 2; column-gap: 16pt; column-fill: auto; text-align: left; hyphens: auto; }
.body p { break-inside: avoid-column; }
.body h2, .body h3, .body h4 { font: 800 11pt/1.2 Barlow, Arial, sans-serif; color: var(--navy); margin: 8pt 0 3pt; text-transform: none; letter-spacing: 0; }
.body blockquote { margin: 4pt 0 8pt; padding-left: 8pt; border-left: 3pt solid var(--orange); font-style: italic; }
.body ul, .body ol { margin: 0 0 7pt; padding-left: 14pt; }
.body figure { margin: 4pt 0 8pt; column-span: all; }
.body figure img { width: 100%; max-height: 3.4in; object-fit: cover; }
.body figcaption { font-style: normal; }
.body strong { font-weight: 700; }

/* Slate, shots, end */
.slate, .shots { break-before: page; }
.sl .hero td { background: #fff4ef; font-weight: 700; }
.sl i { font-style: normal; color: var(--mute); font-size: 8.5pt; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt; }
.grid figure:first-child { grid-column: 1 / -1; }
.grid img { width: 100%; max-height: 4.4in; object-fit: cover; }
.end { margin-top: 18pt; padding-top: 8pt; border-top: 3pt solid var(--navy); break-inside: avoid; }
.next { font: 700 11pt/1.3 Barlow, Arial, sans-serif; color: var(--navy); }
.colophon { font-size: 8pt; color: var(--mute); margin: 0; }

/* ===== Dark magazine theme (matches the live /magazine design) ===== */
:root { --navy: #0a1a3a; --ink: #e9eef8; --mute: #9fb0cc; --rule: #1f3566; --gold: #ffc233; }
html, body { background: #060f24; color: var(--ink); }
.sec { color: #fff; border-left-color: var(--orange); }
h3, .big, .key b, .watch th { color: #fff; }
.team { background: #0d2250; border-color: #22407f; border-top-color: var(--orange); }
.team b { color: #fff; } .team span:last-child { color: var(--mute); }
.chip { background: #0d2250; border-color: #22407f; color: #fff; } .chip b { color: var(--gold); }
td, th { border-bottom-color: #1f3566; } th { color: var(--gold); }
.sl .hero td { background: #12295e; color: #fff; }
figcaption, .src, .note, .by span { color: var(--mute); }
.cover { background: #060f24; position: relative; display: block; }
.cover-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
.cover-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(6,15,36,.78) 0%, rgba(6,15,36,0) 22%, rgba(6,15,36,0) 42%, rgba(6,15,36,.92) 78%, #060f24 100%); }
.mast { position: absolute; top: 0.45in; left: 0.5in; right: 0.5in; display: block; padding: 0; }
.wm { font-size: 60pt; display: block; line-height: .9; text-shadow: 0 2px 14px rgba(0,0,0,.55); }
.mz { display: block; margin-top: 4pt; color: #fff; letter-spacing: .5em; font-size: 14pt; }
.ed { position: absolute; top: 1.45in; right: 0.5in; text-align: right; background: #0a2a8a; padding: 6pt 12pt; color: #fff; }
.ed b { display: block; font: 800 13pt/1.1 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; letter-spacing: .06em; }
.ed span { font-size: 8.5pt; color: #cdd9f2; }
.cover-type { position: absolute; left: 0.5in; right: 0.5in; bottom: 0.75in; padding: 0; }
.cover-type h1 { font-size: 52pt; line-height: .95; text-shadow: 0 2px 16px rgba(0,0,0,.6); }
.cover-type .dek { font-size: 13pt; max-width: 7in; color: #fff; }
.cover-foot { position: absolute; left: 0.5in; right: 0.5in; bottom: 0.3in; padding: 0; color: #b8c6e0; }
.story-h h2 { color: #fff; font-size: 34pt; }
.story.card .story-h h2 { font-size: 26pt; }
.story.card { border-top-color: var(--orange); }
.lede, .by { color: #fff; } .by { color: var(--gold); }
.story-ph { margin: 0 0 10pt; } .story-ph img { max-height: 5.3in; width: 100%; }
.story-ph figcaption { margin: 3pt 0 0; }
.story.card .story-ph img { max-height: 4.4in; }
.body { color: #dfe7f5; font-size: 10.6pt; } .body h2, .body h3, .body h4 { color: #fff; }
.body strong { color: #fff; } .body blockquote { border-left-color: var(--orange); color: #fff; }
.body figure img { max-height: 3.6in; }
.grid img { max-height: 5in; }
.end { border-top-color: var(--orange); } .next { color: #fff; }
</style></head><body>
${cover}
${briefing}
${story(coverPost, { kicker: C.kicker, title: coverPost && /Nostalgia/i.test(C.headline) ? C.headline : undefined, lede: C.dek, cls: 'feature' })}
${story(leadPost, { kicker: `${L.label || 'The Lead'} · ${L.author || ''}`, image: L.image, title: L.title, cls: 'feature' })}
${slateSec}
<section class="news"><h2 class="sec" style="break-before:page">${esc(D.cards && D.cards.label || 'This week')}</h2>
${cardStories}
</section>
${shots}
<section class="end">${next}<p class="colophon">GatorBait Magazine, ${esc(q(I.number))}, ${esc(q(I.date))}. ${esc(q(I.tagline))}. ${esc(q(D.asOf || ''))} Published by GatorBait Media, www.gatorbaitmedia.com.</p></section>
</body></html>`;
fs.writeFileSync(outPath, html);
console.log(`wrote ${outPath} (${html.length} chars, ${P.posts.length} posts, ${(html.match(/<img /g) || []).length} images)`);
