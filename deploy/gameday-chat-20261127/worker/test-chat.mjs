import WebSocket from 'ws';
const ROOM = 'game-test-' + Date.now(); const BASE = 'ws://127.0.0.1:8787/room/' + ROOM + '/ws', HTTP = 'http://127.0.0.1:8787/room/' + ROOM, ORIGIN = 'http://127.0.0.1:8765';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = []; const ok = (name, cond, extra) => { results.push([cond ? 'PASS' : 'FAIL', name, extra || '']); };
function client(origin = ORIGIN) {
  return new Promise((res, rej) => { const ws = new WebSocket(BASE, { headers: { Origin: origin } }); const c = { ws, msgs: [] }; ws.on('message', d => c.msgs.push(JSON.parse(d.toString()))); ws.on('open', () => res(c)); ws.on('error', e => rej(e)); ws.on('unexpected-response', (q, r) => rej(new Error('HTTP ' + r.statusCode))); });
}
const send = (c, o) => c.ws.send(JSON.stringify(o));
const last = (c, t) => [...c.msgs].reverse().find(m => m.t === t);
const mod = async (body, token = 'local-test-token') => { const r = await fetch(HTTP + '/mod', { method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify(body) }); return [r.status, await r.json().catch(() => ({}))]; };

// origin gate
try { await client('https://evil.example'); ok('blocks a foreign origin', false); } catch (e) { ok('blocks a foreign origin', /403/.test(String(e)), String(e)); }
const a = await client(), b = await client();
send(a, { t: 'hello', name: 'Gator Fan 1' }); send(b, { t: 'hello', name: 'Seminole Sam' }); await sleep(300);
ok('hello returns history and count', last(a, 'hist') && last(b, 'hist'), JSON.stringify(last(b, 'hist')).slice(0, 80));
send(a, { t: 'hello', name: 'Jarvis' }); await sleep(100);
const c = await client(); send(c, { t: 'hello', name: 'Jarvis Official' }); await sleep(150); ok('reserved name rejected', last(c, 'err') && last(c, 'err').code === 'name', JSON.stringify(last(c, 'err')));
send(c, { t: 'hello', name: 'f u c k' }); await sleep(150); ok('profane nickname rejected', last(c, 'err').code === 'name');
send(a, { t: 'say', text: 'Go Gators! Baugh is close to 1,000' }); await sleep(250);
ok('message broadcasts to both', last(a, 'msg') && last(b, 'msg') && last(b, 'msg').m.text.startsWith('Go Gators'), JSON.stringify(last(b, 'msg')).slice(0, 90));
ok('sender name attached', last(b, 'msg').m.name === 'Gator Fan 1');
send(a, { t: 'say', text: 'again right away' }); await sleep(150); ok('slow mode blocks a quick second message', last(a, 'err') && last(a, 'err').code === 'slow', JSON.stringify(last(a, 'err')));
await sleep(3100);
for (const [txt, code, label] of [['check out www.example.com', 'link', 'link blocked'], ['visit foo.io now', 'link', 'bare domain blocked'], ['email me at bob@gmail.com', 'pii', 'email blocked'], ['call 352 555 0199 now', 'pii', 'phone blocked'], ['you are a sh1t team', 'clean', 'leetspeak profanity blocked'], ['f.u.c.k this', 'clean', 'spaced profanity blocked'], ['x'.repeat(201), 'long', 'too long blocked'], ['   ', 'empty', 'empty blocked']]) {
  send(b, { t: 'say', text: txt }); await sleep(200); const e = last(b, 'err'); ok(label, e && e.code === code, e ? e.code : 'no error'); await sleep(3050);
}
send(b, { t: 'say', text: 'Nice drive by the Gators, Class of 2024 here' }); await sleep(250); ok('normal text with "class" passes (no false positive)', last(a, 'msg').m.text.startsWith('Nice drive'));
await sleep(3100);
send(b, { t: 'say', text: 'Hancock Peacock Scunthorpe grape therapist' }); await sleep(250); ok('Scunthorpe words pass', last(a, 'msg').m.text.startsWith('Hancock'), JSON.stringify(last(a, 'err') || ''));
// moderation
ok('mod rejects a bad token', (await mod({ action: 'status' }, 'nope'))[0] === 401);
const [s1, st] = await mod({ action: 'status' }); ok('mod status works', s1 === 200 && st.msgs >= 2, JSON.stringify(st));
const [s2, said] = await mod({ action: 'say', text: 'Welcome to the Gator chat. Be respectful.' }); await sleep(250);
ok('staff say broadcasts with staff flag', s2 === 200 && last(a, 'msg').m.staff === 1 && last(a, 'msg').m.name === 'Jarvis', JSON.stringify(last(a, 'msg')).slice(0, 100));
const fanMsg = [...b.msgs].reverse().find(m => m.t === 'msg' && !m.m.staff); const targetId = fanMsg.m.id; const [s3] = await mod({ action: 'hide', id: targetId }); await sleep(200);
ok('hide removes a message for everyone', s3 === 200 && last(a, 'del') && last(a, 'del').id === targetId);
const hist = await (await fetch(HTTP + '/history', { headers: { Origin: ORIGIN } })).json(); ok('history excludes hidden', !hist.msgs.some(m => m.id === targetId) && hist.msgs.length >= 2, hist.msgs.length + ' msgs');
await mod({ action: 'open', open: false }); await sleep(200); send(a, { t: 'say', text: 'still here' }); await sleep(200);
ok('kill switch closes the chat', last(a, 'cfg') && last(a, 'cfg').cfg.open === false && last(a, 'err').code === 'closed');
await mod({ action: 'open', open: true });
const [s4, bn] = await mod({ action: 'ban', id: targetId, minutes: 5 }); await sleep(300);
ok('ban works and closes the banned socket', s4 === 200, JSON.stringify(bn)); 
try { const d2 = await client(); send(d2, { t: 'hello', name: 'Seminole Sam' }); await sleep(250); ok('banned nickname cannot rejoin', last(d2, 'err') && last(d2, 'err').code === 'banned', JSON.stringify(last(d2, 'err'))); d2.ws.close(); } catch (e) { ok('banned user is refused at connect', /403/.test(String(e)), String(e)); }
for (const r of results) console.log(r[0], r[1], r[2] ? '| ' + r[2] : '');
console.log('SUMMARY', results.filter(r => r[0] === 'PASS').length + '/' + results.length, 'passed'); process.exit(0);
