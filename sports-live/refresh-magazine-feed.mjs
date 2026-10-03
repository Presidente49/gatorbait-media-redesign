#!/usr/bin/env node
// Refresh the Magazine's lead column and story cards from the newest posts, using the same picker the live page runs
// (sports-live/src/magazine-feed.js). Rewrites ONLY issue.lead and issue.cards.items; every other byte of the issue file is
// kept (the new values are spliced into the original text, so ESPN/FloridaGators.com numbers, rosters and copy never move).
// No network: the feed is a file. Posts JSON ({posts:[...]}, the gazette-live/posts.json shape) or a Wix blog-feed.xml copy.
//
// Usage (from the repo root):
//   node sports-live/refresh-magazine-feed.mjs [--feed gazette-live/posts.json] [--issue sports-live/magazine-issue-pregame.json]
//        [--out <file>] [--now 2026-10-03T13:00:00Z] [--dry-run] [--check]
//   --dry-run  print what would change, write nothing      --check  exit 1 when the issue is not current with the feed
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');

// Load the shared picker exactly as the bundle runs it (plain script, functions in scope).
export function loadPicker() {
  const src = readFileSync(join(here, 'src/magazine-feed.js'), 'utf8');
  const ctx = vm.createContext({ URL, Intl, Date, Math, JSON, String, Array, Object, isFinite });
  vm.runInContext('(function(){' + src + ';this.api={mfPick,mfNormalize,mfPickLead,mfScoreLine,mfLinked};}).call(this);', ctx);
  return ctx.api;
}

// Minimal Wix RSS reader -> the homepage post shape (mirrors fetchRss in src/front-page.js and the runtime parser).
export function parseRss(xml) {
  const ent = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&');
  const tag = (block, name) => { const m = new RegExp('<(?:[\\w-]+:)?' + name + '\\b[^>]*>([\\s\\S]*?)</(?:[\\w-]+:)?' + name + '>').exec(block); return m ? ent(m[1]).trim() : ''; };
  return (xml.match(/<item\b[\s\S]*?<\/item>/g) || []).map((b) => {
    const enc = /<enclosure\b[^>]*\burl="([^"]*)"/.exec(b);
    return { title: tag(b, 'title'), excerpt: tag(b, 'description'), author: tag(b, 'creator'), url: tag(b, 'link'), firstPublishedDate: tag(b, 'pubDate'), html: tag(b, 'encoded'), image: { src: enc ? ent(enc[1]) : '', alt: tag(b, 'title') } };
  });
}

export function readFeed(text) {
  const t = text.trimStart();
  if (t.startsWith('<')) return parseRss(t);
  const d = JSON.parse(t);
  return Array.isArray(d) ? d : Array.isArray(d.posts) ? d.posts : [];
}

// Byte span [start, end) of the value at a key path in a JSON text (string- and bracket-aware scan).
function span(text, path) {
  let i = 0;
  const ws = () => { while (/\s/.test(text[i])) i++; };
  const str = () => { const s = i++; while (text[i] !== '"') i += text[i] === '\\' ? 2 : 1; i++; return JSON.parse(text.slice(s, i)); };
  const skip = () => { ws(); const s = i; if (text[i] === '"') { str(); return [s, i]; } if (text[i] === '{' || text[i] === '[') { let depth = 0; do { if (text[i] === '"') { str(); continue; } if (text[i] === '{' || text[i] === '[') depth++; if (text[i] === '}' || text[i] === ']') depth--; i++; } while (depth); return [s, i]; } while (i < text.length && !/[,}\]\s]/.test(text[i])) i++; return [s, i]; };
  let range = [0, text.length];
  for (const key of path) {
    i = range[0]; ws(); if (text[i] !== '{') throw Error('not an object at ' + key); i++;
    let found = null;
    for (;;) { ws(); if (text[i] === '}') break; const k = str(); ws(); i++; const r = skip(); if (k === key) { found = r; break; } ws(); if (text[i] === ',') i++; }
    if (!found) throw Error('missing key ' + path.join('.'));
    range = found;
  }
  return range;
}
// Serialize like the issue file (indent 1, raw Unicode), re-indented to the value's column.
function dump(value, text, start) {
  const depth = (text.slice(text.lastIndexOf('\n', start - 1) + 1, start).match(/^ */)[0] || '').length;
  return JSON.stringify(value, null, 1).replace(/\n/g, '\n' + ' '.repeat(depth));
}

