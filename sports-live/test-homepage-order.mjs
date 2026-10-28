import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('./broadcast-home-color.js', import.meta.url), 'utf8');
const between = (start, end) => {
  const from = source.indexOf(start), to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `Missing production function ${start}`);
  return source.slice(from, to);
};
const functions = between('function storyPath(', 'function freshRows(')
  + between('function freshLead(', '/* Reuse the same live RSS records')
  + between('function freshRows(', 'function img(u,w,h)');
const day = 86400000, now = Date.now();
const story = (slug, author, age = 0) => [now - age - 1000, slug, `/post/${slug}`, author,
  'https://static.wixstatic.com/media/16b519_0000~mv2.jpg', 'Verified cover', 'Photo by Chris Spears, GatorBait Media.', 'A short summary.'];

function harness(records, fixedNow) {
  const link = { href: '/post/old-lead' };
  const lead = {
    html: '',
    querySelector(selector) {
      return selector === 'a[href]' ? link : selector === 'img' ? { src: 'old.jpg' } : { textContent: 'Old headline' };
    },
    set innerHTML(value) { this.html = value; link.href = /href="([^"]+)"/.exec(value)[1]; },
  };
  const photoSources = {};
  const list = { innerHTML: '', classList: { add() {} }, querySelectorAll: () => [], parentNode: { querySelector: () => photoSources } };
  const root = {
    querySelector(selector) {
      return selector === '.bc-hero .sh-lead' ? lead : selector === '.bc-hero .sh-lead a[href]' ? link : selector === '.bc-rows' ? list : null;
    },
    querySelectorAll: () => [], setAttribute() {}, classList: { add() {} },
  };
  const ClockDate = fixedNow === undefined ? Date : class extends Date { static now() { return fixedNow; } };
  const context = vm.createContext({
    URL, Date: ClockDate, Intl, location: { href: 'https://www.gatorbaitmedia.com/' }, DAY: day,
    D: { all: records }, COVER_META: {}, esc: value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;'),
  });
  vm.runInContext(functions, context);
  return { context, root, lead, link, list, order: () => Array.from(context.homepageStories(records), f => f[2]) };
}

test('current named writers lead, Buddy precedes Brenden, staff finishes the same nine-story window', () => {
  const records = [story('brenden', 'Brenden Martin'), story('franz', 'Franz Beard', 1000), story('buddy', 'Buddy Martin', 2000),
    ...Array.from({ length: 5 }, (_, i) => story(`writer-${i}`, 'Loren Meadows', 3000 + i)), story('staff', 'GatorBait Staff', 4000)];
  const before = JSON.stringify(records), h = harness(records);
  h.context.freshLead(h.root);
  h.context.freshRows(h.root);
  const rows = Array.from(h.list.innerHTML.matchAll(/<li\b[^>]*><a href="([^"]+)"/g), m => m[1]);
  assert.equal(h.link.href, '/post/franz');
  assert.deepEqual(rows, ['/post/buddy', ...Array.from({ length: 5 }, (_, i) => `/post/writer-${i}`), '/post/staff', '/post/brenden']);
  assert.equal(new Set([h.link.href, ...rows]).size, 9);
  assert.equal(JSON.stringify(records), before, 'Publication timestamps and source records must not change');
});

test('selects current nine before partitioning so old writers cannot crowd out current staff', () => {
  const records = [story('current-staff', 'GatorBait Staff'), ...Array.from({ length: 12 }, (_, i) => story(`writer-${i}`, 'Franz Beard', 1000 + i))];
  assert.deepEqual(harness(records).order(), [...Array.from({ length: 8 }, (_, i) => `/post/writer-${i}`), '/post/current-staff']);
});

test('newest staff column is the final item even when four older staff stories share the window', () => {
  const records = [story('current-staff', 'GatorBait Staff'), story('franz', 'Franz Beard', 1), story('buddy', 'Buddy Martin', 2),
    ...Array.from({ length: 4 }, (_, i) => story(`older-staff-${i}`, i % 2 ? 'Brenden Martin' : 'GatorBait Staff', 3 + i))];
  const h = harness(records);
  h.context.freshLead(h.root);
  h.context.freshRows(h.root);
  assert.equal(h.link.href, '/post/franz');
  assert.deepEqual(Array.from(h.list.innerHTML.matchAll(/<li\b[^>]*><a href="([^"]+)"/g), m => m[1]),
    ['/post/buddy', '/post/older-staff-3', '/post/older-staff-2', '/post/older-staff-1', '/post/older-staff-0', '/post/current-staff']);
});

