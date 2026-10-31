// Unit tests for the RSS validator and digest. No network. Run: node --test automation/rss/rss_digest.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { isWellFormed, validateSelfFeed, digestFeed, makeBlocker, buildDigest, materiallyDifferent, cleanText } from './rss_digest.mjs';

const blocked = makeBlocker(['gator\\s*-?\\s*country', 'gatorcountry']);
const item = (t, link, date, cover = true) => `<item><title><![CDATA[${t}]]></title><link>${link}</link><pubDate>${date}</pubDate>${cover ? '<enclosure url="https://static.wixstatic.com/media/a.jpg" length="0" type="image/png"/>' : ''}</item>`;
const feed = (...items) => `<?xml version="1.0"?><rss version="2.0"><channel><title>x</title>${items.join('')}</channel></rss>`;
const GOOD = feed(
  item('Newest', 'https://www.gatorbaitmedia.com/post/a', 'Sat, 31 Oct 2026 14:50:20 GMT'),
  item('Older', 'https://www.gatorbaitmedia.com/post/b', 'Sat, 31 Oct 2026 10:00:00 GMT'),
);

test('well-formed detects truncation and mismatches', () => {
  assert.equal(isWellFormed(GOOD).ok, true);
  assert.equal(isWellFormed(GOOD.slice(0, -20)).ok, false);
  assert.equal(isWellFormed('<rss><a></b></rss>').ok, false);
  assert.equal(isWellFormed('').ok, false);
});

test('self feed: good feed passes', () => {
  const r = validateSelfFeed(GOOD, { blocked });
  assert.equal(r.ok, true);
  assert.equal(r.checks.withCoverImage, 2);
  assert.equal(r.newest.title, 'Newest');
});

test('self feed: out-of-order, missing cover and blocked publisher are all reported', () => {
  const bad = feed(
    item('Old first', 'https://www.gatorbaitmedia.com/post/a', 'Sat, 31 Oct 2026 08:00:00 GMT'),
    item('New second', 'https://www.gatorbaitmedia.com/post/b', 'Sat, 31 Oct 2026 12:00:00 GMT', false),
    item('Gator Country says', 'https://www.gatorbaitmedia.com/post/c', 'Sat, 31 Oct 2026 07:00:00 GMT'),
  );
  const r = validateSelfFeed(bad, { blocked });
  assert.equal(r.ok, false);
  assert.equal(r.checks.newestFirst, false);
  assert.equal(r.checks.noBlockedPublisher, false);
  assert.ok(r.problems.some((p) => /no cover image/.test(p)));
});

test('digest keeps four fields only, drops Gator Country by title and host, dedupes, sorts newest first', () => {
  const xml = feed(
    item('Florida preps for Georgia', 'https://www.espn.com/college-football/story/_/id/1', 'Sat, 31 Oct 2026 12:00:00 GMT'),
    item('From Gator Country', 'https://www.espn.com/x/2', 'Sat, 31 Oct 2026 13:00:00 GMT'),
    item('Mirror story', 'https://www.gatorcountry.com/story/3', 'Sat, 31 Oct 2026 13:30:00 GMT'),
    item('Florida preps for Georgia', 'https://www.espn.com/college-football/story/_/id/1', 'Sat, 31 Oct 2026 12:00:00 GMT'),
    item('Newer one', 'https://www.espn.com/college-football/story/_/id/4', 'Sat, 31 Oct 2026 14:00:00 GMT'),
  ).replace('<title>x</title>', '<description>FULL ARTICLE TEXT SHOULD NEVER APPEAR</description>');
  const items = digestFeed(xml, { source: 'ESPN' }, { blocked });
  assert.deepEqual(items.map((i) => i.title), ['Newer one', 'Florida preps for Georgia']);
  assert.deepEqual(Object.keys(items[0]).sort(), ['link', 'publishedAt', 'source', 'title']);
  assert.ok(!JSON.stringify(items).toLowerCase().includes('gatorcountry'));
});

test('titleMustMatch narrows to SEC headlines', () => {
  const xml = feed(item('Big Ten race tightens', 'https://e/1', 'Sat, 31 Oct 2026 12:00:00 GMT'), item('Georgia hosts Florida', 'https://e/2', 'Sat, 31 Oct 2026 11:00:00 GMT'));
  const items = digestFeed(xml, { source: 'ESPN', titleMustMatch: ['Georgia', '\\bSEC\\b'] }, { blocked });
  assert.equal(items.length, 1);
  assert.equal(items[0].title, 'Georgia hosts Florida');
});

test('non-http links are dropped', () => {
  const xml = feed(item('Bad', 'javascript:alert(1)', 'Sat, 31 Oct 2026 12:00:00 GMT'));
  assert.equal(digestFeed(xml, { source: 'S' }, { blocked }).length, 0);
});

test('buildDigest: a blocked outside feed is reported ok:false with no items; others still work', async () => {
  const cfg = {
    selfFeed: { url: 'https://self/', checkItems: 20, requireCoverImages: true },
    blocklist: { patterns: ['gatorcountry'] }, perFeedLimit: 5, digestLimit: 10,
    outside: [
      { id: 'a', source: 'ESPN', label: 'a', url: 'https://espn/' },
      { id: 'b', source: 'FloridaGators.com', label: 'b', url: 'https://ufl/' },
    ],
  };
  const map = {
    'https://self/': { status: 200, text: async () => GOOD },
    'https://espn/': { status: 200, text: async () => feed(item('Headline', 'https://www.espn.com/s/1', 'Sat, 31 Oct 2026 12:00:00 GMT')) },
    'https://ufl/': { status: 200, text: async () => '<html>blocked</html>' },
  };
  const d = await buildDigest(cfg, { fetchImpl: async (u) => map[u], now: new Date('2026-10-31T15:00:00Z') });
  assert.equal(d.selfFeed.ok, true);
  assert.equal(d.feeds[0].ok, true);
  assert.equal(d.feeds[1].ok, false);
  assert.equal(d.headlines.length, 1);
});

test('materiallyDifferent ignores timestamps only', () => {
  const a = { generatedAt: '2026-10-31T10:00:00Z', selfFeed: { checkedAt: 'x', ok: true }, headlines: [1] };
  const b = { generatedAt: '2026-10-31T11:00:00Z', selfFeed: { checkedAt: 'y', ok: true }, headlines: [1] };
  assert.equal(materiallyDifferent(a, b, 6, Date.parse('2026-10-31T11:00:00Z')), false);
  assert.equal(materiallyDifferent(a, { ...b, headlines: [1, 2] }, 6, Date.parse('2026-10-31T11:00:00Z')), true);
  assert.equal(materiallyDifferent(a, b, 6, Date.parse('2026-11-01T11:00:00Z')), true);
});

test('cleanText strips tags and entities', () => {
  assert.equal(cleanText('<![CDATA[A &amp; <b>B</b>]]>'), 'A & B');
});
