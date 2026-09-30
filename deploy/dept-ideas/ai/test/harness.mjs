#!/usr/bin/env node
// Runs the Worker's fetch handler in Node with a stub AI binding and an in-memory KV.
// Proves: retrieval, grounded prompt, number guard, refusal without a model call, trivia (daily pick, one
// answer per day, streak), rate limits and CORS. Records real responses to recorded.json for preview.html.
// Usage: node deploy/dept-ideas/ai/test/harness.mjs
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker, { MODEL, REFUSAL, retrieve, buildPrompt, guardAnswer } from '../worker.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const NOW = Date.parse('2026-09-30T14:00:00Z'); // Wed 10 a.m. ET
let pass = 0, fail = 0; const lines = [];
const ok = (cond, msg, extra) => { (cond ? pass++ : fail++); const l = `${cond ? 'PASS' : 'FAIL'}  ${msg}${extra ? '  -> ' + extra : ''}`; lines.push(l); console.log(l); };

// Stub AI: reads the numbered sources out of the prompt and answers from them, or hallucinates on demand.
const ai = { calls: [], mode: 'grounded', async run(model, opts) {
  this.calls.push({ model, opts });
  const sys = opts.messages[0].content, src = sys.split('SOURCES:\n')[1].split('\n');
  if (this.mode === 'hallucinate') return { response: 'Florida beat Ole Miss 52-28 and DJ Lagway threw for 412 yards [1].' };
  if (this.mode === 'refuse') return { response: REFUSAL };
  const first = src[0].replace(/^\[1\] \([a-z]+\) /, '').replace(/\s*\(By [^)]*\)\s*$/, '');
  return { response: first + ' [1]' };
} };
class MemKV { constructor() { this.m = new Map(); } async get(k) { return this.m.has(k) ? this.m.get(k) : null; } async put(k, v) { this.m.set(k, String(v)); } async delete(k) { this.m.delete(k); } }
const kv = new MemKV();
const env = { AI: ai, ASK_KV: kv, NOW_MS: String(NOW), HASH_SALT: 'harness-only', DEV_ORIGINS: 'http://localhost:8788' };
const ORIGIN = 'https://www.gatorbaitmedia.com';
async function req(path, { method = 'GET', body, ip = '203.0.113.7', origin = ORIGIN } = {}) {
  const r = await worker.fetch(new Request('https://ask-gatorbait.local' + path, { method, headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip, ...(origin ? { Origin: origin } : {}) }, body: body ? JSON.stringify(body) : undefined }), env);
  const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch (_) { /* noop */ }
  return { status: r.status, headers: Object.fromEntries(r.headers), json };
}
const recorded = { asks: [], trivia: {} };

// 1. Health + CORS
let r = await req('/health');
ok(r.status === 200 && r.json.ok && r.json.model === MODEL, 'GET /health', `${r.json.counts.stories} stories, ${r.json.counts.scoreboard} scoreboard, ${r.json.counts.history} history, ${r.json.counts.trivia} trivia`);
r = await req('/ask', { method: 'OPTIONS' });
ok(r.status === 204 && r.headers['access-control-allow-origin'] === ORIGIN, 'OPTIONS preflight from gatorbaitmedia.com', r.headers['access-control-allow-origin']);
r = await req('/ask', { method: 'POST', body: { q: 'next game' }, origin: 'https://evil.example' });
ok(r.status === 403, 'POST /ask from a foreign origin is refused', `status ${r.status}`);
r = await req('/ask', { method: 'POST', body: { q: 'next game' }, origin: 'http://localhost:8788', ip: '198.51.100.9' });
ok(r.status === 200 && r.headers['access-control-allow-origin'] === 'http://localhost:8788', 'DEV_ORIGINS allows a local origin', r.headers['access-control-allow-origin']);

// 2. Retrieval + grounded prompt
const hits = retrieve('When is the next game and what channel?', 5, NOW);
ok(hits[0].id === 'sb:next', 'retrieve() ranks the scoreboard "next game" doc first', hits.map((h) => h.id + ':' + h.score).join(', '));
const prompt = buildPrompt('When is the next game?', hits, '2026-09-30');
ok(prompt[0].content.includes('[1] (scoreboard) Florida\'s next game') && prompt[0].content.includes('Answer ONLY'), 'prompt contains only the numbered sources + the grounding rule');
ok(retrieve('Who won the Heisman in 2007?', 3, NOW)[0].id === 'hist:heisman-2007', 'history retrieval: Heisman 2007 -> Tebow fact');
ok(/MRI Confirms/.test(retrieve('What happened to Vernell Brown?', 3, NOW)[0].title), 'story retrieval: injury question -> MRI story', retrieve('What happened to Vernell Brown?', 1, NOW)[0].id);

// 3. /ask end to end with the stub model
const asks = ['When is the next game?', 'Who won the Heisman for Florida?', 'How did the Ole Miss game go?', 'What is the injury news?', 'How many national championships does Florida have?'];
for (const q of asks) {
  const before = ai.calls.length; r = await req('/ask', { method: 'POST', body: { q } });
  ok(r.status === 200 && r.json.grounded && r.json.sources.length > 0 && ai.calls.length === before + 1, `POST /ask "${q}"`, `${r.json.answer.slice(0, 90)}… | source: ${r.json.sources[0].title}`);
  recorded.asks.push({ q, ...r.json });
}
// 4. Grounding: number guard and refusals
ai.mode = 'hallucinate'; r = await req('/ask', { method: 'POST', body: { q: 'How did the Ole Miss game go?' } });
ok(r.json.grounded === false && r.json.refused === 'unsourced-number' && r.json.answer === REFUSAL, 'number guard rejects "412 yards" (not in any source)', r.json.refused);
recorded.asks.push({ q: 'How many yards did Lagway throw for against Ole Miss?', ...r.json });
ai.mode = 'refuse'; r = await req('/ask', { method: 'POST', body: { q: 'Who won the 1985 Super Bowl?' } });
ok(r.json.grounded === false && r.json.refused === 'model-refused', 'model refusal is passed through as a refusal');
ai.mode = 'grounded'; let before = ai.calls.length; r = await req('/ask', { method: 'POST', body: { q: 'best pizza in Gainesville' } });
ok(r.json.refused === 'no-sources' && ai.calls.length === before, 'off-topic question refused with NO model call', `${r.json.refused}; top hit coverage ${retrieve('best pizza in Gainesville', 1, NOW)[0]?.coverage}`);
recorded.asks.push({ q: 'Best pizza in Gainesville?', ...r.json });
const g = guardAnswer('Florida is 4-0 and ranked No. 8 [1].', retrieve('record', 3, NOW));
ok(g.ok && g.cited.length === 1, 'guardAnswer accepts figures that are in the sources');
r = await req('/ask', { method: 'POST', body: { q: 'hi' }, ip: '203.0.113.12' });
ok(r.status === 400, 'too-short question -> 400');

// 5. Trivia: daily pick, answer once, streak
r = await req('/trivia/today');
const today = r.json; recorded.trivia.today = today;
ok(r.status === 200 && today.date === '2026-09-30' && today.options.length === 4 && !today.answered, 'GET /trivia/today', `${today.q}`);
const again = await req('/trivia/today');
ok(again.json.id === today.id, 'same question all day (KV trivia:2026-09-30)', today.id);
// seed a streak of 2 ending yesterday for this visitor
const { hashIp } = await import('../worker.mjs'); const who = await hashIp('203.0.113.7', env.HASH_SALT);
await kv.put(`streak:${who}`, JSON.stringify({ n: 2, last: '2026-09-29' }));
r = await req('/trivia/today'); ok(r.json.streak === 2, 'streak from yesterday carries into today', `streak ${r.json.streak}`);
const stored = JSON.parse(await kv.get('trivia:2026-09-30'));
r = await req('/trivia/answer', { method: 'POST', body: { choice: stored.answer } }); recorded.trivia.answer = r.json;
ok(r.json.correct === true && r.json.streak === 3 && /Streak: 3 days/.test(r.json.share), 'POST /trivia/answer correct -> streak 3 + share line', r.json.share);
r = await req('/trivia/answer', { method: 'POST', body: { choice: (stored.answer + 1) % 4 } });
ok(r.json.alreadyAnswered && r.json.correct === true && r.json.streak === 3, 'second answer the same day does not change the result');
r = await req('/trivia/answer', { method: 'POST', body: { choice: (stored.answer + 1) % 4 }, ip: '203.0.113.8' });
ok(r.json.correct === false && r.json.streak === 0, 'wrong answer (other visitor) -> streak 0', r.json.share);
recorded.trivia.wrong = r.json;
r = await req('/trivia/answer', { method: 'POST', body: { choice: 9 }, ip: '203.0.113.9' });
ok(r.status === 400, 'out-of-range choice -> 400');

// 6. Rate limit: 8 asks a minute per hashed IP
const ip = '203.0.113.50'; let last;
for (let i = 0; i < 9; i++) last = await req('/ask', { method: 'POST', body: { q: 'next game' }, ip });
ok(last.status === 429 && last.headers['retry-after'] === '60', '9th /ask in a minute from one IP -> 429', `Retry-After ${last.headers['retry-after']}`);
r = await req('/ask', { method: 'POST', body: { q: 'next game' }, ip: '203.0.113.51' });
ok(r.status === 200, 'a different IP is unaffected');
ok(![...kv.m.keys()].some((k) => k.includes('203.0.113')), 'KV keys never contain a raw IP');

writeFileSync(join(here, '..', 'recorded.json'), JSON.stringify(recorded, null, 1));
lines.push(`\n${pass} passed, ${fail} failed. Model calls made to the stub: ${ai.calls.length}. KV keys: ${kv.m.size}.`);
console.log(lines[lines.length - 1]);
writeFileSync(join(here, 'last-run.txt'), lines.join('\n') + '\n');
process.exit(fail ? 1 : 0);
