const { chromium } = require('playwright');
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mobile/15E148 Safari/604.1';
const PAGES = ['/', '/post/the-gators-sucked-less-turning-arch-madness-into-arch-sadness', '/gatorbait-media-blogs', '/magazine', '/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play', '/pricing-plans'];
async function audit(path, w, mobile) {
  const b = await chromium.launch();
  const c = await b.newContext(mobile ? { viewport: { width: w, height: 844 }, userAgent: UA, isMobile: true, hasTouch: true } : { viewport: { width: w, height: 900 } });
  const p = await c.newPage(); const errs = [], bad = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  p.on('response', r => { if (r.status() >= 400 && /gatorbaitmedia|wixstatic|jsdelivr/.test(r.url())) bad.push(r.status() + ' ' + r.url().slice(0, 110)); });
  await p.goto('https://www.gatorbaitmedia.com' + path + '?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(5000);
  const r = await p.evaluate(() => {
    const lum = (rgb) => { const a = rgb.match(/[\d.]+/g).map(Number); const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(a[0]) + .7152 * f(a[1]) + .0722 * f(a[2]); };
    const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); const m = s.backgroundColor.match(/[\d.]+/g); if (m && (m.length < 4 || +m[3] > .9)) return s.backgroundColor; } return 'rgb(255,255,255)'; };
    const fonts = {}, low = [], tiny = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; let seen = 0;
    while ((n = walker.nextNode()) && seen < 4000) {
      const t = n.textContent.trim(); if (!t) continue; const el = n.parentElement; if (!el || /SCRIPT|STYLE|NOSCRIPT/.test(el.tagName)) continue;
      const rc = el.getBoundingClientRect(); const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || s.display === 'none' || rc.width < 2 || rc.height < 2 || +s.opacity === 0) continue; seen++;
      const fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
      if (!/^Barlow/i.test(fam)) { const k = fam; (fonts[k] = fonts[k] || { n: 0, ex: [] }).n++; if (fonts[k].ex.length < 3) fonts[k].ex.push(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + '.' + String(el.className || '').toString().split(' ')[0] + ' "' + t.slice(0, 28) + '"'); }
      const fg = s.color, bg = bgOf(el); const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05); const big = parseFloat(s.fontSize) >= 24 || (parseFloat(s.fontSize) >= 18.66 && +s.fontWeight >= 700);
      if (ratio < (big ? 3 : 4.5) && low.length < 12) low.push(ratio.toFixed(1) + ' ' + fg + ' on ' + bg + ' ' + el.tagName.toLowerCase() + '.' + String(el.className || '').toString().split(' ')[0] + ' "' + t.slice(0, 30) + '"');
    }
    document.querySelectorAll('a,button').forEach(e => { const rc = e.getBoundingClientRect(); const s = getComputedStyle(e); if (rc.width > 0 && rc.height > 0 && s.visibility !== 'hidden' && (rc.height < 32 || rc.width < 32) && (e.textContent || '').trim() && tiny.length < 6) tiny.push(Math.round(rc.width) + 'x' + Math.round(rc.height) + ' "' + e.textContent.trim().slice(0, 24) + '"'); });
    const imgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).map(i => i.src.slice(-60)).slice(0, 5);
    return { fonts, low, tiny, imgs, overflow: document.documentElement.scrollWidth - window.innerWidth, h1: [...document.querySelectorAll('h1')].filter(h => h.getBoundingClientRect().height > 0).length };
  });
  console.log('### ' + path + ' @' + w + ' ' + JSON.stringify({ overflow: r.overflow, h1: r.h1, errs, bad: bad.slice(0, 4), brokenImgs: r.imgs }));
  console.log('  FONTS ' + JSON.stringify(r.fonts)); console.log('  LOWCONTRAST ' + JSON.stringify(r.low)); console.log('  TINY ' + JSON.stringify(r.tiny));
  await b.close();
}
(async () => { for (const pg of PAGES) { await audit(pg, 1280, false); await audit(pg, 390, true); } })();
// recheck after native font fix 1792334672
