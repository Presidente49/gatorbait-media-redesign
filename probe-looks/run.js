const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  const p = await c.newPage();
  await p.goto('https://www.gatorbaitmedia.com/magazine?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(6000);
  for (const y of [1500, 4200, 7000]) {
    await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(700);
    const r = await p.evaluate(() => {
      const bar = document.querySelector('.pm-readerbar');
      const rc = bar && bar.getBoundingClientRect();
      const stack = []; for (let yy = 0; yy <= 80; yy += 8) { const e = document.elementsFromPoint(195, yy).slice(0, 3).map(n => n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.className && n.className.baseVal === undefined ? '.' + String(n.className).split(' ').slice(0, 2).join('.') : '')); stack.push(yy + ':' + e.join(' < ')); }
      const cs = bar && getComputedStyle(bar);
      const ancestors = []; for (let e = bar && bar.parentElement; e && ancestors.length < 8; e = e.parentElement) { const s = getComputedStyle(e); ancestors.push(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + ' ov=' + s.overflow + '/' + s.overflowY + ' pos=' + s.position + ' tf=' + s.transform.slice(0, 20) + ' ct=' + s.contain + ' h=' + Math.round(e.getBoundingClientRect().height)); }
      return { scrollY: window.scrollY, innerH: window.innerHeight, bar: rc && { top: Math.round(rc.top * 10) / 10, h: Math.round(rc.height), pos: cs.position, topCss: cs.top, shadow: cs.boxShadow, transition: cs.transition.slice(0, 60), willChange: cs.willChange }, stack, ancestors };
    });
    console.log('### scroll ' + y + ' ' + JSON.stringify(r));
  }
  await b.close();
})();
