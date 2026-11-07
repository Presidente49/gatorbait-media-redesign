#!/usr/bin/env node
// GatorBait Magazine, Oklahoma-week collector's edition (v2 redesign), one builder for the digital Letter PDF and the phone PDF.
// Chromium prints it (Playwright). Barlow only. Real photographs only (see assets/week2 and the credit manifest in the issue).
//
// Usage:
//   node tools/magazine-pdf/build-issue-v2.mjs --out <dir> [--phone] [--html-only]
// Reads:  magazine/issues/2026-11-06-oklahoma-week/posts.json (prepared story copy, nine stories)
//         magazine/issues/2026-11-06-oklahoma-week/data/{uf-roster,ou-roster,ou-depth}.json (official roster text layers)
//         tools/magazine-pdf/assets/week2/* (cover and photographs)
// Writes: <dir>/issue-v2[-phone].html and, unless --html-only, <dir>/issue-v2[-phone].pdf with bookmarks, tagged structure,
//         internal contents links and a small set of official-source links. Two passes: the first sets the contents page numbers.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const argv = process.argv.slice(2);
const PHONE = argv.includes('--phone');
const HTML_ONLY = argv.includes('--html-only');
const outIdx = argv.indexOf('--out');
const OUT = path.resolve(outIdx > -1 ? argv[outIdx + 1] : path.join(ROOT, 'print-stage'));
fs.mkdirSync(OUT, { recursive: true });
const ISSUE = path.join(ROOT, 'magazine/issues/2026-11-06-oklahoma-week');
const ASSET = path.join(HERE, 'assets/week2');
// Phone edition: the same photographs, resized for a 5 in wide page (max 1300 px wide, JPEG) so the phone PDF stays light on a cellular connection.
function phoneAsset(f) {
  const out = path.join(OUT, '_phone-assets', f.replace(/\.(png|jpe?g)$/i, '.jpg'));
  if (!fs.existsSync(out)) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const py = 'import sys\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert("RGB")\nmw=int(sys.argv[3])\nif im.width>mw: im=im.resize((mw,round(im.height*mw/im.width)),Image.LANCZOS)\nim.save(sys.argv[2],"JPEG",quality=int(sys.argv[4]),optimize=True,progressive=True)';
    const cover = /^cover/.test(f);
    execFileSync('/usr/bin/python3', ['-c', py, path.join(ASSET, f), out, cover ? '1103' : '1300', cover ? '90' : '84']);
  }
  return out;
}
const A = (f) => pathToFileURL(PHONE ? phoneAsset(f) : path.join(ASSET, f)).href;

