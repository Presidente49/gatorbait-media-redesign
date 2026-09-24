// Renders the built issue to a PDF in CI, where the Wix image CDN is
// reachable. Also captures the cover and first spread as images so the issue
// can be reviewed without downloading anything.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const dir = process.argv[2] || 'magazine/issues/2026-09-26-ole-miss';
const page_url = 'file://' + process.cwd() + '/' + dir + '/issue.html';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1000, height: 1400 } });
const page = await context.newPage();
const failed = [];
page.on('requestfailed', (r) => failed.push(r.url().slice(0, 120)));

await page.goto(page_url, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2500);

// An empty frame must never pass as a design choice.
const images = await page.evaluate(() =>
  [...document.images].map((i) => ({ ok: i.complete && i.naturalWidth > 0, w: i.naturalWidth, src: i.src.slice(0, 100) }))
);
const loaded = images.filter((i) => i.ok).length;

await page.screenshot({ path: dir + '/preview-cover.jpg', type: 'jpeg', quality: 72 });
await page.evaluate(() => {
  const s = document.querySelector('.story');
  if (s) s.scrollIntoView();
});
await page.waitForTimeout(600);
await page.screenshot({ path: dir + '/preview-story.jpg', type: 'jpeg', quality: 72 });

const pdfPath = dir + '/issue.pdf';
await page.pdf({
  path: pdfPath,
  format: 'Letter',
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();

const bytes = readFileSync(pdfPath);
// Dependency-free page count: every page object declares its type.
const pages = (bytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;

const report = {
  issue: dir,
  pdfBytes: bytes.length,
  pdfPages: pages,
  imagesLoaded: loaded + '/' + images.length,
  failedRequests: failed,
};
writeFileSync(dir + '/render-report.json', JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));

if (loaded !== images.length) {
  console.log('::error::' + (images.length - loaded) + ' image(s) failed to load - the issue would ship with empty frames');
  process.exit(1);
}
if (failed.length) {
  console.log('::warning::' + failed.length + ' request(s) failed');
}
