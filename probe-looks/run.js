const { chromium } = require('playwright');
async function check(w, mobile) {
  const b = await chromium.launch();
  const c = await b.newContext(mobile ? { viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: w, height: 900 } });
  const p = await c.newPage(); const errs = [], bad = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  p.on('response', r => { if (r.status() >= 400 && /gatorbaitmedia|wixstatic|jsdelivr|usrfiles/.test(r.url())) bad.push(r.status() + ' ' + r.url().slice(0, 120)); });
  await p.goto('https://www.gatorbaitmedia.com/magazine?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(6000);
  for (let y = 0; y < 30000; y += 900) { await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(120); }
  const r = await p.evaluate(() => {
    const pg = document.querySelector('#gbm-magazine-page');
    const dl = [...document.querySelectorAll('a')].find(a => /Download the full magazine/i.test(a.textContent || ''));
    const imgs = [...document.images].filter(i => pg && pg.contains(i));
    return {
      issue: pg && pg.getAttribute('data-issue'), h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().slice(0, 90)),
      dl: dl ? { href: dl.getAttribute('href'), download: dl.hasAttribute('download'), h: Math.round(dl.getBoundingClientRect().height) } : null,
      imgs: imgs.length, brokenImgs: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(-50)),
      uaa: !![...document.querySelectorAll('a')].find(a => a.getAttribute('href') === 'https://floridagators.com'),
      hannah: !![...document.querySelectorAll('a')].find(a => /hannahmorganphoto/.test(a.getAttribute('href') || '')),
      georgiaRank: /(No\. ?1|#1|top-ranked|6-0)[^.]{0,20}Georgia|Georgia[^.]{0,20}(No\. ?1|6-0)/i.test(pg ? pg.textContent : ''),
      sections: pg ? [...pg.querySelectorAll('h2')].map(h => h.textContent.trim().slice(0, 40)) : [],
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      pageHeight: document.documentElement.scrollHeight
    };
  });
  console.log('### /magazine @' + w + ' ' + JSON.stringify({ errs, bad: bad.slice(0, 5) }));
  console.log('  ' + JSON.stringify(r));
  await b.close();
}
(async () => { await check(1280, false); await check(390, true); await check(320, true); })();
