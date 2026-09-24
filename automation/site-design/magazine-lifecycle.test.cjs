/* Lifecycle regression checks of the unmodified production source; no browser/network. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, 'magazine.js'), 'utf8');
function harness() {
  const nodes = new Map(), events = {}, requests = [], timers = new Map(), classes = new Set();
  let serial = 0;
  const location = { pathname: '/magazine' };
  const body = { insertBefore(node) { nodes.set(node.id, node); node.parentNode = body; } };
  const document = {
    readyState: 'complete', body,
    documentElement: { classList: { add: x => classes.add(x), remove: x => classes.delete(x) } },
    getElementById: id => nodes.get(id),
    createElement: () => ({ remove() { nodes.delete(this.id); } })
  };
  // Model parsed item nodes, not the XML parser: this test targets request/route ownership.
  class DOMParser {
    parseFromString(input) {
      const posts = JSON.parse(input);
      return { querySelectorAll: () => posts.map(post => ({
        children: Object.entries(post).map(([localName, textContent]) => ({ localName, textContent })),
        querySelector: () => ({ getAttribute: () => 'https://static.wixstatic.com/media/test.jpg' })
      })) };
    }
  }
  const window = { addEventListener(name, fn) { events[name] = fn; } };
  vm.runInNewContext(source, { window, document, location, DOMParser, AbortController,
    setTimeout(fn) { const id = ++serial; timers.set(id, fn); return id; },
    clearTimeout(id) { timers.delete(id); },
    fetch(url, options) { return new Promise((resolve, reject) => requests.push({ resolve, reject, signal: options.signal })); }
  });
  return {
    requests, nodes, classes,
    route(path) { location.pathname = path; events.gbmroutechange(); },
    timeout() { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); },
    resolve(index, title) {
      const posts = Array.from({ length: 4 }, (_, i) => ({
        title: `${title} ${i}`, description: 'Summary', creator: i ? 'Franz Beard' : 'Buddy Martin',
        link: `https://www.gatorbaitmedia.com/post/${title}-${i}`, pubDate: new Date(Date.UTC(2026, 8, 23, 12 - i)).toUTCString()
      }));
      requests[index].resolve({ ok: true, text: async () => JSON.stringify(posts) });
    }
  };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
test('leaving a pending route aborts its request and cannot mount fallback on another page', async () => {
  const h = harness(); h.route('/post/article');
  assert.equal(h.requests[0].signal.aborted, true);
  h.requests[0].reject(new Error('Aborted')); h.timeout(); await settle();
  assert.equal(h.nodes.size, 0); assert.equal(h.classes.has('gbm-magazine-live'), false);
});
test('returning to magazine starts a new request and remounts exactly one root', async () => {
  const h = harness(); h.resolve(0, 'initial'); await settle();
  assert.equal(h.nodes.size, 1); h.route('/'); assert.equal(h.nodes.size, 0);
  h.route('/magazine'); assert.equal(h.requests.length, 2);
  h.resolve(1, 'current'); await settle();
  assert.equal(h.nodes.size, 1); assert.match(h.nodes.get('gbm-magazine-page').innerHTML, /current 0/);
  h.route('/magazine'); assert.equal(h.requests.length, 2);
});
test('late successful old response cannot replace the current generation', async () => {
  const h = harness(); h.route('/'); h.route('/magazine');
  h.resolve(0, 'stale'); await settle(); assert.equal(h.nodes.size, 0);
  h.resolve(1, 'current'); await settle();
  assert.match(h.nodes.get('gbm-magazine-page').innerHTML, /current 0/);
  assert.doesNotMatch(h.nodes.get('gbm-magazine-page').innerHTML, /stale 0/);
});
test('late rejection from old request cannot mount fallback over pending new request', async () => {
  const h = harness(); h.route('/'); h.route('/magazine');
  h.requests[0].reject(new Error('Late abort')); await settle(); assert.equal(h.nodes.size, 0);
  h.resolve(1, 'current'); await settle(); assert.match(h.nodes.get('gbm-magazine-page').innerHTML, /current 0/);
});
test('timeout mounts stable fallback once and late network data never replaces it', async () => {
  const h = harness(); h.timeout();
  assert.equal(h.requests[0].signal.aborted, true);
  const root = h.nodes.get('gbm-magazine-page'), content = root.innerHTML;
  h.resolve(0, 'late'); await settle();
  assert.equal(h.nodes.get('gbm-magazine-page'), root); assert.equal(root.innerHTML, content);
});
