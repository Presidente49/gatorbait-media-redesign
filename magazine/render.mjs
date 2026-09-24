// Same Chromium export lane; no website access, deployment or paid dependency.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const dir = process.argv[2] || 'magazine/issues/2026-09-26-ole-miss';
const htmlPath = resolve(dir, 'issue.html');
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1000, height: 1400 } });
const page = await context.newPage();
const failed = [];
page.on('requestfailed', r => failed.push(r.url().slice(0, 180)));
const countPages = buffer => (buffer.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
const pdfOptions = {
  format: 'Letter',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
  footerTemplate: '<div style="font:8px Arial;color:#526276;width:100%;padding:0 57px;display:flex;justify-content:space-between"><span>GATORBAIT MAGAZINE · REVIEW EDITION</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>'
};
try {
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode()));
  });
  const images = await page.evaluate(() => [...document.images].map(i => ({
    src: i.src, loaded: i.complete && i.naturalWidth > 0,
    width: i.naturalWidth, height: i.naturalHeight, alt: i.alt
  })));
  if (images.some(i => !i.loaded)) throw new Error('Unloaded photograph');
  if (new Set(images.map(i => i.src)).size !== images.length) throw new Error('Repeated photograph');
  const ids = await page.locator('article.story').evaluateAll(nodes => nodes.map(n => n.id));
  const pageStarts = [];
  let nextPage = 3;
  await page.emulateMedia({ media: 'print' });
  for (const id of ids) {
    await page.evaluate(id => {
      document.body.classList.add('measure-only');
      document.getElementById(id).classList.add('measure-target');
    }, id);
    const bytes = await page.pdf(pdfOptions);
    const pages = countPages(bytes);
    if (pages < 1) throw new Error('Empty PDF for ' + id);
    pageStarts.push({ id, startPage: nextPage, pages });
    nextPage += pages;
    await page.evaluate(id => document.getElementById(id).classList.remove('measure-target'), id);
  }
  await page.evaluate(starts => {
    document.body.classList.remove('measure-only');
    for (const s of starts) {
      document.querySelector('[data-story="' + s.id.replace('story-', '') + '"]').textContent = String(s.startPage);
    }
  }, pageStarts);
  const overflow = await page.evaluate(() => [...document.querySelectorAll('.cover,.contents')].map(el => {
    const box = el.getBoundingClientRect();
    const bottom = Math.max(...[...el.children].map(child => child.getBoundingClientRect().bottom));
    return { surface: el.className, contentBottom: bottom - box.top, height: box.height, ok: bottom <= box.bottom + 1 };
  }));
  if (overflow.some(s => !s.ok)) throw new Error('Cover/contents overflow: ' + JSON.stringify(overflow));
  const bytes = await page.pdf({ ...pdfOptions, path: dir + '/issue.pdf' });
  const pdfPages = countPages(bytes);
  if (pdfPages !== nextPage - 1) throw new Error('Contents page map does not reconcile: ' + pdfPages + ' vs ' + (nextPage - 1));
  // Embed exact artwork and fonts in the HTML for offline reading as well.
  for (const image of images) {
    const r = await fetch(image.src);
    if (!r.ok) throw new Error('Artwork download failed: ' + r.status);
    const data = Buffer.from(await r.arrayBuffer()).toString('base64');
    const src = 'data:' + (r.headers.get('content-type') || 'image/jpeg') + ';base64,' + data;
    await page.locator('img').evaluateAll((nodes, pair) => {
      nodes.filter(n => n.src === pair.old).forEach(n => n.src = pair.src);
    }, { old: image.src, src });
  }
  const styles = await page.locator('style').allTextContents();
  for (let index = 0; index < styles.length; index++) {
    let css = styles[index];
    const urls = [...css.matchAll(/url\(['"]?([^)'"\s]+\.woff2)['"]?\)/g)];
    for (const match of urls) {
      const font = readFileSync(resolve(dirname(htmlPath), match[1]));
      css = css.replace(match[0], 'url(data:font/woff2;base64,' + font.toString('base64') + ')');
    }
    await page.locator('style').nth(index).evaluate((el, css) => el.textContent = css, css);
  }
  writeFileSync(dir + '/issue.html', await page.content());
  await page.emulateMedia({ media: 'screen' });
  await page.locator('.cover').screenshot({ path: dir + '/preview-cover.jpg', type: 'jpeg', quality: 85 });
  await page.locator('.contents').screenshot({ path: dir + '/preview-contents.jpg', type: 'jpeg', quality: 85 });
  for (let i = 0; i < ids.length; i++) {
    await page.locator('#' + ids[i]).screenshot({ path: dir + '/preview-story-' + (i + 1) + '.jpg', type: 'jpeg', quality: 82 });
  }
  const report = {
    status: 'DRAFT_REVIEW_ONLY', issue: dir, pdfBytes: bytes.length, pdfPages,
    articleCount: ids.length, pageStarts, imagesLoaded: images.length + '/' + images.length,
    images, coverAndContentsGeometry: overflow, failedRequests: failed,
    offlineHtml: true, textSource: 'Frozen full-article Wix reads; see build-report.json',
    visualApproval: 'PENDING owner/editor review; build metrics do not certify photographic rights or appearance',
    saleEnabled: false
  };
  writeFileSync(dir + '/render-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
