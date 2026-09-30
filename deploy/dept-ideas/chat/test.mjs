#!/usr/bin/env node
/* Local proof for The Stands. Starts `wrangler dev` (workerd, SQLite Durable Object) on 127.0.0.1:8787 and a static
 * server for test-page.html + client.js on 127.0.0.1:8790, then drives two Chromium contexts (390 phone, 1365 desktop)
 * plus raw WebSocket clients through the room rules, saves screenshots to shots/ and writes TEST.md.
 * If wrangler cannot start, the same RoomCore runs under the `ws` package (--harness) and TEST.md says so.
 * Usage: NODE_PATH=<scratchpad>/node_modules node test.mjs [--harness] */
import { spawn } from 'node:child_process';
import http from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const WebSocket = require('ws');
const here = dirname(fileURLToPath(import.meta.url)), repo = join(here, '..', '..', '..');
const API = 'http://127.0.0.1:8787', PAGE = 'http://127.0.0.1:8790', MOD = 'dev-only-mod-key', ROOM = 'game-2026-10-03';
const log = [], t0 = Date.now();
const say = (s) => { const line = `[${String(((Date.now() - t0) / 1000).toFixed(1)).padStart(5)}s] ${s}`; console.log(line); log.push(line); };
let pass = 0, fail = 0;
const check = (name, ok, detail) => { ok ? pass++ : fail++; say(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sb = JSON.parse(readFileSync(join(repo, 'sports-live/scoreboard.json'), 'utf8'));
const withKick = (iso) => ({ ...sb, next: { ...sb.next, kickoffIso: iso } });
const mod = async (cmd) => (await fetch(`${API}/room/${ROOM}/mod`, { method: 'POST', headers: { Authorization: 'Bearer ' + MOD, 'content-type': 'application/json' }, body: JSON.stringify(cmd) })).json();
const state = async () => (await fetch(`${API}/room/${ROOM}/state`)).json();
const token = async (name, tier) => (await (await fetch(`${API}/token?name=${encodeURIComponent(name)}&tier=${tier}`)).json()).token;
let mode = process.argv.includes('--harness') ? 'harness' : 'wrangler', wrangler = null, wlog = [];

/* ---------- servers ---------- */
async function startWrangler() {
  const bin = join(process.env.NODE_PATH || '', '..', 'node_modules', '.bin', 'wrangler'), b2 = join(process.env.NODE_PATH || 'node_modules', '.bin', 'wrangler');
  const w = existsSync(b2) ? b2 : bin;
  wrangler = spawn(w, ['dev', '--config', 'wrangler.toml', '--ip', '127.0.0.1', '--port', '8787', '--log-level', 'info'], { cwd: here, env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: '1', NO_COLOR: '1', FORCE_COLOR: '0' } });
  wrangler.stdout.on('data', (d) => wlog.push(String(d))); wrangler.stderr.on('data', (d) => wlog.push(String(d)));
  for (let i = 0; i < 90; i++) { await sleep(1000); try { const r = await fetch(API + '/'); if (r.ok) return true; } catch (_) { } if (wrangler.exitCode != null) break; }
  return false;
}
async function startHarness() {
  const w = await import('./worker.mjs');
  const rooms = new Map(), secret = 'dev-only-not-a-secret';
  const room = (id) => { if (!rooms.has(id)) { const set = new Set(); const io = { sockets: () => set, send: (s, d) => s.send(d), close: (s, c, r) => s.close(c, r), get: (s) => s._d || null, set: (s, d) => { s._d = d; }, now: () => Date.now() }; rooms.set(id, { core: new w.RoomCore(io, {}), set }); } return rooms.get(id); };
  const json = (res, o, code = 200) => { res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(o)); };
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, API), m = url.pathname.match(/^\/room\/([a-z]+-\d{4}-\d{2}-\d{2})\/(state|mod)$/);
    if (url.pathname === '/') return json(res, { service: 'the-stands', mode: 'ws-harness' });
    if (url.pathname === '/token') return json(res, { token: await w.signToken(secret, { sub: 'dev-' + (url.searchParams.get('name') || 'r').toLowerCase().replace(/\W+/g, '-'), name: url.searchParams.get('name') || 'Reader', tier: url.searchParams.get('tier') || 'reader', exp: Date.now() + 600000 }) });
    if (!m) return json(res, { error: 'not found' }, 404);
    const r = room(m[1]);
    if (m[2] === 'state') return json(res, { room: r.core.room(), count: r.core.count(), settings: r.core.settings });
    if (req.headers.authorization !== 'Bearer ' + MOD) return json(res, { ok: false, error: 'unauthorized' }, 401);
    let body = ''; for await (const c of req) body += c; return json(res, r.core.mod(JSON.parse(body || 'null')));
  });
  const wss = new WebSocket.Server({ noServer: true });
  server.on('upgrade', async (req, socket, head) => {
    const url = new URL(req.url, API), m = url.pathname.match(/^\/room\/([a-z]+-\d{4}-\d{2}-\d{2})\/ws$/), you = m && await w.verifyToken(secret, url.searchParams.get('token'));
    if (!you) { socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n'); return socket.destroy(); }
    wss.handleUpgrade(req, socket, head, (ws) => { const r = room(m[1]); r.set.add(ws); r.core.join(ws, you); ws.on('message', (d) => r.core.message(ws, d)); ws.on('close', () => { r.set.delete(ws); r.core.leave(ws); }); });
  });
  await new Promise((r) => server.listen(8787, '127.0.0.1', r));
  return server;
}
function startStatic() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
  const s = http.createServer((req, res) => {
    const p = new URL(req.url, PAGE).pathname, f = p === '/scoreboard.json' ? join(repo, 'sports-live/scoreboard.json') : join(here, p.replace(/^\/+/, '') || 'test-page.html');
    try { const b = readFileSync(f); res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }); res.end(b); } catch (_) { res.writeHead(404); res.end('no'); }
  });
  return new Promise((r) => s.listen(8790, '127.0.0.1', () => r(s)));
}
const wsClient = (tk) => new Promise((resolve, reject) => {
  const ws = new WebSocket(`${API.replace('http', 'ws')}/room/${ROOM}/ws?token=${encodeURIComponent(tk)}`), inbox = [];
  ws.on('message', (d) => inbox.push(JSON.parse(String(d)))); ws.on('open', () => resolve({ ws, inbox })); ws.on('error', reject); ws.on('unexpected-response', (_, r) => reject(new Error('HTTP ' + r.statusCode)));
});

