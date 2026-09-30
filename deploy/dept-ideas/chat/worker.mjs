/* The Stands: GatorBait live chat room. Cloudflare Worker + one Durable Object per room.
 * Rooms: "game-YYYY-MM-DD" (The Tunnel, game day) and "show-YYYY-MM-DD" (The Buddy Martin Show).
 * Rules live server-side so a modified client cannot skip them: slow mode, word filter, member-only mode,
 * the kickoff lock (members only for LOCK_MIN minutes after kickoff, read from sports-live/scoreboard.json),
 * one-tap report (HIDE_AT reports hides a post until a moderator rules) and a 200-message ring buffer.
 * RoomCore holds every rule with no Cloudflare API in it, so the same class runs under a plain `ws` server
 * for local tests; StandsRoom is the Durable Object adapter (WebSocket Hibernation API, storage).
 *
 * Wire protocol (JSON, one object per frame)
 *   client -> {t:'msg',text} {t:'report',id} {t:'ping'}
 *   server -> {t:'welcome',you,settings,msgs,room} {t:'msg',m} {t:'sys',text} {t:'err',code,text,wait}
 *             {t:'del',id} {t:'count',n} {t:'room',...}
 * Sign-in: ?token=<payload>.<hmac> issued by the Velo HTTP function (/_functions/standsToken) with the same
 * TOKEN_SECRET; payload {sub, name, tier:'reader'|'member'|'staff', exp}. DEV_TOKENS=1 lets /token mint
 * test tokens locally; never set it on the deployed Worker. */

export const RING = 200, MAX_LEN = 240, LOCK_MIN = 5, HIDE_AT = 3, OPEN_BEFORE_MIN = 30, OPEN_AFTER_H = 5;
const WORDS = ['damn', 'hell', 'crap', 'ass', 'bitch', 'shit', 'fuck']; // starter list; override with the WORDS var (comma separated)
const enc = new TextEncoder();