export function refresh(issueText, posts, nowMs, credits) {
  const issue = JSON.parse(issueText);
  const res = loadPicker().mfPick(issue, posts, nowMs, credits);
  let out = issueText;
  const edits = [];
  if (res.cardsChanged) edits.push([['cards', 'items'], res.items]);
  if (res.leadChanged) edits.push([['lead'], res.lead]);
  // Splice from the end of the file backwards so earlier spans stay valid.
  edits.map(([p, v]) => [span(out, p), v]).sort((a, b) => b[0][0] - a[0][0]).forEach(([[s, e], v]) => { out = out.slice(0, s) + dump(v, out, s) + out.slice(e); });
  // Guard: every other top-level key is byte-identical, and the result parses to exactly what the picker chose.
  const before = JSON.parse(issueText), after = JSON.parse(out);
  for (const k of Object.keys(before)) {
    if (k === 'lead' || k === 'cards') continue;
    const a = span(issueText, [k]), b = span(out, [k]);
    if (issueText.slice(...a) !== out.slice(...b)) throw Error('refresh touched ' + k);
  }
  for (const k of Object.keys(before.cards || {})) if (k !== 'items') { const a = span(issueText, ['cards', k]), b = span(out, ['cards', k]); if (issueText.slice(...a) !== out.slice(...b)) throw Error('refresh touched cards.' + k); }
  if (JSON.stringify(after.lead) !== JSON.stringify(res.lead) || JSON.stringify(after.cards.items) !== JSON.stringify(res.items)) throw Error('splice mismatch');
  return { text: out, res, before, after };
}

export function summary(before, after) {
  const line = (c) => `  ${c.date || ''} | ${c.kicker || ''} | ${c.title} | ${c.url}`;
  return [
    'LEAD before: ' + before.lead.title + ' | ' + before.lead.url,
    'LEAD after:  ' + after.lead.title + ' | ' + after.lead.url,
    'CARDS before:', ...before.cards.items.map(line),
    'CARDS after:', ...after.cards.items.map(line),
  ].join('\n');
}

if (import.meta.url === 'file://' + resolve(process.argv[1] || '')) {
  const arg = (name, def) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : def; };
  const issuePath = resolve(repo, arg('--issue', 'sports-live/magazine-issue-pregame.json'));
  const outPath = resolve(repo, arg('--out', issuePath));
  const feedPath = resolve(repo, arg('--feed', 'gazette-live/posts.json'));
  const nowMs = arg('--now') ? Date.parse(arg('--now')) : Date.now();
  if (!Number.isFinite(nowMs)) { console.error('--now must be an ISO date'); process.exit(2); }
  let credits = {};
  try { credits = JSON.parse(readFileSync(join(repo, 'sports-live/front-page.config.json'), 'utf8')).credits || {}; } catch (_) {}
  const issueText = readFileSync(issuePath, 'utf8');
  const { text, res, before, after } = refresh(issueText, readFeed(readFileSync(feedPath, 'utf8')), nowMs, credits);
  const changed = text !== issueText;
  console.log(`${res.posts} posts read from ${feedPath.replace(repo + '/', '')}; lead ${res.leadChanged ? 'changes' : 'unchanged'}, cards ${res.cardsChanged ? 'change' : 'unchanged'}.`);
  console.log(summary(before, after));
  if (process.argv.includes('--check')) { if (changed) { console.error('Magazine issue is behind the feed; run without --check.'); process.exit(1); } console.log('Magazine issue is current with the feed.'); }
  else if (process.argv.includes('--dry-run')) console.log('Dry run: nothing written.');
  else if (changed || outPath !== issuePath) { writeFileSync(outPath, text); console.log('Wrote ' + outPath.replace(repo + '/', '')); }
}
