#!/usr/bin/env node
// Phone-first edition of a Game Day (pregame) magazine issue. Same words and numbers as the web issue and the print edition:
// sports-live/magazine-issue-pregame.json plus the full post bodies from tools/magazine-pdf/extract-posts.py, nothing added or
// rewritten. One column, 390 x 844 pt portrait pages, body 17 pt, nothing under 12 pt, full-bleed photos, Barlow only
// (Barlow Condensed for display headlines), selectable text, working links. Typography and page rules follow
// deploy/magazine-2026/postgame-texas/build-phone.mjs (the Oct. 18-19 phone PDF).
//   node deploy/mag-georgia-pregame-20261027/build-phone.mjs <issue.json> <posts.json> <cover.jpg> <out.html> [print-pdf-url]
//   PLAYWRIGHT_PKG=/opt/node22/lib/node_modules/playwright node deploy/magazine-2026/postgame-texas/render-phone.mjs <out.html> <out.pdf>
import fs from 'node:fs';
import path from 'node:path';

const [issuePath, postsPath, coverPath, out, printUrl] = process.argv.slice(2);
if (!out) { console.error('usage: build-phone.mjs <issue.json> <posts.json> <cover.jpg> <out.html> [print-pdf-url]'); process.exit(2); }
const D = JSON.parse(fs.readFileSync(issuePath, 'utf8'));
const P = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
const byUrl = new Map(P.posts.map(p => [p.url, p]));
const extrasPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'tools', 'magazine-pdf', 'issues', D.id + '.json');
const X = fs.existsSync(extrasPath) ? JSON.parse(fs.readFileSync(extrasPath, 'utf8')) : {};

