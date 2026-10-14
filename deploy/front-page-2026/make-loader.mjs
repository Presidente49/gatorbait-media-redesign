#!/usr/bin/env node
// Generate the reviewed Home Code loader for a commit-pinned release.
// Update both sports-live/current.json and this fallback on deployment.
// Usage: node deploy/front-page-2026/make-loader.mjs <40-hex commit> [--info]
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const commit = process.argv[2] || '';
if (!/^[0-9a-f]{40}$/.test(commit)) { console.error('need a 40-hex commit'); process.exit(1); }
// This canonical template includes the failure latch, optional fonts, photo containment,
// trial CTA and reserved layout slots. Do not regenerate from the retired V4 loader.
const template = readFileSync(new URL('../funnel-repair-20261014/home-live.html', import.meta.url), 'utf8');
if ((template.match(/src=[0-9a-f]{7} pointer=/g) || []).length !== 1 ||
    (template.match(/var d='[0-9a-f]{40}'/g) || []).length !== 1) {
  throw new Error('canonical loader markers changed');
}
const html = template.replace(/src=[0-9a-f]{7} pointer=/, `src=${commit.slice(0, 7)} pointer=`)
  .replace(/var d='[0-9a-f]{40}'/, `var d='${commit}'`);
if (html.length >= 15000) throw new Error('loader exceeds Wix embed limit');
let h = 5381; for (let i = 0; i < html.length; i++) h = ((h * 33) ^ html.charCodeAt(i)) >>> 0;
if (process.argv.includes('--info')) console.error(`loader ${html.length} chars, djb2 ${h}, sha1 ${createHash('sha1').update(html).digest('hex').slice(0, 8)}`);
process.stdout.write(html);