/* ---------- the run ---------- */
const statik = await startStatic();
let harnessServer = null;
if (mode === 'wrangler') { if (await startWrangler()) say(`wrangler dev is up at ${API} (workerd, SQLite Durable Object)`); else { say('wrangler dev did not start; last output: ' + wlog.slice(-6).join(' ').replace(/\s+/g, ' ').slice(0, 600)); mode = 'harness'; try { wrangler.kill(); } catch (_) { } } }
if (mode === 'harness') { harnessServer = await startHarness(); say('ws harness is up (same RoomCore, node `ws` server); wrangler was not used'); }
const errors = [];
const browser = await chromium.launch();
try {
  say(`room ${ROOM}; scoreboard.json updatedAt ${sb.updatedAt}; real kickoff ${sb.next.kickoffIso} (${sb.next.opponent}, ${sb.next.tv})`);
  const real = await mod({ cmd: 'scoreboard', sb });
  check('kickoff lock window computed from scoreboard.json', real.room.kickoff === '2026-10-03T19:30:00.000Z' && real.room.lockUntil === '2026-10-03T19:35:00.000Z', `${real.room.kickoff} to ${real.room.lockUntil}`);
  const locked = await mod({ cmd: 'scoreboard', sb: withKick(new Date(Date.now() - 60000).toISOString()) });
  check('room open + lock active one minute after kickoff', locked.room.open && locked.room.lock, JSON.stringify({ open: locked.room.open, lock: locked.room.lock, why: locked.room.why }));

  const ctxA = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const ctxB = await browser.newContext({ viewport: { width: 1365, height: 800 } });
  const A = await ctxA.newPage(), B = await ctxB.newPage();
  for (const [p, n] of [[A, 'A'], [B, 'B']]) { p.on('console', (m) => { if (m.type() === 'error') errors.push(`${n}: ${m.text()}`); }); p.on('pageerror', (e) => errors.push(`${n}: ${e.message}`)); }
  await A.goto(`${PAGE}/test-page.html?name=SwampReader&tier=reader`); await B.goto(`${PAGE}/test-page.html?name=TailgateTina&tier=member`);
  await A.waitForFunction(() => /in the room|Signed in/.test(document.querySelector('[data-gbs="count"]').textContent), null, { timeout: 15000 });
  await B.waitForFunction(() => /2 in the room/.test(document.querySelector('[data-gbs="count"]').textContent), null, { timeout: 15000 });
  check('two browsers joined; presence count reached 2', true, await B.textContent('[data-gbs="count"]'));
  const send = async (p, text) => { await p.fill('[data-gbs="msg"]', text); await p.press('[data-gbs="msg"]', 'Enter'); };
  const sysIs = (p, re) => p.waitForFunction((s) => new RegExp(s).test(document.querySelector('[data-gbs="sys"]').textContent), re, { timeout: 8000 }).then(() => true, () => false);
  await send(A, 'Go Gators');
  check('kickoff lock: reader blocked for the first five minutes', await sysIs(A, 'Members only for the first 5 minutes'), await A.textContent('[data-gbs="sys"]'));
  const opened = await mod({ cmd: 'scoreboard', sb: withKick(new Date(Date.now() - 600000).toISOString()) });
  check('lock lifts ten minutes after kickoff', opened.room.open && !opened.room.lock);
  await send(A, 'Go Gators. Columbia is loud tonight.');
  const seenByB = await B.waitForSelector('.gbs-p:has-text("Columbia is loud tonight")', { timeout: 8000 }).then(() => true, () => false);
  check('reader post fans out to the other browser', seenByB);
  await send(B, 'Third-and-long every drive so far.');
  check('member post fans out with the Member badge', await A.waitForSelector('.gbs-p:has-text("Third-and-long") .gbs-bd', { timeout: 8000 }).then(() => true, () => false));
  await send(A, 'Timeout? Why now?');
  const slowHit = await sysIs(A, 'Slow mode: \\d+ s to go');
  check('slow mode: second reader post inside 30 s refused, input locked', slowHit && await A.isDisabled('[data-gbs="msg"]'), await A.textContent('[data-gbs="sys"]'));
  await send(B, 'That was a damn hold.');
  check('word filter masks on the server, member not slowed', await A.waitForSelector('.gbs-p:has-text("d*** hold")', { timeout: 8000 }).then(() => true, () => false));
  check('poster told a word was masked', await sysIs(B, 'masked by the filter'));
  await send(B, 'Fresh legs on the punt return, please.'); await send(B, 'Defense, one more stop.');
  await A.waitForSelector('.gbs-p:has-text("one more stop")', { timeout: 8000 });
  await A.screenshot({ path: join(here, 'shots/stands-390-live.png') }); await B.screenshot({ path: join(here, 'shots/stands-1365-live.png') });
  say('saved shots/stands-390-live.png and shots/stands-1365-live.png');
  const id = await A.getAttribute('.gbs-p:has-text("d*** hold")', 'data-id');
  await A.click(`.gbs-p[data-id="${id}"] .gbs-rp`);
  check('one-tap report acknowledged', await sysIs(A, 'Reported'));
  const c3 = await wsClient(await token('ThirdReader', 'reader')), c4 = await wsClient(await token('FourthReader', 'reader'));
  c3.ws.send(JSON.stringify({ t: 'report', id })); c4.ws.send(JSON.stringify({ t: 'report', id }));
  check('three reports hide the post everywhere', await B.waitForFunction((i) => !document.querySelector(`.gbs-p[data-id="${i}"]`), id, { timeout: 8000 }).then(() => true, () => false));
  const q = await mod({ cmd: 'reports' });
  check('moderator queue lists the hidden post', q.hidden.length === 1 && q.hidden[0].id === id, `${q.reports.length} reports, ${q.hidden.length} hidden`);
  await mod({ cmd: 'slow', seconds: 0 }); await mod({ cmd: 'memberOnly', on: true });
  await A.waitForFunction(() => !document.querySelector('[data-gbs="msg"]').disabled, null, { timeout: 35000 });
  await send(A, 'Can a reader post now?');
  check('member-only mode blocks readers', await sysIs(A, 'Members only right now'));
  await mod({ cmd: 'memberOnly', on: false });
  const staff = await wsClient(await token('GatorBait Desk', 'staff'));
  for (let i = 1; i <= 210; i++) staff.ws.send(JSON.stringify({ t: 'msg', text: 'ring test ' + i }));
  await sleep(2500);
  const st = await mod({ cmd: 'state' });
  check('ring buffer holds 200 after 210 more posts', st.messages === 200, `${st.messages} stored`);
  await mod({ cmd: 'slow', seconds: 30 });
  let bad = 'connected'; try { await wsClient('not.a.token'); } catch (e) { bad = e.message; }
  check('bad token refused at the socket', bad !== 'connected', bad);
  const linkTry = c3.inbox.length; c3.ws.send(JSON.stringify({ t: 'msg', text: 'see www.example.com' })); await sleep(800);
  check('links from readers refused', c3.inbox.slice(linkTry).some((o) => o.t === 'err' && o.code === 'link'));
  const closed = await mod({ cmd: 'scoreboard', sb });
  check(`real scoreboard restored: room ${closed.room.open ? 'open (' + closed.room.why + ' window now)' : 'closed until game day'}`, closed.room.kickoff === '2026-10-03T19:30:00.000Z');
  await A.waitForFunction(() => document.querySelector('.gbs').getAttribute('data-quiet') === (document.querySelector('.gbs-clk em').textContent === 'Room open' ? '0' : '1'), null, { timeout: 8000 }).catch(() => { });
  if (!closed.room.open) { await A.screenshot({ path: join(here, 'shots/stands-390-quiet.png') }); await B.screenshot({ path: join(here, 'shots/stands-1365-quiet.png') }); say('saved shots/stands-390-quiet.png and shots/stands-1365-quiet.png (countdown to kickoff, no empty feed)'); }
  check('quiet state shown when the room is closed', closed.room.open || await A.getAttribute('.gbs', 'data-quiet') === '1');
  for (const c of [c3, c4, staff]) c.ws.close();
} catch (e) { check('run completed without an exception', false, e.stack || String(e)); }
check('no browser console errors', errors.length === 0, errors.join(' | ').slice(0, 400));
await browser.close(); statik.close(); if (harnessServer) harnessServer.close(); if (wrangler) { try { wrangler.kill('SIGTERM'); } catch (_) { } }
const shots = ['stands-390-live.png', 'stands-1365-live.png', 'stands-390-quiet.png', 'stands-1365-quiet.png'].filter((f) => existsSync(join(here, 'shots', f))).map((f) => `- shots/${f} (${statSync(join(here, 'shots', f)).size.toLocaleString('en-US')} bytes)`);
const ver = (p) => { try { return require(join(process.env.NODE_PATH || 'node_modules', p, 'package.json')).version; } catch (_) { return '?'; } };
writeFileSync(join(here, 'TEST.md'), `# The Stands — local test run\n\n- Date: ${new Date().toISOString()}\n- Mode: ${mode === 'wrangler' ? 'wrangler dev (workerd, SQLite-backed Durable Object), local only, nothing deployed' : 'ws harness (node `ws` server running the same RoomCore); wrangler dev was not usable in this container'}\n- Versions: node ${process.version}, wrangler ${ver('wrangler')}, workerd ${ver('workerd')}, playwright ${ver('playwright')}, ws ${ver('ws')}\n- Result: ${pass} passed, ${fail} failed\n\n## Screenshots\n\n${shots.join('\n')}\n\n## Console output\n\n\`\`\`\n${log.join('\n')}\n\`\`\`\n${wlog.length ? '\n## wrangler output (trimmed)\n\n```\n' + wlog.join('').replace(/\u001b\[[0-9;]*m/g, '').split('\n').filter((l) => l.trim()).slice(0, 25).join('\n') + '\n```\n' : ''}`);
say(`TEST.md written: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
