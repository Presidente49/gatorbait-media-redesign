#!/usr/bin/env node
// Postgame Edition print build. Reuses the house CSS of tools/magazine-pdf/build-print.mjs (extracted at build time, so the
// two cannot drift) and adds only page layouts for this issue.
//   node deploy/magazine-2026/postgame-texas/build-print.mjs <out.html>
//   PLAYWRIGHT_PKG=/opt/node22/lib/node_modules/playwright node tools/magazine-pdf/render-pdf.mjs <out.html> <out.pdf>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './content.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2];
if (!out) { console.error('usage: build-print.mjs <out.html>'); process.exit(2); }

// House CSS from the existing pregame builder.
const base = fs.readFileSync(path.join(here, '../../../tools/magazine-pdf/build-print.mjs'), 'utf8');
let css = base.split('<style>\n')[1].split('</style></head>')[0].replace(/\\\\/g, '\\');
css = css.replace(/@page \{ @bottom-center \{[^\n]*\n/, `@page { @bottom-center { content: "${C.ISSUE.footer}   |   " counter(page); font: 500 8pt/1 Barlow, Arial, sans-serif; color: #5a6783; } }\n`);

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const q = s => String(s == null ? '' : s)
  .replace(/(^|[\s(\[{—–-])"/g, '$1“').replace(/"/g, '”')
  .replace(/(^|[\s(\[{—–-])'/g, '$1‘').replace(/'/g, '’');
const img = f => 'file://' + path.join(here, 'art', f);
const CREDIT = C.ISSUE.credit;
const fig = (p, cls = '') => `<figure class="ph story-ph ${cls}"><img src="${img(p.file)}" alt="${esc(p.cap)}"><figcaption>${esc(q(p.cap))} ${esc(CREDIT)}.</figcaption></figure>`;
const hdr = (o, extra = '') => `<header class="story-h"><p class="kick">${esc(q(o.kicker))}</p><h2>${esc(q(o.title))}</h2><p class="by">${esc(o.by)} <span>${esc(o.date || '')}</span></p>${extra}</header>`;
const pull = (t, cite = '') => `<blockquote class="pull">${esc(t.replace(/[“”]/g, '’'))}</blockquote>${cite ? `<p class="pcite">${esc(cite)}</p>` : ''}`;
const tiles = a => `<div class="tiles">${a.map(t => `<div class="tile"><b>${esc(t.v)}</b><span>${esc(t.l)}</span><small>${esc(q(t.n))}</small></div>`).join('')}</div>`;

const cover = `<section class="cover art"><img class="cover-img" src="${img('cover.jpg')}" alt="GatorBait Magazine Postgame Edition cover: Florida 27, Texas 24"></section>`;

const story = `<article class="story feature">${hdr(C.STORY)}${fig(C.STORY.photo)}${pull(C.STORY.pull, C.STORY.pullCite)}
<div class="body">${C.STORY.paras.map(p => `<p>${esc(q(p))}</p>`).join('')}</div><p class="src">${esc(q(C.STORY.source))}</p><h3>Why it flipped</h3>${tiles(C.TILES)}</article>`;

const lineRows = C.LINE.rows.map(r => `<tr><td class="tm">${esc(r.team)}<small>${esc(r.rec)}</small></td>${r.q.map(n => `<td>${n}</td>`).join('')}<td class="fin">${r.f}</td></tr>`).join('');
const lineScore = `<table class="linescore"><thead><tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>Final</th></tr></thead><tbody>${lineRows}</tbody></table>`;

const timeline = `<section class="pg"><h2 class="sec">Score by score</h2><p class="note">Final: Florida 27, No. 7 Texas 24. Highlighted rows are Florida’s 24 straight points.</p>${lineScore}
<table class="tl"><thead><tr><th>When</th><th>Play</th><th>Score</th></tr></thead><tbody>${C.TIMELINE.map(r => `<tr class="${r.run ? 'run' : ''}"><td>${esc(r.when)}</td><td>${esc(q(r.play))}<small>${esc(q(r.src))}</small></td><td>${esc(r.score)}</td></tr>`).join('')}</tbody></table>
<p class="src">Source: ESPN game summary (event 401856724). Q1 and the 11:27 mark are from Franz Beard’s column; the 1:58 mark is from the desk story. The Q2 field goal is the 45-yarder in ESPN’s kicking line and is not timed in the summary we pulled.</p></section>`;

const statRows = C.TEAMSTATS.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
const lead = (name, rows) => `<h3>${name}</h3><table class="ld">${rows.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(q(r[1]))}</td></tr>`).join('')}</table>`;
const box = `<section class="pg"><h2 class="sec">Box score</h2><p class="note">Darrell K. Royal–Texas Memorial Stadium, Austin · Oct. 17, 2026 · Attendance 103,989</p>${lineScore}
<div class="two"><div><h3>Team stats</h3><table class="tape"><thead><tr><th></th><th>Florida</th><th>Texas</th></tr></thead><tbody>${statRows}</tbody></table></div>
<div>${lead('Florida leaders', C.LEADERS.Florida)}</div></div>${lead('Texas leaders', C.LEADERS.Texas)}
<p class="src">Source: ESPN game summary (event 401856724). Records: Florida 5-2 (3-2 SEC), Texas 4-2 (1-2 SEC).</p></section>`;

const franz = `<article class="story feature franz">${hdr(C.FRANZ)}${fig(C.FRANZ.photo)}${pull(C.FRANZ.pull)}<p class="src enote">${esc(q(C.FRANZ.note))}</p><p class="epi">${esc(q(C.FRANZ.epigraph))}</p>
<div class="body">${C.FRANZ.paras.map(p => `<p>${esc(p)}</p>`).join('')}</div></article>`;

const loren = `<article class="story feature loren">${hdr(C.LOREN)}${pull(C.LOREN.pull)}<p class="src enote">${esc(q(C.LOREN.note))}</p>
<div class="body">${C.LOREN.blocks.map(([t, s]) => t === 'h' ? `<h3>${esc(q(s))}</h3>` : `<p>${esc(s)}</p>`).join('')}</div></article>`;

const buddy = `<article class="story feature buddy">${hdr(C.BUDDY)}${fig(C.BUDDY.photo)}${pull(C.BUDDY.pull)}<p class="src enote">${esc(q(C.BUDDY.note))}</p>
<div class="body">${C.BUDDY.blocks.map(([t, s]) => t === 'h' ? `<h3>${esc(q(s))}</h3>` : `<p>${esc(s)}</p>`).join('')}</div></article>`;

const presser = `<section class="pg"><h2 class="sec">Press conference</h2><p class="note">Template page. Nothing on this page is a quote. Quotes go in only from a full transcript, verbatim, with the speaker and the setting.</p>
<div class="slot"><span class="tag">Reserved · pending transcript</span><h3>Head coach Jon Sumrall</h3><p class="ph-q">“[Opening statement: verbatim from the transcript]”</p><p class="ph-q">“[Q&amp;A pull quote: verbatim from the transcript]”</p><p class="ph-by">Jon Sumrall, head coach · postgame press conference, Oct. 17, 2026</p></div>
<div class="slot"><span class="tag">Reserved · pending transcript</span><h3>Players at the podium</h3><p class="ph-q">“[Player quote: verbatim from the transcript]”</p><p class="ph-by">[Name, position] · postgame press conference, Oct. 17, 2026</p></div>
<div class="slot"><span class="tag">Watch · @gatorbaitmedia on Instagram</span><h3>Watch</h3><p class="ph-q">“Baugh: ‘Tramell is going to be a great quarterback.’” instagram.com/reel/Deo2ka3j-lI</p><p class="ph-q">“Sumrall: ‘We still suck. We just suck less.’” instagram.com/reel/Deo0M1Kj-1N</p><p class="ph-by">Clips from GatorBait Media, posted Oct. 18, 2026. Quotes are the clip titles as posted; full video at the links.</p></div>
<p class="src">Until the full transcripts arrive, Jon Sumrall’s press-conference comments as Franz Beard reported them are printed in Franz’s column in this issue.</p></section>`;

const georgia = `<section class="pg"><h2 class="sec">What’s next: Georgia</h2><p class="note">Florida’s next game, from ESPN.</p>
<div class="matchup"><div class="team"><span class="rk">&nbsp;</span><b>Florida</b><span>5-2 · 3-2 SEC</span></div><div class="at">vs</div><div class="team"><span class="rk">&nbsp;</span><b>Georgia</b><span>Record and ranking pending</span></div></div>
<table class="watch">${C.GEORGIA.facts.map(r => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}</table>
<h3>What Florida carries out of Austin</h3>${tiles(C.GEORGIA.carry)}
<h3>Still to come</h3>${C.GEORGIA.slots.map(s => `<div class="slot slim"><span class="tag">Pending</span><p>${esc(q(s))}</p></div>`).join('')}
<p class="src">Source: ESPN game summary (event 401856724) for Florida’s numbers; ESPN schedule for date, time, network and site. No Georgia ranking or record is claimed here.</p></section>`;

const back = `<section class="credits"><h2 class="sec">Masthead</h2><div class="people">${C.CREDITS.people.map(p => `<div class="pr"><b>${esc(q(p[0]))}</b><span>${esc(q(p[1]))}</span></div>`).join('')}</div>
<div class="clines">${C.CREDITS.lines.map(l => `<p>${esc(q(l))}</p>`).join('')}</div><p class="cc">${esc(C.CREDITS.contact)}<br>${esc(C.CREDITS.copyright)}</p>
<div class="end"><p class="next">Next: Georgia, Saturday, Oct. 31, 3:30 p.m. ET, ABC, Mercedes-Benz Stadium.</p><p class="colophon">GatorBait Magazine, ${esc(C.ISSUE.number)}, ${esc(C.ISSUE.date)}. Independent Florida Gators coverage. Published by GatorBait Media, www.gatorbaitmedia.com.</p></div></section>`;

const extra = `
.pg { break-before: page; }
.pcite { margin: -6pt 0 8pt 19pt; font: 700 8pt/1.3 Barlow, Arial, sans-serif; letter-spacing: .08em; text-transform: uppercase; color: var(--mute); }
.epi { font: italic 500 10.5pt/1.4 Barlow, Arial, sans-serif; color: var(--blue); margin: 0 0 8pt; }
.story.feature .story-h h2 { font-size: 34pt; }
.story.feature .body > h3:first-child + p::first-letter { float: none; font: inherit; color: inherit; padding: 0; }
.story.feature .body > p:first-child::first-letter { float: none; font: inherit; color: inherit; padding: 0; }
.story .body h3 { margin: 8pt 0 3pt; font: 800 12pt/1.2 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; letter-spacing: .04em; color: var(--blue); break-after: avoid; }
.story.feature .story-ph img { max-height: 2.6in; }
.story .body p { break-inside: auto; }
.enote { margin: 0 0 8pt; font-size: 7.6pt; }
.buddy .story-ph img { max-height: 2.2in; }
.buddy .body p { margin-bottom: 4.5pt; }
.loren .body p { margin-bottom: 4.5pt; }
.loren .enote { color: var(--orange); font-weight: 700; }
.buddy .enote { color: var(--orange); font-weight: 700; }
.linescore { margin: 4pt 0 10pt; font-size: 11pt; }
.linescore th, .linescore td { text-align: center; padding: 5pt 6pt; }
.linescore th:first-child, .linescore td.tm { text-align: left; }
.linescore thead th { background: var(--blue); color: #fff; border: 0; }
.linescore td.tm { font: 800 15pt/1.1 "Barlow Condensed", Barlow, sans-serif; text-transform: uppercase; color: var(--blue); }
.linescore td.tm small { display: block; font: 500 8pt/1.2 Barlow, Arial, sans-serif; color: var(--mute); text-transform: none; }
.linescore td.fin { font: 900 20pt/1 "Barlow Condensed", Barlow, sans-serif; color: var(--orange); }
.tl { margin: 0 0 8pt; font-size: 9.6pt; }
.tl td:first-child { width: .95in; font-weight: 700; color: var(--blue); white-space: nowrap; }
.tl td:last-child { width: 1.45in; font-weight: 700; white-space: nowrap; }
.tl small { display: block; color: var(--mute); font-size: 7.4pt; }
.tl thead th { background: var(--blue); color: #fff; border: 0; }
.tl tr.run td { background: #fff1ea; }
.ld { font-size: 9pt; margin-bottom: 4pt; }
.ld th { width: .8in; }
.tape td:nth-child(n+2) { white-space: normal; }
.two { margin-top: 6pt; }
.slot { border: 1.5pt dashed var(--orange); background: #fffaf7; padding: 10pt 14pt 8pt; margin: 0 0 12pt; position: relative; break-inside: avoid; }
.slot.slim { padding: 6pt 12pt 2pt; margin: 0 0 6pt; }
.slot .tag { position: absolute; top: -8pt; left: 12pt; background: var(--orange); color: #fff; font: 800 7.6pt/1 Barlow, Arial, sans-serif; letter-spacing: .12em; text-transform: uppercase; padding: 3pt 8pt; }
.slot h3 { margin-top: 4pt; }
.slot.slim p { margin: 0 0 4pt; font-weight: 600; }
.ph-q { font: italic 600 13pt/1.35 Barlow, Arial, sans-serif; color: #8a93a6; margin: 4pt 0; }
.ph-by { font: 800 8.6pt/1.2 Barlow, Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: var(--mute); margin: 0 0 4pt; }
.matchup { margin: 8pt 0 12pt; }
.watch { margin: 4pt 0 6pt; font-size: 11pt; }
.watch th { width: 1.3in; font-size: 9pt; }
.credits { break-before: page; }
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>GatorBait Magazine | Postgame Edition: Florida 27, Texas 24</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Barlow+Condensed:wght@600;700;800;900&display=block">
<style>
${css}
${extra}
</style></head><body>
${cover}
${story}
${timeline}
${box}
${franz}
${loren}
${buddy}
${presser}
${georgia}
${back}
</body></html>`;
fs.writeFileSync(out, html);
console.log(`wrote ${out} (${html.length} chars, ${(html.match(/<img /g) || []).length} images)`);
