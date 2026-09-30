#!/usr/bin/env node
// Executes worker.mjs's fetch handler against the in-memory D1 shim loaded with schema.sql.
// Usage: node deploy/dept-ideas/web/test-worker.mjs  (exit 1 on any failing check; writes recorded.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createD1 } from './d1-shim.mjs';
import worker from './worker.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const NOW = Date.parse('2026-09-30T20:00:00Z'); // Wed 4 p.m. ET, three days before Missouri kickoff
const ORIGIN = 'https://www.gatorbaitmedia.com';
const GAME = '401856708';
const env = { DB: createD1(readFileSync(join(here, 'schema.sql'), 'utf8')), NOW_OVERRIDE: NOW };
const failures = []; let n = 0;
function check(name, cond, detail) { n++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (detail ? '  ' + detail : '')); if (!cond) failures.push(name); }
function call(method, path, { body, origin = ORIGIN, ip = '203.0.113.7', now } = {}) {
  const headers = { 'cf-connecting-ip': ip };
  if (origin) headers.origin = origin;
  if (body !== undefined) headers['content-type'] = 'text/plain;charset=UTF-8';
  const e = now ? Object.assign({}, env, { NOW_OVERRIDE: now }) : env;
  return worker.fetch(new Request('https://gatorbait-make-the-call.workers.dev' + path, { method, headers, body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) }), e)
    .then(async (r) => ({ status: r.status, headers: Object.fromEntries(r.headers), json: await r.json().catch(() => null) }));
}
const tok = (i) => 'tok_' + String(i).padStart(4, '0') + '_abcdefghijklmnop';

let r = await call('GET', '/v1/health');
check('GET /v1/health 200', r.status === 200 && r.json.ok === true, r.json.serverTime);

r = await worker.fetch(new Request('https://x/v1/pick', { method: 'OPTIONS', headers: { origin: ORIGIN, 'access-control-request-method': 'POST' } }), env);
check('OPTIONS preflight from gatorbaitmedia.com 204 + CORS', r.status === 204 && r.headers.get('access-control-allow-origin') === ORIGIN, r.headers.get('access-control-allow-methods'));
r = await worker.fetch(new Request('https://x/v1/pick', { method: 'OPTIONS', headers: { origin: 'https://evil.example' } }), env);
check('OPTIONS preflight from other origin 403, no ACAO', r.status === 403 && !r.headers.get('access-control-allow-origin'));

r = await call('GET', '/v1/game/' + GAME);
check('GET game empty: count 0, six bins, not locked', r.status === 200 && r.json.count === 0 && r.json.bins.length === 6 && r.json.locked === false && r.json.avg === null, r.headers['cache-control']);
check('GET game carries ACAO + Vary', r.headers['access-control-allow-origin'] === ORIGIN && /origin/i.test(r.headers.vary));
r = await call('GET', '/v1/game/000000');
check('GET unknown game 404', r.status === 404);

r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 34, opp: 20, token: tok(1) } });
check('POST first pick 201, yours echoed, count 1', r.status === 201 && r.json.yours.fla === 34 && r.json.count === 1 && r.json.bins[0].n === 1, JSON.stringify(r.json.avg));
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 27, opp: 24, token: tok(1) } });
check('POST same token again 200 (update), count still 1, bin moved', r.status === 200 && r.json.count === 1 && r.json.bins[0].n === 0 && r.json.bins[2].n === 1);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 24, opp: 24, token: tok(2) } });
check('POST tie 422', r.status === 422, r.json.error);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 120, opp: 3, token: tok(2) } });
check('POST score 120 422', r.status === 422);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 30.5, opp: 3, token: tok(2) } });
check('POST fractional score 422', r.status === 422);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 30, opp: 3, token: 'short' } });
check('POST bad token 422', r.status === 422);
r = await call('POST', '/v1/pick', { body: '{not json', ip: '203.0.113.8' });
check('POST invalid JSON 400', r.status === 400);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 30, opp: 3, token: tok(2) }, origin: 'https://evil.example', ip: '203.0.113.9' });
check('POST from other origin 403', r.status === 403);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 30, opp: 3, token: tok(2) }, origin: null, ip: '203.0.113.9' });
check('POST with no Origin 403', r.status === 403);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 30, opp: 3, token: tok(2) }, ip: '203.0.113.9' });
check('POST valid pick from allowed origin 201; voter stored as a hash, never the token', r.status === 201 && (await env.DB.prepare('SELECT voter FROM picks WHERE voter = ?').bind(tok(2)).first()) === null);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 30, opp: 3, token: 'x'.repeat(2000) }, ip: '203.0.113.10' });
check('POST oversized body 413', r.status === 413);

