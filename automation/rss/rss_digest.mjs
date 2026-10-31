#!/usr/bin/env node
// RSS validator and headline-only digest.
// 1. Validates the site's own /blog-feed.xml: well-formed, newest first, cover image on every item, no Gator Country.
// 2. Builds a digest of outside feeds named in sports-live/rss-feeds.json with title, source, link, publishedAt ONLY.
//    No article text is read into the output. Every item links out to its source. Gator Country is never ingested or linked.
// Usage: node automation/rss/rss_digest.mjs [--config sports-live/rss-feeds.json] [--out sports-live/rss-digest.json] [--force]
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const UA = 'GatorBaitMedia-HeadlineDigest/1.0'; // honest, plain identification; no browser impersonation

// ---------- small XML helpers (no dependencies) ----------
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export function decode(s) {
  return String(s || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in ENT ? ENT[n.toLowerCase()] : m));
}
export function cleanText(s) {
  const noCdata = String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  return decode(decode(noCdata).replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

// Tag-balance check. Strict enough to catch truncation and broken markup; not a full XML validator.
export function isWellFormed(xml) {
  if (!xml || typeof xml !== 'string') return { ok: false, reason: 'empty' };
  let s = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<\?[\s\S]*?\?>/g, '').replace(/<!DOCTYPE[^>]*>/gi, '');
  const re = /<(\/?)([A-Za-z_][\w:.-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  const stack = [];
  let m, last = 0, root = null, rootClosed = false;
  while ((m = re.exec(s))) {
    if (/</.test(s.slice(last, m.index))) return { ok: false, reason: 'stray <' };
    last = re.lastIndex;
    const [, close, name, , self] = m;
    if (rootClosed) return { ok: false, reason: 'content after root' };
    if (close) {
      if (stack.pop() !== name) return { ok: false, reason: 'mismatched </' + name + '>' };
      if (!stack.length) rootClosed = true;
    } else if (!self) {
      if (!stack.length) { if (root) return { ok: false, reason: 'two roots' }; root = name; }
      stack.push(name);
    } else if (!stack.length) { root = name; rootClosed = true; }
  }
  if (/</.test(s.slice(last))) return { ok: false, reason: 'stray <' };
  if (stack.length) return { ok: false, reason: 'unclosed <' + stack[stack.length - 1] + '>' };
  if (!root) return { ok: false, reason: 'no root' };
  return { ok: true, root };
}

const tag = (block, name) => {
  const m = new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + name + '>', 'i').exec(block);
  return m ? m[1] : '';
};
const attr = (block, name, a) => {
  const m = new RegExp('<' + name + '\\b[^>]*\\b' + a + '\\s*=\\s*"([^"]*)"', 'i').exec(block);
  return m ? decode(m[1]) : '';
};

// RSS 2.0 or Atom. Returns raw-ish items; callers pick which fields they keep.
export function parseItems(xml) {
  const out = [];
  const rss = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [];
  for (const b of rss) {
    out.push({
      title: cleanText(tag(b, 'title')),
      link: cleanText(tag(b, 'link')) || cleanText(tag(b, 'guid')),
      date: cleanText(tag(b, 'pubDate')) || cleanText(tag(b, 'dc:date')),
      cover: attr(b, 'enclosure', 'url') || attr(b, 'media:content', 'url') || attr(b, 'media:thumbnail', 'url'),
      raw: b,
    });
  }
  if (!rss.length) {
    for (const b of xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || []) {
      out.push({ title: cleanText(tag(b, 'title')), link: attr(b, 'link', 'href'), date: cleanText(tag(b, 'published')) || cleanText(tag(b, 'updated')), cover: '', raw: b });
    }
  }
  return out;
}

export function toIso(d) {
  const t = Date.parse(d);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

// ---------- blocklist ----------
export function makeBlocker(patterns) {
  const res = patterns.map((p) => new RegExp(p, 'i'));
  return (...texts) => texts.some((t) => res.some((r) => r.test(t || '')));
}

// ---------- self-feed validation ----------
export function validateSelfFeed(xml, { checkItems = 20, requireCoverImages = true, blocked }) {
  const wf = isWellFormed(xml);
  const problems = [];
  if (!wf.ok) problems.push('not well-formed: ' + wf.reason);
  const rootOk = wf.ok && wf.root === 'rss';
  if (wf.ok && !rootOk) problems.push('root element is ' + wf.root + ', expected rss');
  const items = wf.ok ? parseItems(xml).slice(0, checkItems) : [];
  if (wf.ok && !items.length) problems.push('no items');
  const dates = items.map((i) => Date.parse(i.date));
  const badDates = dates.filter((d) => !Number.isFinite(d)).length;
  if (badDates) problems.push(badDates + ' item(s) with a missing or unreadable pubDate');
  let newestFirst = true;
  for (let i = 1; i < dates.length; i++) if (Number.isFinite(dates[i]) && Number.isFinite(dates[i - 1]) && dates[i] > dates[i - 1]) newestFirst = false;
  if (!newestFirst) problems.push('items are not newest first');
  const noCover = items.filter((i) => !i.cover);
  if (requireCoverImages && noCover.length) problems.push(noCover.length + ' of ' + items.length + ' items have no cover image (first: ' + noCover[0].link + ')');
  const gc = items.filter((i) => blocked(i.title, i.link, i.raw));
  if (gc.length) problems.push(gc.length + ' item(s) mention a blocked publisher (first: ' + gc[0].link + ')');
  return {
    ok: problems.length === 0,
    checks: {
      wellFormed: wf.ok && rootOk,
      newestFirst,
      itemsChecked: items.length,
      withCoverImage: items.length - noCover.length,
      noBlockedPublisher: gc.length === 0,
    },
    newest: items[0] ? { title: items[0].title, link: items[0].link, publishedAt: toIso(items[0].date) } : null,
    problems,
  };
}

// ---------- outside feed digest ----------
export function digestFeed(xml, feed, { limit = 12, blocked }) {
  const must = (feed.titleMustMatch || []).map((p) => new RegExp(p, 'i'));
  const seen = new Set();
  const items = [];
  for (const i of parseItems(xml)) {
    if (!i.title || !/^https?:\/\//i.test(i.link)) continue;
    let host = '';
    try { host = new URL(i.link).hostname; } catch { continue; }
    if (blocked(i.title, host, i.link)) continue;
    if (must.length && !must.some((r) => r.test(i.title))) continue;
    if (seen.has(i.link)) continue;
    seen.add(i.link);
    // Headline-only: these four fields are the whole record.
    items.push({ title: i.title.slice(0, 220), source: feed.source, link: i.link, publishedAt: toIso(i.date) });
  }
  items.sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0));
  return items.slice(0, limit);
}

async function curlGet(url) {
  try {
    const { stdout } = await promisify(execFile)('curl', ['-sS', '-L', '--max-time', '25', '-A', UA, '-w', '\n%{http_code}', url], { maxBuffer: 8 * 1024 * 1024 });
    const i = stdout.lastIndexOf('\n');
    return { status: Number(stdout.slice(i + 1)) || 0, text: stdout.slice(0, i) };
  } catch { return { status: 0, text: '', error: 'network' }; }
}

async function get(url, timeoutMs = 20000, fetchImpl = fetch) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { headers: { 'user-agent': UA, accept: 'application/rss+xml, application/xml, text/xml, */*' }, redirect: 'follow', signal: ctl.signal });
    return { status: res.status, text: await res.text() };
  } catch (e) {
    return { status: 0, text: '', error: e && e.name === 'AbortError' ? 'timeout' : 'network' };
  } finally { clearTimeout(t); }
}

export async function buildDigest(cfg, { fetchImpl = fetch, now = new Date() } = {}) {
  const blocked = makeBlocker(cfg.blocklist.patterns);
  const selfRes = await get(cfg.selfFeed.url, 20000, fetchImpl);
  const self = selfRes.status === 200
    ? validateSelfFeed(selfRes.text, { ...cfg.selfFeed, blocked })
    : { ok: false, checks: {}, newest: null, problems: ['could not read the feed (HTTP ' + selfRes.status + ')'] };
  const cache = new Map();
  const feeds = [];
  const all = [];
  for (const f of cfg.outside) {
    if (!cache.has(f.url)) {
      let res = await get(f.url, 20000, fetchImpl);
      // Some publishers answer Node's HTTP client with 202/empty but serve curl normally. Retry once with plain curl
      // (same honest User-Agent, public syndication URL). Only when the default transport is in use; tests inject fetchImpl.
      if (res.status !== 200 && fetchImpl === fetch) res = await curlGet(f.url);
      else if (res.status !== 200) res = await get(f.url, 20000, fetchImpl);
      cache.set(f.url, res);
    }
    const r = cache.get(f.url);
    const looksLikeFeed = r.status === 200 && /<(rss|feed)[\s>]/i.test(r.text);
    if (!looksLikeFeed) {
      feeds.push({ id: f.id, source: f.source, label: f.label, ok: false, status: r.status, reason: r.status === 200 ? 'response was not an RSS or Atom feed' : (r.error || 'HTTP ' + r.status), items: 0 });
      continue;
    }
    const items = digestFeed(r.text, f, { limit: cfg.perFeedLimit, blocked });
    feeds.push({ id: f.id, source: f.source, label: f.label, ok: true, status: r.status, items: items.length });
    for (const it of items) all.push({ ...it, feed: f.id });
  }
  // One list for the page: newest first, a headline appears once even if two feeds carried it.
  const seen = new Set();
  const headlines = all.sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0))
    .filter((i) => (seen.has(i.link) ? false : seen.add(i.link))).slice(0, cfg.digestLimit);
  return {
    schema: 1,
    generatedAt: now.toISOString(),
    notice: 'Headlines only. Title, source, link and time. Always link out to the source.',
    selfFeed: { url: cfg.selfFeed.url, checkedAt: now.toISOString(), ...self },
    feeds,
    headlines,
  };
}

// Skip the write (and so the commit) when nothing but timestamps moved, unless the file is old.
export function materiallyDifferent(prev, next, maxAgeHours, now = Date.now()) {
  if (!prev) return true;
  if (now - Date.parse(prev.generatedAt) > maxAgeHours * 3600000) return true;
  const strip = (d) => JSON.stringify({ ...d, generatedAt: 0, selfFeed: { ...d.selfFeed, checkedAt: 0 } });
  return strip(prev) !== strip(next);
}

const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };

async function main() {
  const cfgPath = arg('config', 'sports-live/rss-feeds.json');
  const out = arg('out', 'sports-live/rss-digest.json');
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  const next = await buildDigest(cfg);
  let prev = null;
  try { prev = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null; } catch {}
  const write = process.argv.includes('--force') || materiallyDifferent(prev, next, cfg.refreshFullAfterHours);
  if (write) writeFileSync(out, JSON.stringify(next, null, 1) + '\n');
  console.log(JSON.stringify({
    selfFeedOk: next.selfFeed.ok, selfFeedChecks: next.selfFeed.checks, selfFeedProblems: next.selfFeed.problems,
    feeds: next.feeds, headlines: next.headlines.length, sample: next.headlines.slice(0, 3), wrote: write,
  }, null, 1));
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `selfok=${next.selfFeed.ok}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });
