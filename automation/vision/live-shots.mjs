// Real-browser screenshots of the production site for review from sessions that cannot reach it.
// Usage: node automation/vision/live-shots.mjs [path] [selector] [widths]
//   path      page path on www.gatorbaitmedia.com, query allowed (default "/")
//   selector  element to scroll into view and capture on its own (default "#gbm-road"; "" for none)
//   widths    comma list (default "390,1365"); widths under 800 use an iPhone profile
//   PERF=1    also measure load performance under Lighthouse-like throttling (phone: 1.6 Mbps, 150 ms RTT,
//             4x CPU slowdown; desktop: 10 Mbps, 40 ms, no CPU slowdown): TTFB, FCP, LCP, CLS, long tasks,
//             when our front page root and story button appeared, and every request grouped by host.
// Output: build/live-shots/<name>.jpg plus metrics.json (bounding boxes, computed fonts, scroll state, perf).
import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const path = process.argv[2] || '/';
const selector = process.argv[3] === undefined ? '#gbm-road' : process.argv[3];
const widths = (process.argv[4] || '390,1365').split(',').map(Number).filter(Boolean);
const PERF = process.env.PERF === '1';
const OUT = 'build/live-shots';
mkdirSync(OUT, { recursive: true });
// deploy/covers/*.html renders a story cover from the checkout instead of the live site (the query carries the copy).
const url = /^deploy\/covers\//.test(path) ? 'file://' + process.cwd() + '/' + path : 'https://www.gatorbaitmedia.com' + path;
const IOS_UA = devices['iPhone 13'].userAgent;
// A real Chrome UA on desktop: with the default HeadlessChrome UA, Wix answered with an older cached
// snapshot for a while after an embed update (Sept. 30), which real browsers did not get.
const DESKTOP_UA = devices['Desktop Chrome'].userAgent;
const profile = (w) => w < 800
  ? { userAgent: IOS_UA, viewport: { width: w, height: w < 360 ? 740 : w < 410 ? 844 : 932 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { userAgent: DESKTOP_UA, viewport: { width: w, height: 900 }, deviceScaleFactor: 1 };

// Read-only CDN availability/integrity gate; fail before starting Chromium.
const SOURCE_PIN = '312018fa66e644a3f32fe473b6a855d1b114c356';
const EXPECTED_ASSETS = [
  {
    "path": "sports-live/broadcast-home.js",
    "sha256": "de9430dd9d539f01c7feb3d2a332de5e7bd3a46974d559767f55b735f63bbef8"
  },
  {
    "path": "sports-live/magazine-pregame.js",
    "sha256": "8168521f4a02e6f6fde0ec2013cf9173f1849a0d44c85a097f4dbcfb71482818"
  },
  {
    "path": "deploy/broadcast-network-20261017/site-shell.css",
    "sha256": "b09dfeb710afe1a91b22af2039ec218dde7837a449c90e7ef5fce2abb6b6dbbe"
  },
  {
    "path": "deploy/broadcast-network-20261017/news-chronology.js",
    "sha256": "7ddde8064232daf8c4a69ef182f2f0dc3170740b1984842e762e85326a166da5"
  },
  {
    "path": "owner-selected-v5-cover",
    "url": "https://static.wixstatic.com/media/d3cfa5_6d3a6ab429634722ada0394526bc480d~mv2.jpg",
    "sha256": "6fe6309f9d70930149e41458d0dc4659ba3bc1c3bec93e74a8fd1a26fb2c320d"
  }
];
const preflight = { pin: SOURCE_PIN, at: new Date().toISOString(), ok: false, files: [] };
for (const asset of EXPECTED_ASSETS) {
  const receipt = { path: asset.path, status: null, bytes: 0, expectedSha256: asset.sha256, sha256: null, ok: false };
  try {
    const response = await fetch(asset.url || `https://cdn.jsdelivr.net/gh/Presidente49/gatorbait-media-redesign@${SOURCE_PIN}/${asset.path}`, { signal: AbortSignal.timeout(30000), cache: 'no-store' });
    receipt.status = response.status;
    if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    receipt.bytes = bytes.length;
    receipt.sha256 = createHash('sha256').update(bytes).digest('hex');
    receipt.ok = receipt.sha256 === asset.sha256;
    if (!receipt.ok) receipt.error = 'SHA256 mismatch';
  } catch (error) { receipt.error = String(error.message || error).slice(0, 180); }
  preflight.files.push(receipt);
}
preflight.ok = preflight.files.length === EXPECTED_ASSETS.length && preflight.files.every((file) => file.ok);
writeFileSync(`${OUT}/preflight.json`, JSON.stringify(preflight, null, 1));
console.log(JSON.stringify({ event: preflight.ok ? 'BROADCAST_CDN_PREFLIGHT_OK' : 'BROADCAST_CDN_PREFLIGHT_ALERT', ...preflight }));
if (!preflight.ok) process.exit(1);

writeFileSync(`${OUT}/metrics.json`, JSON.stringify({preflight},null,1));