// Rate limit: 6 POST/min per IP (invalid bodies count too, so IP .7 is already spent; use a fresh IP).
let statuses = [];
for (let i = 0; i < 8; i++) { r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 20 + i, opp: 10, token: tok(100 + i) }, ip: '203.0.113.11' }); statuses.push(r.status); }
check('rate limit: 6 POSTs/min pass, 7th and 8th from same IP 429 with Retry-After', statuses.slice(0, 6).every((s) => s === 201) && statuses[6] === 429 && statuses[7] === 429 && !!r.headers['retry-after'], statuses.join(',') + ' retry-after=' + r.headers['retry-after']);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 20, opp: 10, token: tok(200) }, ip: '203.0.113.7' });
check('rate limit: IP .7 spent by its six earlier POSTs (invalid ones count)', r.status === 429);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 20, opp: 10, token: tok(200) }, ip: '203.0.113.11', now: NOW + 61000 });
check('rate limit: next minute window passes again', r.status === 201);
r = await call('GET', '/v1/game/' + GAME, { ip: '203.0.113.20' });
check('rate limit: GET budget separate from POST', r.status === 200);

// Crowd of 40 more devices, spread across every bin.
const spread = [[41, 17], [38, 21], [35, 24], [31, 24], [30, 27], [27, 24], [24, 27], [20, 24], [17, 24], [13, 27], [10, 31], [21, 23], [34, 20], [34, 20], [34, 20], [28, 14], [31, 21], [24, 21], [27, 17], [38, 10]];
for (let i = 0; i < 40; i++) { const s = spread[i % spread.length]; r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: s[0], opp: s[1], token: tok(1000 + i) }, ip: '198.51.100.' + (i % 200) }); if (r.status !== 201) check('seed pick ' + i, false, r.status + ' ' + JSON.stringify(r.json)); }
r = await call('GET', '/v1/game/' + GAME, { ip: '203.0.113.21' });
const sum = r.json.bins.reduce((a, b) => a + b.n, 0);
check('distribution: bins sum to count', sum === r.json.count, `count=${r.json.count} sum=${sum} avg=${r.json.avg.fla}-${r.json.avg.opp} flaShare=${r.json.flaShare.toFixed(2)}`);
check('distribution: most common call is 34-20', r.json.top && r.json.top.fla === 34 && r.json.top.opp === 20, JSON.stringify(r.json.top));
check('distribution: opponent name in bin labels', r.json.bins[5].label === 'Missouri by 14+', r.json.bins.map((b) => b.label + '=' + b.n).join(' | '));
writeFileSync(join(here, 'recorded.json'), JSON.stringify(r.json, null, 1) + '\n');
// preview.html replays this exact response when opened without ?gbm_api=live.
const pv = join(here, 'preview.html'), html = readFileSync(pv, 'utf8');
writeFileSync(pv, html.replace(/\/\*recorded\*\/[\s\S]*?\/\*\/recorded\*\//, '/*recorded*/' + JSON.stringify(r.json) + '/*/recorded*/'));

// Kickoff lock: 3:30 p.m. ET Oct. 3 = 19:30Z.
const KICK = Date.parse('2026-10-03T19:30:00Z');
r = await call('GET', '/v1/game/' + GAME, { ip: '203.0.113.30', now: KICK - 1000 });
check('one second before kickoff: not locked', r.json.locked === false);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 30, opp: 3, token: tok(3000) }, ip: '203.0.113.30', now: KICK - 1000 });
check('one second before kickoff: pick accepted', r.status === 201);
r = await call('GET', '/v1/game/' + GAME, { ip: '203.0.113.31', now: KICK });
check('at kickoff: GET reports locked', r.json.locked === true);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 30, opp: 3, token: tok(3001) }, ip: '203.0.113.31', now: KICK });
check('at kickoff: POST 409 locked', r.status === 409 && r.json.error === 'locked', r.json.kickoff);
r = await call('POST', '/v1/pick', { body: { gameId: GAME, fla: 30, opp: 3, token: tok(3000) }, ip: '203.0.113.32', now: KICK + 3600000 });
check('an hour in: existing voter cannot change a pick either', r.status === 409);

const rows = await env.DB.prepare('SELECT COUNT(*) AS c FROM picks').first('c');
const rl = await env.DB.prepare('SELECT COUNT(*) AS c FROM rate_limits').first('c');
console.log(`\npicks rows=${rows} rate_limit rows=${rl} checks=${n} failures=${failures.length}`);
if (failures.length) { console.error('FAILED: ' + failures.join('; ')); process.exit(1); }
console.log('All Worker checks passed.');
