const { chromium } = require('playwright');
const fs = require('fs');
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
(async () => {
  const b = await chromium.launch();
  // 1) render the local logo stub (not the live site)
  const c1 = await b.newContext({ viewport: { width: 390, height: 300 }, deviceScaleFactor: 2 });
  const p1 = await c1.newPage();
  await p1.goto('file://' + process.cwd() + '/logo-stub.html', { waitUntil: 'networkidle' });
  await p1.evaluate(() => document.fonts.ready); await p1.waitForTimeout(800);
  await p1.screenshot({ path: 'logo.png', clip: { x: 0, y: 0, width: 390, height: 230 } });
  const png = fs.readFileSync('logo.png');
  console.log('LOGO_PNG_BYTES', png.length);
  console.log('LOGO_B64_START\n' + png.toString('base64') + '\nLOGO_B64_END');
  console.log('FONTS', JSON.stringify(await p1.evaluate(() => [...document.fonts].map(f => f.family + ' ' + f.style + ' ' + f.weight + ' ' + f.status))));
  // 2) who requests the big images on the live homepage (initiator), phone, plain URL
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await c.newPage(); const cdp = await c.newCDPSession(p); await cdp.send('Network.enable');
  const init = {}; const size = {};
  cdp.on('Network.requestWillBeSent', e => { if (e.type === 'Image') init[e.requestId] = { url: e.request.url, t: e.initiator.type, stack: (e.initiator.stack && e.initiator.stack.callFrames || []).slice(0, 3).map(f => (f.functionName || '?') + '@' + f.url.slice(0, 90) + ':' + f.lineNumber), from: (e.initiator.url || '').slice(0, 100) }; });
  cdp.on('Network.loadingFinished', e => { size[e.requestId] = e.encodedDataLength; });
  await p.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(4000);
  console.log('BIG_IMAGES (initiator)');
  Object.entries(init).map(([id, v]) => ({ ...v, sz: size[id] || 0 })).sort((a, b) => b.sz - a.sz).slice(0, 12).forEach(v => console.log(v.sz, v.url.slice(0, 130), '|', v.t, v.from, JSON.stringify(v.stack)));
  const where = await p.evaluate(() => { const out = []; for (const el of document.querySelectorAll('img,source,link[rel=preload],[style*="background-image"]')) { const s = el.currentSrc || el.src || el.href || el.getAttribute('style') || ''; if (/d3cfa5_886c22d|d3cfa5_8e8e9000|d3cfa5_087caa7b/.test(s + (el.srcset || ''))) out.push(el.tagName + ' ' + (el.className || '') + ' parent=' + (el.parentElement && el.parentElement.className) + ' ' + s.slice(0, 120)); } return out; });
  console.log('DOM_REFS_TO_BIG_IMAGES', JSON.stringify(where));
  await b.close();
})();
