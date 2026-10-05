// Fixture test for the post template (embed 14a887e3): renders fixture.html as https://www.gatorbaitmedia.com/post/...
// with live-before.html and with proposed.html at 320/390/430/1366, runs the live Share + Story Kit + signup bundle
// (sports-live/share.js at the live pointer 3143027, read from git) against the repo's scoreboard.json, and checks:
// no mid-article signup card, a compact end card with light text on blue, light text in the stat boxes, an editorial
// Barlow headline and no sideways scroll. Screenshots land in deploy/post-template/shots/.
// Run from the repo root:  NODE_PATH=$(npm root -g) node deploy/post-template/test.mjs
// (Chromium from PLAYWRIGHT_BROWSERS_PATH, /opt/pw-browsers here.)
import { readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');
const POINTER = '314302704a8c4209db3d064071ae319dfda61157';
const shareJs = execFileSync('git', ['-C', repo, 'show', `${POINTER}:sports-live/share.js`], { encoding: 'utf8' });
const scoreboard = readFileSync(join(repo, 'sports-live/scoreboard.json'), 'utf8');
const fixture = readFileSync(join(here, 'fixture.html'), 'utf8');
const variants = { before: readFileSync(join(here, 'live-before.html'), 'utf8'), after: readFileSync(join(here, 'proposed.html'), 'utf8') };
const WIDTHS = [320, 390, 430, 1366];
const PATH = '/post/hey-missouri-don-t-show-me-anymore';
const out = join(here, 'shots');
mkdirSync(out, { recursive: true });

const lum = (rgb) => { const c = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const browser = await chromium.launch();
const results = [];
let failures = 0;
for (const [name, embed] of Object.entries(variants)) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, deviceScaleFactor: w < 800 ? 2 : 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
    await page.route('**/*', (route) => {
      const u = new URL(route.request().url());
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === PATH) return route.fulfill({ contentType: 'text/html', body: fixture.replace('<!--TEMPLATE-->', embed) });
      if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/_qa/share.js') return route.fulfill({ contentType: 'text/javascript', body: shareJs });
      if (u.hostname === 'presidente49.github.io' && u.pathname.endsWith('/sports-live/scoreboard.json')) return route.fulfill({ contentType: 'application/json', body: scoreboard });
      if (/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) return route.continue();
      return route.fulfill({ status: 404, body: '' });
    });
    await page.goto('https://www.gatorbaitmedia.com' + PATH, { waitUntil: 'load' });
    await page.waitForSelector('[data-gbm-capture="story-end"]', { timeout: 10000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
    const m = await page.evaluate(() => {
      const cs = (el, p) => (el ? getComputedStyle(el, p) : null);
      const box = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { y: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width) }; };
      const title = document.querySelector('[data-hook=post-title]'), header = document.querySelector('[data-hook=post]>div>header');
      const kick = cs(header, '::before');
      const inline = document.querySelector('[data-gbm-capture="story-inline"]'), end = document.querySelector('[data-gbm-capture="story-end"]');
      const texts = (card) => card ? [...card.querySelectorAll('.gbc-k,.gbc-h,.gbc-v,.gbc-c span,.gbc-p')].filter((n) => cs(n).display !== 'none' && n.getBoundingClientRect().height > 0).map((n) => ({ cls: n.className, color: cs(n).color, size: cs(n).fontSize })) : [];
      const stat = document.querySelector('[data-gbm-stat] p');
      return {
        title: { family: cs(title).fontFamily, size: cs(title).fontSize, weight: cs(title).fontWeight, transform: cs(title).textTransform, color: cs(title).color },
        kicker: { text: kick.content, bg: kick.backgroundColor, color: kick.color, display: kick.display },
        inline: inline ? { display: cs(inline).display, ...box(inline), texts: texts(inline) } : null,
        end: end ? { bg: cs(end).backgroundColor, ...box(end), texts: texts(end) } : null,
        stat: stat ? { color: cs(stat).color, bg: cs(stat.closest('[data-gbm-stat]')).backgroundColor } : null,
        lastChip: (document.querySelector('.gbm-kit-chip.last') || {}).textContent || null,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    const checks = [];
    const ok = (cond, label) => checks.push({ pass: !!cond, label });
    ok(!m.inline || m.inline.display === 'none' || m.inline.h === 0, 'no mid-article signup card');
    for (const t of [...(m.end ? m.end.texts : []), ...((m.inline && m.inline.display !== 'none') ? m.inline.texts : [])]) ok(contrast(t.color, 'rgb(0, 33, 165)') >= 4.5, `signup text ${t.cls} ${t.color} on blue >= 4.5:1`);
    if (w <= 430) ok(m.end && m.end.h <= 230, `end card compact on phones (${m.end && m.end.h}px <= 230)`);
    if (m.stat) ok(contrast(m.stat.color, m.stat.bg) >= 4.5, `stat box text ${m.stat.color} on ${m.stat.bg} >= 4.5:1`);
    ok(/Barlow/.test(m.title.family) && m.title.transform === 'none' && Number(m.title.weight) >= 700, 'headline Barlow, not uppercase, bold');
    ok(contrast(m.kicker.color, m.kicker.bg === 'rgba(0, 0, 0, 0)' ? 'rgb(255, 255, 255)' : m.kicker.bg) >= 4.5, 'kicker readable');
    ok(m.overflow <= 0, `no sideways scroll (${m.overflow})`);
    const failed = checks.filter((c) => !c.pass);
    if (name === 'after') failures += failed.length;
    results.push({ variant: name, width: w, errors, metrics: m, failed: failed.map((c) => c.label) });
    await page.screenshot({ path: join(out, `${name}-${w}-top.jpg`), type: 'jpeg', quality: 72 });
    const card = await page.$(m.inline && m.inline.display !== 'none' ? '[data-gbm-capture="story-inline"]' : '[data-gbm-capture="story-end"]');
    await card.scrollIntoViewIfNeeded();
    await page.evaluate(() => scrollBy(0, -140));
    await page.waitForTimeout(150);
    await page.screenshot({ path: join(out, `${name}-${w}-signup.jpg`), type: 'jpeg', quality: 72 });
    const stats = await page.$('[data-gbm-stat-head]');
    if (stats) { await stats.scrollIntoViewIfNeeded(); await page.evaluate(() => scrollBy(0, -60)); await page.waitForTimeout(100); await page.screenshot({ path: join(out, `${name}-${w}-stats.jpg`), type: 'jpeg', quality: 72 }); }
    await ctx.close();
  }
}
await browser.close();
for (const r of results) console.log(`${r.variant.padEnd(6)} ${String(r.width).padStart(4)}  title ${r.metrics.title.size}/${r.metrics.title.weight}  end card ${r.metrics.end && r.metrics.end.h}px  inline ${r.metrics.inline ? (r.metrics.inline.display === 'none' ? 'hidden' : r.metrics.inline.h + 'px') : 'none'}  last chip "${r.metrics.lastChip}"  ${r.failed.length ? 'FAIL: ' + r.failed.join('; ') : 'pass'}${r.errors.length ? '  errors: ' + r.errors.join(' | ') : ''}`);
console.log(failures ? `\n${failures} check(s) failed on the proposed template` : '\nProposed template: all checks pass');
process.exit(failures ? 1 : 0);
