const { chromium } = require('playwright');
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
async function audit(url, ctxOpts, label) {
  const b = await chromium.launch();
  const c = await b.newContext(ctxOpts); const p = await c.newPage();
  const reqs = [];
  p.on('request', r => { const u = r.url(); if (/jsdelivr|github\.io|raw\.githubusercontent|usrfiles|filesusr/.test(u) && /\.(js|css)(\?|$)/.test(u)) reqs.push(u.slice(0, 150)); });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(5000);
  const info = await p.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0 ? Math.round(r.width) + 'x' + Math.round(r.height) : 'hidden'; };
    const ids = [...document.querySelectorAll('[id^="gbm"],[id^="GBM"],[class*="gbm-"],[class^="fp-"],[class*=" fp-"],[id^="fp"],[class*="gz-"],[id*="gazette"],[class*="gazette"],[class*="bc-"]')].map(e => e.tagName.toLowerCase() + '#' + (e.id || '') + '.' + String(e.className || '').split(/\s+/).slice(0, 3).join('.') + ' ' + vis(e)).slice(0, 80);
    const styles = [...document.querySelectorAll('style[id],script[id],link[id]')].filter(e => /gbm|gz|fp|bc|home|mag|post|site/i.test(e.id)).map(e => e.tagName.toLowerCase() + '#' + e.id + ' len=' + (e.textContent || '').length);
    const roots = [...document.body.children].map(e => e.tagName.toLowerCase() + '#' + (e.id || '') + ' ' + vis(e)).slice(0, 30);
    const h1s = [...document.querySelectorAll('h1')].map(e => (e.textContent || '').trim().slice(0, 60) + ' ' + vis(e));
    const fonts = [...new Set([...document.querySelectorAll('h1,h2,p,a,button')].slice(0, 300).map(e => getComputedStyle(e).fontFamily.split(',')[0].trim()))];
    const txt = document.body.innerText;
    const marks = ['Up next', 'Gazette', 'Swamp Night', 'Game Day', 'Message Board', 'South Carolina', 'Soothsayer', 'LIVE', 'FINAL'].map(k => k + ':' + (txt.split(k).length - 1));
    return { ids, styles, roots, h1s, fonts, marks, h: document.body.scrollHeight };
  });
  console.log('=== ' + label + ' ' + url); console.log(JSON.stringify(info, null, 1)); console.log('EXTERNAL_ASSETS', JSON.stringify([...new Set(reqs)], null, 1));
  await b.close();
}
(async () => {
  await audit('https://www.gatorbaitmedia.com/?a=' + Date.now(), { viewport: { width: 1280, height: 900 } }, 'HOME-1280');
  await audit('https://www.gatorbaitmedia.com/?a=' + Date.now(), { viewport: { width: 390, height: 844 }, userAgent: UA, isMobile: true, hasTouch: true }, 'HOME-390');
  await audit('https://www.gatorbaitmedia.com/post/the-gators-sucked-less-turning-arch-madness-into-arch-sadness', { viewport: { width: 1280, height: 900 } }, 'POST-1280');
  await audit('https://www.gatorbaitmedia.com/gatorbait-media-blogs', { viewport: { width: 1280, height: 900 } }, 'LATEST-1280');
  await audit('https://www.gatorbaitmedia.com/magazine', { viewport: { width: 1280, height: 900 } }, 'MAGAZINE-1280');
})();
