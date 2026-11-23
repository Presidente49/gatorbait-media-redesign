// Release check for photo-led postgame editions. The public reader is never intercepted.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const repository = fileURLToPath(new URL('../', import.meta.url));
const reader = 'https://www.gatorbaitmedia.com/magazine';

function expectedCover(commit, variant) {
  if (!/^[0-9a-f]{40}$/.test(commit || '') || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(variant || '')) {
    throw Error('Usage: --release --commit <full 40-character Git SHA> --variant <issue variant> [--out <directory>]');
  }
  const gitFile = file => execFileSync('git', ['show', commit + ':sports-live/' + file],
    { cwd: repository, encoding: 'utf8' });
  const issue = JSON.parse(gitFile('magazine-issue-' + variant + '.json'));
  const bundle = 'magazine-' + variant + '.js';
  const build = gitFile(bundle).match(/build ([0-9a-f]{8})\./)?.[1];
  const cover = issue.cover;
  const image = cover?.image;
  if (!build || !issue.id || issue.layout !== 'postgame' || cover.pdfPhoto || (cover.poster && !cover.coverTitle)
      || !image?.alt?.trim() || !image.credit?.trim() || !cover.headline?.trim()
      || !/^[0-9a-f]+_[0-9a-f]{32}$/.test(image.id) || !/^(jpe?g|png|webp|avif)$/.test(image.ext || 'jpg')) {
    throw Error('Expected a built photo-led postgame edition with Wix image, alt, headline and credit');
  }
  return {
    reader, bundle: 'https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@' + commit + '/sports-live/' + bundle,
    build, issue: issue.id, title: cover.coverTitle || cover.headline, headline: cover.headline,
    media: image.id + '~mv2.' + (image.ext || 'jpg'), alt: image.alt, credit: image.credit
  };
}

export async function verifyPublicCover(args, chromium, devices) {
  const { values } = parseArgs({ args, options: {
    release: { type: 'boolean' }, commit: { type: 'string' }, variant: { type: 'string' },
    out: { type: 'string', default: 'build/live-shots/release' }
  } });
  const report = { mode: 'public mobile reader', checkedAt: new Date().toISOString(), commit: values.commit,
    variant: values.variant, errors: [], expected: {}, observed: { scripts: [] } };
  const observed = report.observed;
  mkdirSync(values.out, { recursive: true });
  let browser;
  let page;
  try {
    const expected = report.expected = expectedCover(values.commit, values.variant);
    // A system Chrome installation is sufficient when Playwright has no downloaded browser.
    browser = await chromium.launch(process.env.CHROME_PATH
      ? { executablePath: process.env.CHROME_PATH }
      : existsSync(chromium.executablePath()) ? {} : { channel: 'chrome' });
    page = await browser.newPage({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } });
    page.on('response', response => {
      const request = response.request();
      if (response.url().includes('/sports-live/magazine-') && request.resourceType() === 'script'
          && !request.serviceWorker() && request.frame() === page.mainFrame()) {
        observed.scripts.push({ url: response.url(), status: response.status() });
      }
    });
    const response = await page.goto(reader, { waitUntil: 'domcontentloaded', timeout: 60000 });
    observed.reader = page.url();
    observed.http = response?.status();
    const poster = page.locator('#gbm-magazine-page .pm-entrance .pm-poster');
    await poster.waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForFunction(() => { const image = document.querySelector('#gbm-magazine-page .pm-entrance .pm-poster img'); return image?.complete && image.naturalWidth > 0; }, null, { timeout: 20000 });
    Object.assign(observed, await poster.evaluate(p => {
      const root = p.closest('#gbm-magazine-page');
      const image = p.querySelector('img');
      const src = new URL(image.currentSrc);
      const box = image.getBoundingClientRect();
      const text = selector => p.querySelector(selector)?.textContent.trim();
      return {
        issue: root.dataset.issue, build: root.dataset.mzBuild, bundle: document.querySelector('#gbm-mag26-bundle')?.src,
        title: text('h1'), headline: text('.pm-coversub') || text('h1'), credit: text('.pm-covercredit'),
        currentSrc: src.href, media: src.origin === 'https://static.wixstatic.com' ? src.pathname.match(/^\/media\/([^/]+)/)?.[1] : null,
        alt: image.alt, decodedWidth: image.naturalWidth, viewportWidth: innerWidth,
        imageInViewport: box.width > 0 && box.height > 0 && box.right > 0 && box.left < innerWidth && box.bottom > 0 && box.top < innerHeight
      };
    }));
    for (const key of Object.keys(expected)) {
      if (expected[key] !== observed[key]) report.errors.push(key + ' differs from committed issue or release target');
    }
    if (observed.http !== 200 || !observed.scripts.some(s => s.url === expected.bundle && s.status === 200)) {
      report.errors.push('Public page or exact pinned script missing HTTP 200 receipt');
    }
    if (observed.viewportWidth !== 390 || !observed.imageInViewport || !observed.decodedWidth) {
      report.errors.push('Cover photo did not render in the mobile viewport');
    }
  } catch (error) {
    report.errors.push(error.message);
  } finally {
    if (page) await page.screenshot({ path: path.join(values.out, 'cover-mobile.jpg'), type: 'jpeg', timeout: 10000 })
      .catch(error => report.errors.push('Mobile screenshot failed: ' + error.message));
    if (browser) await browser.close();
  }
  report.pass = report.errors.length === 0;
  const json = JSON.stringify(report, null, 2);
  writeFileSync(path.join(values.out, 'metrics.json'), json + '\n');
  console.log(json);
  return report.pass;
}
