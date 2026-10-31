// Unit tests for the uptime probe. No network. Run: node --test automation/uptime/probe.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { probeUrl, firstPostUrl, runProbe, mergeRun, shouldCommit, summarize, runOk, MAX_RUNS } from './probe.mjs';

const RSS = '<?xml version="1.0"?><rss><channel><item><title><![CDATA[x]]></title><link>https://www.gatorbaitmedia.com/post/hello-world</link></item><item><link>https://www.gatorbaitmedia.com/post/older</link></item></channel></rss>';
const resp = (status, body = 'ok') => ({ status, text: async () => body });
const fakeFetch = (map) => async (url) => { const v = map[url]; if (v instanceof Error) throw v; return v || resp(404, 'no'); };
const clock = (...ts) => { let i = 0; return () => ts[Math.min(i++, ts.length - 1)]; };
const T0 = Date.parse('2026-10-31T15:00:00Z');
const run = (t, ok = true) => ({ t: new Date(t).toISOString(), s: [0, 1, 2, 3].map(() => (ok ? [200, 300, 1] : [503, 900, 0])) });

test('firstPostUrl reads the first item link only', () => {
  assert.equal(firstPostUrl(RSS), 'https://www.gatorbaitmedia.com/post/hello-world');
  assert.equal(firstPostUrl('<rss></rss>'), null);
  assert.equal(firstPostUrl(''), null);
});

test('probeUrl records status and ms; 5xx is not ok', async () => {
  const f = fakeFetch({ 'https://a/': resp(200), 'https://b/': resp(503) });
  const a = await probeUrl('https://a/', { fetchImpl: f, now: clock(1000, 1250) });
  assert.deepEqual([a.status, a.ms, a.ok], [200, 250, true]);
  const b = await probeUrl('https://b/', { fetchImpl: f, now: clock(0, 40) });
  assert.deepEqual([b.status, b.ok], [503, false]);
});

test('probeUrl: thrown error becomes status 0, never ok', async () => {
  const r = await probeUrl('https://x/', { fetchImpl: fakeFetch({ 'https://x/': new Error('boom') }) });
  assert.equal(r.status, 0);
  assert.equal(r.ok, false);
});

test('probeUrl: a 200 that is not RSS fails the feed check', async () => {
  const r = await probeUrl('https://f/', { fetchImpl: fakeFetch({ 'https://f/': resp(200, '<html>error page</html>') }), needRss: true });
  assert.equal(r.status, 200);
  assert.equal(r.ok, false);
});

test('runProbe measures four targets and follows the newest post from the feed', async () => {
  const f = fakeFetch({
    'https://www.gatorbaitmedia.com/': resp(200),
    'https://www.gatorbaitmedia.com/blog-feed.xml': resp(200, RSS),
    'https://www.gatorbaitmedia.com/magazine': resp(200),
    'https://www.gatorbaitmedia.com/post/hello-world': resp(200),
  });
  const r = await runProbe({ fetchImpl: f });
  assert.equal(r.s.length, 4);
  assert.equal(r.postUrl, 'https://www.gatorbaitmedia.com/post/hello-world');
  assert.ok(runOk(r));
});

test('runProbe: feed down and no fallback records a failed post check, not a skipped one', async () => {
  const f = fakeFetch({ 'https://www.gatorbaitmedia.com/': resp(200), 'https://www.gatorbaitmedia.com/magazine': resp(200) });
  const r = await runProbe({ fetchImpl: f });
  assert.equal(r.s[3][2], 0);
  assert.equal(runOk(r), false);
});

test('availability comes only from recorded runs (3 of 4 ok = 75)', () => {
  const runs = [run(T0 - 3000), run(T0 - 2000), run(T0 - 1000), run(T0, false)];
  const s = summarize(runs, T0 + 1000);
  assert.equal(s.availability24h.overall, 75);
  assert.equal(s.availability24h.runs, 4);
  assert.equal(s.state, 'degraded');
});

test('no runs means null availability and unknown state, never 100', () => {
  const s = summarize([], T0);
  assert.equal(s.availability24h.overall, null);
  assert.equal(s.state, 'unknown');
});

test('24h and 7d windows differ; runs older than 7 days are dropped', () => {
  const old = run(T0 - 8 * 86400000);
  const day3 = run(T0 - 3 * 86400000, false);
  const doc = mergeRun({ runs: [old, day3] }, { ...run(T0), postUrl: null }, T0 + 5000);
  assert.equal(doc.runs.length, 2);
  assert.equal(doc.summary.availability24h.overall, 100);
  assert.equal(doc.summary.availability7d.overall, 50);
});

test('size is capped', () => {
  const many = Array.from({ length: MAX_RUNS + 50 }, (_, i) => run(T0 - (MAX_RUNS + 60 - i) * 1000));
  const doc = mergeRun({ runs: many }, { ...run(T0), postUrl: null }, T0 + 1);
  assert.ok(doc.runs.length <= MAX_RUNS);
  assert.ok(JSON.stringify(doc).length < 150 * 1024);
});

test('shouldCommit: quiet and recent = no; state change = yes; hour old = yes; first ever = yes', () => {
  const prev = mergeRun(null, { ...run(T0), postUrl: null }, T0);
  const quiet = mergeRun(prev, { ...run(T0 + 600000), postUrl: null }, T0 + 600000);
  assert.equal(shouldCommit(prev, quiet, T0 + 600000), false);
  const bad = mergeRun(prev, { ...run(T0 + 600000, false), postUrl: null }, T0 + 600000);
  assert.equal(shouldCommit(prev, bad, T0 + 600000), true);
  const later = mergeRun(prev, { ...run(T0 + 3600000), postUrl: null }, T0 + 3600000);
  assert.equal(shouldCommit(prev, later, T0 + 3600000), true);
  assert.equal(shouldCommit(null, quiet, T0), true);
});