const { posts } = JSON.parse(fs.readFileSync(path.join(ISSUE, 'posts.json'), 'utf8'));
const byKey = Object.fromEntries(posts.map((p) => [p.key, p]));
const readJson = (f) => { const p = path.join(ISSUE, 'data', f); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; };
const UF = readJson('uf-roster.json'), OU = readJson('ou-roster.json'), OUD = readJson('ou-depth.json');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
// Typographic quotes and apostrophes for DISPLAY copy that we compose (pull quotes, headings we set); story bodies stay as the writers filed them.
const curl = (s) => s.replace(/(^|[\s(\[—-])"/g, '$1“').replace(/"/g, '”').replace(/(\w)'(\w)/g, '$1’$2').replace(/(^|[\s(\[—-])'/g, '$1‘').replace(/'/g, '’');

// ---------------------------------------------------------------------------------------------------------------------
// Editorial plan: order, sections, openers, pull quotes. Every pull quote is asserted to be verbatim in its story.
// ---------------------------------------------------------------------------------------------------------------------
const SECTIONS = {
  honor: { name: 'Ring of Honor', page: 'p-honor' },
  football: { name: 'Football', page: 'p-football' },
  hoops: { name: 'Basketball', page: 'p-hoops' },
  columns: { name: 'Columns', page: 'p-columns' },
};
const PLAN = [
  { key: 'fridays', section: 'honor', open: 'tribute', pq: { after: 11, pafter: 13, text: "I wish I would've enjoyed it more, buddy,", who: 'Urban Meyer' }, watch: 'fridays',
    dek: "Urban Meyer reflects on Florida's championship years and the current Gators. Edgar Thompson previews Oklahoma and the Jacksonville basketball win, and Rob Dotson joins from the Panhandle." },
  { key: 'show', section: 'football', toc: 'Panel opinion', open: 'split-photo', photo: 'qb-panel.jpg', pos: '50% 38%', credit: 'Photo by Chris Spears, GatorBait Media.', cap: 'Aaron Philo (12) and Tramell Jones Jr. (9) on the sideline against South Carolina on Oct. 10, 2026.', pq: { after: 3, text: 'The days of dynasties are over. There is no dynasty anymore.', who: 'Loren Meadows, Buddy Martin Show panel' }, watch: 'show',
    enote: "This is the panel's opinion, not a team announcement. Florida's Week 10 depth chart lists Aaron Philo OR Tramell Jones Jr. at quarterback; see the Game Guide, page {guide}.",
    inlineLink: { text: 'watch the Urban Meyer Ring of Honor discussion', url: 'https://www.youtube.com/watch?v=ZcDpF0jCPGU' } },
  { key: 'scouting1', section: 'football', dekRepl: [['at No. 24 Florida', 'at CFP No. 24 Florida']], open: 'photo-full', photo: 'scouting-huddle.jpg', pos: '50% 40%', credit: 'Photo by Chris Spears, GatorBait Media.', cap: "Florida's defense huddles during the game at Auburn on Sept. 19, 2026.", pq: { after: 5, text: 'We need a change.', who: 'Brent Venables, Oklahoma coach, on the coordinator change' },
    afterNote: "Part 2 of this series, on Florida's offense against Oklahoma's defense, had not been published when this edition's stories were collected on Friday, Nov. 6.", tune: { fs: '9.45pt', lh: '1.45', pfs: '10.4pt', plh: '1.42' } },
  { key: 'cfp', section: 'football', open: 'split-numeral', numeral: '24', numcap: 'Florida in the first College Football Playoff Top 25', pq: null },
  { key: 'soothsayer', section: 'football', open: 'photo-full', photo: 'soothsayer-baugh.jpg', pos: '50% 50%', credit: 'Archival photo by Chris Spears, GatorBait Media.', cap: 'Jadan Baugh dives into the end zone against Ole Miss in The Swamp on Sept. 26, 2026.', pq: null,
    enote: "This edition could not confirm a Florida starting quarterback. Its Week 10 depth chart lists Aaron Philo OR Tramell Jones Jr.; see the Game Guide, page {guide}.", tune: { fs: '9.6pt', lh: '1.46' } },
  { key: 'condon', section: 'hoops', open: 'portrait-full', dek: "Franz Beard on Alex Condon's near triple-double, Rueben Chinyelu's career-high 21 points and Florida's 88-57 win over Jacksonville.", photo: 'condon.jpg', pos: '50% 22%', credit: 'Photo by Chris Spears, GatorBaitMedia.com', cap: 'Alex Condon drives against Stetson in an October exhibition.', pq: { after: 13, text: "They're both very capable decisionmakers", who: 'Todd Golden, Florida coach' } },
  { key: 'mcmiller', section: 'hoops', open: 'split-numeral', numeral: '42', numcap: "Kiyomi McMiller's career-high against UCF", pq: null, tune: { fs: '10.5pt', lh: '1.56' } },
  { key: 'goose', section: 'columns', open: 'type-full', pq: 'story' },
  { key: 'yost', section: 'columns', open: 'type-full', pq: 'story', tune: { fs: '10.3pt', lh: '1.54' } },
];
// Archival art for the Ring of Honor tribute (official UF photographs; credits as supplied by UF).
const TRIBUTE = {
  main: { f: 'champ-2008-celebration.jpg', pos: '50% 46%', cap: "Florida's 2008 team celebrates its title victory over Oklahoma. The game was played Jan. 8, 2009.", credit: 'Jason Parkhurst/UAA Communications' },
  tebow: { f: 'tebow-2006-lsu.jpg', pos: '50% 50%', cap: "Tim Tebow celebrates during Florida's 2006 game against LSU, a season that ended in the first of Meyer's two national titles at Florida.", credit: 'Jay Metz/UAA Communications' },
};
const MEYER_FACTS = [
  ['2005–10', 'Seasons as Florida head coach'],
  ['65–15', 'His record at Florida'],
  ['2', 'National titles: the 2006 and 2008 seasons'],
  ['7th', "UF: will become the Ring of Honor's seventh member"],
];
let PAGES = {}; // story key -> physical page, filled by the first render pass
const WATCH = readJson('watch-links.json') || {};

const live = PLAN.filter((s) => { if (!byKey[s.key]) { console.warn('WARN: story missing from posts.json, skipped: ' + s.key); return false; } return true; });
const paraTexts = (p) => (p.html.match(/<p[^>]*>[\s\S]*?<\/p>/g) || []).map((x) => norm(plain(x)));
for (const s of live) {
  const p = byKey[s.key];
  const body = norm(plain(p.html));
  if (s.pq === 'story') { if (!p.pullquote) throw new Error('no story pullquote for ' + s.key); s.open_pq = { text: p.pullquote.text, who: p.pullquote.who === p.author ? p.author + ', column' : p.pullquote.who }; s.pq = null; }
  if (s.open_pq && !body.includes(norm(s.open_pq.text).replace(/,$/, ''))) throw new Error(`Opener quote is not verbatim in ${s.key}`);
  if (s.pq) {
    const needle = norm(s.pq.text).replace(/,$/, '');
    if (!body.includes(needle)) throw new Error(`Pull quote is not verbatim in ${s.key}: ${s.pq.text}`);
    const paras = paraTexts(p).filter((t) => t);
    const idx = paras.findIndex((t) => t.includes(needle)) + 1; // 1-based source paragraph
    if (Math.abs(idx - s.pq.after) < 3) throw new Error(`Pull quote sits within 2 paragraphs of its source in ${s.key}: source para ${idx}, placed after ${s.pq.after}`);
  }
}

// ---------------------------------------------------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------------------------------------------------
const LEN = (t) => (t.length <= 42 ? 'xl' : t.length <= 66 ? 'lg' : t.length <= 92 ? 'md' : 'sm');
// No-break joins that keep a number with its unit, a suffix with its name and a time with its meridiem (display text and story text).
const NBJ = (h) => h
  .replace(/\bNo\. (\d)/g, 'No.&nbsp;$1')
  .replace(/(\d) (a\.m\.|p\.m\.|noon)/g, '$1&nbsp;$2')
  .replace(/([A-Za-z]) (Jr\.|Sr\.|III\b|II\b|IV\b)/g, '$1&nbsp;$2');
const T = (s) => NBJ(esc(curl(String(s ?? ''))));                  // display text we set: smart quotes, no-break joins
const nbTitle = (s) => T(s).replace(/\b([A-Za-z]{2,}-[A-Za-z]{2,})\b/g, '<span class="nb">$1</span>');
const fills = (t) => t.replace(/\{guide\}/g, PAGES.guide || '3');
const guideLink = (h) => h.replace(/Game Guide, page (\d+)/, '<a class="vlink" href="#guide">Game Guide, page $1</a>');
// Text-node-only transform of an html fragment.
const mapText = (h, fn) => h.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, txt) => (tag ? tag : fn(txt)));
// Typographic quotes for story text (wording is never touched). Straight quotes become curly using the visible character before them,
// tracked across inline tags.
function smartQuotes(h) {
  let prev = '';
  return h.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, txt) => {
    if (tag) { if (/^<\/?(p|div|li|td|th|tr|h\d|section|aside|figure|figcaption|header|br|blockquote)\b/i.test(tag)) prev = ''; return tag; }
    let out = '';
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      const before = i ? txt[i - 1] : prev;
      const after = txt[i + 1] || '';
      if (c === '"') out += (!before || /[\s(\[{—–\-\/]/.test(before)) ? '“' : '”';
      else if (c === "'") {
        const rest = txt.slice(i + 1);
        const elision = /^(em|til|cause|tis|twas|round|bout)\b/i.test(rest) || /^\d\d?s\b/.test(rest);
        out += ((!before || /[\s(\[{—–\-\/“]/.test(before)) && /[A-Za-z]/.test(after) && !elision) ? '‘' : '’';
      } else out += c;
    }
    if (txt.length) prev = txt[txt.length - 1];
    return out;
  });
}
const nbw = (w) => `<span class="nb">${w}</span>`;
const protect = (h) => NBJ(smartQuotes(mapText(h, (t) => t
  .replace(/\(\d{1,2}-\d{1,2}(?:, [^()]{1,18})?\)/g, nbw)                                                          // (6-2, 4-2 SEC) never splits
  .replace(/\b\d{1,2}(?::\d{2})? (?:p\.m\.|a\.m\.|noon),? [A-Z][A-Za-z+]*(?: [A-Z][A-Za-z+]*)?:/g, nbw)           // 3:30 p.m., ABC: stays whole
  .replace(/\b\d{1,2}-of-\d{1,2}\b/g, nbw)
  .replace(/\bfree-throws?\b/gi, nbw)
  .replace(/(?<![\w.\-])\d{1,3}(?:-\d{1,3}){1,2}(?![\w\-])/g, nbw))));                                             // 55-1-1, 42-25
const dekFor = (p, s) => {
  if (s.dek) return s.dek;
  const first = paraTexts(p).find((t) => t) || '';
  if (norm(first).startsWith(norm(p.excerpt))) return '';              // a deck that only repeats the lede is dropped
  return (s.dekRepl || []).reduce((d, [a, b]) => d.replace(a, b), p.excerpt);
};

// Body: story html with drop cap, subheads restyled by CSS, key-numbers panel, one inset pull quote.
function bodyHtml(p, s) {
  let n = 0, out = '', keynums = null;
  const parts = p.html.match(/<(p|h3|h4|blockquote|ul|ol)[^>]*>[\s\S]*?<\/\1>/g) || [];
  if (parts.join('').length < p.html.replace(/\s/g, '').length * 0.98) throw new Error('Unparsed html in ' + p.key);
  const flush = () => { if (keynums) { out += `<div class="keynums">${keynums.join('')}</div>`; keynums = null; } };
  for (const part0 of parts) {
    let part = protect(part0);
    if (/^<h3/.test(part)) {
      flush();
      part = part.replace(/^<h3/, '<p class="sub"').replace(/<\/h3>$/, '</p>');
      if (/key numbers/i.test(plain(part))) keynums = [];
      out += part;
    } else if (/^<h4/.test(part)) {
      flush(); out += part.replace(/^<h4/, '<p class="sub2"').replace(/<\/h4>$/, '</p>');
    } else if (keynums && /^<p/.test(part)) {
      keynums.push(part.replace(/^<p([^>]*)>\s*([A-Z][A-Za-z ]{2,24}:)/, '<p$1><b>$2</b>'));
    } else {
      flush();
      n += 1;
      if (/^<p/.test(part)) {
        const short = n === 1 && plain(part).length < 90;
        part = part.replace(/^<p/, n === 1 ? (short ? '<p class="lede short"' : '<p class="lede"') : '<p');
        if (s.key === 'soothsayer') part = mapText(part, (t) => t.replace(/The Sayer Says Sooth!:/gi, '<span class="sayer">$&</span>'));
        if (/:\s*<\/p>\s*$/.test(part) || /:<\/p>$/.test(part)) part = part.replace(/^<p/, '<p class="lead-in"');
        if (s.inlineLink && part.includes(s.inlineLink.text)) part = part.replace(s.inlineLink.text, `<a class="vlink" href="${s.inlineLink.url}">${s.inlineLink.text}</a>`);
      }
      out += part;
      if (s.pq && n === (PHONE && s.pq.pafter ? s.pq.pafter : s.pq.after)) out += pullInset(s.pq);
    }
  }
  flush();
  return out;
}
const tuneStyle = (s) => { const t = s.tune; if (!t) return ''; const fs = PHONE ? t.pfs : t.fs, lh = PHONE ? t.plh : t.lh; return fs ? ` style="font-size:${fs};line-height:${lh || '1.48'}"` : ''; };
const endMark = (h) => {
  const i = h.lastIndexOf('</p>');
  if (i < 0) return h + '<p class="end">GATORBAIT</p>';
  let head = h.slice(0, i);
  const m = head.match(/([^\s<>]+(?:\s|&nbsp;)[^\s<>]+)((?:<\/[a-z]+>)*)\s*$/i);
  if (m) head = head.slice(0, m.index) + '<span class="nb">' + m[1] + '</span>' + m[2];
  return head + ' <span class="endmark">GATORBAIT</span>' + h.slice(i);
};
const pullInset = (pq) => `<aside class="pull"><p>${esc(curl('"' + (pq.ellip ? '… ' : '') + pq.text.replace(/,$/, '') + '"'))}</p><b>${T(pq.who)}</b></aside>`;
const watchBox = (key) => {
  const L = WATCH[key];
  if (!L || !L.length) return '';
  const short = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const row = (x) => (x.url ? (PHONE ? `<a href="${x.url}">${T(x.label)}</a>` : `<a href="${x.url}"><span>${T(x.label)}</span><i class="wu">${esc(short(x.url))}</i></a>`) : `<p class="wnote">${T(x.label)}</p>`);
  return `<aside class="watch"><p class="wk">Watch and read</p>${L.map(row).join('')}</aside>`;
};
const folio = (s) => (PAGES[s.key] ? `<span class="ofolio">${PAGES[s.key]}</span>` : '');

function storyHeading(p, s) {
  const dek = dekFor(p, s);
  return `<p class="kick">${T(p.rubric)}</p>
<h1 class="title ${LEN(p.title)}" id="${p.key}">${nbTitle(p.title)}</h1>
${dek ? `<p class="dek">${T(dek)}</p>` : ''}
<p class="by">${T(p.byline)}</p>${s.enote ? `<p class="enote"><b>Editor's note.</b> ${guideLink(T(fills(s.enote)))}</p>` : ''}`;
}
const lightHead = (p, s, extra = '') => {
  const dek = dekFor(p, s);
  return `<p class="kick lt">${T(p.rubric)}</p><h1 class="title lt ${LEN(p.title)}" id="${p.key}">${nbTitle(p.title)}</h1>${dek ? `<p class="dek lt">${T(dek)}</p>` : ''}<p class="by lt">${T(p.byline)}</p>${s.enote ? `<p class="enote lt"><b>Editor's note.</b> ${guideLink(T(fills(s.enote)))}</p>` : ''}${extra}`;
};

function openTribute(p, s) {
  const Tb = TRIBUTE;
  return `<section class="full tribute" id="open-${p.key}" style="page:full">
<figure class="tphoto"><img src="${A(Tb.main.f)}" alt="${esc(Tb.main.cap)}" style="object-position:${Tb.main.pos}"></figure>
<div class="tpanel">
 <p class="tk">Urban Meyer</p>
 <p class="tbig">Ring of <em>Honor</em></p>
 <div class="tfacts">${MEYER_FACTS.map(([a, b]) => `<div><b>${T(a)}</b><span>${T(b)}</span></div>`).join('')}</div>
 <p class="tnote">Meyer's induction into the Florida Football Ring of Honor is scheduled for the end of the first quarter Saturday night. Source: FloridaGators.com.<br>Photo: ${T(Tb.main.cap)} <i>${T(Tb.main.credit)}</i></p>
 <div class="tstory">${lightHead(p, s)}</div>
</div>${folio(s)}</section>`;
}
function openPhotoFull(p, s) {
  return `<section class="full photofull" id="open-${p.key}" style="page:full">
<figure class="pf"><img src="${A(s.photo)}" alt="${esc(s.cap)}" style="object-position:${s.pos}"><figcaption>${T(s.cap)} <i>${T(s.credit)}</i></figcaption></figure>
<div class="pfp">${storyHeading(p, s)}</div>${folio(s)}</section>`;
}
function openPortraitFull(p, s) {
  return `<section class="full portrait" id="open-${p.key}" style="page:full">
<img class="bg" src="${A(s.photo)}" alt="${esc(s.cap)}" style="object-position:${s.pos}">
<div class="shade"></div>
<div class="ptext">${lightHead(p, s, `<p class="pcredit">${T(s.cap)} <i>${T(s.credit)}</i></p>`)}</div>${folio(s)}</section>`;
}
function openTypeFull(p, s) {
  return `<section class="full typefull" id="open-${p.key}" style="page:full">
<div class="tfin"><div class="thead"><p class="kick lt">${T(p.rubric)}</p>
<h1 class="title lt ${LEN(p.title)} big" id="${p.key}">${nbTitle(p.title)}</h1>
<p class="by lt">${T(p.byline)}</p></div>
<div class="tbase"><p class="bigq">${esc(curl('"' + s.open_pq.text.replace(/,$/, '') + '"'))}</p><p class="bigwho">${T(s.open_pq.who)}</p>${dekFor(p, s) ? `<p class="dek lt">${T(dekFor(p, s))}</p>` : ''}</div></div>${folio(s)}</section>`;
}
function openSplit(p, s) {
  const art = s.open === 'split-photo'
    ? `<figure class="sphoto"><img src="${A(s.photo)}" alt="${esc(s.cap)}" style="object-position:${s.pos}"><figcaption>${T(s.cap)} <i>${T(s.credit)}</i></figcaption></figure>`
    : `<div class="snum"><b>${esc(s.numeral)}</b><span>${T(s.numcap)}</span></div>`;
  return `<header class="splithead">${storyHeading(p, s)}</header>${art}`;
}

function story(p, s) {
  const open = { tribute: openTribute, 'photo-full': openPhotoFull, 'portrait-full': openPortraitFull, 'type-full': openTypeFull }[s.open];
  const sec = SECTIONS[s.section];
  const split = s.open.startsWith('split');
  const fridaysFigs = p.key === 'fridays' ? tributeBodyFigures(p) : '';
  const pg = sec.page;
  return `${split ? '' : open(p, s)}
<section class="story ${split ? 'splitstory' : ''}" style="page:${pg}" data-key="${p.key}">
${split ? openSplit(p, s) : ''}
${fridaysFigs}
<div class="body"${tuneStyle(s)}>${endMark(bodyHtml(p, s))}</div>
${s.afterNote ? `<p class="enote after"><b>Editor's note.</b> ${T(s.afterNote)}</p>` : ''}
${s.watch ? watchBox(s.watch) : ''}
${p.key === 'fridays' ? tributeCloser() : ''}
</section>`;
}
function tributeCloser() {
  const Tb = TRIBUTE.tebow;
  return `<figure class="wide closer"><img src="${A(Tb.f)}" alt="${esc(Tb.cap)}" style="object-position:${Tb.pos}"><figcaption>${T(Tb.cap)} <i>${T(Tb.credit)}</i></figcaption></figure>`;
}
function tributeBodyFigures(p) {
  return `<figure class="wide still"><img src="${A('fridays-still.jpg')}" alt="Buddy Martin, left, interviews Urban Meyer in the taped conversation featured on Best Fridays."><figcaption>Buddy Martin, left, interviews Urban Meyer in the taped conversation featured on Best Fridays. <i>Video still: The Buddy Martin Show / Gator Bait Media.</i></figcaption></figure>`;
}

// ---------------------------------------------------------------------------------------------------------------------
// Front of book
// ---------------------------------------------------------------------------------------------------------------------
const coverLink = () => { const k = (PHONE ? 5 : 8.5) / 1103, f = (v) => (v * k).toFixed(3) + 'in'; return `<a class="curl" href="https://www.gatorbaitmedia.com/" style="left:${f(78)};top:${f(1350)};width:${f(270)};height:${f(44)}" aria-label="gatorbaitmedia.com"></a>`; };
const coverHtml = () => PHONE
  ? `<section class="cover" style="page:full"><h1 class="sr">GatorBait Magazine, Oklahoma week cover</h1><img src="${A('cover-v2.png')}" alt="GatorBait Magazine cover, Nov. 6, 2026, Oklahoma week: Urban Meyer, Ring of Honor.">${coverLink()}<div class="below"><p class="ed">Oklahoma week edition · Friday, Nov. 6, 2026</p><p class="six">Nine complete stories</p><p class="tag">Plus both rosters and Oklahoma's depth chart.</p></div></section>`
  : `<section class="cover" style="page:full"><h1 class="sr">GatorBait Magazine, Oklahoma week cover</h1><img src="${A('cover-v2.png')}" alt="GatorBait Magazine cover, Nov. 6, 2026, Oklahoma week: Urban Meyer, Ring of Honor.">${coverLink()}</section>`;

function contents(pages) {
  const pn = (id) => (pages && pages[id] ? pages[id] : '');
  const row = (id, kicker, title, dek, mins) => `<li><a href="#${id}"><span class="pgn">${pn(id)}</span><span class="ct"><span class="ck">${T(kicker)}</span><b>${T(title)}</b></span></a></li>`;
  let last = '', out = '';
  const group = (name) => { if (name !== last) { out += `<li class="grp"><span>${esc(name)}</span></li>`; last = name; } };
  group('The game');
  out += row('guide', 'Game guide', 'Oklahoma at Florida', 'Kickoff, TV, records, series history and the Ring of Honor ceremony.');
  for (const s of live) {
    const p = byKey[s.key];
    group(SECTIONS[s.section].name);
    out += row(p.key, `${p.rubric}  ·  ${p.author}${s.toc ? '  ·  ' + s.toc : ''}`, p.title, p.excerpt);
  }
  group('Reference');
  out += row('teams', 'Official rosters', "The Teams: both rosters and Oklahoma's depth chart", '');
  out += row('credits', 'Credits and sources', 'Behind the pages', '');
  return `<section class="contents" style="page:p-front"><p class="mast">GATORBAIT<span>.</span></p><p class="mag">MAGAZINE  ·  OKLAHOMA WEEK  ·  THE PREGAME EDITION</p><p class="mdate">Friday, Nov. 6, 2026  ·  Week 10: Oklahoma at Florida, Saturday, Nov. 7, 7:45 p.m. ET, SEC Network</p><h1 class="sr">Contents</h1><ol class="toc">${out}</ol></section>`;
}

function guide() {
  const SRC = [
    ['UF game center', 'https://floridagators.com/game-center/27911'],
    ['OU game primer', 'https://soonersports.com/news/2026/11/5/football-game-primer-ou-at-florida'],
    ['UF broadcast guide', 'https://floridagators.com/news/2026/11/3/football-broadcast-information-florida-vs-oklahoma'],
    ['UF Meyer feature', 'https://floridagators.com/news/2026/11/5/football-urban-meyers-florida-legacy-gets-permanent-place-in-the-swamp-florida-gators-ring-of-honor'],
    ['SEC availability report archive', 'https://www.secsports.com/fbreports-archive'],
  ];
  const gsrc = PHONE
    ? `<div class="gsrc stack"><p class="gk">Sources</p>${SRC.map(([t, u]) => `<a href="${u}">${t}</a>`).join('')}<p class="gasof">Information as of Friday, Nov. 6, 2026.</p></div>`
    : `<p class="gsrc">Sources: ${SRC.map(([t, u]) => `<a href="${u}">${t}</a>`).join(' · ')}. Information as of Friday, Nov. 6, 2026.</p>`;
  return `<section class="guide" style="page:p-game" id="guide">
<p class="kick">The game guide  ·  Saturday, Nov. 7, 2026</p>
<h1 class="gtitle"><span>Oklahoma</span><em>at</em><span>Florida</span></h1>
<p class="gplace">Ben Hill Griffin Stadium  ·  Gainesville, Florida</p>
<div class="gband"><div><b>7:45</b><span>p.m. ET</span></div><div><b>SEC</b><span>Network</span></div><div><b>5–3</b><span>Florida · 3–3 SEC</span></div><div><b>4–4</b><span>Oklahoma · 2–3 SEC</span></div></div>
<div class="gcols">
 <div><p class="gh">Florida's ranking</p><p><b>No. 24</b> in the College Football Playoff rankings</p><p><b>No. 25</b> in the AP poll</p><p>Receiving votes in the Coaches poll</p></div>
 <div><p class="gh">On the air</p><p><b>TV:</b> SEC Network with Matt Schumacker, Aaron Murray and Taylor Davis</p><p><b>Radio:</b> Gator Sports Network with Sean Kelley, Shane Matthews and Tate Casey. Radio pregame starts at 4:30 p.m. ET.</p></div>
 <div><p class="gh">The series</p><p>Tied 1–1. Florida won the Jan. 8, 2009 national championship game, 24–14. Oklahoma won the Dec. 30, 2020 Cotton Bowl, 55–20.</p><p>The first meeting on either campus and the first as SEC opponents.</p></div>
</div>
<div class="gboxes">
 <aside class="gbox honor"><p class="gk">Ring of Honor</p><p>Urban Meyer will be inducted into the Florida Football Ring of Honor at the <b>end of the first quarter</b>. He coached Florida from 2005 to 2010, went 65–15 and won national championships for the 2006 and 2008 seasons. UF says he will become the Ring of Honor's seventh member.</p></aside>
 <aside class="gbox qb"><p class="gk">Quarterback watch</p><p>Florida's published Week 10 depth chart lists <b>Aaron Philo OR Tramell Jones Jr.</b> at quarterback. That is not a confirmed starter announcement. Depth charts do not establish game-day availability. For who plays, check the SEC's official availability reports and school updates; this edition did not retrieve a final game-day report.</p></aside>
</div>
<figure class="gpano"><img src="${A('swamp-panorama.jpg')}" alt="Ben Hill Griffin Stadium, The Swamp, in a wide interior panorama."><figcaption>Ben Hill Griffin Stadium. <i>Archival photo by Chris Spears, GatorBait Media.</i></figcaption></figure>
${gsrc}
</section>`;
}

// ---------------------------------------------------------------------------------------------------------------------
// Teams (official text layers rebuilt as tables; Florida's blurry official depth chart is linked, not reproduced)
// ---------------------------------------------------------------------------------------------------------------------
// Display tidy for typos the official UF notes carry (documented in data/ROSTER-VERIFY.md): "5th." class years, a dangling "/" after a hometown,
// and the Solwold row whose hometown cell holds his high school.
const tidyRow = (r) => {
  const x = { ...r };
  if (x.cl === '5th.') x.cl = '5th';
  x.hometown = String(x.hometown || '').replace(/\s*\/\s*$/, '');
  if (x.name === 'Solwold, Hunter' && x.hometown === 'Fallston, Md. / Fallston') { x.hometown = 'Fallston, Md.'; x.school = 'Fallston / ' + x.school; }
  return x;
};
function rosterTable(rows0, withSchool = true) {
  const rows = rows0.map(tidyRow);
  const tr = (r) => `<tr><td class="n">${esc(r.num)}</td><td class="nm">${esc(r.name)}</td><td>${esc(r.pos)}</td><td class="ht">${esc(r.ht)}</td><td class="ht">${esc(r.wt)}</td><td class="cl">${esc(r.cl)}</td><td class="hm">${esc(r.hometown)}</td>${withSchool ? `<td class="sc">${esc(r.school || '')}</td>` : ''}</tr>`;
  return `<table class="roster"><thead><tr><th>#</th><th>Name</th><th>Pos</th><th>Ht</th><th>Wt</th><th>Cl</th><th>Hometown</th>${withSchool ? `<th>${PHONE ? 'High school / prev.' : 'High school / previous school'}</th>` : ''}</tr></thead><tbody>${rows.map(tr).join('')}</tbody></table>`;
}
function depthTable(D) {
  if (!D) return '';
  const grp = (g, tag) => `<div class="dpos"><p class="dh4"><span class="dsec">${tag}</span> ${esc(g.pos)}</p>${g.entries.map((e, i) => `<p><span class="dn">${esc(e.num)}</span> ${esc(e.name)} <span class="dm">${esc([e.ht, e.wt, e.cl].filter(Boolean).join(', '))}</span>${e.or ? ' <span class="or">OR</span>' : ''}</p>`).join('')}</div>`;
  const sect = (name, tag, arr) => (arr && arr.length ? `<p class="dh">${name}</p><div class="dgrid">${arr.map((g) => grp(g, tag)).join('')}</div>` : '');
  return sect('Offense', 'OFF', D.offense) + sect('Defense', 'DEF', D.defense) + sect('Specialists', 'ST', D.specialists);
}
function teams() {
  if (!UF || !OU) { console.warn('WARN: roster data missing; The Teams section skipped'); return ''; }
  const hasSchool = (rows) => rows.some((r) => r.school);
  const qb = `<div class="qbbox"><p class="gk">Florida at quarterback</p><p class="qbname">Aaron Philo <em>OR</em> Tramell Jones Jr.</p><p>Florida listed the two quarterbacks together on its Week 10 depth chart. UF's Nov. 2 report says the competition remained open and the team was preparing both to play. This is not a confirmed game-day starter announcement.</p><p class="qbsrc">Florida's official Week 10 depth chart is page 42 of its game notes, an image too blurry to print cleanly here, so it is linked rather than reproduced; no other position has been transcribed from it. The quarterback listing is also reported in UF's Nov. 2 update.</p><p class="qlinks"><a href="https://floridagators.com/documents/download/2026/11/2/WEEK_10_NOTES_-_MASTER_-_OKLAHOMA.pdf#page=42">Open Florida's official Week 10 depth chart</a><a href="https://floridagators.com/news/2026/11/2/football-gators-look-to-reignite-offense-amid-qb-battle-browns-injury">Read UF's quarterback update</a><a href="https://www.secsports.com/fbreports-archive">SEC football availability report archive</a></p><p class="qbsrc">Source check: Nov. 6, 2026. Weekly lineup information is subject to change.</p></div>`;
  const uf = `<section class="teampage" style="page:p-teams"><p class="kick" id="teams">Official rosters</p><h1 class="ttitle">Florida Gators <small>2026 roster</small></h1><p class="tsrc">Official weekly roster from Florida's Week 10 game notes (floridagators.com), as published the week of Nov. 2, 2026. Subject to change. A roster listing does not establish that a player is healthy, dressed or available Saturday. The official notes' pronunciation guide and coaching staff list are not reproduced here.</p>${qb}${rosterTable(UF.rows, hasSchool(UF.rows))}</section>`;
  const ouDepth = OUD ? `<section class="teampage" style="page:p-teams"><p class="kick">Official depth chart</p><h1 class="ttitle">Oklahoma Sooners depth chart <small>Game 9 · SEC Week 10</small></h1><p class="tsrc">Official depth chart from Oklahoma's game notes (soonersports.com), as published the week of Nov. 2, 2026. OR listings are shown as the school printed them; class years are as printed on the chart and can differ from OU's roster page. Subject to change; not an availability report.</p>${depthTable(OUD)}</section>` : '';
  const ou = `<section class="teampage" style="page:p-teams"><p class="kick">Official roster</p><h1 class="ttitle">Oklahoma Sooners <small>2026 roster</small></h1><p class="tsrc">Official roster from Oklahoma's game notes (soonersports.com), as published the week of Nov. 2, 2026. Subject to change. * Indicates number of letters earned at OU. ^ Has earned an undergraduate degree. Last updated Nov. 2, 2026; weights as of Aug. 4, 2026. The official notes' pronunciation guide and coaching staff list are not reproduced here.</p>${rosterTable(OU.rows, hasSchool(OU.rows))}</section>`;
  return uf + ouDepth + ou;
}

function credits() {
  const rows = [
    ['Cover', 'A digital composite (AI-assisted) built from official Florida Gators/UAA photographs: Urban Meyer (2006 vs. South Carolina), Florida Gators/UAA; Tim Tebow (2006 vs. LSU), Jay Metz/UAA Communications; the 2008-season championship celebration, Jason Parkhurst/UAA Communications. Digital resolution, not a print master.'],
    ['Game guide', 'Ben Hill Griffin Stadium panorama: archival photo by Chris Spears, GatorBait Media.'],
    ['Ring of Honor opener', "Florida's 2008 team celebrates its title victory over Oklahoma (game played Jan. 8, 2009): Jason Parkhurst/UAA Communications."],
    ['Best Fridays', 'Tim Tebow, 2006 game against LSU: Jay Metz/UAA Communications. Video still of Buddy Martin and Urban Meyer: The Buddy Martin Show / Gator Bait Media.'],
    ['Tramell Jones Gets the Call', 'Photo by Chris Spears, GatorBait Media.'],
    ['Scouting Oklahoma, Part 1', 'Photo by Chris Spears, GatorBait Media.'],
    ['The Soothsayer', 'Archival photo by Chris Spears, GatorBait Media.'],
    ['Condon story', 'Photo by Chris Spears, GatorBaitMedia.com, from an October exhibition against Stetson (not from the Jacksonville game).'],
    ['Official rosters and depth charts', 'University Athletic Association (floridagators.com) and the University of Oklahoma (soonersports.com), Week 10 game notes.'],
    ['Desk corrections carried', `Three small fact corrections, each checked against a published source: Condon's shooting line reads 3-6 (ESPN box score; the story first printed 2-3); McMiller's hometown reads Silver Spring, Maryland (ESPN roster; the story first printed Springs); and Buddy Martin's Golden Goose column (page ${PAGES.goose || ''}) says Urban Meyer enters the Ring of Honor at the end of the first quarter, as Florida announced (FloridaGators.com, Nov. 5); the column first said halftime.`],
  ];
  return `<section class="credits" style="page:p-front" id="credits"><p class="kick">Credits and sources</p><h1 class="ttitle">Behind the pages</h1>${rows.map(([a, b]) => `<p><b>${T(a)}.</b> ${T(b)}</p>`).join('')}
<p>Complete stories from GatorBait Media as published through Friday, Nov. 6, 2026. Web navigation, sponsor banners and most video links are left out; the Best Fridays and Thursday panel stories keep their own watch links. Rankings, scores and times are as reported on each story's publication date. Depth charts and rosters do not establish game-day availability.</p>
<p class="tag">Real Gator news for real Gators.  <a href="https://www.gatorbaitmedia.com/">GatorBaitMedia.com</a></p></section>`;
}
const backCover = () => `<section class="back" style="page:full"><p class="bw">GATORBAIT<span>.</span></p><p class="bt">REAL GATOR NEWS FOR REAL GATORS</p><p class="bu"><a href="https://www.gatorbaitmedia.com/">gatorbaitmedia.com</a></p></section>`;

// ---------------------------------------------------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------------------------------------------------
const css = (PHONE) => `
:root{--navy:#10264b;--ink:#0b1a36;--blue:#0021a5;--orange:#fa4616;--rust:#b93a0e;--cream:#f8f3e8;--paper:#fcfaf4;--rule:#d9cfbc;--muted:#5d6577;--cond:"Barlow Condensed","Barlow",Arial,sans-serif;--sans:"Barlow",Arial,sans-serif}
*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:${PHONE ? '480px 854px' : '8.5in 11in'};margin:${PHONE ? '.42in .34in .55in' : '.75in .68in .85in'};background:var(--cream);
 @bottom-left{content:"GATORBAIT MAGAZINE  \\00B7  PREGAME EDITION  \\00B7  NOV. 6, 2026";font:700 ${PHONE ? '6.4pt' : '6.6pt'} var(--cond);letter-spacing:.16em;color:var(--muted);vertical-align:top;padding-top:${PHONE ? '.13in' : '.2in'}}
 @bottom-right{content:counter(page);font:800 ${PHONE ? '9pt' : '11pt'} var(--cond);color:var(--orange);vertical-align:top;padding-top:${PHONE ? '.1in' : '.15in'}}}
@page full{margin:0;background:var(--navy);@bottom-left{content:none}@bottom-right{content:none}}
${[['p-front', 'GATORBAIT'], ['p-game', 'THE GAME'], ['p-honor', 'RING OF HONOR'], ['p-football', 'FOOTBALL'], ['p-hoops', 'BASKETBALL'], ['p-columns', 'COLUMNS'], ['p-teams', 'THE TEAMS']].map(([n, t]) => `@page ${n}{@top-left{content:"${t}";font:800 ${PHONE ? '7.2pt' : '7.6pt'} var(--cond);letter-spacing:.24em;color:var(--rust);vertical-align:bottom;padding-bottom:.1in}@top-right{content:"OKLAHOMA WEEK";font:700 ${PHONE ? '6.4pt' : '6.6pt'} var(--cond);letter-spacing:.2em;color:var(--muted);vertical-align:bottom;padding-bottom:.1in}}`).join('\n')}
body{margin:0;font:400 ${PHONE ? '10.8pt/1.46' : '9.7pt/1.5'} var(--sans);color:var(--navy);background:var(--cream)}
a{color:inherit;text-decoration:none}
.sr{position:absolute;left:0;top:0;color:transparent;font-size:2px;line-height:2px;white-space:nowrap;pointer-events:none}
.kick{margin:0 0 5pt;font:800 ${PHONE ? '8pt' : '9pt'} var(--cond);letter-spacing:.2em;text-transform:uppercase;color:var(--rust);white-space:pre-wrap}
.kick.lt{color:#ff8a5c}
.title{font:800 ${PHONE ? '28pt' : '40pt'}/.98 var(--cond);letter-spacing:-.005em;text-transform:uppercase;margin:0 0 8pt;color:var(--navy);text-wrap:balance}
.title.xl{font-size:${PHONE ? '34pt' : '58pt'}}.title.lg{font-size:${PHONE ? '30pt' : '46pt'}}.title.md{font-size:${PHONE ? '26pt' : '38pt'}}.title.sm{font-size:${PHONE ? '22pt' : '31pt'}}
.title.lt{color:#fff}
.dek{font:500 ${PHONE ? '11pt/1.32' : '13.2pt/1.34'} var(--sans);color:#33405e;margin:0 0 7pt;max-width:${PHONE ? '100%' : '6.2in'};text-wrap:pretty}
.dek.lt{color:#e3e9f5}
.by{font:700 ${PHONE ? '8.6pt' : '9.4pt'} var(--cond);letter-spacing:.16em;text-transform:uppercase;color:var(--rust);margin:0 0 ${PHONE ? '10pt' : '14pt'}}
.by.lt{color:#ff8a5c}

/* cover + back */
.cover{width:${PHONE ? '480px' : '8.5in'};height:${PHONE ? '854px' : '11in'};background:var(--navy);break-after:page;position:relative;overflow:hidden}
.cover .curl{position:absolute;display:block;z-index:3}
.cover img{display:block;width:${PHONE ? '5in' : '8.5in'};height:${PHONE ? '6.466in' : '11in'}}
.cover .below{position:absolute;left:0;right:0;top:6.466in;bottom:0;padding:.24in .34in 0;color:#fff;border-top:3pt solid var(--orange);background:var(--navy)}
.cover .below .ed{font:800 11pt var(--cond);letter-spacing:.16em;text-transform:uppercase;color:#ff8a5c;margin:0 0 6pt}
.cover .below .six{font:800 26pt/1 var(--cond);text-transform:uppercase;margin:0 0 8pt}
.cover .below .tag{font:600 10.5pt var(--sans);color:#c8d1e7;margin:0}
.back{width:${PHONE ? '480px' : '8.5in'};height:${PHONE ? '854px' : '11in'};background:var(--navy);color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;break-before:page}
.back .bw{font:800 ${PHONE ? '40pt' : '72pt'}/1 var(--cond);letter-spacing:.02em;font-style:italic;margin:0}.back .bw span{color:var(--orange)}
.back .bt{font:700 ${PHONE ? '9pt' : '12pt'} var(--cond);letter-spacing:.42em;color:#ff8a5c;margin:12pt 0 22pt}
.back .bu{font:600 ${PHONE ? '11pt' : '14pt'} var(--sans);color:#c8d1e7;margin:0}.back a{color:#c8d1e7;text-decoration:underline;text-decoration-thickness:.5pt}

/* contents */
.contents{break-after:page;position:relative}
.mast{font:800 ${PHONE ? '32pt' : '54pt'}/.86 var(--cond);font-style:italic;letter-spacing:.01em;margin:0;color:var(--navy)}.mast span{color:var(--orange)}
.mag{font:800 ${PHONE ? '8pt' : '11pt'} var(--cond);letter-spacing:.34em;color:var(--rust);margin:6pt 0 3pt}
.mdate{font:500 ${PHONE ? '8.4pt' : '9.6pt'} var(--sans);color:var(--muted);margin:0 0 ${PHONE ? '4pt' : '4pt'};padding-bottom:${PHONE ? '6pt' : '7pt'};border-bottom:3pt solid var(--orange)}
.toc{list-style:none;margin:0;padding:0}
.toc li{break-inside:avoid;border-bottom:.5pt solid var(--rule)}
.toc li.grp{border:0;padding:${PHONE ? '3.5pt 0 0' : '7pt 0 1pt'}}.toc li.grp span{font:800 ${PHONE ? '7.5pt' : '8.6pt'} var(--cond);letter-spacing:.3em;text-transform:uppercase;color:var(--orange)}
.toc a{display:flex;gap:${PHONE ? '9pt' : '16pt'};align-items:center;padding:${PHONE ? '2pt 0' : '3.1pt 0'}}
.pgn{font:800 ${PHONE ? '15pt' : '26pt'}/1 var(--cond);color:var(--blue);min-width:${PHONE ? '20pt' : '40pt'};text-align:right;font-variant-numeric:tabular-nums}
.ct{display:block}.ck{display:block;font:800 ${PHONE ? '6.6pt' : '7.4pt'} var(--cond);letter-spacing:.18em;text-transform:uppercase;color:var(--rust)}
.ct b{display:block;font:800 ${PHONE ? '10.6pt' : '15pt'}/1.04 var(--cond);color:var(--navy);margin:1pt 0 0}
.cd{display:block;font-size:${PHONE ? '7.3pt' : '8.2pt'};line-height:1.3;color:var(--muted);${PHONE ? 'display:none;' : ''}}

/* guide */
.guide{break-after:page}
.gtitle{margin:0;font:800 ${PHONE ? '33pt' : '60pt'}/.9 var(--cond);text-transform:uppercase;color:var(--navy);display:flex;align-items:baseline;gap:${PHONE ? '6pt' : '12pt'};flex-wrap:wrap}
.gtitle em{font:italic 700 ${PHONE ? '16pt' : '26pt'} var(--cond);color:var(--orange);text-transform:lowercase}
.gplace{font:700 ${PHONE ? '8.4pt' : '10pt'} var(--cond);letter-spacing:.26em;text-transform:uppercase;color:var(--muted);margin:${PHONE ? '5pt 0 10pt' : '8pt 0 14pt'}}
.gband{display:grid;grid-template-columns:repeat(4,1fr);background:var(--navy);color:#fff;border-top:4pt solid var(--orange);margin:0 0 ${PHONE ? '10pt' : '16pt'}}
.gband span{white-space:nowrap}.gband div{padding:${PHONE ? '7pt 6pt' : '9pt 12pt'};border-right:.5pt solid #2d4676}.gband div:last-child{border:0}
.gband b{display:block;font:800 ${PHONE ? '17pt' : '30pt'}/1 var(--cond)}.gband span{display:block;font:700 ${PHONE ? '5.9pt' : '8.2pt'} var(--cond);letter-spacing:.16em;text-transform:uppercase;color:#ff8a5c;margin-top:2pt}
.gcols{display:grid;grid-template-columns:${PHONE ? '1fr' : 'repeat(3,1fr)'};gap:${PHONE ? '6pt' : '18pt'};margin-bottom:${PHONE ? '8pt' : '14pt'}}
.gcols .gh,.gk{font:800 ${PHONE ? '8pt' : '9.4pt'} var(--cond);letter-spacing:.22em;text-transform:uppercase;color:var(--rust);margin:0 0 4pt;border-top:1.4pt solid var(--orange);padding-top:4pt}
.gcols p{margin:0 0 4pt;font-size:${PHONE ? '9.6pt' : '9.4pt'};line-height:1.4}.gcols .small{font-size:7.6pt;color:var(--muted)}
.gboxes{${PHONE ? 'display:block' : 'display:grid;grid-template-columns:1fr 1fr;gap:14pt'}}${PHONE ? '.gboxes .gbox{margin-bottom:8pt}' : ''}
.gboxes .qb{${PHONE ? 'break-before:page;margin-top:0' : ''}}
.gbox{background:var(--paper);border:.6pt solid var(--rule);border-left:5pt solid var(--orange);padding:${PHONE ? '7pt 9pt' : '10pt 13pt'}}
.gbox .gk{border:0;padding:0;color:var(--rust)}.gbox p{margin:0 0 3pt;font-size:${PHONE ? '9.6pt' : '9.4pt'};line-height:1.42}
.gsrc{margin:${PHONE ? '8pt 0 0' : '14pt 0 0'};font-size:${PHONE ? '7pt' : '7.8pt'};line-height:1.4;color:var(--muted)}.gsrc a{color:var(--blue);text-decoration:underline;text-decoration-thickness:.4pt}
.gsrc.stack .gk{margin-bottom:2pt}.gsrc.stack a{display:block;padding:4.2pt 0;border-bottom:.5pt solid var(--rule);font:600 9.2pt/1.25 var(--sans)}.gasof{margin:4pt 0 0;font-size:8pt;color:var(--muted)}

.gpano{margin:${PHONE ? '10pt 0 0' : '14pt 0 0'}}.gpano img{display:block;width:100%;height:${PHONE ? '1.7in' : '1.9in'};object-fit:cover;object-position:50% 55%}.gpano figcaption{font:500 ${PHONE ? '6.4pt' : '7.4pt'}/1.3 var(--sans);color:var(--muted);margin-top:3pt}.gpano i{font-style:normal;font-weight:700;color:var(--rust)}
/* full-bleed openers */
.full{width:${PHONE ? '480px' : '8.5in'};height:${PHONE ? '854px' : '11in'};position:relative;overflow:hidden;break-before:page;break-after:page;background:var(--navy);color:#fff}
.ofolio{position:absolute;right:${PHONE ? '.34in' : '.68in'};bottom:${PHONE ? '.2in' : '.32in'};font:800 ${PHONE ? '9pt' : '11pt'} var(--cond);color:var(--orange);z-index:5}
.tribute .tphoto{margin:0;position:absolute;left:0;right:0;top:0;height:${PHONE ? '4.1in' : '6.1in'}}
.tribute .tphoto img{width:100%;height:100%;object-fit:cover;display:block}
.tribute .tphoto:after{content:"";position:absolute;left:0;right:0;bottom:0;height:${PHONE ? '1.7in' : '2.9in'};background:linear-gradient(to bottom,rgba(16,38,75,0),rgba(16,38,75,.88) 70%,var(--navy))}
.tpanel{position:absolute;left:0;right:0;bottom:0;padding:0 ${PHONE ? '.34in .42in' : '.68in .6in'}}
.tk{font:800 ${PHONE ? '11pt' : '17pt'} var(--cond);letter-spacing:.34em;color:#fff;text-shadow:0 1pt 10pt rgba(11,26,54,.95),0 0 3pt rgba(11,26,54,.8);margin:0 0 ${PHONE ? '0' : '2pt'};text-transform:uppercase}
.tbig{font:800 ${PHONE ? '44pt' : '86pt'}/.9 var(--cond);text-transform:uppercase;margin:0 0 ${PHONE ? '8pt' : '14pt'};color:#fff;letter-spacing:-.005em;white-space:nowrap;text-shadow:0 2pt 14pt rgba(11,26,54,.7)}.tbig em{font-style:italic;color:var(--orange)}
.tfacts{display:grid;grid-template-columns:repeat(4,1fr);gap:${PHONE ? '5pt' : '10pt'};border-top:1.4pt solid #31508a;padding-top:${PHONE ? '5pt' : '8pt'}}
.tfacts b{display:block;font:800 ${PHONE ? '15pt' : '24pt'}/1 var(--cond);color:#fff}.tfacts span{display:block;font:600 ${PHONE ? '6.2pt' : '7.6pt'}/1.25 var(--sans);color:#b9c6e2;margin-top:2pt}
.tnote{font:600 ${PHONE ? '7.2pt' : '7.4pt'}/1.4 var(--sans);color:#a3b2d2;margin:${PHONE ? '4pt 0 8pt' : '6pt 0 14pt'}}.tnote i{font-style:normal;font-weight:700;color:#ffb089}
.tstory{border-top:4pt solid var(--orange);padding-top:${PHONE ? '7pt' : '12pt'}}
.tstory .title{font-size:${PHONE ? '17pt' : '27pt'};margin-bottom:5pt}.tstory .dek{font-size:${PHONE ? '8.4pt' : '11pt'}}.tstory .by{margin:0 0 6pt}
.photofull{display:grid;grid-template-rows:1fr auto;background:var(--cream)}
.photofull .pf{margin:0;position:relative;min-height:0}
.photofull .pf img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.photofull figcaption{position:absolute;left:0;right:0;bottom:0;padding:${PHONE ? '22pt .34in 6pt' : '30pt .68in 8pt'};background:linear-gradient(to bottom,rgba(8,18,40,0),rgba(8,18,40,.82));font:500 ${PHONE ? '7.6pt' : '7.6pt'}/1.3 var(--sans);color:#fff}.photofull figcaption i{color:#fff;font-style:normal;font-weight:700}
.pfp{position:relative;background:var(--cream);color:var(--navy);padding:${PHONE ? '.18in .34in .5in' : '.3in .68in .62in'};border-top:6pt solid var(--orange)}
.pfp .title{font-size:${PHONE ? '24pt' : '36pt'}}.pfp .title.sm{font-size:${PHONE ? '20pt' : '31pt'}}
.portrait .ofolio{right:auto;left:${PHONE ? '.34in' : '.68in'}}
.portrait .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.portrait .shade{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(11,26,54,0) 38%,rgba(11,26,54,.8) 64%,rgba(11,26,54,.97) 100%)}
.ptext{position:absolute;left:${PHONE ? '.34in' : '.68in'};right:${PHONE ? '.34in' : '.68in'};bottom:${PHONE ? '.5in' : '.75in'}}
.ptext .title{font-size:${PHONE ? '26pt' : '50pt'}}.pcredit{font:500 ${PHONE ? '7.4pt' : '7.2pt'} var(--sans);color:#c4cee6;margin:6pt 0 0}.pcredit i{color:#ffb089;font-style:normal;font-weight:700}
.typefull{background:var(--navy)}
.tfin{position:absolute;left:${PHONE ? '.4in' : '.8in'};right:${PHONE ? '.4in' : '.8in'};top:${PHONE ? '.5in' : '.9in'};bottom:${PHONE ? '.55in' : '.85in'};display:flex;flex-direction:column}
.tfin:before{content:"";display:block;width:${PHONE ? '.9in' : '1.4in'};height:5pt;background:var(--orange);margin-bottom:${PHONE ? '10pt' : '16pt'}}
.typefull .title{font-size:${PHONE ? '34pt' : '62pt'};line-height:.95;margin:6pt 0 10pt}.typefull .title.xl{font-size:${PHONE ? '42pt' : '86pt'}}.typefull .title.lg{font-size:${PHONE ? '36pt' : '70pt'}}
.typefull .by{margin:0}
.tfin .thead{margin:auto 0}
.tbase{margin-top:0;border-top:1pt solid #31508a;padding-top:${PHONE ? '10pt' : '18pt'}}
.bigq{font:800 ${PHONE ? '17pt' : '29pt'}/1.1 var(--cond);text-transform:uppercase;color:#fff;margin:0 0 8pt;text-wrap:balance}
.bigwho{font:700 ${PHONE ? '8pt' : '10pt'} var(--cond);letter-spacing:.24em;text-transform:uppercase;color:#ff8a5c;margin:0 0 ${PHONE ? '10pt' : '16pt'}}
.tbase .dek{margin:0;font-size:${PHONE ? '9pt' : '11.5pt'}}

/* story flow */
.story{margin:0}
.splitstory{break-before:page}
.splitstory .splithead{margin:0 0 ${PHONE ? '8pt' : '10pt'}}
.sphoto{margin:0 0 ${PHONE ? '10pt' : '14pt'}}.sphoto img{display:block;width:100%;height:${PHONE ? '1.75in' : '3.5in'};object-fit:cover}
.sphoto figcaption,.wide figcaption{font:500 ${PHONE ? '7.8pt' : '7.8pt'}/1.35 var(--sans);color:var(--muted);margin-top:3pt}
.sphoto figcaption i,.wide figcaption i{font-style:normal;font-weight:700;color:var(--rust)}
.snum{margin:0 0 ${PHONE ? '10pt' : '14pt'};background:var(--navy);color:#fff;display:flex;align-items:center;gap:${PHONE ? '10pt' : '20pt'};padding:${PHONE ? '8pt 12pt' : '12pt 22pt'};border-left:8pt solid var(--orange)}
.snum b{font:800 ${PHONE ? '64pt' : '110pt'}/.85 var(--cond);color:#fff}.snum span{font:800 ${PHONE ? '13pt' : '22pt'}/1.1 var(--cond);text-transform:uppercase;color:#ff8a5c;letter-spacing:.04em}
.wide{margin:0 0 ${PHONE ? '10pt' : '14pt'}}.wide img{display:block;width:100%;height:auto}.wide.closer{margin-top:${PHONE ? '12pt' : '18pt'};break-inside:avoid}.wide.closer img{height:${PHONE ? '2.4in' : '3.05in'};object-fit:cover}
.body{column-count:${PHONE ? '1' : '2'};column-gap:.34in;column-rule:.5pt solid var(--rule);orphans:3;widows:3;column-fill:balance}
.body p{margin:0 0 6.2pt;text-wrap:pretty}
.body p.lede::first-letter{font-family:var(--cond);font-weight:800;initial-letter:3;color:var(--orange);margin-right:${PHONE ? '5pt' : '6pt'}}
.body p.sub{font:800 ${PHONE ? '12pt' : '13.5pt'}/1.1 var(--cond);text-transform:uppercase;letter-spacing:.06em;color:var(--navy);margin:${PHONE ? '10pt 0 3pt' : '11pt 0 3pt'};padding-top:5pt;border-top:1.4pt solid var(--orange);break-after:avoid}
.body p.sub2{font:800 ${PHONE ? '10.5pt' : '11.5pt'}/1.15 var(--cond);letter-spacing:.04em;color:var(--blue);margin:9pt 0 2pt;break-after:avoid}
.body blockquote{margin:6pt 0;padding:1pt 0 1pt 10pt;border-left:3pt solid var(--orange);break-inside:avoid;font-style:italic;color:#243a64}.body blockquote p{margin:0 0 4pt}
.body strong{font-weight:700}
.pull{margin:${PHONE ? '8pt 0 10pt' : '8pt 0 12pt'};padding:${PHONE ? '9pt 0' : '10pt 0 9pt'};border-top:3pt solid var(--orange);break-inside:avoid}
.pull p{margin:0 0 5pt;font:800 ${PHONE ? '16pt' : '20.5pt'}/1.08 var(--cond);text-transform:uppercase;color:var(--navy);text-wrap:balance;letter-spacing:.005em}
.pull b{font:700 ${PHONE ? '7.6pt' : '9pt'} var(--cond);letter-spacing:.2em;text-transform:uppercase;color:var(--rust)}
.end{margin:8pt 0 0;font:800 7.4pt var(--cond);letter-spacing:.34em;color:var(--rust);text-align:right;break-inside:avoid}.endmark{font:800 7.4pt var(--cond);letter-spacing:.34em;color:var(--rust);white-space:nowrap;margin-left:6pt}
.body + *{break-before:auto}
.story + .story{break-before:page}

/* editorial furniture */
.nb{white-space:nowrap}
.enote{font:600 ${PHONE ? '9pt' : '8.6pt'}/1.4 var(--sans);color:#33405e;border-left:3pt solid var(--orange);background:rgba(250,70,22,.07);padding:4pt 8pt;margin:0 0 ${PHONE ? '8pt' : '10pt'};max-width:100%}
.enote b{font:800 7.6pt var(--cond);letter-spacing:.14em;text-transform:uppercase;color:var(--rust)}
.enote.lt{color:#d6def0;background:rgba(255,255,255,.08);margin:8pt 0 0}.enote.lt b{color:#ff8a5c}
.enote.after{margin:8pt 0 6pt;break-before:avoid}
.watch{margin:${PHONE ? '10pt 0' : '12pt 0 10pt'};border-top:3pt solid var(--orange);padding-top:5pt;break-inside:avoid}
.watch .wk{font:800 ${PHONE ? '8pt' : '9pt'} var(--cond);letter-spacing:.2em;text-transform:uppercase;color:var(--rust);margin:0 0 3pt}
.wnote{margin:4pt 0 1pt;font:600 ${PHONE ? '9pt' : '9pt'}/1.3 var(--sans);color:var(--navy)}
.watch a{display:block;padding:${PHONE ? '4pt 0' : '3pt 0'};border-bottom:.5pt solid var(--rule);font:600 ${PHONE ? '9.4pt' : '9pt'}/1.28 var(--sans);color:var(--blue);text-decoration:underline;text-decoration-thickness:.4pt}
.watch a{display:flex;justify-content:space-between;gap:12pt;align-items:baseline}.watch a .wu{flex:none;font:500 6.6pt var(--sans);font-style:normal;color:var(--muted);text-decoration:none}
.vlink{color:var(--blue);text-decoration:underline;text-decoration-thickness:.5pt}
.keynums{background:var(--paper);border:.6pt solid var(--rule);border-left:5pt solid var(--orange);padding:6pt 9pt 3pt;margin:3pt 0 9pt}
.keynums p{margin:0 0 3.4pt;font-size:${PHONE ? '9.8pt' : '8.9pt'};line-height:1.4}.keynums b{font:800 ${PHONE ? '9.6pt' : '9pt'} var(--cond);letter-spacing:.1em;text-transform:uppercase;color:var(--rust)}
.sayer{font:800 ${PHONE ? '11pt' : '10pt'} var(--cond);letter-spacing:.05em;color:var(--orange);white-space:nowrap}
.body p.lead-in{break-after:avoid}
.body p.lede.short::first-letter{font:inherit;initial-letter:normal;color:inherit;margin:0}.body p.lede.short{font-weight:700;font-size:${PHONE ? '12pt' : '11.5pt'}}
.qlinks{display:flex;flex-direction:column;margin:6pt 0 4pt}
.qlinks a{display:block;padding:${PHONE ? '4.2pt 0' : '2.6pt 0'};font:700 ${PHONE ? '9.6pt' : '9pt'}/1.25 var(--sans);color:#fff;text-decoration:underline;text-decoration-thickness:.4pt}

/* teams */
.teampage{break-before:page}
.ttitle{font:800 ${PHONE ? '24pt' : '36pt'}/.95 var(--cond);text-transform:uppercase;margin:0 0 4pt;color:var(--navy)}.ttitle small{font:800 ${PHONE ? '10pt' : '14pt'} var(--cond);letter-spacing:.2em;color:var(--orange);margin-left:6pt;vertical-align:middle;white-space:nowrap}
.tcont{font:800 11pt var(--cond);letter-spacing:.22em;text-transform:uppercase;color:var(--rust);margin:0 0 6pt}
.tsrc{font-size:${PHONE ? '7.2pt' : '8pt'};line-height:1.4;color:var(--muted);margin:0 0 8pt}.tsrc a{color:var(--blue);text-decoration:underline;text-decoration-thickness:.4pt}
table.roster thead{display:table-header-group}table.roster tr{break-inside:avoid}.qbbox .qbsrc{font-size:${PHONE ? '6.8pt' : '7.4pt'};color:#b9c6e2}.qbbox .qbsrc a{color:#fff;text-decoration:underline;text-decoration-thickness:.4pt}
table.roster{width:100%;border-collapse:collapse;font-size:${PHONE ? '6.9pt' : '7.2pt'};line-height:1.22;${PHONE ? 'table-layout:fixed' : ''}}
${PHONE ? 'table.roster th:nth-child(1){width:14pt}table.roster th:nth-child(2){width:62pt}table.roster th:nth-child(3){width:22pt}table.roster th:nth-child(4){width:19pt}table.roster th:nth-child(5){width:18pt}table.roster th:nth-child(6){width:20pt}table.roster th:nth-child(7){width:72pt}table.roster td{overflow-wrap:anywhere}' : ''}
table.roster th{font:800 ${PHONE ? '6pt' : '6.6pt'} var(--cond);letter-spacing:${PHONE ? '.08em' : '.14em'};text-transform:uppercase;text-align:left;background:var(--navy);color:#fff;padding:3pt 4pt}
table.roster td{padding:${PHONE ? '.95pt 2pt' : '1.45pt 4pt'};border-bottom:.4pt solid var(--rule)}table.roster tr:nth-child(even) td{background:#f3eddf}
table.roster td.ht,table.roster td.cl{white-space:nowrap}table.roster td.n{font:800 ${PHONE ? '8pt' : '9pt'} var(--cond);color:var(--blue);text-align:right;width:${PHONE ? '.2in' : '.3in'}}table.roster td.nm{font-weight:700;color:var(--navy);${PHONE ? '' : 'white-space:nowrap'}}
.qbbox{background:var(--navy);color:#fff;padding:${PHONE ? '8pt 10pt' : '10pt 16pt'};border-left:8pt solid var(--orange);margin:0 0 10pt}
.qbbox .gk{border:0;padding:0;color:#ff8a5c}.qbname{font:800 ${PHONE ? '18pt' : '26pt'}/1.05 var(--cond);text-transform:uppercase;margin:2pt 0 6pt}.qbname em{font-style:italic;color:var(--orange)}.qbbox p{margin:0 0 4pt;font-size:${PHONE ? '8.4pt' : '9.4pt'};line-height:1.4;color:#d6def0}.qbbox .qbname{color:#fff}
.dh{font:800 ${PHONE ? '12pt' : '13pt'} var(--cond);letter-spacing:.24em;text-transform:uppercase;color:var(--rust);border-top:3pt solid var(--orange);padding-top:3pt;margin:6pt 0 4pt}
.dgrid{display:grid;grid-template-columns:repeat(${PHONE ? '2' : '4'},1fr);gap:${PHONE ? '5pt 8pt' : '3.5pt 12pt'}}
.dpos{break-inside:avoid;border-top:.6pt solid var(--rule);padding-top:2pt}.dpos .dh4{font:800 ${PHONE ? '10pt' : '12pt'} var(--cond);color:var(--blue);margin:0 0 1pt}
.dpos p{white-space:nowrap;margin:0;font-size:${PHONE ? '8pt' : '6.9pt'};line-height:1.24}.dn{font:800 ${PHONE ? '8.6pt' : '8.4pt'} var(--cond);color:var(--rust)}.dm{color:var(--muted)}.dsec{font:700 .68em var(--cond);letter-spacing:.14em;color:var(--muted);margin-right:3pt}.or{font:800 ${PHONE ? '6.8pt' : '6.6pt'} var(--cond);letter-spacing:.1em;color:var(--orange)}

/* credits */
.credits{break-before:page;${PHONE ? '' : 'max-width:5.6in'}}.credits .ttitle{margin-bottom:${PHONE ? '12pt' : '8pt'}}.credits p{margin:0 0 ${PHONE ? '4pt' : '6pt'};font-size:${PHONE ? '9.2pt' : '9.2pt'};line-height:1.42;color:#33405e}.credits b{color:var(--navy)}.credits .tag{margin-top:${PHONE ? '8pt' : '16pt'};font:800 14pt var(--cond);letter-spacing:.06em;color:var(--navy)}
`;

// ---------------------------------------------------------------------------------------------------------------------
// Assemble, render (two passes for contents page numbers), verify
// ---------------------------------------------------------------------------------------------------------------------
function assemble(pages) {
  PAGES = pages || {};
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>GatorBait Magazine | Florida vs. Oklahoma Pregame Edition | Nov. 6, 2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;1,700;1,800&display=swap" rel="stylesheet"><style>${css(PHONE)}</style></head><body>
${smartQuotes([coverHtml(), contents(pages), guide(), live.map((s) => story(byKey[s.key], s)).join('\n'), teams(), credits(), backCover()].join('\n'))}
</body></html>`;
}

const tag = PHONE ? 'issue-v2-phone' : 'issue-v2';
const need = (re, txt) => { if (!re.test(txt)) throw new Error('missing ' + re); };

async function render(html, htmlPath, pdfPath) {
  fs.writeFileSync(htmlPath, html);
  const req = createRequire(import.meta.url);
  const pwPath = process.env.PLAYWRIGHT_PKG || path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright');
  const { chromium } = req(pwPath);
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || '';
  const browser = await chromium.launch(proxy ? { proxy: { server: proxy }, args: ['--ignore-certificate-errors'] } : {});
  const page = await browser.newPage({ viewport: { width: 1100, height: 1400 }, ignoreHTTPSErrors: !!proxy });
  const failed = [];
  page.on('requestfailed', (r) => failed.push(r.url()));
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load', timeout: 120000 });
  const stats = await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images];
    const broken = [];
    await Promise.all(imgs.map(async (i) => { try { if (!i.complete) await new Promise((res, rej) => { i.onload = res; i.onerror = rej; }); await i.decode(); } catch (e) { broken.push(i.src); } if (!i.naturalWidth) broken.push(i.src); }));
    const fonts = [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family))];
    // fixed-size pages must not overflow their box
    const over = [...document.querySelectorAll('.full')].filter((e) => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1).map((e) => e.className);
    return { images: imgs.length, broken: [...new Set(broken)], fonts, over };
  });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, outline: true, tagged: true });
  await browser.close();
  if (stats.broken.length) throw new Error('Broken images: ' + stats.broken.join(', '));
  if (stats.over.length) console.warn('WARN fixed pages overflow:', stats.over.join(', '));
  return { stats, failed };
}

function outlinePages(pdfPath) {
  const py = `
import json,sys
from pypdf import PdfReader
r=PdfReader(sys.argv[1]); out=[]
def walk(o):
    for x in o:
        if isinstance(x,list): walk(x)
        else: out.append([x.title, r.get_destination_page_number(x)+1])
walk(r.outline)
print(json.dumps({'pages':len(r.pages),'outline':out,'chars':[len((pg.extract_text() or '').strip()) for pg in r.pages]}))`;
  return JSON.parse(execFileSync('/usr/bin/python3', ['-c', py, pdfPath]).toString());
}

const htmlPath = path.join(OUT, tag + '.html');
const pdfPath = path.join(OUT, tag + '.pdf');
const compact = (t) => t.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
function locate(o) {
  const pageOf = {};
  for (const [t, pg] of o.outline) {
    const c = compact(t);
    for (const s of live) if (c === compact(byKey[s.key].title) && !pageOf[s.key]) pageOf[s.key] = pg;
    if (c === 'OKLAHOMAATFLORIDA' && !pageOf.guide) pageOf.guide = pg;
    if (/^FLORIDAGATORS2026ROSTER/.test(c) && !pageOf.teams) { pageOf.teams = pg; pageOf.rosterUF = pg; }
    if (c.startsWith('OKLAHOMA') && c.includes('DEPTHCHART') && !pageOf.depthOU) pageOf.depthOU = pg;
    if (c.startsWith('OKLAHOMA') && /2026ROSTER$/.test(c) && !pageOf.rosterOU) pageOf.rosterOU = pg;
    if (c === 'BEHINDTHEPAGES' && !pageOf.credits) pageOf.credits = pg;
  }
  return pageOf;
}
const html1 = assemble(null);
if (HTML_ONLY) { fs.writeFileSync(htmlPath, html1); console.log('wrote', htmlPath); process.exit(0); }
await render(html1, htmlPath, pdfPath);
const o1 = outlinePages(pdfPath);
const pageOf = locate(o1);
console.log('pass 1: pages', o1.pages, 'located', Object.keys(pageOf).length);
const html2 = assemble(pageOf);
const r2 = await render(html2, htmlPath, pdfPath);
const o2 = outlinePages(pdfPath);
const pageOf2 = locate(o2);
const moved = Object.keys(pageOf).filter((k) => pageOf[k] !== pageOf2[k]);
console.log('sparse pages (<420 chars):', o2.chars.map((c, i) => [i + 1, c]).filter(([, c]) => c < 420).map(([i, c]) => i + ':' + c).join(' '));
console.log('pass 2: pages', o2.pages, 'bytes', fs.statSync(pdfPath).size, 'fonts', r2.stats.fonts.join(' | '), 'moved', JSON.stringify(moved));
if (moved.length) console.warn('WARN: page numbers moved between passes; rerun');

// Finish: clean bookmarks and top-of-page internal links (Chromium's own outline fuses wrapped words and lands mid-page).
const sec = (name, keys) => { const kids = keys.filter((k) => pageOf2[k]).map((k) => ({ title: byKey[k].title, page: pageOf2[k] })); return kids.length ? { title: name, page: kids[0].page, children: kids } : null; };
const outline = [
  { title: 'Cover', page: 1 },
  { title: 'Contents', page: 2 },
  { title: 'Game Guide: Oklahoma at Florida', page: pageOf2.guide },
  ...Object.entries(SECTIONS).map(([k, v]) => sec(v.name, live.filter((s) => s.section === k).map((s) => s.key))).filter(Boolean),
  { title: 'The Teams', page: pageOf2.rosterUF, children: [
    { title: 'Florida Gators roster', page: pageOf2.rosterUF },
    { title: 'Oklahoma Sooners depth chart', page: pageOf2.depthOU },
    { title: 'Oklahoma Sooners roster', page: pageOf2.rosterOU }].filter((x) => x.page) },
  { title: 'Credits and sources', page: pageOf2.credits },
  { title: 'Back cover', page: o2.pages },
].filter((x) => x && x.page);
const spec = { outline, title: 'GatorBait Magazine | Florida vs. Oklahoma Pregame Edition | Nov. 6, 2026 (' + (PHONE ? 'Phone edition' : 'Letter edition') + ')', author: 'GatorBait Media', subject: 'Oklahoma week: nine complete stories, the game guide, both official rosters and Oklahoma\'s depth chart. Friday, Nov. 6, 2026.' };
const specPath = path.join(OUT, tag + '.spec.json');
fs.writeFileSync(specPath, JSON.stringify(spec, null, 1));
execFileSync('/usr/bin/python3', [path.join(HERE, 'finish-pdf.py'), pdfPath, specPath], { stdio: 'inherit' });
const o3 = outlinePages(pdfPath);
fs.writeFileSync(path.join(OUT, tag + '.outline.json'), JSON.stringify({ pages: o3.pages, outline: o3.outline, contents: pageOf2, bytes: fs.statSync(pdfPath).size }, null, 1));
console.log('finished:', o3.pages, 'pages;', o3.outline.length, 'bookmarks;', fs.statSync(pdfPath).size, 'bytes');

// Pull quotes must not repeat their source on the same or the next page: report where each one and its source landed.
{
  const key = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const pageTexts = [];
  for (let i = 1; i <= o3.pages; i++) pageTexts.push(' ' + key(execFileSync('pdftotext', ['-f', String(i), '-l', String(i), pdfPath, '-'], { maxBuffer: 1 << 26 }).toString()) + ' ');
  const issues = [];
  for (const s of live.filter((x) => x.pq)) {
    const needle = ' ' + key(s.pq.text).split(' ').slice(0, 6).join(' ') + ' ';
    const hits = [];
    pageTexts.forEach((t, i) => { let n = 0, at = -1; while ((at = t.indexOf(needle, at + 1)) > -1) n++; if (n) hits.push([i + 1, n]); });
    const total = hits.reduce((a, [, n]) => a + n, 0);
    const pages = hits.map(([pg]) => pg);
    const same = hits.some(([, n]) => n > 1);
    const adj = pages.some((pg, i) => i && pg - pages[i - 1] <= 1);
    console.log(`pull quote ${s.key}: occurrences ${total} on pages ${hits.map(([pg, n]) => pg + (n > 1 ? 'x' + n : '')).join(', ')}${same ? '  <-- SAME PAGE' : adj ? '  <-- ADJACENT PAGES' : ''}`);
    if (same || adj) issues.push(s.key);
  }
  if (issues.length) console.warn('WARN pull quotes close to their source:', issues.join(', '));
}
