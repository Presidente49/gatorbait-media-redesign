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

function harness(records) {
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
  const context = vm.createContext({
    URL, Date, Intl, location: { href: 'https://www.gatorbaitmedia.com/' }, DAY: day,
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
  assert.deepEqual(rows, ['/post/buddy', ...Array.from({ length: 5 }, (_, i) => `/post/writer-${i}`), '/post/brenden', '/post/staff']);
  assert.equal(new Set([h.link.href, ...rows]).size, 9);
  assert.equal(JSON.stringify(records), before, 'Publication timestamps and source records must not change');
});

test('selects current nine before partitioning so old writers cannot crowd out current staff', () => {
  const records = [story('current-staff', 'GatorBait Staff'), ...Array.from({ length: 12 }, (_, i) => story(`writer-${i}`, 'Franz Beard', 1000 + i))];
  assert.deepEqual(harness(records).order(), [...Array.from({ length: 8 }, (_, i) => `/post/writer-${i}`), '/post/current-staff']);
});

test('deduplicates canonical paths and skips invalid or far-future dates before filling nine slots', () => {
  const records = [story('duplicate', 'Buddy Martin'), story('duplicate/', 'Buddy Martin', 1),
    [0, 'undated', '/post/undated', 'Franz Beard'], [now + day * 2, 'future', '/post/future', 'Franz Beard'],
    ...Array.from({ length: 10 }, (_, i) => story(`current-${i}`, 'Loren Meadows', i + 2))];
  assert.deepEqual(harness(records).order(), ['/post/duplicate', ...Array.from({ length: 8 }, (_, i) => `/post/current-${i}`)]);
});

test('recognizes case and whitespace variants without demoting other named writers', () => {
  const records = [story('staff', ' gAtOrBaIt   StAfF '), story('brenden', ' BRENDEN MARTIN ', 1), story('buddy', 'Buddy Martin', 2)];
  assert.deepEqual(harness(records).order(), ['/post/buddy', '/post/staff', '/post/brenden']);
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