const SITE = 'https://www.gatorbaitmedia.com';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const q = s => String(s == null ? '' : s)
  .replace(/(^|[\s(\[{—–-])"/g, '$1“').replace(/"/g, '”')
  .replace(/(^|[\s(\[{—–-])'/g, '$1‘').replace(/'/g, '’');
const ap = s => String(s || '').replace(/\b(January|February|August|September|October|November|December)\b(?= \d)/g, m => ({ January: 'Jan.', February: 'Feb.', August: 'Aug.', September: 'Sept.', October: 'Oct.', November: 'Nov.', December: 'Dec.' }[m]));
const fixCredit = s => String(s || '').replace(/Photo Credit\s*[-–:]\s*Chris Spears,?\s*Gator ?[Bb]ait (?:Magazine|Media)\s*/g, 'Photo by Chris Spears, GatorBait Media');
const media = (img, w = 1200, h = 1200, mode = 'fit', qv = 76) => img && img.id ? `https://static.wixstatic.com/media/${img.id}~mv2.${img.ext || 'jpg'}/v1/${mode}/w_${w},h_${h},al_c,q_${qv}/${img.id}.${img.ext === 'png' ? 'png' : 'jpg'}` : '';
const fig = (img, caption) => {
  if (!img || !img.id) return '';
  const credit = fixCredit(q(img.credit || ''));
  const cls = img.ext === 'png' || /illustration|graphic|collage/i.test(credit) ? 'ph contain' : 'ph';
  return `<figure class="${cls}"><img src="${media(img)}" alt="${esc(q(img.alt || ''))}"><figcaption>${esc(q(caption || ''))}${caption ? ' ' : ''}${esc(credit)}${credit ? '.' : ''}</figcaption></figure>`;
};
const when = iso => { const d = new Date(iso); if (!iso || isNaN(d)) return ''; const m = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']; return `${m[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };
// Curly quotes in text nodes only; markup and attributes are never touched.
function smartHtml(h) {
  const fix = t => t.replace(/&(?:#x27|#39|apos);/gi, "'").replace(/&(?:#x22|#34|quot);/gi, '"')
    .replace(/(^|[\s(\[{—–-])'(?=(em|til|cause|tis|twas|round|n)\b|\d\d)/gi, '$1’')
    .replace(/(^|[\s(\[{—–-])"/g, '$1“').replace(/"/g, '”')
    .replace(/(^|[\s(\[{—–-])'/g, '$1‘').replace(/'/g, '’');
  return h.split(/(<[^>]+>)/).map(seg => seg.startsWith('<') ? seg : fix(seg)).join('');
}
// Article body: resolve inline Wix media, drop the duplicate cover image, credit-only lines and a leading "By <author>" line.
function body(post) {
  let h = post.html || '';
  if (post.cover) h = h.replace(new RegExp(`<figure><img data-media="${post.cover.id}"[^>]*>(<figcaption>[^<]*</figcaption>)?</figure>`), '');
  h = h.replace(/<img data-media="([^"]+)" data-ext="([^"]+)" alt="([^"]*)">/g, (m, id, ext, alt) => `<img src="${media({ id, ext })}" alt="${alt}">`);
  h = h.replace(new RegExp(`<p>(?:<strong>)?By ${esc(post.author)}\\.?(?:<\\/strong>)?<\\/p>`, 'g'), '');
  h = h.replace(/<p>(?:<strong>|<em>)*(?:Photo|Cover photo|File photo|Illustration)(?: by|:| credit| courtesy)[^<]{0,220}(?:<\/strong>|<\/em>)*<\/p>/gi, '');
  h = h.replace(/<p>(?:<em>)?GatorBait (?:editorial |Media )?illustration\.?(?:<\/em>)?<\/p>/gi, '');
  h = h.replace(/<p>\s*(?:<strong>)?\s*(?:WATCH THE SHOW LIVE|More from Buddy)\s*(?:<\/strong>)?\s*<\/p>/g, '');
  h = fixCredit(h);
  h = h.replace(/<a href="(\/[^"]*)">/g, `<a href="${SITE}$1">`);   // site links stay tappable; other links keep their href
  return smartHtml(h);
}
const online = (url, label) => url ? `<p class="onl"><a href="${SITE}${url}">${esc(label)}</a></p>` : '';
const hdr = (kicker, title, by, date, id, dek) => `<header class="story-h" id="${id}">${kicker ? `<p class="kick">${esc(q(kicker))}</p>` : ''}<h2>${esc(q(title))}</h2>${dek ? `<p class="dek">${esc(q(dek))}</p>` : ''}<p class="by">${esc(by)} <span>${esc(date || '')}</span></p></header>`;
const pull = (t, cite = '') => `<blockquote class="pull">${esc(String(t).replace(/[“”"]/g, '’'))}</blockquote>${cite ? `<p class="pcite">${esc(cite)}</p>` : ''}`;
const tiles = a => `<div class="tiles">${a.map(t => `<div class="tile"><b>${esc(t.value)}</b><span>${esc(q(t.label))}</span>${t.note ? `<small>${esc(q(t.note))}</small>` : ''}</div>`).join('')}</div>`;

const I = D.issue || {}, C = D.cover || {}, G = D.game || {}, L = D.lead || {}, F = D.feature || {};
const teams = G.teams || [];
const opp = (teams.find(t => t.name !== 'Florida') || {}).name || 'Opponent';
const coverPost = byUrl.get(C.url), leadPost = byUrl.get(L.url), featPost = byUrl.get(F.url);
const cards = ((D.cards && D.cards.items) || []).filter(c => c.url !== C.url && c.url !== L.url && c.url !== F.url);
const COVER = 'file://' + path.resolve(coverPath);

// ---- contents, in page order ----
const TOC = [];
const sec = (id, label, sub) => TOC.push([id, label, sub]);
sec('game', 'The game: ' + I.name, 'Briefing');
sec('cover', C.headline, C.byline.replace(/^By /, ''));
sec('lead', L.title, L.author);
sec('feature', F.title, F.author);
sec('numbers', 'By the numbers and what we’re watching', 'The desk');
if (X.desk) sec('desk', X.desk.title, 'The desk');
cards.forEach((c, i) => sec('card' + i, c.title, c.kicker.split(' · ')[0]));
sec('slate', D.slate.label, 'Saturday');
sec('watch', D.watch.label, 'TV and radio');
sec('shots', D.shots.label, 'Photos');
sec('masthead', 'Masthead', 'Credits');

const cover = `<section class="cover"><img src="${COVER}" alt="${esc(q(C.image && C.image.alt))}">
<div class="cv-t"><p class="cv-k">GatorBait Magazine · ${esc(I.number)}</p><p class="cv-d">${esc(q(I.name))} · ${esc(ap(I.date))}</p><p class="cv-s">Made for your phone. Scroll down to read.</p></div></section>`;

const toc = `<section class="pg toc"><h2 class="sec">In this issue</h2>
<ol>${TOC.map(([id, l, s]) => `<li><a href="#${id}"><b>${esc(q(l))}</b> <span>${esc(s)}</span></a></li>`).join('')}</ol>
${printUrl ? `<p class="prt"><a href="${printUrl}">Print version (US Letter, two columns)</a></p>` : ''}</section>`;

// The game: matchup, kickoff, chips, keys, tale of the tape, series, availability.
const chips = (G.chips || []).map(c => `<div class="chip"><b>${esc(c.k)}</b><span>${esc(q(c.v))}</span></div>`).join('') + (G.predictor ? `<div class="chip"><b>${esc(G.predictor.label)}</b><span>Florida ${esc(G.predictor.florida)}%, ${esc(opp)} ${esc(G.predictor.missouri)}%</span></div>` : '');
const tape = (D.tape.rows || []).map(r => `<div class="st"><p class="sl">${esc(r.label)}</p><div class="sv"><div><span>Florida</span><b>${esc(r.fla)}</b></div><div><span>${esc(opp)}</span><b>${esc(r.miz)}</b></div></div></div>`).join('');
const keys = (D.keys.items || []).map((k, i) => `<div class="key"><h3>${i + 1}. ${esc(q(k.h))}</h3><p>${esc(q(k.p))}</p></div>`).join('');
const series = (D.series.games || []).map(g => `<tr><td class="tm">${g.year}</td><td>${g.fla > g.mizz ? 'W' : g.fla < g.mizz ? 'L' : 'T'} ${g.fla}-${g.mizz}</td><td>${g.site === 'H' ? 'Gainesville' : g.site === 'N' ? 'Neutral' : 'Road'}</td></tr>`).join('');
const game = `<section class="pg"><h2 class="sec" id="game">${esc(G.label)}</h2>
<div class="matchup">${teams.map(t => `<div class="team"><span class="rk">${esc(t.rank || t.role || '')}</span><b>${esc(t.name)}</b><span>${esc(t.record)} · ${esc(t.conf)}</span></div>`).join('<div class="vs">vs</div>')}</div>
<p class="line"><b>${esc(q(G.kickoff))}</b> · ${esc(G.tv)}<br>${esc(q(G.venue))}</p><p class="note">${esc(q(G.forecast))}</p>
<div class="chips">${chips}</div><p class="src">${esc(q(G.source))}</p>
<h3 class="sub">${esc(D.keys.label)}</h3>${keys}<p class="src">${esc(q(D.keys.source))}</p>
<h3 class="sub">${esc(D.tape.label)}</h3><p class="note">${esc(q(D.tape.note))}</p>${tape}<p class="src">${esc(q(D.tape.source))}</p>
<h3 class="sub">${esc(D.series.label)}: ${esc(q(D.series.headline))}</h3><p>${esc(q(D.series.line))}</p><table class="ap"><thead><tr><th>Year</th><th>Florida</th><th>Site</th></tr></thead><tbody>${series}</tbody></table><p class="src">${esc(q(D.series.source))}</p>
<h3 class="sub">${esc(D.injuries.label)}</h3><p>${esc(q(D.injuries.asOf))}</p><p class="src">${esc(q(D.injuries.source))}</p></section>`;

// Stories: full bodies from the live posts.
const story = (post, id, kicker, img, caption, dek, cls = 'story pg') => post ? `<article class="${cls}">${hdr(kicker, post.title, 'By ' + post.author, when(post.published), id, dek)}${fig(img, caption)}
<div class="body">${body(post)}</div>${online(post.url, 'Read it on gatorbaitmedia.com')}</article>` : '';
const coverStory = coverPost ? `<article class="story pg">${hdr(C.kicker, C.headline, C.byline, when(coverPost.published), 'cover', C.dek)}${pull(C.lines[0].replace(/”\s[^”]*$/, '”').replace(/"\s[A-Z][^"]*$/, '"'), C.lines[0].replace(/^.*["”]\s*/, ''))}
<div class="body">${body(coverPost)}</div>${online(coverPost.url, 'Read it on gatorbaitmedia.com')}</article>` : '';
const lead = story(leadPost, 'lead', L.label + ' · ' + L.kicker, L.image, L.caption);
const feature = story(featPost, 'feature', F.label + ' · ' + F.kicker, F.image, F.caption, F.dek);

const NUM = D.numbers, WCH = D.watching;
const numbers = `<section class="pg"><h2 class="sec" id="numbers">${esc(q(NUM.label))}</h2><p class="note">${esc(q(NUM.note))}</p>${tiles(NUM.items)}<p class="src">${esc(q(NUM.source))}</p>
<h3 class="sub">${esc(q(WCH.label))}</h3><p class="note">${esc(q(WCH.note))}</p>${WCH.items.map(w => `<div class="voice"><p class="vq">${esc(q(w.line))}</p><p class="vw">${esc(w.by)}</p></div>`).join('')}<p class="src">${esc(q(WCH.source))}</p></section>`;

const DK = X.desk;
const deskChart = DK && DK.chart ? `<figure class="dchart"><figcaption class="dc-t">${esc(q(DK.chart.label))}</figcaption>${DK.chart.bars.map(b => `<div class="dc-r"><span class="dc-l">${esc(q(b.label))}</span><span class="dc-b"><i class="${b.tone === 'orange' ? 'o' : 'b'}" style="width:${(100 * b.value / (DK.chart.max || 50)).toFixed(1)}%"></i></span><b>${esc(b.value.toFixed(1))}</b></div>`).join('')}</figure>` : '';
const desk = DK ? `<article class="story pg">${hdr(DK.kicker, DK.title, DK.byline, '', 'desk', DK.dek)}${pull(DK.pull)}${deskChart}<div class="body">${DK.paragraphs.map(t => `<p>${esc(q(t))}</p>`).join('')}</div><p class="src">${esc(q(DK.source))}</p></article>` : '';

const cardStories = cards.map((c, i) => story(byUrl.get(c.url), 'card' + i, c.kicker, c.image, '', '')).join('\n');

const slateRows = (D.slate.games || []).map(g => {
  const t = x => `${x.rank ? `No. ${x.rank} ` : ''}${x.name} (${x.rec})`;
  return `<div class="gm${g.hero ? ' hero' : ''}"><p class="gt"><b>${esc(g.time)}</b> ${esc(g.tv)}</p><p class="gn">${esc(t(g.away))} ${g.note ? 'vs.' : 'at'} ${esc(t(g.home))}${g.note ? ` <i>(${esc(q(g.note))})</i>` : ''}</p><p class="gl">${esc(g.line || '')}${g.ou ? ` · O/U ${esc(g.ou)}` : ''}${g.pick ? ` · Soothsayer: ${esc(g.pick)}` : ''}</p></div>`;
}).join('');
const slate = `<section class="pg"><h2 class="sec" id="slate">${esc(q(D.slate.label))}</h2><p class="note">${esc(q(D.slate.note))}</p>${slateRows}<p class="src">${esc(q(D.slate.source))}</p></section>`;

const W = D.watch;
const watch = `<section class="pg"><h2 class="sec" id="watch">${esc(W.label)}</h2><dl class="ld">${W.items.map(i => `<dt>${esc(i.k)}</dt><dd>${esc(q(i.v))}</dd>`).join('')}</dl>
${(W.links || []).map(l => `<p class="onl"><a href="${/^https?:/.test(l.url) ? l.url : SITE + l.url}">${esc(q(l.label))}</a></p>`).join('')}<p class="src">${esc(q(W.source))}</p>
<h3 class="sub">${esc(D.reference.label)}</h3>${D.reference.links.map(l => `<p class="onl"><a href="${SITE}${l.url}">${esc(q(l.label))}</a></p>`).join('')}<p class="nx">${esc(q(D.reference.next))}</p></section>`;

const B = D.shots;
const shots = `<section class="pg"><h2 class="sec" id="shots">${esc(B.label)}</h2><p class="note">${esc(q(B.note))} · ${esc(q(B.credit))}</p>
${B.photos.map(p => `<figure class="ph"><img src="${media(p)}" alt="${esc(q(p.alt))}"><figcaption>${esc(q(p.caption))}. ${esc(q(B.credit))}.</figcaption></figure>`).join('')}${online(B.url, 'The game story on gatorbaitmedia.com')}</section>`;

const CR = X.credits || { label: 'Masthead', people: [], lines: [], contact: 'www.gatorbaitmedia.com', copyright: '© 2026 GatorBait Media. All rights reserved.' };
const back = `<section class="pg credits"><h2 class="sec" id="masthead">${esc(q(CR.label))}</h2><div class="people">${CR.people.map(p => `<div class="pr"><b>${esc(q(p.name))}</b><span>${esc(q(p.role))}</span></div>`).join('')}</div>
<div class="clines">${CR.lines.map(l => `<p>${esc(q(l))}</p>`).join('')}</div>
<p class="cc"><a href="${SITE}/">${esc(CR.contact)}</a><br>${esc(CR.copyright)}</p>
<p class="nx">${esc(q(D.reference.next))}</p>${printUrl ? `<p class="prt">Print version: <a href="${printUrl}">US Letter, two columns</a></p>` : ''}
<p class="colophon">GatorBait Magazine, ${esc(I.number)}, ${esc(ap(I.date))}. ${esc(I.tagline)}. Published by GatorBait Media, www.gatorbaitmedia.com. ${esc(q(D.asOf))}</p></section>`;

const css = `
@page { size: 390pt 844pt; margin: 34pt 0 46pt;
  @bottom-center { content: "GatorBait Magazine  ·  " counter(page); font: 600 12pt/1 Barlow, Arial, sans-serif; color: #5c6675; } }
@page cover { size: 390pt 844pt; margin: 0; @bottom-center { content: none; } }
.cover { page: cover; }
:root { --navy: #081b35; --orange: #fa4616; --green: #22884C; --ink: #10172a; --mute: #4b5563; --rule: #d6dbe3; --soft: #f1f4f9; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; color: var(--ink); font: 400 17pt/1.5 Barlow, Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: #0a3d91; text-decoration: underline; text-underline-offset: 2pt; }
.pg { break-before: page; padding: 0 22pt; }
.cover { width: 390pt; height: 844pt; background: #061a33; position: relative; overflow: hidden; break-after: page; }
.cover img { display: block; width: 390pt; height: 520pt; object-fit: cover; object-position: 50% 0; }
.cv-t { padding: 22pt 26pt 0; color: #fff; }
.cv-k { margin: 0 0 8pt; font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: var(--orange); }
.cv-d { margin: 0 0 14pt; font: 700 22pt/1.2 Barlow, Arial, sans-serif; color: #c9d3e6; }
.cv-s { margin: 0; font: 500 14pt/1.3 Barlow, Arial, sans-serif; color: #c9d3e6; }
.sec { font: 800 32pt/1.05 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: var(--navy); border-left: 7pt solid var(--orange); padding-left: 10pt; margin: 0 0 12pt; break-after: avoid; }
h3.sub { margin: 20pt 0 8pt; font: 800 24pt/1.1 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: var(--navy); border-left: 5pt solid var(--green); padding-left: 8pt; break-after: avoid; }
.toc ol { list-style: none; margin: 0 0 8pt; padding: 0; }
.toc li { border-top: 1pt solid var(--rule); }
.toc a { display: block; padding: 5pt 0; text-decoration: none; color: var(--ink); }
.toc b { font: 700 15.5pt/1.22 Barlow, Arial, sans-serif; color: var(--navy); }
.toc span { display: inline-block; margin-left: 4pt; font: 700 12pt/1.2 Barlow, Arial, sans-serif; color: var(--orange); text-transform: uppercase; letter-spacing: .08em; }
.prt { font: 600 15pt/1.4 Barlow, Arial, sans-serif; margin: 12pt 0 0; padding: 10pt 14pt; background: var(--soft); border-left: 5pt solid var(--orange); break-inside: avoid; }
.kick { font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: var(--orange); margin: 0 0 8pt; }
.story-h h2 { margin: 0 0 10pt; font: 900 34pt/1.05 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: var(--navy); overflow-wrap: break-word; }
.story-h .dek { margin: 0 0 10pt; font: 500 17pt/1.4 Barlow, Arial, sans-serif; color: var(--mute); }
.by { margin: 0 0 14pt; font: 800 14pt/1.3 Barlow, Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: var(--navy); }
.by span { font-weight: 500; letter-spacing: 0; color: var(--mute); text-transform: none; margin-left: 6pt; }
.ph { margin: 0 -22pt 16pt; break-inside: avoid; }
.ph img { display: block; width: 390pt; height: auto; }
.ph.contain img { width: 346pt; margin: 0 22pt; }
.body figure { margin: 0 -22pt 14pt; break-inside: avoid; }
.body figure img { display: block; width: 390pt; height: auto; }
figcaption { padding: 6pt 22pt 0; font: 500 12.5pt/1.35 Barlow, Arial, sans-serif; color: var(--mute); }
.pull { margin: 4pt 0 14pt; padding: 4pt 0 4pt 14pt; border-left: 6pt solid var(--orange); font: 800 23pt/1.22 Barlow, Arial, sans-serif; color: var(--navy); }
.pcite { margin: -6pt 0 14pt 20pt; font: 700 12.5pt/1.3 Barlow, Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: var(--mute); }
.src, .note { font: 500 12.5pt/1.4 Barlow, Arial, sans-serif; color: var(--mute); margin: 0 0 14pt; }
.line { margin: 0 0 8pt; font: 600 17pt/1.4 Barlow, Arial, sans-serif; }
.body p { margin: 0 0 12pt; orphans: 3; widows: 3; hyphens: manual; overflow-wrap: break-word; }
.body h2, .body h3, .body h4, .key h3 { margin: 18pt 0 6pt; font: 800 22pt/1.15 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; letter-spacing: .03em; color: var(--navy); break-after: avoid; }
.body blockquote { margin: 0 0 12pt; padding-left: 12pt; border-left: 4pt solid var(--rule); font-style: italic; }
.body ul, .body ol { margin: 0 0 12pt; padding-left: 22pt; }
.key { break-inside: avoid; }
.key p { margin: 0 0 12pt; }
.onl { margin: 6pt 0 0; font: 700 16pt/1.3 Barlow, Arial, sans-serif; }
table { width: 100%; border-collapse: collapse; }
.ap { margin: 0 0 14pt; font: 600 17pt/1.2 Barlow, Arial, sans-serif; }
.ap th { background: var(--navy); color: #fff; padding: 7pt 8pt; text-align: left; font-weight: 700; }
.ap td { padding: 9pt 8pt; border-bottom: 1pt solid var(--rule); }
.ap td.tm { font-weight: 800; color: var(--navy); }
.tiles { display: block; }
.tile { margin: 0 0 8pt; padding: 10pt 14pt; background: var(--navy); color: #fff; break-inside: avoid; }
.tile b { display: block; font: 900 38pt/1 "Barlow Condensed", Barlow, sans-serif; color: var(--orange); }
.tile span { display: block; font: 800 15pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; }
.tile small { display: block; margin-top: 3pt; font: 500 14pt/1.35 Barlow, Arial, sans-serif; color: #d3dbea; }
.chips { display: flex; flex-wrap: wrap; gap: 8pt; margin: 0 0 10pt; }
.chip { flex: 1 1 40%; padding: 8pt 10pt; background: var(--soft); border-left: 5pt solid var(--orange); break-inside: avoid; }
.chip b { display: block; font: 800 12pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.chip span { display: block; font: 700 17pt/1.25 Barlow, Arial, sans-serif; color: var(--navy); }
.st { padding: 8pt 0; border-bottom: 1pt solid var(--rule); break-inside: avoid; }
.sl { margin: 0 0 3pt; font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.sv { display: flex; gap: 10pt; }
.sv > div { flex: 1; min-width: 0; }
.sv span { display: block; font: 600 12.5pt/1.2 Barlow, Arial, sans-serif; color: var(--orange); text-transform: uppercase; letter-spacing: .06em; }
.sv b { display: block; font: 700 17pt/1.25 Barlow, Arial, sans-serif; color: var(--navy); }
.ld { margin: 0 0 8pt; }
.ld dt { margin: 10pt 0 1pt; font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--orange); break-after: avoid; }
.ld dd { margin: 0; padding-bottom: 8pt; border-bottom: 1pt solid var(--rule); font: 500 16pt/1.38 Barlow, Arial, sans-serif; }
.voice { border-left: 7pt solid var(--orange); background: var(--soft); padding: 12pt 14pt 10pt; margin: 0 0 14pt; break-inside: avoid; }
.vq { margin: 0 0 6pt; font: 800 19pt/1.3 Barlow, Arial, sans-serif; color: var(--navy); }
.vw { margin: 0; font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.matchup { display: flex; align-items: center; gap: 8pt; margin: 6pt 0 14pt; }
.team { flex: 1; padding: 12pt 8pt; background: var(--navy); color: #fff; text-align: center; }
.team b { display: block; font: 900 28pt/1.05 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; }
.team span { display: block; font: 600 13.5pt/1.3 Barlow, Arial, sans-serif; color: #d3dbea; }
.team .rk { color: var(--orange); font-weight: 800; }
.vs { font: 800 16pt/1 Barlow, Arial, sans-serif; color: var(--mute); text-transform: uppercase; }
.gm { padding: 10pt 12pt; margin: 0 0 8pt; border-left: 6pt solid var(--rule); background: var(--soft); break-inside: avoid; }
.gm.hero { border-left-color: var(--orange); background: #fff1ea; }
.gt { margin: 0 0 2pt; font: 800 13pt/1.3 Barlow, Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: var(--mute); }
.gt b { color: var(--navy); margin-right: 6pt; }
.gn { margin: 0 0 2pt; font: 700 17pt/1.3 Barlow, Arial, sans-serif; color: var(--navy); }
.gn i { font-style: normal; font-weight: 500; color: var(--mute); }
.gl { margin: 0; font: 600 14pt/1.3 Barlow, Arial, sans-serif; color: var(--mute); }
.dchart { margin: 0 0 14pt; break-inside: avoid; }
.dc-t { padding: 0 0 6pt; font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.dc-r { display: flex; align-items: center; gap: 8pt; margin: 0 0 6pt; font: 700 14pt/1.2 Barlow, Arial, sans-serif; }
.dc-l { flex: 0 0 112pt; color: var(--navy); }
.dc-b { flex: 1; height: 16pt; background: var(--soft); }
.dc-b i { display: block; height: 100%; }
.dc-b i.b { background: var(--navy); } .dc-b i.o { background: var(--orange); }
.dc-r b { flex: 0 0 40pt; text-align: right; color: var(--navy); }
.people .pr { padding: 9pt 0; border-bottom: 1pt solid var(--rule); break-inside: avoid; }
.people b { display: block; font: 800 18pt/1.2 Barlow, Arial, sans-serif; color: var(--navy); }
.people span { display: block; font: 500 15pt/1.35 Barlow, Arial, sans-serif; color: var(--mute); }
.clines p { margin: 12pt 0 0; font: 500 15pt/1.45 Barlow, Arial, sans-serif; }
.cc { margin: 16pt 0 8pt; font: 600 15pt/1.5 Barlow, Arial, sans-serif; }
.nx { font: 700 16pt/1.4 Barlow, Arial, sans-serif; color: var(--navy); }
.colophon { margin: 14pt 0 0; font: 500 13pt/1.4 Barlow, Arial, sans-serif; color: var(--mute); }
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(q(I.pageTitle || 'GatorBait Magazine'))} (phone edition)</title>
<meta name="viewport" content="width=390">
<style>${css}</style></head><body>
${cover}
${toc}
${game}
${coverStory}
${lead}
${feature}
${numbers}
${desk}
${cardStories}
${slate}
${watch}
${shots}
${back}
</body></html>`;
fs.writeFileSync(out, html);
console.log(`wrote ${out} (${html.length} chars, ${(html.match(/<img /g) || []).length} images, ${TOC.length} contents entries)`);
