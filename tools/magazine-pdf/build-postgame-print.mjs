#!/usr/bin/env node
// White-and-orange print edition of the Georgia postgame magazine (US Letter), whole articles, no outbound links.
// Usage: node tools/magazine-pdf/build-postgame-print.mjs <issue.json> <posts.json> <out.html>
import fs from 'node:fs';
const [issuePath, postsPath, outPath] = process.argv.slice(2);
if (!outPath) { console.error('usage: build-postgame-print.mjs <issue.json> <posts.json> <out.html>'); process.exit(2); }
const I = JSON.parse(fs.readFileSync(issuePath, 'utf8'));
const P = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
const byUrl = new Map(P.posts.map((p) => [p.url, p]));
const norm = (u) => (u.startsWith('/post/') ? u : '/post/' + u.replace(/^\//, ''));
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CDN = 'https://static.wixstatic.com/media/';
const img = (im, w = 1200) => im && im.id ? `${CDN}${im.id}~mv2.${im.ext || 'jpg'}/v1/fit/w_${w},h_${Math.round(w * (im.height / im.width))},q_85/x.${im.ext || 'jpg'}` : '';
// Strip links (keep the words), the web credit line, "By X" line and bare URL paragraphs from a story body.
function body(html) {
  let h = html.replace(/<a [^>]*>(.*?)<\/a>/gs, '$1').replace(/<figure>.*?<\/figure>/gs, '');
  h = h.replace(/<p>\s*(Photo[^<]{0,120}|By [A-Z][^<]{0,60}|Charlie Casey\. Photo[^<]{0,80})<\/p>/i, '');
  h = h.replace(/<p>\s*(From The Buddy Martin Show on YouTube:[^<]*|https?:\/\/[^<\s]+)\s*<\/p>/gi, '').replace(/<h2>\s*Watch:[^<]*<\/h2>/gi, '');
  // ESPN final (event 401856734) corrections for a page that may still be served from cache.
  h = h.replace(/Florida(?:&#x27;|')s 246\./g, "Florida's 252.").replace('48 rushing yards on 28 carries, 1.7 per attempt', '54 rushing yards on 28 carries, 1.9 per attempt');
  h = h.replace(/<p>\s*<\/p>/g, '');
  return h;
}
const kicker = (it) => `${esc(it.rubric)} · ${esc(it.author)}`;
const story = (it, cls = '') => {
  const p = byUrl.get(norm(it.url));
  if (!p) throw new Error('No article text for ' + it.url);
  return `<article class="story ${cls}"><p class="kick">${kicker(it)}</p><h2>${esc(it.title)}</h2><p class="by">By ${esc(it.author)}</p>` +
    (it.image ? `<figure class="hero"><img src="${img(it.image)}" alt="${esc(it.image.alt)}"><figcaption>${esc(it.image.credit)}</figcaption></figure>` : '') +
    `<div class="text">${body(p.html)}</div></article>`;
};
const cover = I.cover;
const tocCols = I.columns.items, tocCov = I.coverage.items;
const toc = (items) => items.map((it) => `<li><b>${esc(it.title)}</b><span>${esc(it.author)}</span></li>`).join('');
const tbl = (rows) => rows.map((r) => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
const sc = I.final, f = (k) => esc(sc[k] ?? '');
const finalHtml = `<section class="final"><p class="kick">Final</p><div class="teams">${(sc.teams || []).map((t, _, a) => `<div class="${t.score === Math.max(...a.map((x) => x.score)) ? 'won' : ''}"><span>${esc(t.name)}</span><b>${esc(t.score)}</b></div>`).join('')}</div><p class="meta">${esc((sc.meta || []).join(' · '))}</p></section>`;
const css = `
@page{size:Letter;margin:.6in .7in .7in}
*{box-sizing:border-box}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font:11pt/1.5 "Barlow",Arial,sans-serif;color:#10264b;background:#fff}
h1,h2,h3,.kick,.mast,.by,li b{font-family:"Barlow Condensed","Barlow",Arial,sans-serif}
.kick{margin:0 0 6pt;font-weight:700;font-size:9.5pt;letter-spacing:.14em;text-transform:uppercase;color:#b93a0e}
.cover{page-break-after:always;border-top:10pt solid #fa4616;padding-top:16pt;min-height:9.3in}
.mast{font-size:54pt;font-weight:800;line-height:.9;letter-spacing:-.02em;text-transform:uppercase;margin:0}.mast span{color:#fa4616}
.mag{font:700 12pt "Barlow Condensed";letter-spacing:.5em;color:#b93a0e;text-transform:uppercase;margin:4pt 0 2pt}
.date{color:#42506a;font-size:10pt;margin:0 0 12pt;border-bottom:2pt solid #fa4616;padding-bottom:8pt}
.cover figure{margin:0}.cover img{width:100%;height:3.7in;object-fit:cover;display:block}
.cover figcaption,figcaption{font-size:8pt;color:#526075;margin-top:3pt}
.cover h1{font-size:31pt;line-height:1.02;margin:12pt 0 6pt;color:#10264b}.cover .dek{font-size:13.5pt;color:#33405e;margin:0 0 12pt}
.inside{display:grid;grid-template-columns:1fr 1fr;gap:0 22pt;border-top:2pt solid #10264b;padding-top:8pt}
.inside h3{font-size:10pt;letter-spacing:.14em;text-transform:uppercase;color:#b93a0e;margin:0 0 4pt}
.inside ul{list-style:none;margin:0;padding:0}.inside li{padding:2.4pt 0;border-bottom:.5pt solid #d9dce6;font-size:8.5pt;line-height:1.2}.inside li b{font-size:10pt;display:block}.inside li span{color:#526075}
.toc{page-break-after:always}.final{margin-top:0;background:#f6f4ef;border-top:6pt solid #fa4616;padding:14pt 16pt}
.teams{display:flex;gap:22pt}.teams div{flex:1;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3pt solid #c9ced9;color:#6b7894}.teams .won{border-color:#fa4616;color:#10264b}
.teams span{font:700 20pt "Barlow Condensed"}.teams b{font:800 56pt/.9 "Barlow Condensed"}.meta{font-size:9.5pt;color:#42506a}
.numbers h2,.box h2,.scoring h2{font-size:20pt;line-height:1.05;margin:12pt 0 3pt}.numbers p,.box p{margin:0 0 4pt}
table{width:100%;border-collapse:collapse;margin:4pt 0 6pt;font-size:9.5pt}th,td{padding:2.5pt 6pt;border-bottom:.5pt solid #d9dce6;text-align:left}td{font-weight:700;text-align:right}thead th{font:700 8.5pt "Barlow Condensed";letter-spacing:.12em;text-transform:uppercase;color:#b93a0e}
.plays{margin:6pt 0}.plays p{margin:0;padding:3pt 0;border-bottom:.5pt solid #d9dce6;font-size:9.5pt}.plays b{color:#0021a5}
.src{font-size:8pt;color:#526075}
.story{page-break-before:always}
.story h2{font-size:27pt;line-height:1.04;margin:0 0 4pt}.by{font-weight:700;font-size:10pt;color:#42506a;margin:0 0 8pt}
.hero{margin:0 0 10pt;break-inside:avoid}.hero img{width:100%;max-height:3.4in;object-fit:cover;display:block}
.text p{margin:0 0 7pt;text-align:left;orphans:3;widows:3}.text h2,.text h3,.text h4{font-size:14pt;margin:12pt 0 3pt;color:#10264b;break-after:avoid}
.text blockquote{margin:8pt 0;padding:2pt 0 2pt 12pt;border-left:4pt solid #fa4616;font-style:italic}.text ul,.text ol{margin:0 0 7pt 16pt}
.text figure{margin:8pt 0;break-inside:avoid}.text img{max-width:100%}
.roundup .story{page-break-before:auto;margin-top:18pt;padding-top:12pt;border-top:3pt solid #fa4616}.roundup .story h2{font-size:20pt}.roundup .hero img{max-height:2.4in}
.next{page-break-before:always}.next h2{font-size:26pt;margin:0 0 6pt}.credits{margin-top:16pt;font-size:8.5pt;color:#526075;border-top:2pt solid #10264b;padding-top:8pt}
`;
const nextS = I.next || {};
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>GatorBait Magazine | Postgame: Georgia 27, Florida 8</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap" rel="stylesheet"><style>${css}</style></head><body>
<section class="cover"><p class="mast">Gator<span>Bait</span></p><p class="mag">Magazine</p><p class="date">${esc(I.issue.date)} · ${esc(I.issue.number)} · ${esc(I.issue.week)}</p>
<figure><img src="${img(cover.image, 1600)}" alt="${esc(cover.image.alt)}"><figcaption>${esc(cover.image.credit)}</figcaption></figure>
<p class="kick" style="margin-top:12pt">${esc(cover.kicker)}</p><h1>${esc(cover.headline)}</h1><p class="dek">${esc(cover.dek)}</p>
</section>
<section class="toc"><p class="kick">In this issue</p><div class="inside"><div><h3>${esc(I.columns.title)}</h3><ul>${toc(tocCols)}</ul></div><div><h3>Georgia week</h3><ul>${toc(tocCov)}</ul></div></div></section>
${finalHtml}
<section class="numbers"><p class="kick">${esc(I.damage.kicker || 'By the numbers')}</p><h2>${esc(I.damage.title)}</h2><p>${esc(I.damage.dek)}</p></section>
<section class="box"><p class="kick">${esc(I.box.kicker)}</p><h2>${esc(I.box.title)}</h2><table><thead><tr><th></th><td>${esc(I.box.cols[0])}</td><td>${esc(I.box.cols[1])}</td></tr></thead><tbody>${tbl(I.box.rows)}</tbody></table>
${I.box.leaders.map((t) => `<p class="kick">${esc(t.team)} leaders</p><p>${t.items.map((x) => `<b>${esc(x[0])}</b> ${esc(x[1])}`).join('<br>')}</p>`).join('')}<p class="src">${esc(I.box.source)}</p></section>
${story({ rubric: 'Postgame', author: 'GatorBait Staff', title: cover.headline, url: cover.url, image: null })}
${tocCols.map((it) => story(it)).join('')}
<div class="roundup">${tocCov.map((it) => story(it)).join('')}</div>
<section class="next"><p class="kick">Up next</p><h2>${esc(nextS.title || 'Oklahoma at Florida')}</h2><p>${esc((nextS.chips || []).join(' · '))}</p>
<div class="credits"><b>Photo credits.</b> ${esc((I.credits.other || []).join(' '))}<br>Score, line score, scoring plays, box score and leaders: ESPN (event 401856734). Quotes are as reported in the linked columns or from full transcripts. Records and rankings as of the latest release at the time of publishing.</div></section>
</body></html>`;
fs.writeFileSync(outPath, html);
console.log(`wrote ${outPath} (${html.length} chars, ${(html.match(/<img /g) || []).length} images, ${tocCols.length + tocCov.length} stories)`);
