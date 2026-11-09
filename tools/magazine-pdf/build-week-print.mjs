#!/usr/bin/env node
// White-and-orange print edition of a game-week issue (Oklahoma week, Nov. 6, 2026; eight stories): whole articles, no outbound links,
// Barlow only. Same palette and type as build-postgame-print.mjs (Nov. 2); Chromium renders it (tools/magazine-pdf/render-pdf.mjs).
// Usage: node tools/magazine-pdf/build-week-print.mjs <issue-config.json> <posts.json> <out.html> [--phone] [--cover <cover.jpg>]
//   <issue-config.json>  magazine/issues/<issue>/issue.json (heroes, cover provenance)
//   <posts.json>         magazine/issues/<issue>/posts.json (output of prepare.py: prepared bodies, bylines, pull quotes)
//   --phone              5 in x 8.9 in pages, one column (the default is US Letter, two columns)
//   --cover <file>       the supplied cover art (trim size, JPEG); defaults to tools/magazine-pdf/assets/oklahoma-week-cover-print-20261106.jpg
// Photos are requested from Wix by media id as JPEG cuts; the cover is a local file. Stories with no owned photo carry a
// pull quote taken verbatim from the story body.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const PHONE = argv.includes('--phone');
const coverIdx = argv.indexOf('--cover');
const coverFile = coverIdx > -1 ? argv[coverIdx + 1] : new URL('./assets/oklahoma-week-cover-print-20261106.jpg', import.meta.url).pathname;
const rest = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--cover');
const [cfgPath, postsPath, outPath] = rest;
if (!outPath) { console.error('usage: build-week-print.mjs <issue-config.json> <posts.json> <out.html> [--phone] [--cover file]'); process.exit(2); }
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const { posts } = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
if (!fs.existsSync(coverFile)) { console.error('missing cover file ' + coverFile); process.exit(2); }

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CDN = 'https://static.wixstatic.com/media/';
const cut = (h, w0) => `${CDN}${h.id}~mv2.${h.ext}/v1/fit/w_${w0},h_${Math.round(w0 * h.height / h.width)},q_85/x.jpg`;
const issueName = 'Oklahoma week edition';
const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
const STORY_COUNT_WORD = NUMBER_WORDS[posts.length] || String(posts.length);
const dateLine = 'Friday, Nov. 6, 2026';

const used = new Set();
function hero(p) {
  if (p.hero === 'pullquote' && p.pullquote) {
    const pq = p.pullquote, quoted = pq.who !== p.author;
    return `<aside class="pq"><p>${quoted ? '“' : ''}${esc(pq.text.replace(/^[“"]|[”"]$/g, ''))}${quoted ? '”' : ''}</p><b>${quoted ? '— ' : ''}${esc(pq.who)}${quoted ? '' : ', column'}</b></aside>`;
  }
  const h = cfg.heroes[p.hero];
  if (!h) throw new Error('No hero config for ' + p.key);
  if (used.has(h.id)) throw new Error('Image used twice in the issue: ' + h.id);
  used.add(h.id);
  const portrait = h.height > h.width;
  const cls = p.key === 'cfp' ? 'hero tall' : portrait ? 'hero crop' : 'hero';
  return `<figure class="${cls}"><img src="${cut(h, PHONE ? 1100 : 1700)}" alt="${esc(h.alt)}"><figcaption>${esc(p.caption || h.credit)}</figcaption></figure>`;
}

const story = (p, n) => `<article class="story" id="s${n}">
<p class="kick">${esc(p.rubric)} · ${esc(p.author)}</p>
<h2>${esc(p.title)}</h2>
<p class="dek">${esc(p.excerpt)}</p>
<p class="by">${esc(p.byline)}</p>
${hero(p)}
<div class="text">${p.html}</div>
<p class="end">GATORBAIT</p>
</article>`;

const toc = posts.map((p, n) => `<li><span class="n">${n + 1}</span><div><span class="k">${esc(p.rubric)} · ${esc(p.author)}</span><b>${esc(p.title)}</b><span class="m">${p.minutesToRead} min read</span></div></li>`).join('');
const credits = [
  ['Cover', 'Urban Meyer: GatorBait Photo (GatorBait archive). The Swamp: Chris Spears, GatorBait Media.'],
  ...posts.filter((p) => p.hero !== 'pullquote').map((p) => [`${p.rubric}, ${p.author}`, cfg.heroes[p.hero].credit.replace(/\.$/, '') + '.']),
];
const creditRows = credits.map(([a, b]) => `<p><b>${esc(a)}.</b> ${esc(b)}</p>`).join('');

