// Deterministic lifecycle test, not a visual/browser substitute. No network or dependencies.
// Node's VM runs the exact layer against a small DOM/event adapter and a virtual clock.
// The adapter implements general tree selection and MutationObserver delivery, not drop-cap logic.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const layer = readFileSync(new URL('./layer.html', import.meta.url), 'utf8');
const legacy = readFileSync(new URL('./legacy-layer.fixture.html', import.meta.url), 'utf8');
const code = html => html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)[1];
const OPENING = 'Before we get going this week, I need a minute for a friend. Because our lives are a little bit poorer.';

function virtualClock() {
  let now = 0, id = 0;
  const timers = new Map(), microtasks = [];
  function flush() { while (microtasks.length) microtasks.shift()(); }
  return {
    timers,
    queue: callback => microtasks.push(callback),
    setTimeout(callback, delay = 0) {
      timers.set(++id, { callback, at: now + delay });
      return id;
    },
    clearTimeout: timer => timers.delete(timer),
    advance(ms) {
      const end = now + ms;
      flush();
      let budget = 1000;
      while (true) {
        const next = [...timers].sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!next || next[1].at > end) break;
        assert.ok(--budget > 0, 'no unbounded timer feedback');
        now = next[1].at;
        timers.delete(next[0]);
        next[1].callback();
        flush();
      }
      now = end;
      flush();
    },
  };
}

