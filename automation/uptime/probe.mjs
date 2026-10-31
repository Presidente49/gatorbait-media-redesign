#!/usr/bin/env node
// GatorBait uptime probe. Measures four public URLs and keeps a rolling 7-day record in sports-live/uptime.json.
// Only measured data is stored. Availability is computed from recorded runs; nothing is estimated or back-filled.
// Usage: node automation/uptime/probe.mjs [--file sports-live/uptime.json] [--base .uptime-state/uptime.json] [--statedir .uptime-state]
// Writes the merged document to --file only when a commit is warranted, always refreshes the state copy, and
// when GITHUB_OUTPUT is set emits `commit=true|false` and `state=...`.
import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const SITE = 'https://www.gatorbaitmedia.com';
export const WINDOW_DAYS = 7;
export const INTERVAL_MIN = 10;
export const MAX_RUNS = 1100; // 7 days at 10-minute ticks is 1008; small headroom, hard size cap
export const TIMEOUT_MS = 15000;
export const COMMIT_EVERY_MS = 55 * 60 * 1000;
const UA = 'GatorBaitMedia-UptimeProbe/1.0 (+https://github.com/Presidente49/gatorbait-media-redesign)';

export const BASE_TARGETS = [
  { id: 'home', label: 'Homepage', url: SITE + '/' },
  { id: 'feed', label: 'Blog feed (RSS)', url: SITE + '/blog-feed.xml' },
  { id: 'magazine', label: 'Magazine', url: SITE + '/magazine' },
  { id: 'post', label: 'Latest story', url: null }, // resolved from the feed each run
];