const css = `
@page{size:Letter;margin:.6in .7in .7in}
@page cover{margin:0}
*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font:10pt/1.5 "Barlow",Arial,sans-serif;color:#10264b;background:#fff}
h1,h2,h3,.kick,.mast,.by,.k,.n,.sec{font-family:"Barlow Condensed","Barlow",Arial,sans-serif}
.kick{margin:0 0 5pt;font-weight:700;font-size:9.5pt;letter-spacing:.14em;text-transform:uppercase;color:#b93a0e}
.cover{page:cover;break-after:page;width:8.5in;height:11in;background:#001b4e;overflow:hidden}
.cover img{display:block;width:8.5in;height:11in}
.toc{break-after:page}
.toc .mast{font-size:40pt;font-weight:800;line-height:.9;letter-spacing:-.02em;text-transform:uppercase;margin:0;color:#10264b}.toc .mast span{color:#fa4616}
.toc .mag{font:700 11pt "Barlow Condensed";letter-spacing:.5em;color:#b93a0e;text-transform:uppercase;margin:3pt 0 2pt}
.toc .date{color:#42506a;font-size:10pt;margin:0 0 16pt;border-bottom:2pt solid #fa4616;padding-bottom:7pt}
.toc ol{list-style:none;margin:0;padding:0}.toc li{display:flex;gap:12pt;padding:9pt 0;border-bottom:.5pt solid #d9dce6;break-inside:avoid}
.toc .n{font-weight:800;font-size:26pt;line-height:1;color:#0021a5;min-width:22pt}
.toc .k{display:block;font-weight:700;font-size:8.5pt;letter-spacing:.14em;text-transform:uppercase;color:#b93a0e}
.toc b{display:block;font:800 15pt/1.1 "Barlow Condensed";color:#10264b;margin:2pt 0}.toc .m{font-size:8.5pt;color:#526075}
.toc .note{margin-top:14pt;font-size:8.5pt;color:#526075}
.story{break-before:page;border-top:7pt solid #fa4616;padding-top:9pt}
.story h2{font:800 28pt/1.02 "Barlow Condensed";margin:0 0 5pt;color:#10264b;letter-spacing:-.005em;text-wrap:balance}
.dek{font-size:12pt;line-height:1.35;color:#33405e;margin:0 0 6pt}
.by{font-weight:700;font-size:10pt;color:#42506a;margin:0 0 9pt;letter-spacing:.02em}
.hero{margin:0 0 10pt;break-inside:avoid}.hero img{display:block;width:100%;height:auto}
.hero.crop img{height:3.9in;object-fit:cover;object-position:50% 14%}
.hero.tall{text-align:center}.hero.tall img{width:auto;max-width:100%;max-height:5.7in;margin:0 auto}
figcaption{font-size:8pt;color:#526075;margin-top:3pt}
.pq{margin:2pt 0 12pt;padding:10pt 0 10pt 14pt;border-left:5pt solid #fa4616;break-inside:avoid;background:#f6f4ef;padding-right:14pt}
.pq p{margin:0 0 5pt;font:700 19pt/1.12 "Barlow Condensed";color:#10264b;letter-spacing:.005em}
.pq b{font:700 9pt "Barlow Condensed";letter-spacing:.14em;text-transform:uppercase;color:#b93a0e}
.text{column-count:2;column-gap:.32in;column-rule:.5pt solid #d9dce6;orphans:3;widows:3}
.text p{margin:0 0 6pt;text-align:left;hyphens:manual}
.text h3{font:800 13pt/1.1 "Barlow Condensed";margin:9pt 0 3pt;color:#10264b;break-after:avoid;text-transform:none}
.text h4{font:700 10.5pt/1.2 "Barlow Condensed";margin:8pt 0 2pt;color:#b93a0e;letter-spacing:.02em;break-after:avoid}
.text blockquote{margin:6pt 0;padding:1pt 0 1pt 10pt;border-left:3pt solid #fa4616;break-inside:avoid;font-style:italic}
.end{margin:10pt 0 0;font:800 8pt "Barlow Condensed";letter-spacing:.3em;color:#fa4616;text-align:right}
.credits{break-before:page;border-top:7pt solid #fa4616;padding-top:9pt}.credits h2{font:800 24pt/1 "Barlow Condensed";margin:0 0 8pt}
.credits p{margin:0 0 5pt;font-size:9pt;color:#33405e}.credits .tag{margin-top:16pt;font:800 14pt "Barlow Condensed";color:#10264b;letter-spacing:.03em}
`;
const phoneCss = `
@page{size:5in 8.9in;margin:.3in .3in .38in}
@page cover{margin:0}
body{font-size:10.2pt;line-height:1.5}
.cover{width:5in;height:8.9in;background:#001b4e;position:relative}
.cover img{width:5in;height:6.47in}
.cover .below{position:absolute;left:0;right:0;top:6.47in;bottom:0;padding:.22in .3in 0;color:#fff;border-top:3pt solid #fa4616;background:#001b4e}
.cover .below .ed{font:800 13pt "Barlow Condensed";letter-spacing:.14em;text-transform:uppercase;color:#ff8a5c;margin:0 0 6pt}
.cover .below .six{font:800 22pt/1 "Barlow Condensed";text-transform:uppercase;margin:0 0 8pt}
.cover .below .tag{font:700 10pt "Barlow Condensed";letter-spacing:.14em;text-transform:uppercase;color:#c8d1e7;margin:0}
.toc .mast{font-size:28pt}.toc .mag{font-size:9pt;margin:2pt 0 1pt}.toc .date{font-size:8.5pt;margin:0 0 9pt;padding-bottom:5pt}.toc .n{font-size:16pt;min-width:14pt}.toc li{padding:4.5pt 0;gap:9pt}.toc b{font-size:11.5pt;line-height:1.08;margin:1pt 0}.toc .k{font-size:7.5pt}.toc .m{font-size:7.5pt}
.story{break-before:page;border-top:5pt solid #fa4616}
.story h2{font-size:23pt}.dek{font-size:10.5pt}
.hero.crop img{height:2.5in}.hero.tall img{max-height:5.2in}
.text{column-count:1;column-rule:0}
.text h3{font-size:12.5pt}.text h4{font-size:10.5pt}.pq p{font-size:16pt}
.credits h2{font-size:20pt}
`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>GatorBait Magazine | Oklahoma Week, Nov. 6, 2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Barlow+Condensed:wght@600;700;800&display=swap" rel="stylesheet"><style>${css}${PHONE ? phoneCss : ''}</style></head><body>
<section class="cover"><img src="${pathToFileURL(path.resolve(coverFile)).href}" alt="GatorBait Magazine cover, Nov. 6, 2026, Oklahoma week: Urban Meyer, Ring of Honor.">${PHONE ? `<div class="below"><p class="ed">${esc(issueName)} · ${esc(dateLine)}</p><p class="six">${STORY_COUNT_WORD} complete stories</p><p class="tag">Real Gator news for real Gators.</p></div>` : ''}</section>
<section class="toc"><p class="mast">Gator<span>Bait</span></p><p class="mag">Magazine</p><p class="date">${esc(dateLine)} · ${esc(issueName)} · Week 10, Oklahoma at Florida</p><p class="kick">In this issue</p><ol>${toc}</ol></section>
${posts.map((p, n) => story(p, n + 1)).join('\n')}
<section class="credits"><p class="kick">Credits</p><h2>Photo credits</h2>${creditRows}<p>Stories without a photograph carry a pull quote from the story itself.</p><p>Complete stories from GatorBait Media, as published. Web navigation, sponsor banners and video links are left out. Rankings, scores and times are as reported on each story's publication date.</p><p class="tag">Real Gator news for real Gators. GatorBaitMedia.com</p></section>
</body></html>`;
if (/<a\b|href=|https?:\/\/(?!static\.wixstatic\.com|fonts\.g)/i.test(html.replace(/<link [^>]*>/g, ''))) throw new Error('Outbound link in the print edition');
fs.writeFileSync(outPath, html);
console.log(`wrote ${outPath} (${html.length} chars, ${(html.match(/<img /g) || []).length} images, ${posts.length} stories, ${PHONE ? 'phone' : 'Letter'})`);
