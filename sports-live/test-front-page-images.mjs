// Exercise the production image handler, with browser events and a controlled clock.
// Run: node --test sports-live/test-front-page-images.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const runtime = readFileSync(new URL('./src/front-page.js', import.meta.url), 'utf8');
const handler = runtime.slice(runtime.indexOf('  function imgFallback(root) {'), runtime.indexOf('  // Owner request: omit Brenden'));
assert.ok(handler.startsWith('  function imgFallback(root) {'), 'production handler not found');

function fixture({ lazy = false, complete = false, width = 0, original = '', video = false } = {}) {
  const timers = [], listeners = {}, notes = [], classes = new Set();
  let observer;
  const attrs = new Map([['src', video ? 'https://i.ytimg.com/vi/test/hqdefault.jpg' : 'https://static.wixstatic.com/media/test/v1/fit/test.jpg'], ['srcset', 'test.jpg 480w'], ['sizes', '100vw']]);
  if (original) attrs.set('data-fp-orig', original);
  const box = {
    classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c) },
    closest: () => video ? box : null,
    appendChild: (n) => { notes.push(n); n.remove = () => notes.splice(notes.indexOf(n), 1); },
    querySelector: () => notes[0] || null,
    querySelectorAll: () => notes.slice(),
  };
  const image = {
    tagName: 'IMG', dataset: {}, hidden: false, isConnected: true, parentElement: box,
    loading: lazy ? 'lazy' : 'eager', complete, naturalWidth: width,
    getAttribute: (k) => attrs.get(k) || null,
    removeAttribute: (k) => attrs.delete(k),
    get src() { return attrs.get('src') || ''; },
    set src(v) { attrs.set('src', v); this.complete = false; this.naturalWidth = 0; },
  };
  const root = { addEventListener: (n, f) => { listeners[n] = f; }, querySelectorAll: () => [image] };
  const context = vm.createContext({ document: { createElement: () => ({}) },
    setTimeout: (f) => timers.push(f),
    IntersectionObserver: class { constructor(f) { observer = f; } observe() {} unobserve() {} },
  });
  vm.runInContext(handler, context);
  context.imgFallback(root);
  return { image, attrs, notes, classes,
    elapsed: () => timers.splice(0).forEach((f) => f()),
    scroll: () => observer([{ target: image, isIntersecting: true }]),
    error: () => { image.complete = true; image.naturalWidth = 0; listeners.error({ target: image }); },
    load: () => { image.complete = true; image.naturalWidth = 1000; listeners.load?.({ target: image }); },
  };
}

test('valid eager photo pending beyond seven seconds keeps its URLs and loads later', () => {
  const f = fixture(); f.elapsed();
  assert.ok(f.attrs.has('src')); assert.ok(f.attrs.has('srcset'));
  assert.equal(f.image.hidden, false); assert.equal(f.image.dataset.fpFailed, undefined);
  f.load(); assert.equal(f.image.naturalWidth, 1000); assert.equal(f.notes.length, 0);
});
test('lazy photo gets its own load opportunity after scrolling, without a deadline', () => {
  const f = fixture({ lazy: true }); f.elapsed();
  assert.equal(f.image.dataset.fpWatched, undefined);
  f.scroll(); f.elapsed(); assert.ok(f.attrs.has('src')); assert.equal(f.image.hidden, false);
  f.load(); assert.equal(f.notes.length, 0);
});
test('failed Wix cut retries the original once and tolerates a slow retry', () => {
  const f = fixture({ original: 'https://static.wixstatic.com/media/original.jpg' }); f.error();
  assert.equal(f.image.src, 'https://static.wixstatic.com/media/original.jpg');
  assert.equal(f.attrs.has('data-fp-orig'), false); assert.equal(f.attrs.has('srcset'), false);
  f.elapsed(); assert.equal(f.image.hidden, false); f.load(); assert.equal(f.notes.length, 0);
});
test('genuine original failure keeps one honest fallback and a later successful load restores it', () => {
  const f = fixture(); f.error(); f.error();
  assert.equal(f.image.hidden, true); assert.equal(f.notes.length, 1);
  assert.equal(f.notes[0].textContent, 'Photo unavailable');
  f.load(); assert.equal(f.image.hidden, false); assert.equal(f.image.dataset.fpFailed, undefined);
  assert.equal(f.notes.length, 0); assert.equal(f.classes.has('fp-media-unavailable'), false);
});
test('cached decoded photo stays visible', () => {
  const f = fixture({ complete: true, width: 1000 }); f.elapsed();
  assert.equal(f.image.hidden, false); assert.equal(f.notes.length, 0);
});
test('cached failed Wix cut still retries the original rather than skipping it', () => {
  const f = fixture({ complete: true, original: 'https://static.wixstatic.com/media/original.jpg' }); f.elapsed();
  assert.equal(f.image.src, 'https://static.wixstatic.com/media/original.jpg');
  assert.equal(f.image.hidden, false); f.load(); assert.equal(f.notes.length, 0);
});
test('YouTube failure retries mqdefault once, then retains the replay link fallback', () => {
  const f = fixture({ video: true }); f.error();
  assert.match(f.image.src, /mqdefault\.jpg$/); f.error();
  assert.equal(f.notes.length, 1); assert.equal(f.notes[0].textContent, 'Watch replay');
});
test('removed photo does not receive fallback markup', () => {
  const f = fixture(); f.image.isConnected = false; f.elapsed();
  assert.equal(f.notes.length, 0); assert.ok(f.attrs.has('src'));
});