// First /post/ link in an RSS body, or null.
export function firstPostUrl(xml) {
  const m = /<item>[\s\S]*?<link>\s*(?:<!\[CDATA\[)?\s*(https:\/\/www\.gatorbaitmedia\.com\/post\/[^\s<\]]+)/i.exec(xml || '');
  return m ? m[1] : null;
}

// One measured GET. status 0 means no HTTP response (network error or timeout).
export async function probeUrl(url, { fetchImpl = fetch, now = () => Date.now(), timeoutMs = TIMEOUT_MS, needRss = false } = {}) {
  const t0 = now();
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { headers: { 'user-agent': UA, 'cache-control': 'no-cache' }, redirect: 'follow', signal: ctl.signal });
    const body = await res.text();
    const ms = Math.max(0, Math.round(now() - t0));
    let ok = res.status >= 200 && res.status < 300;
    if (ok && needRss) ok = /<rss[\s>]/i.test(body) && /<item>/i.test(body);
    return { status: res.status, ms, ok, body: needRss ? body : '' };
  } catch (e) {
    return { status: 0, ms: Math.max(0, Math.round(now() - t0)), ok: false, body: '', error: e && e.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}

// Probe all targets. Feed first so the newest post URL can be probed. Returns one run record.
export async function runProbe(opts = {}) {
  const nowFn = opts.now || (() => Date.now());
  const at = new Date(nowFn()).toISOString();
  const [home, feed, mag] = await Promise.all([
    probeUrl(BASE_TARGETS[0].url, opts),
    probeUrl(BASE_TARGETS[1].url, { ...opts, needRss: true }),
    probeUrl(BASE_TARGETS[2].url, opts),
  ]);
  const postUrl = firstPostUrl(feed.body) || opts.fallbackPostUrl || null;
  // If nothing can name a story there is nothing to measure: record an honest failure, not a skip.
  const post = postUrl ? await probeUrl(postUrl, opts) : { status: 0, ms: 0, ok: false, error: 'no-post-url' };
  const s = [home, feed, mag, post].map((r) => [r.status, r.ms, r.ok ? 1 : 0]);
  return { t: at, s, postUrl };
}

export function runOk(run) { return run.s.every((x) => x[2] === 1); }

// Merge a new run into the previous document, trim to the window and cap.
export function mergeRun(prev, run, now = Date.now()) {
  const cutoff = now - WINDOW_DAYS * 86400000;
  const keep = ((prev && Array.isArray(prev.runs)) ? prev.runs : [])
    .filter((r) => r && typeof r.t === 'string' && Array.isArray(r.s) && r.s.length === 4 && Date.parse(r.t) >= cutoff && r.t < run.t);
  const runs = keep.concat([{ t: run.t, s: run.s }]).slice(-MAX_RUNS);
  return buildDocument(runs, run.postUrl, now);
}

const pct = (ok, n) => (n ? Math.round((ok / n) * 10000) / 100 : null);

export function summarize(runs, now) {
  const part = (ms) => runs.filter((r) => now - Date.parse(r.t) <= ms);
  const calc = (rs) => {
    const targets = {};
    const medianMs = {};
    BASE_TARGETS.forEach((t, i) => {
      targets[t.id] = pct(rs.filter((r) => r.s[i][2] === 1).length, rs.length);
      const v = rs.filter((r) => r.s[i][2] === 1).map((r) => r.s[i][1]).sort((a, b) => a - b);
      medianMs[t.id] = v.length ? v[Math.floor((v.length - 1) / 2)] : null;
    });
    return { runs: rs.length, overall: pct(rs.filter(runOk).length, rs.length), targets, medianMs };
  };
  const d1 = calc(part(86400000));
  const d7 = calc(part(WINDOW_DAYS * 86400000));
  const expected7 = WINDOW_DAYS * 24 * (60 / INTERVAL_MIN);
  const last = runs[runs.length - 1] || null;
  return {
    state: last ? (runOk(last) ? 'normal' : 'degraded') : 'unknown',
    lastChecked: last ? last.t : null,
    availability24h: d1,
    availability7d: d7,
    coverage7d: pct(d7.runs, expected7),
  };
}

export function buildDocument(runs, postUrl, now = Date.now()) {
  const targets = BASE_TARGETS.map((t) => ({ id: t.id, label: t.label, url: t.id === 'post' ? (postUrl || null) : t.url }));
  return {
    schema: 1,
    generatedAt: new Date(now).toISOString(),
    windowDays: WINDOW_DAYS,
    intervalMinutes: INTERVAL_MIN,
    method: 'GET from a GitHub Actions runner. runs[].s = [[httpStatus, ms, ok]] in target order; status 0 = no response. Availability = runs where every target answered OK / runs recorded. Runs GitHub skips are simply missing (see coverage7d).',
    targets,
    summary: summarize(runs, now),
    runs,
  };
}

// Commit when the picture changed (state or any target's HTTP status class vs the committed copy) or the committed copy is an hour old.
export function shouldCommit(committed, next, now = Date.now()) {
  if (!committed || !Array.isArray(committed.runs) || !committed.runs.length) return true;
  const a = committed.runs[committed.runs.length - 1];
  const b = next.runs[next.runs.length - 1];
  if (!b || a.t === b.t) return false;
  if (runOk(a) !== runOk(b)) return true;
  const cls = (x) => (x[0] === 0 ? 0 : Math.floor(x[0] / 100));
  if (a.s.some((x, i) => cls(x) !== cls(b.s[i]))) return true;
  return now - Date.parse(a.t) >= COMMIT_EVERY_MS;
}

const readJson = (p) => { try { return p && existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null; } catch { return null; } };
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };

async function main() {
  const file = arg('file', 'sports-live/uptime.json');
  const stateDir = arg('statedir', '.uptime-state');
  const committed = readJson(file);
  const cache = readJson(arg('base', stateDir + '/uptime.json'));
  // Start from whichever copy is newer: the Actions cache holds uncommitted runs between hourly commits.
  const prev = cache && (!committed || Date.parse(cache.generatedAt) > Date.parse(committed.generatedAt)) ? cache : committed;
  const run = await runProbe({ fallbackPostUrl: prev && prev.targets && prev.targets[3] && prev.targets[3].url });
  const doc = mergeRun(prev, run);
  const commit = shouldCommit(committed, doc);
  try { mkdirSync(stateDir, { recursive: true }); writeFileSync(stateDir + '/uptime.json', JSON.stringify(doc)); } catch {}
  if (commit) writeFileSync(file, JSON.stringify(doc));
  console.log(JSON.stringify({
    at: run.t,
    results: BASE_TARGETS.map((t, i) => ({ id: t.id, status: run.s[i][0], ms: run.s[i][1], ok: !!run.s[i][2] })),
    postUrl: run.postUrl, state: doc.summary.state,
    availability24h: doc.summary.availability24h.overall, availability7d: doc.summary.availability7d.overall,
    runsRecorded: doc.runs.length, commit,
  }, null, 1));
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `commit=${commit}\nstate=${doc.summary.state}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });
