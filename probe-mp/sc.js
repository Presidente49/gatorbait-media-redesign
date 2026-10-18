const { chromium } = require('playwright');
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
async function run(b, label, ctxOpts) {
  const c = await b.newContext(ctxOpts); const p = await c.newPage();
  const reqs = [];
  p.on('request', r => { if (/jsdelivr|github\.io/.test(r.url())) reqs.push(r.url().slice(0, 150)); });
  p.on('requestfailed', r => { if (/jsdelivr|github\.io/.test(r.url())) reqs.push('FAIL ' + r.url().slice(0, 120)); });
  await p.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'load' });
  for (const t of [300, 2500, 12000]) {
    await p.waitForTimeout(t === 300 ? 300 : t === 2500 ? 2200 : 9500);
    const d = await p.evaluate(() => {
      const sel = n => { const o = []; while (n && n.nodeType === 1 && o.length < 5) { o.unshift(n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : '')); n = n.parentElement; } return o.join(' > '); };
      const vis = n => { const e = n.parentElement; if (!e) return false; const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0' && !e.closest('[hidden]'); };
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const hits = []; let n;
      while ((n = w.nextNode())) if (/South Carolina/i.test(n.nodeValue) && !/^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement.tagName)) { const r = n.parentElement.getBoundingClientRect(); hits.push({ vis: vis(n), y: Math.round(r.top + scrollY), text: n.nodeValue.trim().replace(/\s+/g, ' ').slice(0, 140), anc: sel(n.parentElement) }); }
      const attrs = [...document.querySelectorAll('[alt],[title],[aria-label],meta[content],a[href]')].filter(e => /South Carolina|south-carolina/i.test((e.getAttribute('alt') || '') + (e.title || '') + (e.getAttribute('aria-label') || '') + (e.getAttribute('content') || '') + (e.getAttribute('href') || ''))).slice(0, 15).map(e => e.tagName + ' ' + (e.getAttribute('href') || e.getAttribute('alt') || e.getAttribute('content') || '').slice(0, 100));
      const card = document.querySelector('.bc-nx'); const sr = document.querySelector('.sh-reference');
      return { hits, attrs, card: card ? card.innerText.replace(/\s+/g, ' ').slice(0, 300) : 'NO .bc-nx', ref: sr ? sr.innerText.replace(/\s+/g, ' ') + ' | vis ' + (sr.getBoundingClientRect().height > 0) : 'NO .sh-reference', bodyLen: document.body.innerText.length, ld: [...document.querySelectorAll('script[type="application/ld+json"]')].filter(s => /South Carolina/.test(s.textContent)).length };
    });
    console.log(`\n=== ${label} @t${t}`); console.log(JSON.stringify(d, null, 1));
  }
  console.log('REQS', label, JSON.stringify(reqs, null, 1));
  const html = await p.content(); console.log('RAW_HTML_SC_COUNT', label, (html.match(/South Carolina/g) || []).length);
  await p.screenshot({ path: label + '.png', fullPage: true }); await c.close();
}
(async () => {
  const b = await chromium.launch();
  console.log('PROBE_AT', new Date().toISOString());
  await run(b, 'iphone', { viewport: { width: 390, height: 844 }, userAgent: UA, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await run(b, 'desktop', { viewport: { width: 1366, height: 900 } });
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA, isMobile: true });
  await c.route(/jsdelivr|github\.io/, r => r.abort()); const p = await c.newPage();
  await p.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'load' }); await p.waitForTimeout(8000);
  console.log('\n=== iphone, jsdelivr+github.io BLOCKED');
  console.log(JSON.stringify(await p.evaluate(() => { const o = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (/South Carolina/i.test(n.nodeValue) && n.parentElement.tagName !== 'SCRIPT' && n.parentElement.tagName !== 'STYLE') o.push(n.nodeValue.trim().slice(0, 120) + ' @' + n.parentElement.className + ' h=' + n.parentElement.getBoundingClientRect().height); return o; }), null, 1));
  await b.close();
})();
