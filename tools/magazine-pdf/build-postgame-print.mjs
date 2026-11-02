#!/usr/bin/env node
// White-and-orange print edition of the Georgia postgame magazine (US Letter), whole articles, no outbound links.
// Usage: node tools/magazine-pdf/build-postgame-print.mjs <issue.json> <posts.json> <out.html>
import fs from 'node:fs';
const PHONE = process.argv.includes('--phone');
const adsArg = process.argv.indexOf('--ads');
const ADS = adsArg > 0 ? JSON.parse(fs.readFileSync(process.argv[adsArg + 1], 'utf8')) : [];
const argsRest = process.argv.slice(2).filter((a, i, arr) => !a.startsWith('--') && arr[i - 1] !== '--ads');
const [issuePath, postsPath, outPath] = argsRest;
if (!outPath) { console.error('usage: build-postgame-print.mjs <issue.json> <posts.json> <out.html>'); process.exit(2); }
const I = JSON.parse(fs.readFileSync(issuePath, 'utf8'));
const P = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
const byUrl = new Map(P.posts.map((p) => [p.url, p]));
const norm = (u) => (u.startsWith('/post/') ? u : '/post/' + u.replace(/^\//, ''));
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const CDN = 'https://static.wixstatic.com/media/';
const LITE = process.argv.includes('--lite'); // smaller file: 70% width, q70
const img = (im, w0 = 1200) => { const w = LITE ? Math.round(w0 * 0.7) : w0; return im && im.id ? `${CDN}${im.id}~mv2.${im.ext || 'jpg'}/v1/fit/w_${w},h_${Math.round(w * (im.height / im.width))},q_${LITE ? 70 : 85}/x.${im.ext || 'jpg'}` : ''; };
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
.cover.art{padding:0;min-height:0;border-top:0;background:#fff;text-align:center;page-break-after:always;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover.art img{display:block;margin:0 auto;width:auto;max-width:100%;max-height:9.3in;height:auto;border-top:10pt solid #fa4616}
.cover.art .tzbox{background:#071439;color:#fff;text-align:left;padding:10pt 14pt;margin-top:-1pt}.cover.art ul.tz{list-style:none;margin:0;padding:0}.cover.art ul.tz li{font:700 11.5pt "Barlow Condensed";text-transform:uppercase;letter-spacing:.05em;padding-left:12pt;position:relative;margin:0 0 3pt}.cover.art ul.tz li:before{content:"";position:absolute;left:0;top:4pt;width:6pt;height:6pt;background:#ff4a0a}

.cover.hot{position:relative;border-top:10pt solid #fa4616;padding:0;min-height:9.55in;color:#fff;background:#071439;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover.hot .bg{position:absolute;left:0;right:0;top:118pt;width:100%;height:calc(100% - 118pt);object-fit:cover;object-position:50% 0}
.cover.hot .shade{position:absolute;inset:0;background:linear-gradient(180deg,#071439 0%,#071439 11%,rgba(7,20,57,0) 24%,rgba(7,20,57,0) 32%,rgba(7,20,57,.82) 52%,rgba(7,20,57,.97) 76%,#071439 100%)}
.cover.hot .in{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:9.55in;padding:18pt 20pt 18pt;box-sizing:border-box}
.cover.hot .mast{color:#fff;text-align:center;font-size:62pt}.cover.hot .mag{color:#ffd9c7;text-align:center;border-bottom:2.5pt solid #fa4616;padding-bottom:6pt}
.cover.hot .date{color:#fff;border:0;margin:6pt 0 0;padding:0}
.cover.hot .ed{display:inline-block;background:#ff4a0a;color:#fff;font:800 11pt "Barlow Condensed";letter-spacing:.07em;text-transform:uppercase;padding:5pt 9pt;margin:0 0 8pt}
.cover.hot h1{color:#fff;font-size:70pt;line-height:.88;text-transform:uppercase;margin:0 0 10pt;letter-spacing:-.01em}
.cover.hot .chip{display:inline-flex;font:700 15pt "Barlow Condensed";text-transform:uppercase;letter-spacing:.05em;border:1pt solid rgba(255,255,255,.6);margin:0 0 10pt}
.cover.hot .chip span{padding:6pt 10pt;border-right:1pt solid rgba(255,255,255,.6)}.cover.hot .chip b{font-size:1.25em;margin-left:4pt}.cover.hot .chip span+span b{color:#ffb27a}.cover.hot .chip em{font-style:normal;background:#ff4a0a;padding:6pt 10pt}
.cover.hot .sub{font-size:12pt;line-height:1.35;color:#eef2ff;margin:0 0 9pt}
.cover.hot ul.tz{list-style:none;margin:0 0 6pt;padding:0}.cover.hot ul.tz li{font:700 13pt "Barlow Condensed";text-transform:uppercase;letter-spacing:.05em;padding-left:12pt;position:relative;margin:0 0 4pt}.cover.hot ul.tz li:before{content:"";position:absolute;left:0;top:4pt;width:6pt;height:6pt;background:#ff4a0a}
.cover.hot .cr{font-size:8pt;color:#c8d1e7;margin:6pt 0 0}

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

const phoneCss = `
.cover.art{background:#071439;min-height:8.0in;max-height:8.25in;overflow:hidden}.cover.art img{max-height:6.9in}.cover.art .tzbox{padding:14pt 16pt}.cover.art ul.tz li{font-size:13pt;margin:0 0 5pt}.cover.art .tag{font:700 10pt "Barlow Condensed";letter-spacing:.12em;text-transform:uppercase;color:#ffb27a;margin:8pt 0 0}.cover.hot,.cover.hot .in{min-height:8.05in;max-height:8.3in}.cover.hot .in{padding:12pt 14pt}.cover.hot .mast{font-size:44pt}.cover.hot h1{font-size:50pt}.cover.hot .sub{display:none}.cover.hot .chip{font-size:13pt}.cover.hot ul.tz li{font-size:11.5pt;margin:0 0 3pt}.cover.hot .cr{margin-top:3pt}
@page{size:5in 8.9in;margin:.3in .3in .38in}
body{font-size:10.2pt;line-height:1.5}
.mast{font-size:40pt}.mag{font-size:10pt}.date{font-size:8.5pt}
.cover{min-height:0;padding-top:12pt}.cover img{height:3.3in}.cover h1{font-size:23pt}.cover .dek{font-size:10.5pt}
.inside{display:block}.inside li{font-size:8.5pt}.inside li b{font-size:9.5pt}.inside>div{margin-bottom:8pt}
.teams span{font-size:15pt}.teams b{font-size:40pt}.teams{gap:12pt}
.numbers h2,.box h2{font-size:17pt}table{font-size:8.8pt}
.story,.roundup .story{page-break-before:auto;margin-top:18pt;padding-top:12pt;border-top:4pt solid #fa4616}
.story h2,.roundup .story h2{font-size:19pt}.hero img,.roundup .hero img{max-height:2.4in}
.text h2,.text h3,.text h4{font-size:12.5pt}.text p{margin-bottom:7pt}
.sec{page-break-before:always;margin:0 0 4pt;font:800 11pt "Barlow Condensed";letter-spacing:.2em;text-transform:uppercase;color:#b93a0e}
.ad{break-inside:avoid;margin:18pt 0 4pt;padding:14pt 12pt;background:#fa4616;color:#fff;text-align:center;border-radius:2pt}
.ad b{display:block;font:800 18pt/1.05 "Barlow Condensed";text-transform:uppercase}.ad span{display:block;margin-top:4pt;font-size:9pt}
.adx{break-inside:avoid;margin:18pt 0 4pt;padding:6pt 0;border-top:1pt solid #d9dce6;border-bottom:1pt solid #d9dce6}.adl{margin:0 0 4pt;font:700 7.5pt "Barlow Condensed";letter-spacing:.2em;text-transform:uppercase;color:#6b7894}.adrow{display:flex;gap:10pt;align-items:center}.adimg{flex:1;max-width:100%;height:auto}.adqr{width:.9in;height:.9in}
.ad.light{background:#f6f4ef;color:#10264b;border:2pt solid #fa4616}
.next{page-break-before:auto;margin-top:18pt}
`;
const nextS = I.next || {};
// Paid or partner ad slots. Dormant unless --ads <json> supplies real creative.
// Each: {id, label:'Advertisement', image:'https://...', link:'https://...', qr?:'https://...', alt, after:'columns'|'coverage'}
// Refuses a placeholder link, a direct polymarket.com link (must be our tracking link) and any creative without a label.
function adBlock(a) {
  if (!a.image || !a.link) throw new Error('Ad ' + a.id + ' needs image and link');
  if (/POLYMARKET_LINK|TBD|\{\{/.test(a.link)) throw new Error('Ad ' + a.id + ' still has a placeholder link');
  if (/^https?:\/\/(www\.)?polymarket\.com/i.test(a.link)) throw new Error('Ad ' + a.id + ' must use our tracking link, not polymarket.com directly');
  if (a.label !== 'Advertisement') throw new Error('Ad ' + a.id + ' must be labeled Advertisement');
  return `<aside class="adx"><p class="adl">Advertisement</p><div class="adrow"><img class="adimg" src="${esc(a.image)}" alt="${esc(a.alt || 'Advertisement')}">${a.qr ? `<img class="adqr" src="${esc(a.qr)}" alt="QR code">` : ''}</div></aside>`;
}
const adsAfter = (where) => ADS.filter((a) => a.after === where).map(adBlock).join('');

const ad1 = '<aside class="ad"><b>Get GatorBait Magazine free</b><span>Buddy Martin, the game-week package and Chris Spears\' photos. gatorbaitmedia.com/magazine</span></aside>';
const ad2 = '<aside class="ad light"><b>The Buddy Martin Show</b><span>New episodes all week. Search \'The Buddy Martin Show\' on YouTube.</span></aside>';
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>GatorBait Magazine | Postgame: Georgia 27, Florida 8</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap" rel="stylesheet"><style>${css}${PHONE ? phoneCss : ''}</style></head><body>
${(cover.poster && !cover.coverTitle) ? `<section class="cover art"><img src="${new URL('../../sports-live/reels/' + cover.poster.file, import.meta.url).href}" alt="${esc(cover.poster.alt)}">${PHONE ? `<div class="tzbox"><ul class="tz">${(cover.teasers || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul><p class="tag">Real Gator news for real Gators.</p></div>` : ''}</section>` : cover.coverTitle ? `<section class="cover hot"><img class="bg" src="${cover.pdfPhoto ? new URL('../../sports-live/reels/' + cover.pdfPhoto.file, import.meta.url).href : img(cover.image, 1600)}" alt="${esc((cover.pdfPhoto || cover.image).alt)}"><div class="shade"></div><div class="in"><div><p class="mast">Gator<span>Bait</span></p><p class="mag">Magazine</p><p class="date">${esc(I.issue.date)} · ${esc(I.issue.week)}</p></div><div><p class="ed">${esc(I.issue.number)}</p><h1>${esc(cover.coverTitle)}</h1><p class="chip"><span>${esc(cover.score.away)} <b>${esc(cover.score.awayScore)}</b></span><span>${esc(cover.score.home)} <b>${esc(cover.score.homeScore)}</b></span><em>${esc(cover.score.label)}</em></p><p class="sub">${esc(cover.headline)}</p><ul class="tz">${(cover.teasers || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul><p class="cr">${esc((cover.pdfPhoto || cover.image).credit)}</p></div></div></section>` : `<section class="cover"><p class="mast">Gator<span>Bait</span></p><p class="mag">Magazine</p><p class="date">${esc(I.issue.date)} · ${esc(I.issue.number)} · ${esc(I.issue.week)}</p>
<figure><img src="${img(cover.image, 1600)}" alt="${esc(cover.image.alt)}"><figcaption>${esc(cover.image.credit)}</figcaption></figure>
<p class="kick" style="margin-top:12pt">${esc(cover.kicker)}</p><h1>${esc(cover.headline)}</h1><p class="dek">${esc(cover.dek)}</p>
</section>`}
<section class="toc"><p class="kick">In this issue</p><div class="inside"><div><h3>${esc(I.columns.title)}</h3><ul>${toc(tocCols)}</ul></div><div><h3>Georgia week</h3><ul>${toc(tocCov)}</ul></div></div></section>
${finalHtml}
<section class="numbers"><p class="kick">${esc(I.damage.kicker || 'By the numbers')}</p><h2>${esc(I.damage.title)}</h2><p>${esc(I.damage.dek)}</p></section>
<section class="box"><p class="kick">${esc(I.box.kicker)}</p><h2>${esc(I.box.title)}</h2><table><thead><tr><th></th><td>${esc(I.box.cols[0])}</td><td>${esc(I.box.cols[1])}</td></tr></thead><tbody>${tbl(I.box.rows)}</tbody></table>
${I.box.leaders.map((t) => `<p class="kick">${esc(t.team)} leaders</p><p>${t.items.map((x) => `<b>${esc(x[0])}</b> ${esc(x[1])}`).join('<br>')}</p>`).join('')}<p class="src">${esc(I.box.source)}</p></section>
${story({ rubric: 'Postgame', author: 'GatorBait Staff', title: cover.headline, url: cover.url, image: null })}
${PHONE ? '<p class="sec">Columns</p>' : ''}${tocCols.map((it) => story(it)).join('')}${PHONE ? ad1 : ''}${adsAfter('columns')}
${PHONE ? '<p class="sec">Georgia week</p>' : ''}<div class="roundup">${tocCov.map((it) => story(it)).join('')}</div>${PHONE ? ad2 : ''}${adsAfter('coverage')}
<section class="next"><p class="kick">Up next</p><h2>${esc(nextS.title || 'Oklahoma at Florida')}</h2><p>${esc((nextS.chips || []).join(' · '))}</p>
<div class="credits"><b>Photo credits.</b> ${esc((I.credits.other || []).join(' '))}<br>Score, line score, scoring plays, box score and leaders: ESPN (event 401856734). Quotes are as reported in the linked columns or from full transcripts. Records and rankings as of the latest release at the time of publishing.</div></section>
</body></html>`;
fs.writeFileSync(outPath, html);
console.log(`wrote ${outPath} (${html.length} chars, ${(html.match(/<img /g) || []).length} images, ${tocCols.length + tocCov.length} stories)`);
