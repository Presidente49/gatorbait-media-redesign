// READ-ONLY: orange-background controls (selector + label contrast) and off-palette accent colors (orange/blue family) per page.
const { chromium } = require('playwright'); const fs = require('fs'); fs.mkdirSync('shots', { recursive: true });
const PAGES = [['post', '/post/longhorns-tumble-gators-return-florida-is-no-20-in-the-ap-poll'], ['magazine', '/magazine'], ['contact', '/contact'], ['pricing', '/pricing-plans'], ['allnews', '/gatorbait-media-blogs'], ['about', '/about'], ['home', '/']];
const EV = () => {
  const rgb = s => { const m = String(s).match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
  const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
  const cr = (a, b) => { const x = lum(a), y = lum(b); return +((Math.max(x, y) + .05) / (Math.min(x, y) + .05)).toFixed(2); };
  const hsl = c => { const [r, g, b] = c.map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } const l = (mx + mn) / 2, s = d ? d / (1 - Math.abs(2 * l - 1)) : 0; return [h, s, l]; };
  const path = el => { const out = []; for (let n = el; n && n !== document.body && out.length < 4; n = n.parentElement) out.push(n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (typeof n.className === 'string' && n.className.trim() ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + (n.getAttribute('data-hook') ? '[' + n.getAttribute('data-hook') + ']' : '')); return out.join(' < '); };
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const orange = [], accents = {};
  for (const el of document.body.querySelectorAll('*')) {
    if (!vis(el)) continue; const cs = getComputedStyle(el); const bg = rgb(cs.backgroundColor);
    if (bg && bg[3] > .5 && hex(bg) === '#FA4616' && (el.textContent || '').trim() && (el.textContent || '').trim().length < 40) { const col = rgb(cs.color); orange.push({ p: path(el), t: el.textContent.trim().slice(0, 24), col: hex(col), ratio: cr(col, bg), fs: cs.fontSize, fw: cs.fontWeight }); }
    for (const prop of ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor']) { const c = rgb(cs[prop]); if (!c || c[3] < .3) continue; if (prop.startsWith('border') && (parseFloat(cs[prop.replace('Color', 'Width')]) || 0) < 1) continue; const [h, s, l] = hsl(c); const H = hex(c); if (H === '#FA4616' || H === '#0021A5' || H === '#002657' || H === '#22884C') continue; const fam = (h >= 5 && h <= 28 && s > .55 && l > .25 && l < .8) ? 'orange' : (h >= 215 && h <= 240 && s > .7 && l > .2 && l < .75) ? 'blue' : null; if (!fam) continue; const k = fam + ' ' + H + ' ' + prop; (accents[k] = accents[k] || { n: 0, ex: path(el).slice(0, 80) }).n++; }
  }
  return { orange: orange.slice(0, 14), accents: Object.entries(accents).sort((a, b) => b[1].n - a[1].n).slice(0, 18).map(([k, v]) => k + ' x' + v.n + ' ' + v.ex) };
};
(async () => { const browser = await chromium.launch(); const out = [];
  for (const w of [1366, 390]) for (const [name, path] of PAGES) { const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500, hasTouch: w < 500 }); const page = await ctx.newPage(); const r = { page: name, w };
    try { await page.goto('https://www.gatorbaitmedia.com' + path + '?gbm_qc=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(6500); await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(s => setTimeout(s, 120)); } scrollTo(0, 0); }); await page.waitForTimeout(800); r.ev = await page.evaluate(EV); } catch (e) { r.err = String(e.message).slice(0, 100); }
    out.push(r); console.log('### AC ' + JSON.stringify(r).slice(0, 3500)); await ctx.close(); }
  fs.writeFileSync('shots/audit.json', JSON.stringify(out, null, 1)); await browser.close(); })();