/* ---------- tokens (HMAC-SHA256, base64url) ---------- */
function b64u(buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unb64u(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); }
async function key(secret) { return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']); }
export async function signToken(secret, payload) {
  var body = b64u(enc.encode(JSON.stringify(payload)));
  return body + '.' + b64u(await crypto.subtle.sign('HMAC', await key(secret), enc.encode(body)));
}
export async function verifyToken(secret, token, now) {
  try {
    var parts = String(token || '').split('.'); if (parts.length !== 2) return null;
    if (!(await crypto.subtle.verify('HMAC', await key(secret), unb64u(parts[1]), enc.encode(parts[0])))) return null;
    var p = JSON.parse(new TextDecoder().decode(unb64u(parts[0])));
    if (!p || typeof p.sub !== 'string' || typeof p.name !== 'string' || !(p.exp > (now || Date.now()))) return null;
    return { sub: p.sub.slice(0, 64), name: p.name.replace(/[^\w .'-]/g, '').slice(0, 24) || 'Reader', tier: /^(member|staff)$/.test(p.tier) ? p.tier : 'reader' };
  } catch (_) { return null; }
}

/* ---------- windows: game day from the scoreboard, show nights Mon/Wed/Thu 8:30 p.m. to 12:30 a.m. ET ---------- */
function et(ms) {
  var o = {};
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
  return { wd: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: (Number(o.hour) % 24) * 60 + Number(o.minute) };
}
export function showWindow(ms) {
  var e = et(ms), prev = et(ms - 4 * 3600000);
  return ([1, 3, 4].indexOf(e.wd) >= 0 && e.min >= 20 * 60 + 30) || ([1, 3, 4].indexOf(prev.wd) >= 0 && e.min < 30);
}
export function roomInfo(sb, now, forceOpen) {
  var k = sb && sb.next ? Date.parse(sb.next.kickoffIso) : NaN, live = sb && sb.live && sb.live.status !== 'final';
  var game = Number.isFinite(k) && now >= k - OPEN_BEFORE_MIN * 60000 && now < k + OPEN_AFTER_H * 3600000;
  var lock = Number.isFinite(k) && now >= k && now < k + LOCK_MIN * 60000;
  return { open: !!forceOpen || game || !!live || showWindow(now), lock: lock, kickoff: Number.isFinite(k) ? new Date(k).toISOString() : null,
    lockUntil: Number.isFinite(k) ? new Date(k + LOCK_MIN * 60000).toISOString() : null, why: forceOpen ? 'forced' : game || live ? 'game' : showWindow(now) ? 'show' : 'closed',
    next: sb && sb.next ? { opponent: sb.next.opponent, rank: sb.next.opponentRank, home: sb.next.home, tv: sb.next.tv, venue: sb.next.venue } : null,
    team: sb && sb.team ? sb.team : null, last: sb && sb.last ? { opponent: sb.last.opponent, rank: sb.last.opponentRank, score: sb.last.score, date: sb.last.date } : null, live: sb && sb.live || null };
}

/* ---------- RoomCore: the rules. `io` = {sockets(), send(ws,str), close(ws,code,reason), get(ws), set(ws,d), now()} ---------- */
export class RoomCore {
  constructor(io, saved) {
    this.io = io; saved = saved || {};
    this.msgs = saved.msgs || []; this.reports = saved.reports || []; this.sb = saved.sb || null;
    this.settings = Object.assign({ slow: 30, memberOnly: false, open: true, forceOpen: false }, saved.settings || {});
    this.words = saved.words || WORDS; this.seq = saved.seq || 0; this.dirty = false;
  }
  toJSON() { return { msgs: this.msgs, reports: this.reports, sb: this.sb, settings: this.settings, words: this.words, seq: this.seq }; }
  filterRe() { return this._re && this._reWords === this.words ? this._re : (this._reWords = this.words, this._re = new RegExp('\\b(' + this.words.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')\\b', 'gi')); }
  room() { return roomInfo(this.sb, this.io.now(), this.settings.forceOpen); }
  count() { var n = 0; for (var _ of this.io.sockets()) n++; return n; }
  send(ws, o) { try { this.io.send(ws, JSON.stringify(o)); } catch (_) { } }
  cast(o, except) { var s = JSON.stringify(o); for (var ws of this.io.sockets()) if (ws !== except) { try { this.io.send(ws, s); } catch (_) { } } }
  join(ws, you) {
    this.io.set(ws, { sub: you.sub, name: you.name, tier: you.tier, last: 0 });
    var r = this.room();
    this.send(ws, { t: 'welcome', you: you, settings: { slow: this.settings.slow, memberOnly: this.settings.memberOnly }, room: r, msgs: this.msgs.filter(function (m) { return !m.hidden; }).slice(-50).map(pub) });
    this.cast({ t: 'count', n: this.count() });
  }
  leave() { this.cast({ t: 'count', n: this.count() }); }
  message(ws, raw) {
    var d = this.io.get(ws); if (!d) return this.io.close(ws, 1008, 'no session');
    var o; try { o = JSON.parse(String(raw)); } catch (_) { return this.send(ws, { t: 'err', code: 'bad', text: 'Not JSON.' }); }
    if (!o || typeof o !== 'object') return;
    if (o.t === 'ping') return this.send(ws, { t: 'pong', n: this.count() });
    if (o.t === 'report') return this.report(ws, d, String(o.id || ''));
    if (o.t !== 'msg') return;
    var r = this.room(), priv = d.tier === 'member' || d.tier === 'staff', now = this.io.now();
    if (!this.settings.open || !r.open) return this.send(ws, { t: 'err', code: 'closed', text: 'The room is closed right now.' });
    if (!priv && (this.settings.memberOnly || r.lock)) return this.send(ws, { t: 'err', code: 'members', text: r.lock ? 'Members only for the first ' + LOCK_MIN + ' minutes after kickoff.' : 'Members only right now.' });
    var wait = Math.ceil((d.last + this.settings.slow * 1000 - now) / 1000);
    if (!priv && this.settings.slow > 0 && wait > 0) return this.send(ws, { t: 'err', code: 'slow', wait: wait, text: 'Slow mode: ' + wait + ' s to go.' });
    var text = String(o.text || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_LEN);
    if (!text) return this.send(ws, { t: 'err', code: 'empty', text: 'Say something first.' });
    if (!priv && /https?:\/\/|www\./i.test(text)) return this.send(ws, { t: 'err', code: 'link', text: 'Links are for members.' });
    var masked = 0, clean = text.replace(this.filterRe(), function (w) { masked++; return w[0] + '***'; });
    d.last = now; this.io.set(ws, d);
    var m = { id: String(++this.seq), sub: d.sub, name: d.name, tier: d.tier, text: clean, ts: now, reports: [], hidden: false, masked: masked };
    this.msgs.push(m); if (this.msgs.length > RING) this.msgs.splice(0, this.msgs.length - RING);
    this.dirty = true; this.cast({ t: 'msg', m: pub(m) });
    if (masked) this.send(ws, { t: 'sys', text: 'A word was masked by the filter. Keep it family friendly.' });
  }
  report(ws, d, id) {
    var m = this.msgs.find(function (x) { return x.id === id; });
    if (!m || m.sub === d.sub) return this.send(ws, { t: 'err', code: 'report', text: 'Nothing to report.' });
    if (m.reports.indexOf(d.sub) < 0) m.reports.push(d.sub);
    this.reports.push({ id: id, by: d.sub, ts: this.io.now() }); if (this.reports.length > 500) this.reports.splice(0, this.reports.length - 500);
    if (m.reports.length >= HIDE_AT && !m.hidden) { m.hidden = true; this.cast({ t: 'del', id: id }); }
    this.dirty = true; this.send(ws, { t: 'sys', text: 'Reported. A moderator will look.' });
  }
  /* Moderator and desk commands (HTTP, MOD_KEY). */
  mod(cmd) {
    var s = this.settings, out = { ok: true };
    switch (cmd && cmd.cmd) {
      case 'slow': s.slow = Math.max(0, Math.min(600, Number(cmd.seconds) || 0)); break;
      case 'memberOnly': s.memberOnly = !!cmd.on; break;
      case 'open': s.open = !!cmd.on; break;
      case 'forceOpen': s.forceOpen = !!cmd.on; break;
      case 'words': if (Array.isArray(cmd.words)) this.words = cmd.words.map(String).filter(Boolean).slice(0, 500); break;
      case 'del': { var m = this.msgs.find(function (x) { return x.id === String(cmd.id); }); if (m) { m.hidden = true; this.cast({ t: 'del', id: m.id }); } out.found = !!m; break; }
      case 'scoreboard': if (cmd.sb && typeof cmd.sb === 'object') this.sb = cmd.sb; break;
      case 'say': this.cast({ t: 'sys', text: String(cmd.text || '').slice(0, MAX_LEN) }); break;
      case 'reports': out.reports = this.reports.slice(-100); out.hidden = this.msgs.filter(function (m) { return m.hidden; }).map(pub); break;
      case 'state': break;
      default: return { ok: false, error: 'unknown command' };
    }
    this.dirty = true;
    out.settings = s; out.room = this.room(); out.count = this.count(); out.messages = this.msgs.length;
    this.cast({ t: 'room', room: out.room, settings: { slow: s.slow, memberOnly: s.memberOnly } });
    return out;
  }
}
function pub(m) { return { id: m.id, name: m.name, tier: m.tier, text: m.text, ts: m.ts }; }

/* ---------- Durable Object adapter ---------- */
export class StandsRoom {
  constructor(state, env) {
    this.state = state; this.env = env; this.core = null; this.fetchedAt = 0;
    var self = this, wm = new WeakMap();
    this.io = {
      sockets: function () { return self.state.getWebSockets(); }, send: function (ws, s) { ws.send(s); }, close: function (ws, c, r) { ws.close(c, r); },
      get: function (ws) { var d = wm.get(ws); if (!d) { try { d = ws.deserializeAttachment(); } catch (_) { } if (d) wm.set(ws, d); } return d || null; },
      set: function (ws, d) { wm.set(ws, d); try { ws.serializeAttachment(d); } catch (_) { } }, now: function () { return Date.now(); }
    };
  }
  async load() {
    if (this.core) return this.core;
    var saved = await this.state.storage.get('room');
    if (this.env.WORDS && (!saved || !saved.words)) { saved = saved || {}; saved.words = String(this.env.WORDS).split(',').map(function (w) { return w.trim(); }).filter(Boolean); }
    this.core = new RoomCore(this.io, saved); return this.core;
  }
  async save() { if (this.core && this.core.dirty) { this.core.dirty = false; await this.state.storage.put('room', this.core.toJSON()); } }
  async scoreboard(core) {
    // The desk pushes scoreboard.json with {cmd:'scoreboard'}; between pushes the room refreshes itself from Pages, at most once a minute.
    if (!this.env.SCOREBOARD_URL || Date.now() - this.fetchedAt < 60000) return;
    this.fetchedAt = Date.now();
    try { var r = await fetch(this.env.SCOREBOARD_URL, { cf: { cacheTtl: 60 } }); if (r.ok) { core.sb = await r.json(); core.dirty = true; } } catch (_) { }
  }
  async fetch(req) {
    var core = await this.load(), url = new URL(req.url);
    if (url.pathname.endsWith('/ws')) {
      if (req.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
      var you = await verifyToken(this.env.TOKEN_SECRET, url.searchParams.get('token'));
      if (!you) return new Response('Sign in to chat', { status: 401 });
      await this.scoreboard(core);
      var pair = new WebSocketPair(), client = pair[0], server = pair[1];
      this.state.acceptWebSocket(server); core.join(server, you); await this.save();
      return new Response(null, { status: 101, webSocket: client });
    }
    if (url.pathname.endsWith('/mod')) {
      if (req.method !== 'POST' || req.headers.get('Authorization') !== 'Bearer ' + this.env.MOD_KEY) return json({ ok: false, error: 'unauthorized' }, 401);
      var out = core.mod(await req.json().catch(function () { return null; })); await this.save(); return json(out);
    }
    await this.scoreboard(core); await this.save();
    return json({ room: core.room(), count: core.count(), settings: { slow: core.settings.slow, memberOnly: core.settings.memberOnly } });
  }
  async webSocketMessage(ws, msg) { var core = await this.load(); core.message(ws, msg); await this.save(); }
  async webSocketClose(ws) { var core = await this.load(); core.leave(ws); }
  async webSocketError(ws) { var core = await this.load(); core.leave(ws); }
}

function json(o, status) { return new Response(JSON.stringify(o), { status: status || 200, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' } }); }

/* ---------- Worker: routes /room/:id/{ws,state,mod}; /token only when DEV_TOKENS=1 ---------- */
export default {
  async fetch(req, env) {
    var url = new URL(req.url), m = url.pathname.match(/^\/room\/([a-z]+-\d{4}-\d{2}-\d{2})\/(ws|state|mod)$/);
    if (m) { var id = env.ROOMS.idFromName(m[1]); return env.ROOMS.get(id).fetch(req); }
    if (url.pathname === '/token' && env.DEV_TOKENS === '1') {
      var name = url.searchParams.get('name') || 'Reader', tier = url.searchParams.get('tier') || 'reader';
      return json({ token: await signToken(env.TOKEN_SECRET, { sub: 'dev-' + name.toLowerCase().replace(/\W+/g, '-'), name: name, tier: tier, exp: Date.now() + 600000 }) });
    }
    if (url.pathname === '/') return json({ service: 'the-stands', routes: ['/room/{game|show}-YYYY-MM-DD/ws?token=', '/room/.../state', '/room/.../mod'] });
    return json({ error: 'not found' }, 404);
  }
};
