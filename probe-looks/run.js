// Read-only live probe: does #pm-download / .pm-dl-btn exist and show at the bottom of /magazine? Cache-busting URL, no UA override.
const { chromium } = require('playwright');
const fs = require('fs');
fs.mkdirSync('shots', { recursive: true });
const views = [
  { name: '390', w: 390, h: 844, dpr: 1, mobile: true },
  { name: '1366', w: 1366, h: 900, dpr: 1, mobile: false },
];
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const v of views) {
    const r = { width: v.name };
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: v.dpr, isMobile: v.mobile, hasTouch: v.mobile });
        const page = await ctx.newPage();
        const resp = await page.goto('https://www.gatorbaitmedia.com/magazine?gbm_qc=' + Date.now() + v.name, { waitUntil: 'domcontentloaded', timeout: 90000 });
        r.http = resp.status();
        if (r.http >= 500) { await ctx.close(); r.attempt = attempt; await new Promise(s => setTimeout(s, 4000)); continue; }
        const html = await resp.text();
        r.htmlHasPmDownload = /id=["']pm-download["']/.test(html); r.htmlHasDlBtn = /pm-dl-btn/.test(html);
        await page.waitForSelector('#gbm-magazine-page', { timeout: 60000 });
        await page.waitForTimeout(4000);
        await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(s => setTimeout(s, 150)); } window.scrollTo(0, document.documentElement.scrollHeight); });
        await page.waitForTimeout(3000);
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(1000);
        r.info = await page.evaluate(() => {
          const d = document.documentElement;
          const desc = el => el ? { tag: el.tagName.toLowerCase(), id: el.id || '', cls: String(el.className || '').slice(0, 80) } : null;
          const rectOf = el => { const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y + scrollY), w: Math.round(b.width), h: Math.round(b.height), viewportY: Math.round(b.y) }; };
          const info = (el) => {
            if (!el) return null;
            const cs = getComputedStyle(el), b = el.getBoundingClientRect();
            const o = { desc: desc(el), text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160), href: el.getAttribute('href'), download: el.hasAttribute('download'), rect: rectOf(el),
              display: cs.display, visibility: cs.visibility, opacity: cs.opacity, color: cs.color, bg: cs.backgroundColor, fontSize: cs.fontSize };
            const clips = []; for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const s = getComputedStyle(p); if (/hidden|clip|scroll|auto/.test(s.overflow + s.overflowX + s.overflowY)) { const pb = p.getBoundingClientRect(); if (b.left < pb.left - 1 || b.right > pb.right + 1 || b.top < pb.top - 1 || b.bottom > pb.bottom + 1) clips.push({ el: desc(p), pr: [Math.round(pb.left), Math.round(pb.top), Math.round(pb.right), Math.round(pb.bottom)] }); } if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') clips.push({ hiddenAncestor: desc(p), display: s.display, vis: s.visibility, op: s.opacity }); }
            o.clippedOrHiddenBy = clips;
            el.scrollIntoView({ block: 'center' });
            const bb = el.getBoundingClientRect(); const cx = bb.left + bb.width / 2, cy = bb.top + bb.height / 2;
            const top = document.elementFromPoint(cx, cy);
            o.inViewportAfterScroll = bb.top >= 0 && bb.bottom <= innerHeight && bb.left >= 0 && bb.right <= innerWidth;
            o.topElementAtCenter = desc(top); o.notCovered = !!top && (top === el || el.contains(top) || top.contains(el));
            o.overlapsFixed = [...document.querySelectorAll('*')].filter(x => { const s = getComputedStyle(x); if (s.position !== 'fixed' && s.position !== 'sticky') return false; const xb = x.getBoundingClientRect(); return xb.width > 0 && xb.height > 0 && xb.left < bb.right && xb.right > bb.left && xb.top < bb.bottom && xb.bottom > bb.top && !x.contains(el) && !el.contains(x); }).slice(0, 5).map(x => ({ el: desc(x), rect: [Math.round(x.getBoundingClientRect().left), Math.round(x.getBoundingClientRect().top), Math.round(x.getBoundingClientRect().width), Math.round(x.getBoundingClientRect().height)] }));
            return o;
          };
          const sec = document.querySelector('#pm-download'), btn = document.querySelector('.pm-dl-btn');
          const out = { pmDownloadCount: document.querySelectorAll('#pm-download').length, pmDlBtnCount: document.querySelectorAll('.pm-dl-btn').length, pmDownload: info(sec), pmDlBtn: info(btn),
            pageHeight: d.scrollHeight, scrollW: d.scrollWidth, clientW: d.clientWidth };
          window.scrollTo(0, d.scrollHeight);
          const root = document.getElementById('gbm-magazine-page');
          out.pageRootChildrenLast3 = root ? [...root.children].slice(-3).map(c => ({ desc: desc(c), text: (c.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90), rect: rectOf(c) })) : null;
          out.lastSections3 = [...document.querySelectorAll('section')].slice(-3).map(c => ({ desc: desc(c), text: (c.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90), rect: rectOf(c) }));
          out.allIdsInRoot = root ? [...root.children].map(c => (c.id || c.tagName.toLowerCase() + '.' + String(c.className).slice(0, 20))) : null;
          return out;
        });
        const H = r.info.pageHeight, hh = Math.min(1400, H);
        await page.screenshot({ path: 'shots/mag-bottom-' + v.name + '.png', fullPage: true, clip: { x: 0, y: H - hh, width: v.w, height: hh } });
        r.shot = 'shots/mag-bottom-' + v.name + '.png'; r.attempt = attempt;
        await ctx.close();
        break;
      } catch (e) { r.error = String(e.message || e).slice(0, 300); r.attempt = attempt; }
    }
    results.push(r);
    console.log('### /magazine bottom @' + v.name + ' ' + JSON.stringify(r));
  }
  await browser.close();
  fs.writeFileSync('shots/bottom-check.json', JSON.stringify(results, null, 1));
  console.log('DONE ' + results.map(x => x.width + ':' + (x.shot ? 'shot' : 'noshot')).join(' '));
})();