function fixture(source, { age = '2 minutes ago', state = 'complete' } = {}) {
  const clock = virtualClock(), observers = new Set(), events = new Map();
  let deliveries = 0, article;
  const contains = (parent, node) => {
    for (; node; node = node.parentElement) if (node === parent) return true;
    return false;
  };
  function mutation(target, type) {
    for (const observer of observers) {
      if (!observer.active || !observer.options[type] || !contains(observer.target, target)) continue;
      if (!observer.queued) {
        observer.queued = true;
        clock.queue(() => {
          observer.queued = false;
          if (observer.active) { deliveries++; observer.callback([{ type, target }]); }
        });
      }
    }
  }
  function simpleMatch(element, selector) {
    if (selector.startsWith('.')) return element.classList.contains(selector.slice(1));
    const attribute = selector.match(/^\[([^=\]]+)=(?:"([^"]*)"|'([^']*)'|([^\]]+))\]$/);
    if (attribute) return element.getAttribute(attribute[1]) === (attribute[2] ?? attribute[3] ?? attribute[4]);
    return element.tagName.toLowerCase() === selector.toLowerCase();
  }
  function matches(element, selector) {
    const parts = selector.trim().split(/\s+/);
    if (!simpleMatch(element, parts.pop())) return false;
    let parent = element.parentElement;
    while (parts.length) {
      const wanted = parts.pop();
      while (parent && !simpleMatch(parent, wanted)) parent = parent.parentElement;
      if (!parent) return false;
      parent = parent.parentElement;
    }
    return true;
  }
  class Element {
    constructor(tag, display = 'block') {
      this.tagName = tag.toUpperCase(); this.display = display;
      this.children = []; this.attributes = new Map(); this.parentElement = null; this.text = '';
      const names = new Set();
      this.classList = {
        add: (...values) => { values.forEach(value => names.add(value)); mutation(this, 'attributes'); },
        remove: (...values) => { values.forEach(value => names.delete(value)); mutation(this, 'attributes'); },
        contains: value => names.has(value),
      };
    }
    appendChild(child) { child.parentElement = this; this.children.push(child); mutation(this, 'childList'); return child; }
    removeChild(child) { this.children.splice(this.children.indexOf(child), 1); child.parentElement = null; mutation(this, 'childList'); }
    get firstElementChild() { return this.children[0] || null; }
    get textContent() { return this.text + this.children.map(child => child.textContent).join(''); }
    set textContent(value) { this.text = value; this.children = []; mutation(this, 'childList'); }
    setAttribute(name, value) { this.attributes.set(name, value); mutation(this, 'attributes'); }
    getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
    hasAttribute(name) { return this.attributes.has(name); }
    removeAttribute(name) { this.attributes.delete(name); mutation(this, 'attributes'); }
    querySelectorAll(selector) {
      const all = [];
      function walk(node) { for (const child of node.children) { all.push(child); walk(child); } }
      walk(this);
      const groups = selector.split(',');
      return all.filter(element => groups.some(group => matches(element, group)));
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  }
  class Observer {
    constructor(callback) { this.callback = callback; this.active = false; this.queued = false; observers.add(this); }
    observe(target, options) { this.target = target; this.options = options; this.active = true; }
    disconnect() { this.active = false; }
  }
  const html = new Element('html'), body = html.appendChild(new Element('body'));
  const time = body.appendChild(new Element('span'));
  time.setAttribute('data-hook', 'time-ago'); time.textContent = age;
  function listen(type, callback, options = {}) {
    const list = events.get(type) || [];
    list.push({ callback, once: !!options.once }); events.set(type, list);
  }
  function dispatch(type) {
    const list = events.get(type) || [];
    events.set(type, list.filter(event => !event.once));
    list.forEach(event => event.callback()); clock.advance(0);
  }
  const document = {
    documentElement: html, readyState: state,
    querySelector: selector => html.querySelector(selector),
    querySelectorAll: selector => html.querySelectorAll(selector),
    addEventListener: listen,
  };
  const location = { pathname: '/post/a-podcast-tribute-david-moulton' };
  const context = {
    document, location, MutationObserver: Observer,
    getComputedStyle: element => ({ display: element.display }),
    setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout,
    addEventListener: listen,
  };
  context.window = context;
  function paragraph(text, block = true) {
    const p = new Element('p'), outer = new Element('span', block ? 'block' : 'inline');
    const inner = new Element('span', 'inline'); inner.textContent = text;
    outer.appendChild(inner); p.appendChild(outer); return p;
  }
  function hydrate({ text = OPENING, block = true, preceding = [] } = {}) {
    if (article) body.removeChild(article);
    article = new Element('section'); article.setAttribute('data-hook', 'post-description');
    preceding.forEach(text => article.appendChild(paragraph(text)));
    article.appendChild(paragraph(text, block));
    article.appendChild(paragraph('The complete next paragraph stays exactly as the writer submitted it, including its punctuation.'));
    body.appendChild(article); return article;
  }
  return {
    clock, html, body, document, location, time, hydrate, paragraph, dispatch,
    start: () => vm.runInNewContext(code(source), context),
    caps: () => document.querySelectorAll('.gbm-dropcap'),
    origins: () => document.querySelectorAll('.gbm-dropcap-letter'),
    activeObservers: () => [...observers].filter(observer => observer.active),
    deliveries: () => deliveries,
  };
}

test('syntax, unchanged visual CSS, and native embed size gate', () => {
  new vm.Script(code(layer));
  assert.equal(layer.slice(0, layer.indexOf('<script')), legacy.slice(0, legacy.indexOf('<script')));
  assert.ok(layer.length <= 2309, 'full native template stays below15000characters');
  assert.equal(OPENING.length, 103);
});

test('actual103character Moulton opening arrives after old final3500ms retry: old fails/new passes', () => {
  for (const [name, source, expected] of [['legacy', legacy, 0], ['candidate', layer, 1]]) {
    const f = fixture(source); f.start(); f.clock.advance(5000);
    const article = f.hydrate(), text = article.textContent;
    f.clock.advance(100);
    assert.equal(f.caps().length, expected, name);
    assert.equal(f.origins().length, expected, name);
    assert.equal(article.textContent, text, 'no writer text mutation');
    if (expected) assert.equal(f.origins()[0], f.caps()[0].firstElementChild, 'one block-wrapper origin');
  }
});

test('late replacement of already decorated Ricos nodes is decorated again', () => {
  const f = fixture(layer); f.hydrate(); f.start();
  assert.equal(f.origins().length, 1);
  f.clock.advance(8000);
  const replacement = f.hydrate(), text = replacement.textContent;
  f.clock.advance(100);
  assert.equal(f.caps().length, 1); assert.equal(f.origins().length, 1);
  assert.equal(replacement.textContent, text);
});

test('debounced child insertions, no class-driven feedback, and one origin after repeated events', () => {
  const f = fixture(layer); f.start(); const article = f.hydrate();
  for (let i = 0; i < 20; i++) article.appendChild(f.paragraph('extra prose'));
  const text = article.textContent;
  f.clock.advance(79); assert.equal(f.origins().length, 0);
  f.clock.advance(1); assert.equal(f.origins().length, 1);
  assert.equal(f.deliveries(), 1, 'child mutations coalesce');
  f.clock.advance(500); assert.equal(f.deliveries(), 1, 'own class/attribute changes are not observed');
  f.dispatch('load'); f.dispatch('gbmroutechange'); f.dispatch('popstate'); f.clock.advance(100);
  assert.equal(f.origins().length, 1); assert.equal(f.caps().length, 1);
  assert.equal(f.activeObservers().length, 1, 'at most one live observer');
  assert.equal(article.textContent, text);
});

test('observer and queued debounce terminate at30seconds; route change opens a fresh bounded window', () => {
  const f = fixture(layer); f.start(); f.clock.advance(29990); f.hydrate(); f.clock.advance(10);
  assert.equal(f.activeObservers().length, 0);
  assert.equal(f.clock.timers.size, 0, 'time cap cancels trailing debounce');
  f.clock.advance(1000); const article = f.hydrate(); f.clock.advance(100);
  assert.equal(f.origins().length, 0, 'no permanent observation');
  f.dispatch('gbmroutechange'); assert.equal(f.origins().length, 1);
  assert.equal(f.activeObservers().length, 1);
  const text = article.textContent;
  f.location.pathname = '/magazine'; f.dispatch('popstate');
  assert.equal(f.html.hasAttribute('data-gbm-week-rich'), false, 'inactive outside post routes');
  assert.equal(f.activeObservers().length, 0); assert.equal(f.clock.timers.size, 0);
  assert.equal(article.textContent, text);
});

test('same age boundary and prose exclusions; inline child uses paragraph as single origin', () => {
  for (const [age, expected] of [['7 days ago', 1], ['8 days ago', 0], ['', 0]]) {
    const f = fixture(layer, { age });
    f.hydrate({ block: false, preceding: ['Photo: ' + 'a'.repeat(100), 'By ' + 'a'.repeat(100), 'Short intro.'] });
    f.start(); assert.equal(f.origins().length, expected, age);
    if (expected) assert.equal(f.origins()[0], f.caps()[0], 'paragraph is single origin for inline wrapper');
  }
});

test('loading lifecycle replaces the watcher rather than stacking observers', () => {
  const f = fixture(layer, { state: 'loading' }); f.start();
  f.dispatch('DOMContentLoaded'); f.dispatch('load');
  assert.equal(f.activeObservers().length, 1);
  f.clock.advance(6000); f.hydrate(); f.clock.advance(100);
  assert.equal(f.origins().length, 1);
  f.clock.advance(30000); assert.equal(f.activeObservers().length, 0);
});
