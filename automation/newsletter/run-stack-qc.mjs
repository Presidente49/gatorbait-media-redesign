#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const sourceFile = process.argv[2];
const policyFile = process.argv[3] || 'automation/newsletter/stack-policy.json';

if (!sourceFile) {
  console.error('Usage: node automation/newsletter/run-stack-qc.mjs <issue.mjml> [policy.json]');
  process.exit(2);
}

const source = fs.readFileSync(sourceFile, 'utf8');
const policy = JSON.parse(fs.readFileSync(policyFile, 'utf8'));
const errors = [];
const warnings = [];

function attr(tag, name) {
  const match = tag.match(new RegExp('\\b' + name + '=["\\\']([^"\\\']*)["\\\']', 'i'));
  return match ? match[1] : '';
}

function mediaIdentity(url) {
  const wix = url.match(/\/media\/([^/?#]+)/i);
  if (wix) return 'wix:' + wix[1].toLowerCase();
  try {
    const u = new URL(url);
    u.search = '';
    u.hash = '';
    return u.toString().toLowerCase();
  } catch {
    return String(url || '').trim().toLowerCase();
  }
}

if (!/GATORBAIT/i.test(source) || !/MAGAZINE NEWSLETTER/i.test(source)) {
  errors.push('Missing GatorBait Magazine Newsletter identity.');
}
if (/\$\{[^}]+\}/.test(source)) errors.push('Unresolved placeholder found.');
if (/&amp;utm_/i.test(source)) errors.push('Broken encoded UTM key pattern (&amp;utm_) found.');
for (const prefix of policy.contentPolicy.rejectTitlePrefixes || []) {
  if (source.includes(prefix)) errors.push('Stale/rejected content prefix present: ' + prefix);
}
if (/href=["']\s*(?:#|javascript:|)["']/i.test(source)) errors.push('Placeholder or unsafe href found.');

const imageTags = [...source.matchAll(/<mj-image\b[^>]*>/gi)].map(m => m[0]);
const imageRows = imageTags.map(tag => ({
  src: attr(tag, 'src'),
  alt: attr(tag, 'alt')
}));

if (imageRows.length < policy.photoPolicy.minImages) {
  errors.push('Too few editorial images: ' + imageRows.length + ' < ' + policy.photoPolicy.minImages);
}
if (imageRows.length > policy.photoPolicy.maxImages) {
  errors.push('Too many editorial images: ' + imageRows.length + ' > ' + policy.photoPolicy.maxImages);
}

const identities = new Map();
for (const row of imageRows) {
  let u;
  try { u = new URL(row.src); } catch { errors.push('Invalid image URL: ' + row.src); continue; }
  if (!policy.photoPolicy.allowedHosts.includes(u.hostname)) errors.push('Unapproved image host: ' + u.hostname);
  const id = mediaIdentity(row.src);
  const list = identities.get(id) || [];
  list.push(row.src);
  identities.set(id, list);

  if ((policy.photoPolicy.deniedMediaIds || []).some(media => id.includes(media.toLowerCase()))) {
    errors.push('Denied newsletter image/media ID present: ' + id);
  }
  if ((policy.photoPolicy.disallowedAltPatterns || []).some(p => row.alt.toLowerCase().includes(p.toLowerCase()))) {
    errors.push('Non-serious/graphic image alt rejected: ' + row.alt);
  }
  const hasCredit = (policy.photoPolicy.requiredCreditMarkers || []).some(marker =>
    row.alt.toLowerCase().includes(marker.toLowerCase())
  );
  if (!hasCredit) warnings.push('Image alt has no recognized credit marker: ' + row.alt);
}

for (const [id, urls] of identities.entries()) {
  if (urls.length > 1) errors.push('Duplicate image/media identity: ' + id);
}

const hrefs = [...source.matchAll(/\bhref=["']([^"']+)["']/gi)].map(m => m[1]);
const articleUrls = [];
for (const href of hrefs) {
  let u;
  try { u = new URL(href); } catch { continue; }
  if (policy.contentPolicy.requireHttps && u.protocol !== 'https:') errors.push('Non-HTTPS link: ' + href);
  if (u.pathname.startsWith('/post/')) {
    if (u.hostname !== policy.contentPolicy.allowedArticleHost) errors.push('Article link on unexpected host: ' + href);
    articleUrls.push(u.origin + u.pathname);
  }
}
const distinctArticles = new Set(articleUrls);
if (distinctArticles.size < policy.contentPolicy.minimumDistinctArticleLinks) {
  errors.push('Not enough distinct canonical article links: ' + distinctArticles.size + ' < ' + policy.contentPolicy.minimumDistinctArticleLinks);
}

const summary = {
  file: path.normalize(sourceFile),
  images: imageRows.length,
  uniqueImages: identities.size,
  distinctArticleLinks: distinctArticles.size,
  warnings,
  errors
};

console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exit(1);
