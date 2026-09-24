#!/usr/bin/env node
// Pre-send link gate for GatorBait newsletters.
//
// The 2026-09-23 campaign reached 467 inboxes with 86 unique clickers and
// attributed zero sessions, because its MJML carried XML-escaped separators
// (&amp;) that the Wix campaign import rendered as literal text. The browser
// then parsed the query as utm_source + amp;utm_medium + amp;utm_campaign +
// amp;utm_content, so three of four UTM fields were malformed before the
// article ever loaded. Root cause was reproduced in issue #3 comment
// 5805668138; this is the gate that stops it shipping again.
//
// Usage: node check-links.mjs <file.mjml|file.html> [...]
// Exit 0 = safe to send. Exit 1 = do not send.

import { readFileSync } from 'node:fs';

const REQUIRED_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

function hrefsOf(text) {
  const out = [];
  const re = /href\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

// What a mail client actually navigates to: the HTML entity is resolved once.
function asBrowserWouldSee(href) {
  return href
    .replace(/&amp;/g, '&')
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
    if (!raw.includes('utm_')) continue;
    tracked++;
    if (seen.has(raw)) continue;
    seen.add(raw);

    // Literal "&amp;" surviving into the query is the defect itself.
    if (/\?[^"]*&amp;/.test(raw)) {
      problems.push({
        href: raw,
        why: 'query separators are XML-escaped (&amp;); Wix renders these literally',
      });
      continue;
    }

    let url;
    try {
      url = new URL(asBrowserWouldSee(raw));
    } catch {
      problems.push({ href: raw, why: 'not a parseable URL' });
      continue;
    }

    const keys = [...url.searchParams.keys()];
    const malformed = keys.filter((k) => /^amp;/.test(k) || /[^a-z0-9_]/i.test(k));
    if (malformed.length) {
      problems.push({ href: raw, why: `malformed query keys: ${malformed.join(', ')}` });
      continue;
    }

    const missing = REQUIRED_UTM.filter((k) => !url.searchParams.get(k));
    if (missing.length) {
      problems.push({ href: raw, why: `missing or empty: ${missing.join(', ')}` });
    }
  }

  return { file, tracked, unique: seen.size, problems };
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: check-links.mjs <file.mjml|file.html> [...]');
  process.exit(2);
}

let failed = false;
for (const f of files) {
  const r = checkOne(f);
  const bad = r.problems.length;
  console.log(`\n${r.file}`);
  console.log(`  tracked links: ${r.tracked} (${r.unique} unique)`);
  if (!r.tracked) {
    console.log('  no UTM-tagged links found — nothing to verify');
    continue;
  }
  if (!bad) {
    console.log(`  OK — every link carries clean ${REQUIRED_UTM.join(', ')}`);
    continue;
  }
  failed = true;
  console.log(`  ${bad} PROBLEM${bad === 1 ? '' : 'S'}:`);
  for (const p of r.problems) {
    console.log(`    - ${p.why}`);
    console.log(`      ${p.href.slice(0, 120)}${p.href.length > 120 ? '…' : ''}`);
  }
}

if (failed) {
  console.log('\nDO NOT SEND. Fix the separators so the rendered anchor carries real "&".');
  process.exit(1);
}
console.log('\nSafe to send.');
