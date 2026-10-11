// Local browser proof. Synthetic mode verifies layout with offline placeholders,
// never real photos, provider rendering, rights, freshness or delivery.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const input = process.argv[2], requested = process.argv[3];
const synthetic = process.argv.includes('--synthetic');
if (!input || !requested) throw Error('Usage: render-preview.mjs INPUT.html PRIVATE_OUTPUT [--synthetic]');
const inside = target => target === root || target.startsWith(root + path.sep);
if (inside(path.resolve(requested))) throw Error('Preview output must be outside the public checkout');
fs.mkdirSync(requested, { recursive: true, mode: 0o700 });
const output = fs.realpathSync(requested);
if (inside(output)) throw Error('Preview output resolves into the public checkout');
const save = (name, body) => {
  const file = path.join(output, name);
  const descriptor = fs.openSync(file, fs.constants.O_CREAT | fs.constants.O_WRONLY | fs.constants.O_TRUNC | fs.constants.O_NOFOLLOW, 0o600);
  try { fs.fchmodSync(descriptor, 0o600); fs.writeFileSync(descriptor, body); } finally { fs.closeSync(descriptor); }
};
const modulePath = process.env.PLAYWRIGHT_MODULE || pathToFileURL(path.join(root, 'vendor/colorlib-email-templates/node_modules/playwright-core/index.mjs')).href;
const { chromium } = await import(modulePath);
const launch = process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : { channel: 'chrome' };
const browser = await chromium.launch({ ...launch, headless: true });
const profiles = [{ name: 'mobile320', width: 320, height: 844 }, { name: 'mobile390', width: 390, height: 844 }, { name: 'mobile430', width: 430, height: 844 }, { name: 'desktop1000', width: 1000, height: 900 }, { name: 'desktop1366', width: 1366, height: 900 }];
const report = { sourceOnly: true, synthetic, offlinePlaceholderPhotos: synthetic, remoteFontsVerified: false, runs: [], hardFailureCount: 0 };

try {
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    let networkFailureCount = 0;
    page.on('requestfailed', () => networkFailureCount++);
    page.on('response', response => { if (response.status() >= 400) networkFailureCount++; });
    if (synthetic) {
      await page.route('https://**/*', async route => {
        const request = route.request(), parsed = new URL(request.url());
        if (parsed.hostname === 'example.invalid' && request.resourceType() === 'image') {
          const color = parsed.pathname.includes('cover') ? '#081B35' : '#E9EEF5';
          await route.fulfill({ contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700"><rect width="1200" height="700" fill="${color}"/><text x="600" y="370" text-anchor="middle" fill="#FA4616" font-family="Arial" font-size="50">SYNTHETIC LOCAL PHOTO</text></svg>` });
        } else await route.fulfill({ contentType: 'text/css', body: '' });
      });
    }
    await page.goto(pathToFileURL(path.resolve(input)).href, { waitUntil: 'load', timeout: 45000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); })));
    });
    const audit = await page.evaluate(() => {
      const text = document.body.innerText;
      const images = [...document.images];
      const headings = [...document.querySelectorAll('.gb-h1,.gb-h2,.gb-h3')];
      const hard = [];
      if (document.documentElement.scrollWidth > innerWidth + 2) hard.push('horizontal overflow');
      if (!text.includes('GATORBAIT MAGAZINE NEWSLETTER')) hard.push('newsletter identity missing');
      if (headings.length !== 8 || headings.some(heading => !heading.textContent.trim() || !heading.getBoundingClientRect().height)) hard.push('eight visible story headings required');
      if (images.length !== 2 || images.some(image => !image.complete || !image.naturalWidth)) hard.push('two loaded image slots required');
      if (document.querySelectorAll('a[href*="utm_content="]').length !== 11) hard.push('eleven tracked links required');
      if (/\{\{|\}\}|\$\{/.test(text)) hard.push('unresolved issue data');
      return { viewport: { width: innerWidth, height: innerHeight }, layoutWidth: document.documentElement.scrollWidth, headingCount: headings.length, imageCount: images.length, documentHeight: document.documentElement.scrollHeight, hard };
    });
    report.hardFailureCount += audit.hard.length;
    save('preview-' + profile.name + '.jpg', await page.screenshot({ type: 'jpeg', quality: 82, fullPage: true }));
    report.runs.push({ profile: profile.name, networkFailureCount, ...audit });
    await context.close();
  }
} finally { await browser.close(); }
save('preview-report.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
if (report.hardFailureCount) process.exitCode = 1;
