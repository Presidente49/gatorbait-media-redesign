#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const REQUIRED_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
const args = process.argv.slice(2);
const rendered = args[0] === '--rendered';
const files = rendered ? args.slice(1) : args;

if (!files.length) {
  console.error('usage: check-links.mjs [--rendered] <file.mjml|file.html> [...]');
  process.exit(2);
}

function hrefsOf(text) {
  const out = [];
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

function decodeHtmlEntitiesOnce(href) {
  return href
    .replace(/&amp;/gi, '&')
    .replace(/&#38;/g, '&')
    .replace(/&#x26;/gi, '&');
}

function checkOne(file) {
  const text = readFileSync(file, 'utf8');
  const problems = [];
  const seen = new Set();
  let tracked = 0;

  for (const raw of hrefsOf(text)) {
    if (!/^https?:/i.test(raw)) continue;
    if (!/utm_/i.test(raw)) continue;
    tracked++;
    if (seen.has(raw)) continue;
    seen.add(raw);

    // Wix's MJML import previously double-preserved the named &amp; entity.
    // Source MJML therefore rejects that exact spelling. Numeric &#38; is
    // accepted at source and must still decode to valid browser query keys.
    if (!rendered && /[?&][^"'\s]*&amp;utm_/i.test(raw)) {
      problems.push({ href: raw, why: 'source uses &amp; before a UTM key; known Wix import risk' });
      continue;
    }

    let url;
    try {
      url = new URL(decodeHtmlEntitiesOnce(raw));
    } catch {
      problems.push({ href: raw, why: 'not a parseable URL after one browser-style entity decode' });
      continue;
    }

    const keys = [...url.searchParams.keys()];
    const malformed = keys.filter(k => /^amp;/i.test(k) || /[^a-z0-9_]/i.test(k));
    if (malformed.length) {
      problems.push({ href: raw, why: 'malformed query keys: ' + malformed.join(', ') });
      continue;
    }

    const missing = REQUIRED_UTM.filter(k => !url.searchParams.get(k));
    if (missing.length) {
      problems.push({ href: raw, why: 'missing or empty: ' + missing.join(', ') });
    }
  }

  return { file, rendered, tracked, unique: seen.size, problems };
}

let failed = false;
for (const file of files) {
  const result = checkOne(file);
  console.log('\n' + result.file + (rendered ? ' [compiled/rendered]' : ' [source]'));
  console.log('  tracked links: ' + result.tracked + ' (' + result.unique + ' unique)');
  if (!result.tracked) {
    console.log('  no UTM-tagged links found');
    continue;
  }
  if (!result.problems.length) {
    console.log('  OK — complete clean UTM set on every tracked link');
    continue;
  }
  failed = true;
  for (const p of result.problems) {
    console.log('  PROBLEM: ' + p.why);
    console.log('    ' + p.href.slice(0, 180) + (p.href.length > 180 ? '…' : ''));
  }
}

if (failed) process.exit(1);