test('deduplicates canonical paths and skips invalid or far-future dates before filling nine slots', () => {
  const records = [story('duplicate', 'Buddy Martin'), story('duplicate/', 'Buddy Martin', 1),
    [0, 'undated', '/post/undated', 'Franz Beard'], [now + day * 2, 'future', '/post/future', 'Franz Beard'],
    ...Array.from({ length: 10 }, (_, i) => story(`current-${i}`, 'Loren Meadows', i + 2))];
  assert.deepEqual(harness(records).order(), ['/post/duplicate', ...Array.from({ length: 8 }, (_, i) => `/post/current-${i}`)]);
});

test('recognizes case and whitespace variants without demoting other named writers', () => {
  const records = [story('staff', ' gAtOrBaIt   StAfF '), story('brenden', ' BRENDEN MARTIN ', 1), story('buddy', 'Buddy Martin', 2)];
  assert.deepEqual(harness(records).order(), ['/post/buddy', '/post/brenden', '/post/staff']);
});

test('all-staff fallback and empty feeds remain safe', () => {
  const records = [story('older', 'GatorBait Staff', 2), story('newer', 'Brenden Martin', 1)];
  assert.deepEqual(harness(records).order(), ['/post/newer', '/post/older']);
  assert.deepEqual(harness([]).order(), []);
});

