// Broadcast story pages (S3): render real production posts with the candidate a5452619 HTML injected into <head>
// (the same place the HEAD embed lands) and check them at 320, 390, 430 and 1366 px.
// PLAYWRIGHT=/opt/node22/lib/node_modules/playwright/index.mjs node deploy/broadcast-2026/story/test.mjs [out-dir]
// Phones use the live-shots profile (iPhone UA, isMobile), so Wix serves the same mobile page it serves readers.
// The slide-up signup bar is hidden in screenshots only, and one blockquote is added client-side to probe the
// pull-quote style (no current post has one). Nothing is written to the site.
import fs from 'fs';
import path from 'path';
const { chromium, devices } = await import(process.env.PLAYWRIGHT || 'playwright');
const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = process.argv[2] || path.join(HERE, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const CAND = fs.readFileSync(path.join(HERE, 'a5452619-broadcast.html'), 'utf8');
const POSTS = {
  newest: 'a-texas-barbecue-gators-flip-the-script-and-jones-changes-the-conversation',
  column: 'the-soothsayer-texas-big-unless-the-uf-defense-finds-an-exorcist',
  photos: 'chris-spears-best-shots-south-carolina-38-florida-19',
  members: 'qb1-philo-hurt-qb2-jones-to-start-explained-by-that-great-football-mind-ted-lasso',
  subheads: 'is-the-sec-undergoing-a-drain-of-excellence',
};
const WIDTHS = [320, 390, 430, 1366];
const profile = w => w < 768
  ? { userAgent: devices['iPhone 13'].userAgent, viewport: { width: w, height: w < 360 ? 740 : w < 410 ? 844 : 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { userAgent: devices['Desktop Chrome'].userAgent, viewport: { width: w, height: 900 }, deviceScaleFactor: 1 };

const browser = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const results = [];
let fails = 0;
for (const [kind, slug] of Object.entries(POSTS)) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext(profile(w));
    // Once a revision is live its own script runs first and the candidate's guard would skip; neutralize the live copy.
    await ctx.addInitScript(() => { new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.id === 'gbm-post-broadcast-v1' && !n.dataset.cand) n.type = 'text/plain'; }).observe(document, { childList: true, subtree: true }); });
    await ctx.addInitScript(html => {
      const put = () => { const t = document.createElement('template'); t.innerHTML = html; for (const n of [...t.content.childNodes]) { if (n.nodeName === 'SCRIPT') { const s = document.createElement('script'); s.dataset.cand = 1; s.id = n.id; s.textContent = n.textContent; document.head.appendChild(s); } else document.head.appendChild(n); } };
      if (document.head) put(); else document.addEventListener('DOMContentLoaded', put, { once: true });
    }, CAND);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
    await page.goto(`https://www.gatorbaitmedia.com/post/${slug}?s3qa=${Date.now()}`, { waitUntil: 'load', timeout: 90000 });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } scrollTo(0, 0); });
    await page.waitForTimeout(6500);
    const r = await page.evaluate(() => {
      const q = s => document.querySelector(s), cs = e => getComputedStyle(e);
      const rgb = s => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const lum = c => { const v = c.map(x => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
      const bgOf = e => { for (let a = e; a; a = a.parentElement) { const s = cs(a); if (s.backgroundImage !== 'none' && /gradient/.test(s.backgroundImage)) { const m = s.backgroundImage.match(/rgba?\([^)]+\)/g); if (m) return rgb(m[m.length - 1]); } const c = s.backgroundColor, al = /rgba/.test(c) ? +(c.match(/[\d.]+/g)[3]) : 1; if (al >= .5) return rgb(c); } return [255, 255, 255]; };
      const out = { docW: document.documentElement.scrollWidth, vw: innerWidth, problems: [], notes: [] };
      const P = msg => out.problems.push(msg);
      const shell = !!q('#gbm-broadcast-network-shell-v1');
      const S = msg => (shell ? out.notes : out.problems).push(msg + (shell ? ' (theme shell override)' : ''));
      if (out.docW > innerWidth) P(`horizontal scroll ${out.docW} > ${innerWidth}`);
      if (!q('#gbm-post-broadcast')) P('skin style missing');
      const hdr = q('[data-hook=post-page] article[data-hook=post]>div>header');
      const h1 = q('[data-hook=post-page] h1[data-hook=post-title]');
      if (h1) {
        const s = cs(h1); out.title = [s.fontSize, s.fontStyle, s.textTransform, s.color];
        if (h1.scrollWidth > h1.clientWidth + 1) P('headline clipped');
        if (s.fontStyle !== 'italic' || s.textTransform !== 'uppercase' || !/Barlow Condensed/.test(s.fontFamily)) S('headline not Broadcast type');
        const cr = ratio(rgb(s.color), bgOf(hdr)); if (cr < 4.5) P(`headline contrast ${cr.toFixed(2)}`);
        if (h1.getBoundingClientRect().left < 12) P('headline touches the screen edge');
      } else P('no headline');
      // Contrast of every visible text node in the story header and the first 40 body paragraphs.
      const texts = [...(hdr ? hdr.querySelectorAll('*') : []), ...[...document.querySelectorAll('[data-hook=post-description] p')].slice(0, 40)];
      let low = 0;
      for (const e of texts) {
        if (!e.offsetParent || ![...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim())) continue;
        const s = cs(e); if (s.visibility === 'hidden' || +s.opacity === 0) continue;
        const cr = ratio(rgb(s.color), bgOf(e)); const big = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && +s.fontWeight >= 700);
        if (cr < (big ? 3 : 4.5)) { low++; if (low < 4) P(`low contrast ${cr.toFixed(2)} "${e.textContent.trim().slice(0, 30)}"`); }
      }
      // Barlow only in the story header and body text.
      const fam = new Set(); for (const e of texts) if (e.offsetParent && [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim())) fam.add(cs(e).fontFamily.split(',')[0].replace(/"/g, '').trim());
      out.fonts = [...fam]; for (const f of fam) if (!/^Barlow/.test(f)) P(`non-Barlow font ${f}`);
      const body = [...document.querySelectorAll('[data-hook=post-description] p')].find(p => p.textContent.trim().length > 120 && !p.closest('[data-gbm-capture],[data-gbm-stat]') && !p.matches('[data-gbm-lede],[data-gbm-dek]'));
      if (body) { const s = cs(body), fs = parseFloat(s.fontSize), lh = parseFloat(s.lineHeight) / fs; out.body = [fs, +lh.toFixed(2)]; if (fs < 17 || fs > 19) P(`body ${fs}px`); if (Math.abs(lh - 1.6) > .02) P(`body line-height ${lh.toFixed(2)}`); }
      for (const e of document.querySelectorAll('#gbm-share-btn, nav.gbm-kit .gbm-kit-chip, [data-hook=post-footer] [data-hook^=share-button], .gbm-upnext')) {
        const b = e.getBoundingClientRect(); if (b.width && (b.height < 43.5 || b.width < 43.5)) P(`tap target ${Math.round(b.width)}x${Math.round(b.height)} ${e.id || e.className || e.getAttribute('data-hook')}`);
      }
      const sub = q('[data-hook=post-description] :is(h2,h3)[id^=viewer-], [data-hook=post-description] p[data-gbm-h]');
      if (sub) { const s = cs(sub); out.subhead = /gradient/.test(s.backgroundImage) && s.fontStyle === 'italic'; if (!out.subhead) S('subhead without rail'); }
      const lead = q('[data-gbm-lead]'); out.lead = !!lead;
      if (document.querySelectorAll('#gbm-post-broadcast').length !== 1) P('skin style count ' + document.querySelectorAll('#gbm-post-broadcast').length);
      // Pull-quote probe (client-side only).
      const d = q('[data-hook=post-description]');
      if (d) { const bq = document.createElement('blockquote'); bq.textContent = 'Pull-quote probe'; d.appendChild(bq); const s = cs(bq); out.quote = [s.backgroundImage.slice(0, 20), s.color, s.fontStyle]; if (ratio(rgb(s.color), [10, 26, 107]) < 4.5 || s.fontStyle !== 'italic') S('pull quote style'); bq.remove(); }
      if (document.querySelector('[data-hook=premium-paywall], [data-hook*=paywall]')) out.paywall = true;
      out.upnext = !!q('.gbm-upnext');
      return out;
    });
    // Chronology: Wix's Related Posts widget (pinned posts first) is hidden; Keep Reading shows the newest stories in order.
    r.related = await page.evaluate(async () => {
      await new Promise(res => setTimeout(res, 1500));
      const x = await (await fetch('/blog-feed.xml?t=' + Date.now())).text();
      const dates = {};
      new DOMParser().parseFromString(x, 'text/xml').querySelectorAll('item').forEach(n => { dates[n.querySelector('link').textContent.trim().replace(/^https?:..[^/]+/, '').replace(/[/]+$/, '')] = Date.parse(n.querySelector('pubDate').textContent); });
      const rp = document.querySelector('[data-hook=post-page] [data-hook=recent-posts]');
      const kr = document.getElementById('gbm-kr');
      const krLinks = kr ? [...kr.querySelectorAll('a[href*="/post/"]')].map(a => new URL(a.href).pathname.replace(/[/]+$/, '')) : [];
      const t = krLinks.map(p => dates[p] || 0);
      return { widgetHidden: !rp || !rp.getClientRects().length, kr: !!(kr && kr.getClientRects().length), n: krLinks.length, ok: t.every((v, i) => v && (i === 0 || t[i - 1] >= v)), order: krLinks.map(p => p.split('/').pop().slice(0, 28)) };
    });
    if (!r.related.widgetHidden) r.problems.push('Related Posts widget still visible');
    if (!r.related.kr || r.related.n < 2) r.problems.push('Keep Reading not visible');
    else if (!r.related.ok) r.problems.push('Keep Reading not newest first: ' + r.related.order.join(' > '));
    await page.addStyleTag({ content: '[data-gbm-capture=slide],[data-gbm-capture="bar"],.gbm-cap-slide,#gbm-capture-slide{display:none!important}' });
    const shot = path.join(OUT, `${kind}-${w}.jpg`);
    await page.screenshot({ path: shot, type: 'jpeg', quality: 70, clip: { x: 0, y: 0, width: w, height: Math.min(w < 768 ? 1500 : 1300, await page.evaluate(() => document.documentElement.scrollHeight)) } });
    r.errors = errors;
    if (errors.length) r.problems.push(...errors.map(e => 'page error ' + e));
    results.push({ kind, w, ...r });
    fails += r.problems.length;
    console.log(`${r.problems.length ? 'FAIL' : 'pass'} ${kind} ${w}: title ${r.title?.[0]} body ${r.body} lead ${r.lead} subhead ${r.subhead ?? '-'} upnext ${r.upnext} keep-reading ${r.related.n}${r.related.ok ? ' newest-first' : ' OUT OF ORDER'} ${r.problems.join('; ')}${r.notes && r.notes.length ? ' | notes: ' + r.notes.join('; ') : ''}`);
    await ctx.close();
  }
}
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
await browser.close();
console.log(fails ? `${fails} problem(s)` : 'all checks pass');
process.exit(fails ? 1 : 0);
