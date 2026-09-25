#!/usr/bin/env node
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node automation/newsletter/validate-unique-images.mjs <issue.mjml>');
  process.exit(2);
}

const source = fs.readFileSync(file, 'utf8');
const images = [...source.matchAll(/<mj-image\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m => m[1]);

function identity(url) {
  const wix = url.match(/\/media\/([^/?#]+)/i);
  if (wix) return 'wix:' + wix[1].toLowerCase();
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

const byIdentity = new Map();
for (const url of images) {
  const id = identity(url);
  const list = byIdentity.get(id) || [];
  list.push(url);
  byIdentity.set(id, list);
}

const duplicates = [...byIdentity.entries()].filter(([, urls]) => urls.length > 1);
if (duplicates.length) {
  console.error('Duplicate newsletter image(s) found:');
  for (const [id, urls] of duplicates) {
    console.error('- ' + id);
    for (const url of urls) console.error('  ' + url);
  }
  process.exit(1);
}

console.log('Newsletter image QC passed: ' + images.length + ' image slots / ' + byIdentity.size + ' unique images.');
