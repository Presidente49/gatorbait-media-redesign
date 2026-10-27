#!/usr/bin/env node
// Build the standalone print edition of a GatorBait Magazine issue.
//   node build-print.mjs <issue.json> <posts.json> <out.html>
// issue.json is the same file the live /magazine loader renders; posts.json comes from extract-posts.py
// (full article bodies). Every image is a Wix media id rendered through static.wixstatic.com.
// Pure data in, one self-contained HTML out. render-pdf.mjs turns it into the PDF.
import fs from 'node:fs';
import path from 'node:path';

const [issuePath, postsPath, outPath] = process.argv.slice(2);
if (!outPath) { console.error('usage: build-print.mjs <issue.json> <posts.json> <out.html>'); process.exit(2); }
const D = JSON.parse(fs.readFileSync(issuePath, 'utf8'));
const P = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
const byUrl = new Map(P.posts.map(p => [p.url, p]));
// Optional print-only extras (desk column, credits) keyed by issue id, so the website bundle is untouched.
const extrasPath = process.argv[5] || new URL(`./issues/${D.id}.json`, import.meta.url).pathname;
const X = fs.existsSync(extrasPath) ? JSON.parse(fs.readFileSync(extrasPath, 'utf8')) : {};

const LOGO = 'data:image/webp;base64,' + fs.readFileSync(new URL('./assets/gatorbait-logo.webp', import.meta.url)).toString('base64');
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Text strings get curly quotes (AP style for GatorBait copy). Article HTML is never touched: it already carries the writer's curly quotes.
const q = s => String(s == null ? '' : s)
  .replace(/(^|[\s(\[{\u2014\u2013-])"/g, '$1\u201c').replace(/"/g, '\u201d')
  .replace(/(^|[\s(\[{\u2014\u2013-])'/g, '$1\u2018').replace(/'/g, '\u2019')
  .replace(/\b12 p\.m\. ET/g, 'noon ET').replace(/\s*\(\/post\/[^)\s]*\)/g, '');
// AP style: abbreviate months that take an abbreviation when a date follows.
const ap = s => String(s || '').replace(/\b(January|February|August|September|October|November|December)\b(?= \d)/g, m => ({ January: 'Jan.', February: 'Feb.', August: 'Aug.', September: 'Sept.', October: 'Oct.', November: 'Nov.', December: 'Dec.' }[m]));
// Photo credits read one way everywhere.
const fixCredit = s => String(s || '').replace(/Photo Credit\s*[-\u2013:]\s*Chris Spears,?\s*Gator ?[Bb]ait (?:Magazine|Media)\s*/g, 'Photo by Chris Spears, GatorBait Media');
// PDF_JPEG=1 fetches PNG illustrations as JPEG too (a 1300 px PNG collage embeds at about 2 MB; the JPEG is a tenth of that).
const media = (img, w = 1600, h = 1600, mode = 'fit', qv = 78) => img && img.id ? `https://static.wixstatic.com/media/${img.id}~mv2.${img.ext || 'jpg'}/v1/${mode}/w_${w},h_${h},al_c,q_${qv}/${img.id}.${img.ext === 'png' && !process.env.PDF_JPEG ? 'png' : 'jpg'}` : '';
const fig = (img, cls = '', w = 1600, h = 1600, mode = 'fit') => {
  if (!img || !img.id) return '';
  const credit = fixCredit(q(img.credit || ''));
  if (img.ext === 'png' || /illustration|graphic/i.test(credit)) cls += ' contain';
  return `<figure class="ph ${cls}"><img src="${media(img, w, h, mode)}" alt="${esc(q(img.alt || ''))}">${credit ? `<figcaption>${esc(credit)}</figcaption>` : ''}</figure>`;
};
const site = u => /^https?:/.test(u) ? u : 'https://www.gatorbaitmedia.com' + u;

// Article body: resolve inline Wix media, drop the duplicate cover image and a leading "By <author>" line.
function body(post) {
  let h = post.html || '';
  if (post.cover) h = h.replace(new RegExp(`<figure><img data-media="${post.cover.id}"[^>]*>(<figcaption>[^<]*</figcaption>)?</figure>`), '');
  h = h.replace(/<img data-media="([^"]+)" data-ext="([^"]+)" alt="([^"]*)">/g, (m, id, ext, alt) => `<img src="${media({ id, ext }, 1400, 1400)}" alt="${alt}">`);
  h = h.replace(new RegExp(`^(<p><strong>By ${esc(post.author)}\\.?</strong></p>|<p>By ${esc(post.author)}\\.?</p>)`), '');
  h = h.replace(new RegExp(`<p>(?:<strong>)?By ${esc(post.author)}\\.?(?:<\\/strong>)?<\\/p>`, 'g'), '');   // byline already in the header
  h = h.replace(/<p>(?:<strong>|<em>)*(?:Photo (?:by|credit|Credit)|Archival photo by)[^<]{0,140}(?:<\/strong>|<\/em>)*<\/p>/g, '');   // credit-only lines; the caption carries it
  h = h.replace(/<p>(?:<em>)?GatorBait (?:editorial |Media )?illustration\.?(?:<\/em>)?<\/p>/gi, '');
  h = fixCredit(h);
  h = h.replace(/<a href="[^"]*">/g, '').replace(/<\/a>/g, '');   // links are not useful on paper
  return smartHtml(h);
}
// Curly quotes in text nodes only; markup and attributes are never touched.
function smartHtml(h) {
  const fix = t => t.replace(/&(?:#x27|#39|apos);/gi, "'").replace(/&(?:#x22|#34|quot);/gi, '"')
    .replace(/(^|[\s(\[{\u2014\u2013-])'(?=(em|til|cause|tis|twas|round|n)\b|\d\d)/gi, '$1\u2019')
    .replace(/(^|[\s(\[{\u2014\u2013-])"/g, '$1\u201c').replace(/"/g, '\u201d')
    .replace(/(^|[\s(\[{\u2014\u2013-])'/g, '$1\u2018').replace(/'/g, '\u2019');
  return h.split(/(<[^>]+>)/).map(seg => seg.startsWith('<') ? seg : fix(seg)).join('');
}
const when = iso => { const d = new Date(iso); if (!iso || isNaN(d)) return ''; const m = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']; return `${m[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };

// Brief: whole paragraphs up to ~maxWords, then a pointer to the full story online.
function brief(html, maxWords) {
  const blocks = html.match(/<(p|h[2-4]|ul|ol|blockquote)[^>]*>.*?<\/\1>/gs) || [];
  let out = '', n = 0;
  for (const b of blocks) { const w = b.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length; if (n >= maxWords) break; out += b; n += w; }
  return out;
}
const pullFrom = (post, extra) => {
  if (extra) return extra;
  const t = (post.html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const m = t.match(/[\u201c"]([^\u201d"]{50,170}[.!?])[\u201d"]/);
  return m ? m[1] : '';
};
function story(post, { kicker, image, title, cls = '', lede = '', pq = '' } = {}) {
  if (!post) return '';
  const cap = (post.html || '').match(/<figcaption>([^<]*)<\/figcaption>/);
  const img = image && image.id ? image : (post.cover ? { ...post.cover, credit: cap ? cap[1] : '' } : null);
  const full = !cls.includes('card');
  const bodyHtml = full ? body(post) : brief(body(post), 190);
  const pull = full ? pullFrom(post, pq) : '';
  const more = full ? '' : `<p class="more">Full story: gatorbaitmedia.com${esc(post.url)}</p>`;
  return `<article class="story ${cls}" id="${esc(post.url.replace(/[^a-z0-9]+/gi, '-'))}">
<header class="story-h">${kicker ? `<p class="kick">${esc(q(kicker))}</p>` : ''}<h2>${esc(q(title || post.title))}</h2>${lede ? `<p class="lede">${esc(q(lede))}</p>` : ''}<p class="by">By ${esc(post.author)} <span>${esc(when(post.published))}</span></p></header>
${fig(img, 'story-ph', 1300, 900)}
${pull ? `<blockquote class="pull">${esc(String(pull).replace(/\u201c/g, '\u2018').replace(/\u201d/g, '\u2019').replace(/'/g, '\u2019'))}</blockquote>` : ''}
<div class="body">${bodyHtml}</div>${more}
</article>`;
}

const I = D.issue || {}, C = D.cover || {}, G = D.game || {}, L = D.lead || {};
const teams = G.teams || [];
const cards = (D.cards && D.cards.items) || [];
const coverPost = byUrl.get(C.url), leadPost = byUrl.get(L.url), F = D.feature || {}, featPost = byUrl.get(F.url);
const oppName = (teams.find(t => t.name !== 'Florida') || {}).name || 'Opponent';

// COVER_FILE=<local jpg> uses a finished portrait cover from disk (a deploy/<cover>/ render that is not yet in the Wix Media Manager).
const coverFile = process.env.COVER_FILE ? 'file://' + path.resolve(process.env.COVER_FILE) : '';
const artCover = !!coverFile || !!(C.image && C.image.width && C.image.height && Math.abs(C.image.width / C.image.height - 8.5 / 11) < 0.02);
const cover = artCover ? `<section class="cover art"><img class="cover-img" src="${coverFile || media(C.image, 2200, 2850, 'fill', 90)}" alt="${esc(q(C.image.alt))}"></section>` : `<section class="cover">
<img class="cover-img" src="${media(C.image, 2200, 1700, 'fill')}" alt="${esc(q(C.image && C.image.alt))}">
<div class="cover-shade"></div>
<div class="mast"><img class="logo" src="${LOGO}" alt="GatorBait"><span class="mz">Magazine</span></div>
<div class="cover-type"><p class="kick">${esc(q(C.kicker))}</p><h1>${esc(q(C.headline))}</h1><p class="dek">${esc(q(C.dek))}</p><p class="cby">Buddy Martin <i></i> Franz Beard <i></i> Eddie Gilley <i></i> Loren Meadows</p></div>
<div class="cover-foot"><span>${esc(I.number)} · ${esc(q(I.name))} · ${esc(I.week)} · ${esc(ap(I.date))}</span><span>${esc(q(C.image && C.image.credit))}</span></div>
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
<div class="matchup">${teams.map(t => `<div class="team"><span class="rk">${esc(t.rank || t.role || '')}</span><b>${esc(t.name)}</b><span>${esc(t.record)} · ${esc(t.conf)}</span></div>`).join(`<div class="at">${/neutral/i.test(G.venue || '') ? 'vs.' : 'at'}</div>`)}</div>
<p class="line"><b>${esc(q(G.kickoff))}</b> · ${esc(G.tv)}<br>${esc(q(G.venue))}</p>
<p class="line">${esc(q(G.forecast))}${D.injuries && D.injuries.asOf && process.env.PRINT_AVAIL_TOP ? ` <b>${esc(D.injuries.label || 'Availability')}:</b> ${esc(q(D.injuries.asOf))}` : ''}</p>
<div class="chips">${chips}${pred}</div>
<p class="src">${esc(q(G.source))}</p>
<div class="two">
<div><h3>${esc(D.keys && D.keys.label || 'Keys')}</h3>${keys}<p class="src">${esc(q(D.keys && D.keys.source))}</p></div>
<div><h3>${esc(D.tape && D.tape.label || 'Tale of the tape')}</h3><p class="note">${esc(q(D.tape && D.tape.note))}</p><table class="tape"><thead><tr><th></th><th>Florida</th><th>${esc(oppName)}</th></tr></thead><tbody>${tape}</tbody></table><p class="src">${esc(q(D.tape && D.tape.source))}</p>
<h3>${esc(D.series && D.series.label || 'The series')}</h3><p class="big">${esc(q(D.series && D.series.headline))}</p><p>${esc(q(D.series && D.series.line))}</p>
${process.env.PRINT_AVAIL_TOP ? '' : `<h3>${esc(D.injuries && D.injuries.label || 'Availability')}</h3><p>${esc(q(D.injuries && D.injuries.asOf))}</p>`}</div>
</div>
</section>`;
const NUM = D.numbers || {}, WCH = D.watching || {};
const numItems = (NUM.items || []).filter(t => t && t.value && t.label);
const wchItems = (WCH.items || []).filter(t => t && t.by && t.line);
const authors = [...new Set(P.posts.map(p => p.author).filter(Boolean))];
const numbers = numItems.length ? `<section class="nums"><h2 class="sec">${esc(q(NUM.label || 'By the numbers'))}</h2><p class="note">${esc(q(NUM.note))}</p>
<div class="tiles">${numItems.map(t => `<div class="tile"><b>${esc(t.value)}</b><span>${esc(q(t.label))}</span>${t.note ? `<small>${esc(q(t.note))}</small>` : ''}</div>`).join('')}</div><p class="src">${esc(q(NUM.source))}</p></section>` : '';
const watching = wchItems.length ? `<section class="wtch"><h2 class="sec">${esc(q(WCH.label || 'What we are watching'))}</h2><p class="note">${esc(q(WCH.note))}</p>
<div class="wqs">${wchItems.map(t => `<blockquote class="wq"><p>${esc(q(t.line))}</p><cite>${esc(t.by)}</cite></blockquote>`).join('')}</div><p class="src">${esc(q(WCH.source))}</p></section>` : '';
const team = `<section class="team-page"><h2 class="sec">The GatorBait Media team</h2><p class="who">${authors.map(esc).join(' <i></i> ')}</p><p class="src">Photography: Chris Spears, GatorBait Media. Independent Florida Gators coverage at www.gatorbaitmedia.com, with The Buddy Martin Show nightly.</p></section>`;
const numPage = (numbers || watching) ? `<div class="numpage">${numbers}${watching}${X.credits ? '' : team}</div>` : '';

// From the GatorBait desk: one staff column with a small chart of the numbers it uses.
const DK = X.desk;
const deskChart = DK && DK.chart ? `<figure class="dchart"><figcaption class="dc-t">${esc(q(DK.chart.label))}</figcaption>${DK.chart.bars.map(b => `<div class="dc-r"><span class="dc-l">${esc(q(b.label))}</span><span class="dc-b"><i class="${b.tone === 'orange' ? 'o' : 'b'}" style="width:${(100 * b.value / (DK.chart.max || 50)).toFixed(1)}%"></i></span><b>${esc(b.value.toFixed(1))}</b></div>`).join('')}</figure>` : '';
const deskPage = DK ? `<article class="story desk"><header class="story-h"><p class="kick">${esc(q(DK.kicker))}</p><h2>${esc(q(DK.title))}</h2><p class="lede">${esc(q(DK.dek))}</p><p class="by">${esc(q(DK.byline))}</p></header>
<blockquote class="pull">${esc(q(DK.pull).replace(/[\u201c\u201d]/g, '\u2019'))}</blockquote>${deskChart}
<div class="body">${DK.paragraphs.map(t => `<p>${esc(q(t))}</p>`).join('')}</div><p class="src">${esc(q(DK.source))}</p></article>` : '';

const watchSec = `<h3>${esc(D.watch && D.watch.label || 'How to watch')}</h3><table class="watch">${watch}</table><p class="src">${esc(q(D.watch && D.watch.source))}</p>`;

const slateSec = `<section class="slate"><h2 class="sec">${esc(q(D.slate && D.slate.label || 'Saturday in the SEC'))}</h2><p class="note">${esc(q(D.slate && D.slate.note))}</p>
<table class="sl"><thead><tr><th>Time (ET)</th><th>Game</th><th>TV</th><th>Line</th></tr></thead><tbody>${slate}</tbody></table><p class="src">${esc(q(D.slate && D.slate.source))}</p>${watchSec}</section>`;

const shots = D.shots && D.shots.photos && D.shots.photos.length ? `<section class="shots"><h2 class="sec">${esc(D.shots.label)}</h2><p class="note">${esc(q(D.shots.note))} · ${esc(q(D.shots.credit))}</p>
<div class="grid">${D.shots.photos.map(p => `<figure class="ph"><img src="${media(p, 1400, 1000)}" alt="${esc(q(p.alt))}"><figcaption>${esc(q(p.caption))}</figcaption></figure>`).join('')}</div></section>` : '';

const cardStories = cards.filter(c => c.url !== C.url && c.url !== F.url && c.url !== L.url).map(c => story(byUrl.get(c.url), { kicker: c.kicker, image: c.image, title: c.title, cls: 'card' })).join('\n');
const next = D.reference && D.reference.next ? `<p class="next">${esc(q(D.reference.next))}</p>` : '';

const CR = X.credits;
const creditsPage = CR ? `<section class="credits"><h2 class="sec">${esc(q(CR.label || 'Masthead'))}</h2>
<div class="people">${CR.people.map(p => `<div class="pr"><b>${esc(q(p.name))}</b><span>${esc(q(p.role))}</span></div>`).join('')}</div>
<div class="clines">${CR.lines.map(l => `<p>${esc(q(l))}</p>`).join('')}</div>
<p class="cc">${esc(q(CR.contact || ''))}<br>${esc(q(CR.copyright || ''))}</p></section>` : '';

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(q(I.pageTitle || 'GatorBait Magazine'))}</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Barlow+Condensed:wght@600;700;800;900&display=block">
<style>
@page { size: 8.5in 11in; margin: 0.6in 0.58in 0.7in; }
@page :first { margin: 0; }
@page { @bottom-center { content: "GatorBait Magazine · ${esc(q(I.number))} · ${esc(ap(q(I.date)))}   |   " counter(page); font: 500 8pt/1 Barlow, Arial, sans-serif; color: #5a6783; } }
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

/* ===== Gator day look: white pages, Gator blue and orange, bright photo cover ===== */
:root { --blue: #0021a5; --orange: #fa4616; --ink: #14203f; --mute: #5a6783; --rule: #d9dfec; --tint: #eef2fb; }
html, body { background: #fff; color: var(--ink); }
.sec { color: var(--blue); border-left: 7pt solid var(--orange); font-size: 26pt; }
h3, .big, .key b, .watch th { color: var(--blue); }
.kick { color: var(--orange); }
.team { background: var(--tint); border: 0; border-top: 5pt solid var(--blue); }
.team b { color: var(--blue); } .team .rk { color: var(--orange); } .team span:last-child { color: var(--mute); }
.chip { background: var(--tint); border: 0; border-left: 3pt solid var(--orange); color: var(--ink); } .chip b { color: var(--blue); }
td, th { border-bottom: 1pt solid var(--rule); } th { color: var(--blue); }
.sl .hero td { background: #fff1ea; color: var(--ink); }
.sl th, .tape thead th { background: var(--blue); color: #fff; border: 0; }
figcaption, .src, .note, .by span { color: var(--mute); }
.cover { background: var(--blue); position: relative; display: block; }
.cover-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; filter: saturate(1.12) brightness(1.04); }
.cover-shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,33,165,.42) 0%, rgba(0,33,165,0) 24%, rgba(0,33,165,0) 46%, rgba(0,33,165,.72) 74%, rgba(0,22,120,.95) 100%); }
.mast { position: absolute; top: 0.4in; left: 0.45in; right: 0.45in; display: block; padding: 0; text-align: center; }
.logo { display: block; width: 6.2in; margin: 0 auto; filter: drop-shadow(0 3px 10px rgba(0,0,0,.35)); }
.mz { display: block; margin-top: 2pt; color: #fff; letter-spacing: .55em; font: 700 12pt/1 Barlow, Arial, sans-serif; text-transform: uppercase; text-shadow: 0 2px 8px rgba(0,0,0,.5); }
.ed { position: absolute; top: 1.95in; left: 0; right: 0; text-align: center; background: none; padding: 0; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.55); }
.ed b { display: inline; font: 800 12.5pt/1.1 Barlow, Arial, sans-serif; text-transform: uppercase; letter-spacing: .28em; }
.ed span { display: block; margin-top: 2pt; font-size: 10pt; color: #fff; letter-spacing: .12em; text-transform: uppercase; }
.cover-type { position: absolute; left: 0.5in; right: 0.5in; bottom: 0.85in; padding: 0; text-align: center; }
.cover-type .kick { color: #ffd2c0; font-size: 10pt; text-shadow: 0 2px 6px rgba(0,0,0,.5); }
.cover-type h1 { font: 900 60pt/.92 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: #fff; text-shadow: 0 4px 0 var(--orange), 0 6px 22px rgba(0,0,0,.45); }
.cover-type .dek { font: italic 500 13.5pt/1.35 Barlow, Arial, sans-serif; max-width: 6.4in; margin: 10pt auto 8pt; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.5); }
.cby { font: 800 10.5pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #fff; margin: 0; }
.cby i { display: inline-block; width: 5pt; height: 5pt; background: var(--orange); border-radius: 50%; margin: 0 7pt 1.5pt; }
.cover-foot { position: absolute; left: 0.5in; right: 0.5in; bottom: 0.3in; padding: 0; color: #dfe7ff; justify-content: space-between; }
.story-h h2 { color: var(--blue); font-size: 40pt; line-height: .98; }
.story.card .story-h h2 { font-size: 24pt; }
.story.card { border-top: 4pt solid var(--orange); padding-top: 9pt; margin-top: 14pt; break-inside: avoid; }
.story.card .story-ph img { max-height: 2.9in; }
.lede { color: var(--ink); font-size: 13pt; } .by { color: var(--orange); }
.story-ph img { max-height: 5in; width: 100%; }
.pull { margin: 4pt 0 10pt; padding: 8pt 0 8pt 14pt; border-left: 5pt solid var(--orange); font: 800 17pt/1.18 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: var(--blue); break-inside: avoid; }
.pull::before { content: "\\201C"; } .pull::after { content: "\\201D"; }
.body { color: var(--ink); font-size: 10.4pt; line-height: 1.45; text-align: left; }
.story.card .body { columns: 2; column-gap: 14pt; column-fill: balance; font-size: 9.6pt; }
.dropcap-off { float: left; font: 900 46pt/.82 "Barlow Condensed", Barlow, sans-serif; color: var(--orange); padding: 3pt 5pt 0 0; }
.body h2, .body h3, .body h4 { color: var(--blue); font: 800 12pt/1.2 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; letter-spacing: .04em; margin: 9pt 0 3pt; }
.body strong { color: var(--blue); } .body blockquote { border-left-color: var(--orange); color: var(--ink); }
.more { margin: 5pt 0 0; font: 700 8.5pt/1.3 Barlow, Arial, sans-serif; color: var(--blue); }
.grid img { max-height: 1.75in; width: 100%; object-fit: cover; } .grid figure:first-child img { max-height: 3in; }
.end { border-top: 4pt solid var(--orange); } .next { color: var(--blue); font-size: 13pt; }

/* ===== Network skin for print: blue slabs, orange rails, chamfered tiles. Pages stay white for home printers. ===== */
.cover.art { display: block; position: relative; background: #061a45; }
.cover.art .cover-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%; filter: none; }
.sec { background: linear-gradient(90deg, #0021a5 0%, #0a38d4 100%); color: #fff; border-left: 0; padding: 8pt 22pt 8pt 12pt; position: relative; clip-path: polygon(0 0, 100% 0, calc(100% - 14pt) 100%, 0 100%); letter-spacing: .02em; }
.sec::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 3.5pt; background: var(--orange); }
.story .kick { display: inline-block; background: var(--orange); color: #fff; padding: 3pt 12pt 3pt 8pt; margin: 0 0 6pt; clip-path: polygon(0 0, 100% 0, calc(100% - 7pt) 100%, 0 100%); }
.story.card .story-h .kick { font-size: 7.6pt; }
.numpage { break-after: page; display: grid; gap: 14pt; align-content: start; }
.tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9pt; margin: 8pt 0 2pt; }
.tile { background: var(--tint); border-top: 5pt solid var(--orange); padding: 9pt 10pt 9pt; clip-path: polygon(0 0, 100% 0, 100% calc(100% - 11pt), calc(100% - 11pt) 100%, 0 100%); break-inside: avoid; }
.tile b { display: block; font: 900 31pt/.95 "Barlow Condensed", Barlow, Arial, sans-serif; color: var(--blue); }
.tile span { display: block; margin-top: 3pt; font: 800 8.4pt/1.25 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--orange); }
.tile small { display: block; margin-top: 3pt; font: 500 8.2pt/1.35 Barlow, Arial, sans-serif; color: var(--mute); }
.wqs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10pt; margin-top: 8pt; }
.wq { margin: 0; padding: 10pt 12pt 9pt 34pt; background: var(--tint); border-left: 5pt solid var(--orange); position: relative; break-inside: avoid; }
.wq::before { content: "\\201C"; position: absolute; left: 9pt; top: -2pt; font: 900 44pt/1 "Barlow Condensed", Barlow, sans-serif; color: var(--orange); }
.wq p { margin: 0; font: 600 11.2pt/1.35 Barlow, Arial, sans-serif; color: var(--ink); }
.wq cite { display: block; margin-top: 6pt; font: 800 8.6pt/1.2 Barlow, Arial, sans-serif; font-style: normal; letter-spacing: .12em; text-transform: uppercase; color: var(--blue); }
.team-page { break-inside: avoid; }
.who { font: 800 13pt/1.3 "Barlow Condensed", Barlow, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: var(--blue); margin: 6pt 0 3pt; }
.who i { display: inline-block; width: 5pt; height: 5pt; background: var(--orange); margin: 0 8pt 1.5pt; transform: rotate(45deg); }
.story.feature .story-h h2 { font-size: 44pt; }
.story.feature .body > h2:first-child { display: none; }
.story.feature .body > h2:first-child + p::first-letter { float: left; font: 900 54pt/.8 "Barlow Condensed", Barlow, sans-serif; color: var(--orange); padding: 4pt 6pt 0 0; }
.story.feature .pull { font-size: 21pt; background: var(--tint); padding: 10pt 14pt; border-left-width: 7pt; }

/* Desk column + masthead */
.story.desk { break-before: page; }
.story.desk .story-h h2 { font-size: 32pt; margin-bottom: 3pt; }
.story.desk .body { columns: 2; column-gap: 16pt; column-fill: balance; font-size: 10pt; line-height: 1.4; }
.story.desk .body p { margin: 0 0 5pt; }
.story.desk .lede { font-size: 11.5pt; }
.story.desk .src { margin-top: 6pt; }
.story.desk .pull { font-size: 17pt; background: var(--tint); padding: 6pt 12pt; margin: 2pt 0 6pt; border-left-width: 7pt; }
.dchart { margin: 4pt 0 8pt; padding: 8pt 14pt 6pt; background: var(--tint); border-top: 5pt solid var(--blue); clip-path: polygon(0 0, 100% 0, 100% calc(100% - 12pt), calc(100% - 12pt) 100%, 0 100%); break-inside: avoid; }
.dc-t { font: 800 9pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: var(--blue); margin: 0 0 6pt; }
.dc-r { display: grid; grid-template-columns: 1.15in 1fr 0.5in; align-items: center; gap: 8pt; margin: 0 0 3pt; font: 600 9.4pt/1.2 Barlow, Arial, sans-serif; color: var(--ink); }
.dc-b { display: block; height: 11pt; background: #dfe5f5; position: relative; }
.dc-b i { display: block; height: 100%; }
.dc-b i.b { background: var(--blue); } .dc-b i.o { background: var(--orange); }
.dc-r b { font: 800 12pt/1 "Barlow Condensed", Barlow, sans-serif; color: var(--blue); text-align: right; font-variant-numeric: tabular-nums; }
.credits { break-before: page; break-inside: avoid; }
.people { display: grid; grid-template-columns: 1fr 1fr; gap: 10pt 18pt; margin: 12pt 0 14pt; }
.pr { border-left: 5pt solid var(--orange); background: var(--tint); padding: 8pt 12pt 8pt 11pt; break-inside: avoid; }
.pr b { display: block; font: 900 19pt/1 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: var(--blue); }
.pr span { display: block; margin-top: 3pt; font: 700 8.6pt/1.3 Barlow, Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: var(--orange); }
.clines p { font-size: 9.6pt; margin: 0 0 6pt; color: var(--ink); }
.cc { margin-top: 10pt; font: 700 9pt/1.5 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--blue); }

/* QA fixes: headings stay with their text; graphics are never cropped */
.body h2, .body h3, .body h4 { break-after: avoid; break-inside: avoid; }
.body figure img { object-fit: contain; max-height: 4.4in; background: #fff; }
.story-ph.contain img { object-fit: contain; background: var(--tint); }
</style></head><body>
${cover}
${briefing}
${numPage}
${deskPage}
${story(coverPost, { kicker: C.kicker, title: coverPost && /Nostalgia/i.test(C.headline) ? C.headline : undefined, lede: '', cls: 'feature', pq: ((C.lines||[])[2]||'').replace(/ Buddy Martin$/, '').replace(/^"|"$/g, '') })}
${story(leadPost, { kicker: `${L.label || 'The Lead'} · ${L.author || ''}`, image: L.image, title: L.title, cls: 'feature' })}
${featPost ? story(featPost, { kicker: `${F.label || 'Feature'} · ${F.author || ''}`, image: F.image, title: F.title, lede: F.dek, cls: 'feature', pq: process.env.FEATURE_PULL || '' }) : ''}
${slateSec}
<section class="news"><h2 class="sec" style="break-before:page">${esc(D.cards && D.cards.label || 'This week')}</h2>
${cardStories}
</section>
${shots}
${creditsPage}
<section class="end">${next}<p class="colophon">GatorBait Magazine, ${esc(q(I.number))}, ${esc(ap(q(I.date)))}. ${esc(q(I.tagline))}. ${esc(q(D.asOf || ''))} Published by GatorBait Media, www.gatorbaitmedia.com.</p></section>
</body></html>`;
fs.writeFileSync(outPath, html);
console.log(`wrote ${outPath} (${html.length} chars, ${P.posts.length} posts, ${(html.match(/<img /g) || []).length} images)`);
