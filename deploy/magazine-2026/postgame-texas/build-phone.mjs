#!/usr/bin/env node
// Phone-first edition of the Postgame magazine PDF. Same words and numbers as the print edition (content.mjs, articles2.mjs):
// nothing is added or rewritten. One column, 390 x 844 pt portrait pages (9:19.5, an iPhone screen), body 17 pt, nothing under 12 pt,
// full-bleed photos, Barlow only (Barlow Condensed for display headlines), selectable text, working links.
//   node deploy/magazine-2026/postgame-texas/build-phone.mjs <out.html>
//   PLAYWRIGHT_PKG=<path to playwright> node deploy/magazine-2026/postgame-texas/render-phone.mjs <in.html> <out.pdf>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './content.mjs';
import { FRANZ2, BUDDY2, APPOLL, VOICES } from './articles2.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2];
if (!out) { console.error('usage: build-phone.mjs <out.html>'); process.exit(2); }

const SITE = 'https://www.gatorbaitmedia.com';
const PRINT_URL = 'https://18fb3a4e-d7f6-414a-aeb9-3047db3ea115.usrfiles.com/ugd/d3cfa5_6fd61c786a0441b5a8dbead1182f2e1d.pdf';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const q = s => String(s == null ? '' : s)
  .replace(/(^|[\s(\[{—–-])"/g, '$1“').replace(/"/g, '”')
  .replace(/(^|[\s(\[{—–-])'/g, '$1‘').replace(/'/g, '’');
const img = f => 'file://' + path.join(here, 'art', f);
const CREDIT = C.ISSUE.credit;
// The print notes carry internal Wix post ids; readers do not need them.
const note = s => q(String(s).replace(/ \(Wix post [0-9a-f]{8}(?:, ([^)]*))?\)/g, (m, x) => x ? ` (${x})` : ''));

const fig = p => `<figure class="ph"><img src="${img(p.file)}" alt="${esc(p.cap)}"><figcaption>${esc(q(p.cap))} ${esc(CREDIT)}.</figcaption></figure>`;
const online = (url, label) => url ? `<p class="onl"><a href="${SITE}${url}">${esc(label)}</a></p>` : '';
const hdr = (o, id) => `<header class="story-h" id="${id}"><p class="kick">${esc(q(o.kicker))}</p><h2>${esc(q(o.title))}</h2><p class="by">${esc(o.by)} <span>${esc(o.date || '')}</span></p></header>`;
const pull = (t, cite = '') => `<blockquote class="pull">${esc(t.replace(/[“”]/g, '’'))}</blockquote>${cite ? `<p class="pcite">${esc(cite)}</p>` : ''}`;
const blocks = bl => bl.map(([t, s]) => t === 'h' ? `<h3>${esc(q(s))}</h3>` : `<p>${esc(q(s))}</p>`).join('');
const tiles = a => `<div class="tiles">${a.map(t => `<div class="tile"><b>${esc(t.v)}</b><span>${esc(t.l)}</span><small>${esc(q(t.n))}</small></div>`).join('')}</div>`;

const COVER = 'file://' + path.join(here, '../../postgame-cover-20261018/postgame-cover-1200x1600.jpg');

// ---- sections, in the same order as the print edition ----
const TOC = [];
const sec = (id, label, sub) => { TOC.push([id, label, sub]); };

sec('franz2', 'The Gators Sucked Less, Turning Arch Madness Into Arch Sadness', 'Franz Beard');
sec('franz', 'It was a good day for an exorcism in Austin', 'Franz Beard');
sec('buddy2', 'Deep In The Heart Of Texas, A Gator Grin', 'Buddy Martin');
sec('buddy', 'A Texas Barbecue: Gators Flip the Script', 'Buddy Martin');
sec('poll', 'Longhorns Tumble, Gators Return: Florida Is No. 20 In The AP Poll', 'The polls');
sec('loren', 'Postgame Thoughts: Florida v. Texas', 'Loren Meadows');
sec('story', 'Gators Stun No. 7 Texas 27-24 in Austin Behind Jones Jr.', 'The game');
sec('score', 'Score by score', 'ESPN');
sec('box', 'Box score', 'ESPN');
sec('voices', 'Postgame voices', 'Quotes');
sec('next', 'What’s next: Georgia', 'Oct. 31');
sec('masthead', 'Masthead', 'Credits');

const cover = `<section class="cover"><img src="${COVER}" alt="GatorBait Magazine Postgame Edition cover: Florida 27, Texas 24">
<div class="cv-t"><p class="cv-k">GatorBait Magazine · ${esc(C.ISSUE.number)}</p><p class="cv-d">${esc(C.ISSUE.date)}</p><p class="cv-s">Made for your phone. Scroll down to read.</p></div></section>`;

const toc = `<section class="pg toc"><h2 class="sec">In this issue</h2>
<ol>${TOC.map(([id, l, s]) => `<li><a href="#${id}"><b>${esc(q(l))}</b> <span>${esc(s)}</span></a></li>`).join('')}</ol>
<p class="prt"><a href="${PRINT_URL}">Print version (US Letter, two columns)</a></p></section>`;

const franz2 = `<article class="story pg">${hdr(FRANZ2, 'franz2')}${pull(FRANZ2.pull)}<p class="enote">${esc(note(FRANZ2.note))}</p>
<div class="body">${blocks(FRANZ2.blocks)}</div>${online('/post/the-gators-sucked-less-turning-arch-madness-into-arch-sadness', 'Read it on gatorbaitmedia.com')}</article>`;

const franz = `<article class="story pg">${hdr(C.FRANZ, 'franz')}${fig(C.FRANZ.photo)}${pull(C.FRANZ.pull)}<p class="enote">${esc(note(C.FRANZ.note))}</p><p class="epi">${esc(q(C.FRANZ.epigraph))}</p>
<div class="body">${C.FRANZ.paras.map(p => `<p>${esc(p)}</p>`).join('')}</div>${online('/post/it-was-a-good-day-for-an-exorcism-in-austin', 'Read it on gatorbaitmedia.com')}</article>`;

const buddy2 = `<article class="story pg">${hdr(BUDDY2, 'buddy2')}${fig(BUDDY2.photo)}${pull(BUDDY2.pull)}<p class="enote">${esc(note(BUDDY2.note))}</p>
<div class="body">${blocks(BUDDY2.blocks)}</div></article>`;

const buddy = `<article class="story pg">${hdr(C.BUDDY, 'buddy')}${fig(C.BUDDY.photo)}${pull(C.BUDDY.pull)}<p class="enote">${esc(note(C.BUDDY.note))}</p>
<div class="body">${blocks(C.BUDDY.blocks)}</div>${online('/post/a-texas-barbecue-gators-flip-the-script-and-jones-changes-the-conversation', 'Read it on gatorbaitmedia.com')}</article>`;

const T = APPOLL.table;
const poll = `<article class="story pg">${hdr(APPOLL, 'poll')}
<div class="body">${APPOLL.paras.map(p => Array.isArray(p) ? `<h3>${esc(q(p[1]))}</h3>` : `<p>${esc(q(p))}</p>`).join('')}</div>
<p class="tt">${esc(T.title)}</p><table class="ap"><thead><tr>${T.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${T.rows.map(r => `<tr class="${r[0] == T.hi ? 'hl' : ''}">${r.map((c, i) => `<td${i == 1 ? ' class="tm"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
<div class="body"><p>${esc(q(APPOLL.close))}</p></div><p class="src">${esc(q(APPOLL.source))}</p></article>`;

const loren = `<article class="story pg">${hdr(C.LOREN, 'loren')}${pull(C.LOREN.pull)}<p class="enote">${esc(note(C.LOREN.note))}</p>
<div class="body">${C.LOREN.blocks.map(([t, s]) => t === 'h' ? `<h3>${esc(q(s))}</h3>` : `<p>${esc(s)}</p>`).join('')}</div>${online('/post/postgame-thoughts-florida-5-2-3-2-v-texas-4-2-1-2', 'Read it on gatorbaitmedia.com')}</article>`;

const story = `<article class="story pg">${hdr(C.STORY, 'story')}${fig(C.STORY.photo)}${pull(C.STORY.pull, C.STORY.pullCite)}
<div class="body">${C.STORY.paras.map(p => `<p>${esc(q(p))}</p>`).join('')}</div><p class="src">${esc(q(C.STORY.source))}</p>${online('/post/gators-stun-no-7-texas-27-24-in-austin-behind-jones-jr', 'Read it on gatorbaitmedia.com')}</article>`;

const lineRows = C.LINE.rows.map(r => `<tr><td class="tm">${esc(r.team)}<small>${esc(r.rec)}</small></td>${r.q.map(n => `<td>${n}</td>`).join('')}<td class="fin">${r.f}</td></tr>`).join('');
const lineScore = `<table class="ls"><thead><tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>F</th></tr></thead><tbody>${lineRows}</tbody></table>`;

const score = `<section class="pg"><h2 class="sec" id="score">Score by score</h2><p class="note">Final: Florida 27, No. 7 Texas 24. Orange rows are Florida’s 24 straight points.</p>${lineScore}
<ol class="tl">${C.TIMELINE.map(r => `<li class="${r.run ? 'run' : ''}"><div class="tl-h"><b>${esc(r.when)}</b><span>${esc(r.score)}</span></div><p>${esc(q(r.play))}</p><small>${esc(q(r.src))}</small></li>`).join('')}</ol>
<h3>Why it flipped</h3>${tiles(C.TILES)}
<p class="src">Source: ESPN game summary (event 401856724). Q1 and the 11:27 mark are from Franz Beard’s column; the late sack is from the desk story and Franz Beard’s column. The Q2 field goal is the 45-yarder in ESPN’s kicking line and is not timed in the summary we pulled.</p></section>`;

const stats = C.TEAMSTATS.map(r => `<div class="st"><p class="sl">${esc(r[0])}</p><div class="sv"><div><span>Florida</span><b>${esc(r[1])}</b></div><div><span>Texas</span><b>${esc(r[2])}</b></div></div></div>`).join('');
const lead = (name, rows) => `<h3>${name}</h3><dl class="ld">${rows.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(q(r[1]))}</dd>`).join('')}</dl>`;
const box = `<section class="pg"><h2 class="sec" id="box">Box score</h2><p class="note">Darrell K. Royal–Texas Memorial Stadium, Austin · Oct. 17, 2026 · Attendance 103,989</p>${lineScore}
<h3>Team stats</h3>${stats}${lead('Florida leaders', C.LEADERS.Florida)}${lead('Texas leaders', C.LEADERS.Texas)}
<p class="src">Source: ESPN game summary (event 401856724). Records: Florida 5-2 (3-2 SEC), Texas 4-2 (1-2 SEC).</p></section>`;

const link = l => l ? ` <a href="https://${l}">${esc(l)}</a>` : '';
const voices = `<section class="pg"><h2 class="sec" id="voices">Postgame voices</h2><p class="note">What the coach, the running back and the quarterback said after Florida 27, No. 7 Texas 24.</p>
${VOICES.cards.map(c => `<div class="voice"><p class="vq">“${esc(q(c.q))}”</p><p class="vw">${esc(c.who)}</p><p class="vc">${esc(q(c.ctx))}${link(c.link)}</p></div>`).join('')}
<p class="src">${esc(q(VOICES.note))}</p></section>`;

const G = C.GEORGIA;
const next = `<section class="pg"><h2 class="sec" id="next">What’s next: Georgia</h2><p class="note">Florida’s next game. Saturday, Oct. 24 is an open date.</p>
<div class="matchup"><div class="team"><span class="rk">${esc(G.florida.rk)}</span><b>Florida</b><span>${esc(G.florida.line)}</span></div><div class="vs">vs</div><div class="team"><span class="rk">${esc(G.georgia.rk)}</span><b>Georgia</b><span>${esc(G.georgia.line)}</span></div></div>
<dl class="ld">${G.facts.map(r => `<dt>${esc(r[0])}</dt><dd>${esc(q(r[1]))}</dd>`).join('')}</dl>
<h3>What Florida carries out of Austin</h3>${tiles(G.carry)}<p class="src">${esc(q(G.source))}</p></section>`;

const back = `<section class="pg credits"><h2 class="sec" id="masthead">Masthead</h2><div class="people">${C.CREDITS.people.map(p => `<div class="pr"><b>${esc(q(p[0]))}</b><span>${esc(q(p[1]))}</span></div>`).join('')}</div>
<div class="clines">${C.CREDITS.lines.map(l => `<p>${esc(q(l))}</p>`).join('')}</div>
<p class="cc"><a href="${SITE}/">${esc(C.CREDITS.contact)}</a><br>${esc(C.CREDITS.copyright)}</p>
<p class="nx">Next: Georgia, Saturday, Oct. 31, 3:30 p.m. ET, ABC, Mercedes-Benz Stadium in Atlanta. Open date Oct. 24.</p>
<p class="prt">Print version: <a href="${PRINT_URL}">US Letter, two columns</a></p>
<p class="colophon">GatorBait Magazine, ${esc(C.ISSUE.number)}, ${esc(C.ISSUE.date)}. Independent Florida Gators coverage. Published by GatorBait Media, www.gatorbaitmedia.com.</p></section>`;

const css = `
@page { size: 390pt 844pt; margin: 34pt 0 46pt;
  @bottom-center { content: "GatorBait Magazine  ·  " counter(page); font: 600 12pt/1 Barlow, Arial, sans-serif; color: #5c6675; } }
@page cover { size: 390pt 844pt; margin: 0; @bottom-center { content: none; } }
.cover { page: cover; }
:root { --navy: #081b35; --orange: #fa4616; --ink: #10172a; --mute: #4b5563; --rule: #d6dbe3; --soft: #f1f4f9; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; color: var(--ink); font: 400 17pt/1.5 Barlow, Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: #0a3d91; text-decoration: underline; text-underline-offset: 2pt; }
.pg { break-before: page; padding: 0 22pt; }
.cover { width: 390pt; height: 844pt; background: #061a33; position: relative; overflow: hidden; break-after: page; }
.cover img { display: block; width: 390pt; height: 520pt; object-fit: cover; }
.cv-t { padding: 22pt 26pt 0; color: #fff; }
.cv-k { margin: 0 0 8pt; font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: var(--orange); }
.cv-h { margin: 0 0 8pt; font: 900 38pt/1.02 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; }
.cv-d { margin: 0 0 14pt; font: 700 22pt/1.2 Barlow, Arial, sans-serif; color: #c9d3e6; }
.cv-s { margin: 0; font: 500 14pt/1.3 Barlow, Arial, sans-serif; color: #c9d3e6; }
.sec { font: 800 32pt/1.05 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: var(--navy); border-left: 7pt solid var(--orange); padding-left: 10pt; margin: 0 0 12pt; break-after: avoid; }
.toc ol { list-style: none; margin: 0 0 8pt; padding: 0; }
.toc li { border-top: 1pt solid var(--rule); }
.toc a { display: block; padding: 5pt 0; text-decoration: none; color: var(--ink); }
.toc b { font: 700 15.5pt/1.22 Barlow, Arial, sans-serif; color: var(--navy); }
.toc span { display: inline-block; margin-left: 4pt; font: 700 12pt/1.2 Barlow, Arial, sans-serif; color: var(--orange); text-transform: uppercase; letter-spacing: .08em; }
.prt { font: 600 15pt/1.4 Barlow, Arial, sans-serif; margin: 12pt 0 0; padding: 10pt 14pt; background: var(--soft); border-left: 5pt solid var(--orange); break-inside: avoid; }
.kick { font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: var(--orange); margin: 0 0 8pt; }
.story-h h2 { margin: 0 0 10pt; font: 900 34pt/1.05 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: var(--navy); overflow-wrap: break-word; }
.by { margin: 0 0 14pt; font: 800 14pt/1.3 Barlow, Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: var(--navy); }
.by span { font-weight: 500; letter-spacing: 0; color: var(--mute); text-transform: none; margin-left: 6pt; }
.ph { margin: 0 -22pt 16pt; break-inside: avoid; }
.ph img { display: block; width: 390pt; height: auto; }
figcaption { padding: 6pt 22pt 0; font: 500 12.5pt/1.35 Barlow, Arial, sans-serif; color: var(--mute); }
.pull { margin: 4pt 0 14pt; padding: 4pt 0 4pt 14pt; border-left: 6pt solid var(--orange); font: 800 23pt/1.22 Barlow, Arial, sans-serif; color: var(--navy); }
.pcite { margin: -6pt 0 14pt 20pt; font: 700 12.5pt/1.3 Barlow, Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: var(--mute); }
.enote, .src, .note { font: 500 12.5pt/1.4 Barlow, Arial, sans-serif; color: var(--mute); margin: 0 0 14pt; }
.epi { font: italic 500 16pt/1.4 Barlow, Arial, sans-serif; color: var(--navy); margin: 0 0 14pt; }
.body p { margin: 0 0 12pt; orphans: 3; widows: 3; hyphens: manual; overflow-wrap: break-word; }
.body h3, h3 { margin: 18pt 0 6pt; font: 800 22pt/1.15 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; letter-spacing: .03em; color: var(--navy); break-after: avoid; }
.onl { margin: 6pt 0 0; font: 700 16pt/1.3 Barlow, Arial, sans-serif; }
.tt { margin: 14pt 0 6pt; font: 800 14pt/1.3 Barlow, Arial, sans-serif; color: var(--navy); }
table { width: 100%; border-collapse: collapse; }
.ls { margin: 6pt 0 16pt; font: 600 17pt/1.2 Barlow, Arial, sans-serif; table-layout: fixed; }
.ls th { background: var(--navy); color: #fff; padding: 8pt 2pt; text-align: center; font-weight: 700; }
.ls th:first-child { width: 126pt; }
.ls td { text-align: center; padding: 10pt 2pt; border-bottom: 1pt solid var(--rule); }
.ls td.tm { text-align: left; font: 800 20pt/1.05 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: var(--navy); }
.ls td.tm small { display: block; margin-top: 2pt; font: 500 12pt/1.2 Barlow, Arial, sans-serif; color: var(--mute); text-transform: none; }
.ls td.fin { font: 900 26pt/1 "Barlow Condensed", Barlow, sans-serif; color: var(--orange); }
.tl { list-style: none; margin: 0 0 8pt; padding: 0; }
.tl li { padding: 10pt 12pt; margin: 0 0 8pt; border-left: 6pt solid var(--rule); background: var(--soft); break-inside: avoid; }
.tl li.run { border-left-color: var(--orange); background: #fff1ea; }
.tl-h { display: flex; justify-content: space-between; gap: 10pt; font: 800 16pt/1.2 Barlow, Arial, sans-serif; color: var(--navy); }
.tl-h span { text-align: right; }
.tl p { margin: 4pt 0 2pt; font: 500 16pt/1.35 Barlow, Arial, sans-serif; }
.tl small { font: 500 12.5pt/1.3 Barlow, Arial, sans-serif; color: var(--mute); }
.tiles { display: block; }
.tile { margin: 0 0 8pt; padding: 10pt 14pt; background: var(--navy); color: #fff; break-inside: avoid; }
.tile b { display: block; font: 900 38pt/1 "Barlow Condensed", Barlow, sans-serif; color: var(--orange); }
.tile span { display: block; font: 800 15pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .06em; text-transform: uppercase; }
.tile small { display: block; margin-top: 3pt; font: 500 14pt/1.35 Barlow, Arial, sans-serif; color: #d3dbea; }
.st { padding: 8pt 0; border-bottom: 1pt solid var(--rule); break-inside: avoid; }
.sl { margin: 0 0 3pt; font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.sv { display: flex; gap: 10pt; }
.sv > div { flex: 1; min-width: 0; }
.sv span { display: block; font: 600 12.5pt/1.2 Barlow, Arial, sans-serif; color: var(--orange); text-transform: uppercase; letter-spacing: .06em; }
.sv b { display: block; font: 700 17pt/1.25 Barlow, Arial, sans-serif; color: var(--navy); }
.ld { margin: 0 0 8pt; }
.ld dt { margin: 10pt 0 1pt; font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--orange); break-after: avoid; }
.ld dd { margin: 0; padding-bottom: 8pt; border-bottom: 1pt solid var(--rule); font: 500 16pt/1.38 Barlow, Arial, sans-serif; }
.ap { margin: 0 0 14pt; font: 600 17pt/1.2 Barlow, Arial, sans-serif; }
.ap th { background: var(--navy); color: #fff; padding: 7pt 8pt; text-align: left; font-weight: 700; }
.ap td { padding: 9pt 8pt; border-bottom: 1pt solid var(--rule); }
.ap tr.hl td { background: #fff1ea; font-weight: 800; }
.voice { border-left: 7pt solid var(--orange); background: var(--soft); padding: 12pt 14pt 10pt; margin: 0 0 14pt; break-inside: avoid; }
.vq { margin: 0 0 6pt; font: 800 21pt/1.25 Barlow, Arial, sans-serif; color: var(--navy); }
.vw { margin: 0 0 4pt; font: 800 13pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.vc { margin: 0; font: 500 14pt/1.4 Barlow, Arial, sans-serif; color: var(--mute); }
.matchup { display: flex; align-items: center; gap: 8pt; margin: 6pt 0 14pt; }
.team { flex: 1; padding: 12pt 8pt; background: var(--navy); color: #fff; text-align: center; }
.team b { display: block; font: 900 28pt/1.05 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; }
.team span { display: block; font: 600 13.5pt/1.3 Barlow, Arial, sans-serif; color: #d3dbea; }
.team .rk { color: var(--orange); font-weight: 800; }
.vs { font: 800 16pt/1 Barlow, Arial, sans-serif; color: var(--mute); text-transform: uppercase; }
.people .pr { padding: 9pt 0; border-bottom: 1pt solid var(--rule); break-inside: avoid; }
.people b { display: block; font: 800 18pt/1.2 Barlow, Arial, sans-serif; color: var(--navy); }
.people span { display: block; font: 500 15pt/1.35 Barlow, Arial, sans-serif; color: var(--mute); }
.clines p { margin: 12pt 0 0; font: 500 15pt/1.45 Barlow, Arial, sans-serif; }
.cc { margin: 16pt 0 8pt; font: 600 15pt/1.5 Barlow, Arial, sans-serif; }
.nx { font: 700 16pt/1.4 Barlow, Arial, sans-serif; color: var(--navy); }
.colophon { margin: 14pt 0 0; font: 500 13pt/1.4 Barlow, Arial, sans-serif; color: var(--mute); }
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>GatorBait Magazine | Postgame Edition: Florida 27, Texas 24 (phone edition)</title>
<meta name="viewport" content="width=390">
<style>${css}</style></head><body>
${cover}
${toc}
${franz2}
${franz}
${buddy2}
${buddy}
${poll}
${loren}
${story}
${score}
${box}
${voices}
${next}
${back}
</body></html>`;
fs.writeFileSync(out, html);
console.log(`wrote ${out} (${html.length} chars, ${(html.match(/<img /g) || []).length} images)`);
