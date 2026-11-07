#!/usr/bin/env node
// Release gate for the Oklahoma-week package. Fails (exit 1) while any placeholder is left in the issue JSON, the built bundle,
// the email source or the rendered email. Run it after set-pdf-urls.mjs and before the loader is pinned or a campaign is created.
// Usage: node deploy/oklahoma-week-20261106/check-no-placeholders.mjs [--loader]   (--loader also checks candidate-loader.html for the all-zero pin)
import { readFileSync, existsSync } from 'node:fs';
const files = ['sports-live/magazine-issue-oklahoma-week.json', 'sports-live/magazine-oklahoma-week.js', 'newsletter/2026-11-06-oklahoma-week-magazine.mjml', 'newsletter/2026-11-06-oklahoma-week-magazine.html'];
if (process.argv.includes('--loader')) files.push('deploy/oklahoma-week-20261106/candidate-loader.html');
const re = /\[\[[A-Z_]+\]\]|PLACEHOLDER|(?<![0-9a-f])0{40}(?![0-9a-f])/g;
let bad = 0;
for (const f of files) {
  if (!existsSync(f)) { console.log('MISSING', f); bad++; continue; }
  const hits = readFileSync(f, 'utf8').match(re) || [];
  console.log((hits.length ? 'PLACEHOLDER ' : 'clean       ') + f + (hits.length ? '  ' + [...new Set(hits)].join(', ') : ''));
  if (hits.length) bad++;
}
if (bad) { console.error('Not releasable: fill the placeholders first (set-pdf-urls.mjs, then make-loader.py with the merge SHA).'); process.exit(1); }
console.log('No placeholders left.');
