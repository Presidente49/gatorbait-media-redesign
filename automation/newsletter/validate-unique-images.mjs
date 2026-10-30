#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node automation/newsletter/validate-unique-images.mjs <issue.mjml>');
  process.exit(2);
}

const source = fs.readFileSync(file, 'utf8');
const images = [...source.matchAll(/<mj-image\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m => m[1]);

function inlineDataIdentity(url) {
  const match = url.trim().match(/^data:([^,]*),(.*)$/is);
  if (!match) return null;

  const [, metadata, payload] = match;
  try {
    let bytes;
    if (/(?:^|;)base64(?:;|$)/i.test(metadata)) {
      // Data-URI payloads are allowed to wrap. Normalize both standard and
      // URL-safe base64 so the same asset gets one byte-level identity even
      // if the markup uses a different wrapping or alphabet.
      const normalized = payload
        .replace(/\s+/g, '')
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      bytes = Buffer.from(normalized, 'base64');
    } else {
      bytes = Buffer.from(decodeURIComponent(payload), 'utf8');
    }
    if (!bytes.length) return 'inline:empty';
    return 'inline:sha256:' + crypto.createHash('sha256').update(bytes).digest('hex');
  } catch {
    // Preserve a stable identity for an invalid inline URL so duplicate bad
    // markup is still caught; strict MJML compilation remains responsible
    // for rejecting malformed markup itself.
    return 'inline:raw:' + url.trim().toLowerCase();
  }
}

function identity(url) {
  const inline = inlineDataIdentity(url);
  if (inline) return inline;
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
