import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const context = {
  document: { hidden: false, getElementById: () => null, addEventListener() {} },
  fetch() {}, DOMParser() {}, setInterval: () => 1, clearInterval() {}, setTimeout: fn => fn(),
  safeUrl: v => typeof v === 'string' ? v : '', obj: v => v && typeof v === 'object' ? v : null,
  list: v => Array.isArray(v) ? v : []
};
vm.createContext(context);
vm.runInContext(readFileSync(new URL('./src/magazine-pregame.js', import.meta.url), 'utf8'), context);
let feeds = 0, scores = 0;
context.mfFeed = () => { feeds++; return Promise.resolve([]); };
context.mfApply = () => {};
context.mfScore = () => { scores++; return Promise.resolve(); };
const root = () => ({ isConnected: true, getAttribute: () => '', hasAttribute: () => false, setAttribute() {} });
context.issue = () => ({ liveFeed: false });
context.mfLiveStart(root());
await new Promise(setImmediate);
assert.equal(feeds, 0, 'curated topical issues must not fetch the general-news feed');
assert.equal(scores, 1, 'turning off story swaps must preserve the game-score cycle');
context.issue = () => ({});
context.mfLiveStart(root());
await new Promise(setImmediate);
assert.equal(feeds, 1, 'existing editions retain their default article refresh');
assert.equal(scores, 2);
console.log('PASS topical article-refresh guard, score updates and existing defaults');