test('later feed refresh preserves the already reconciled lead and excludes it from rows', () => {
  const records = [story('franz', 'Franz Beard', 10), story('buddy', 'Buddy Martin', 20), story('staff', 'GatorBait Staff')];
  const h = harness(records);
  h.context.freshLead(h.root);
  h.context.D.all = [story('new-writer', 'Loren Meadows'), ...records];
  h.context.freshLead(h.root);
  h.context.freshRows(h.root);
  assert.equal(h.link.href, '/post/franz');
  assert.deepEqual(Array.from(h.list.innerHTML.matchAll(/<li\b[^>]*><a href="([^"]+)"/g), m => m[1]), ['/post/new-writer', '/post/buddy', '/post/staff']);
});

const packageNow = Date.parse('2026-10-28T12:00:00Z');
const packagePaths = {
  lead: '/post/why-i-despise-the-georgia-bulldogs-and-why-you-should-too',
  basketball: '/post/golden-still-looking-to-solidify-his-bench-rotation',
  rays: '/post/rays-baseball-world-series-game-4-brewers-gators-ties',
  buddy: '/post/florida-georgia-sumrall-knows-the-math',
  brenden: '/post/florida-basketball-urban-renewal-klavzar-aberdeen-stetson-exhibition',
};
const packageStory = (path, author, age = 0) => [packageNow - age * 1000, path.slice(6), path, author,
  'https://static.wixstatic.com/media/16b519_0000~mv2.jpg', 'Verified cover', 'Photo by Chris Spears, GatorBait Media.', 'Summary.'];
function packageRecords() {
  return [
    packageStory(packagePaths.rays, 'GatorBait Staff', 0),
    packageStory(packagePaths.basketball, 'Franz Beard', 1),
    packageStory(packagePaths.lead, 'Franz Beard', 2),
    packageStory('/post/other-writer-a', 'Loren Meadows', 3),
    packageStory(packagePaths.brenden, 'GatorBait Staff', 4),
    packageStory(packagePaths.buddy, 'Buddy Martin', 5),
    packageStory('/post/other-writer-b', 'Eddie Gilley', 6),
    packageStory('/post/older-staff', 'Brenden Martin', 7),
    packageStory('/post/oldest-staff', 'GatorBait Staff', 8),
  ];
}
const expectedPackage = [packagePaths.lead, packagePaths.basketball, packagePaths.rays, packagePaths.buddy,
  '/post/other-writer-a', '/post/other-writer-b', '/post/oldest-staff', '/post/older-staff', packagePaths.brenden];
const expectedDefault = [packagePaths.basketball, packagePaths.lead, '/post/other-writer-a', packagePaths.buddy,
  '/post/other-writer-b', '/post/oldest-staff', '/post/older-staff', packagePaths.brenden, packagePaths.rays];

test('Oct28 package shares exact lead/row order, leaves remaining default order intact and preserves source values', () => {
  const records = packageRecords(), before = JSON.stringify(records), h = harness(records, packageNow);
  h.context.HOMEPAGE_PACKAGE.lead = packagePaths.lead;
  assert.deepEqual(h.order(), expectedPackage);
  h.context.freshLead(h.root);
  h.context.freshRows(h.root);
  const rendered = [h.link.href, ...Array.from(h.list.innerHTML.matchAll(/<li\b[^>]*><a href="([^"]+)"/g), m => m[1])];
  assert.deepEqual(rendered, expectedPackage);
  assert.equal(JSON.stringify(records), before, 'No publication date, cover, byline or source record mutation');
});

test('unresolved or absent main story is skipped and never fabricated', () => {
  const records = packageRecords().filter(f => f[2] !== packagePaths.lead), h = harness(records, packageNow);
  h.context.HOMEPAGE_PACKAGE.lead = null;
  assert.deepEqual(h.order(), expectedPackage.filter(path => path !== packagePaths.lead));
  h.context.HOMEPAGE_PACKAGE.lead = packagePaths.lead;
  assert.deepEqual(h.order(), expectedPackage.filter(path => path !== packagePaths.lead));
});

test('package cannot drag older requested stories outside the newest-nine window or expand that window', () => {
  const records = Array.from({length: 9}, (_, i) => packageStory(`/post/current-${i}`, 'Loren Meadows', i));
  records.push(packageStory(packagePaths.lead, 'Franz Beard', 100));
  records.push(packageStory(packagePaths.basketball, 'Franz Beard', 101));
  const h = harness(records, packageNow);
  h.context.HOMEPAGE_PACKAGE.lead = packagePaths.lead;
  assert.deepEqual(h.order(), Array.from({length: 9}, (_, i) => `/post/current-${i}`));
});

test('package is bounded by exact Eastern-day boundaries and missing or malformed bounds fall back safely', () => {
  const from = Date.parse('2026-10-28T04:00:00Z'), until = Date.parse('2026-10-29T04:00:00Z');
  for (const clock of [from - 1, until, until + day]) {
    const h = harness(packageRecords(), clock);
    h.context.HOMEPAGE_PACKAGE.lead = packagePaths.lead;
    assert.deepEqual(h.order(), expectedDefault);
  }
  for (const bounds of [{until: 'invalid'}, {from: null}, {from: '2026-10-30', until: '2026-10-29'}]) {
    const h = harness(packageRecords(), packageNow);
    Object.assign(h.context.HOMEPAGE_PACKAGE, bounds, {lead: packagePaths.lead});
    assert.deepEqual(h.order(), expectedDefault);
  }
});

test('future content uses normal default lead after package expiry while existing readers keep the stable lead', () => {
  const later = Date.parse('2026-10-29T05:00:00Z');
  const next = [later - 1000, 'A new filing', '/post/new-next-day-writer', 'Loren Meadows',
    'https://static.wixstatic.com/media/16b519_0000~mv2.jpg', 'Cover', 'Credit', 'Summary.'];
  const h = harness([next, ...packageRecords()], later);
  h.context.HOMEPAGE_PACKAGE.lead = packagePaths.lead;
  assert.equal(h.order()[0], next[2]);
  h.context.freshLead(h.root);
  h.context.D.all = [packageStory(packagePaths.basketball, 'Franz Beard'), next, ...packageRecords()];
  h.context.freshLead(h.root);
  assert.equal(h.link.href, next[2], 'Existing stable-reading lead remains intact');
});

test('failed or absent package photograph never changes the requested ordering or hides its headline', () => {
  const records = packageRecords();
  records.find(f => f[2] === packagePaths.rays)[4] = '';
  const h = harness(records, packageNow);
  h.context.HOMEPAGE_PACKAGE.lead = packagePaths.lead;
  assert.deepEqual(h.order(), expectedPackage);
  h.context.freshLead(h.root);
  h.context.freshRows(h.root);
  assert.ok(h.list.innerHTML.includes(packagePaths.rays));
});

