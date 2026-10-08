// Lean front-page proof: serves sports-live/frame.html as https://www.gatorbaitmedia.com/, feeds from the repo,
// stand-in images, blocked fonts/CDN (the container's proxy blocks them anyway). Shoots 390/430/1366 and checks
// the co-lead and rotator rules. Usage: PLAYWRIGHT=<dir> node proof.mjs <repoDir> <shotDir> <label>
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT);
const [repo, shots, label] = process.argv.slice(2);
mkdirSync(shots, { recursive: true });
const frame = readFileSync(repo + '/sports-live/frame.html', 'utf8');
const feed = JSON.parse(readFileSync(repo + '/gazette-live/posts.json', 'utf8'));
const x = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rss = `<?xml version="1.0"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>${feed.posts.map((p) =>
  `<item><title>${x(p.title)}</title><link>${x(p.url)}</link><description>${x(p.excerpt)}</description><dc:creator>${x(p.author)}</dc:creator><pubDate>${new Date(p.firstPublishedDate).toUTCString()}</pubDate>${p.image ? `<enclosure url="${x(p.image.src)}" type="image/jpeg"/>` : ''}</item>`).join('')}</channel></rss>`;
// 1x1 gray PNG stand-in for every image.
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNoaGgAAAMCAYEaRYa4AAAAAElFTkSuQmCC', 'base64');
const local = (p) => { try { return readFileSync(repo + p, 'utf8'); } catch { return null; } };

const b = await chromium.launch();
const out = [];
for (const width of [390, 430, 1366]) {
  const ctx = await b.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 200)));
  await page.route('**/*', (route) => {
    const u = new URL(route.request().url());
    if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/') return route.fulfill({ status: 200, contentType: 'text/html', body: frame });
    if (u.hostname === 'www.gatorbaitmedia.com' && u.pathname === '/blog-feed.xml') return route.fulfill({ contentType: 'application/rss+xml', body: rss });
    if (u.hostname === 'presidente49.github.io') {
      const body = local(u.pathname.replace('/gatorbait-media-redesign', ''));
      return body ? route.fulfill({ contentType: 'application/json', body }) : route.fulfill({ status: 404, body: '' });
    }
    if (/\.(png|jpe?g|webp|gif)/i.test(u.pathname) || u.hostname === 'static.wixstatic.com') return route.fulfill({ contentType: 'image/png', body: png });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.goto('https://www.gatorbaitmedia.com/', { waitUntil: 'load' });
  await page.waitForTimeout(3500);
  const r = await page.evaluate(() => {
    const root = document.getElementById('gbm-live');
    const lead = root ? root.getAttribute('data-fp-lead') : null;
    const items = [...document.querySelectorAll('.fp-lead .fp-lead-item, .fp-lead > article, .fp-lead a[href*="/post/"]')];
    const leadLinks = [...document.querySelectorAll('.fp-lead a[href*="/post/"]')].map((a) => a.getAttribute('href'));
    const leadText = document.querySelector('.fp-lead') ? document.querySelector('.fp-lead').innerText.replace(/\s+/g, ' ').slice(0, 400) : '';
    const authors = [...document.querySelectorAll('.fp-lead')].map((el) => el.innerText).join(' ');
    const allHrefs = [...document.querySelectorAll('#gbm-live a[href*="/post/"]')].map((a) => a.getAttribute('href'));
    const dup = allHrefs.filter((h, i) => allHrefs.indexOf(h) !== i);
    const boxes = [...document.querySelectorAll('.fp-lead > *')].filter((el) => el.offsetHeight > 0).map((el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }; });
    const mag = document.querySelector('[class*="magazine"], #fp-magazine, .fp-mag');
    const rot = document.querySelectorAll('.fp-mag-rotator, [data-rotator], .fp-mag-cover');
    const fonts = [...document.querySelectorAll('#gbm-live *')].slice(0, 400).map((el) => getComputedStyle(el).fontFamily).filter((f) => !/barlow/i.test(f) && !/inherit/.test(f));
    return { root: !!root, lead, h1: document.querySelectorAll('h1').length, leadLinks: [...new Set(leadLinks)], buddyIdx: authors.indexOf('Buddy Martin'), franzIdx: authors.indexOf('Franz Beard'), boxes, dupCount: dup.length, scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, hasMag: !!mag, rotNodes: rot.length, nonBarlow: [...new Set(fonts)].slice(0, 3), pageH: document.body.scrollHeight, leadText };
  });
  await page.screenshot({ path: `${shots}/${label}-${width}.png`, fullPage: true });
  out.push({ width, errs, ...r });
  await ctx.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));
