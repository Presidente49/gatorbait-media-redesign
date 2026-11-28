// gatorbait-chat: a small, moderated live chat for GatorBait Media game days.
// One Durable Object per room (for example "game-401856759") keeps the messages, bans and settings and serves
// WebSockets with the hibernation API. Nothing here stores an email, a real name or an IP address: the IP is
// hashed with a salt and used only for rate limits and bans.
import { DurableObject } from "cloudflare:workers";

const BASE_ORIGINS = ["https://www.gatorbaitmedia.com", "https://gatorbaitmedia.com", "https://presidente49.github.io"];
const MAX_TEXT = 200;
const KEEP = 500;
const HISTORY = 80;
const RESERVED = /^(jarvis|brenden|buddy|franz|loren|eddie|admin|administrator|mod|moderator|staff|system|espn|gatorbait|gator ?bait|official)/i;
const URL_RE = /(https?:\/\/|www\.|\b[a-z0-9-]{2,}\.(com|net|org|io|co|ly|gg|tv|me|us|xyz|info|app|gl|be|to|cc|ru|cn)\b)/i;
const EMAIL_RE = /[a-z0-9._%+-]+\s*@\s*[a-z0-9.-]+\s*\.\s*[a-z]{2,}/i;
const PHONE_RE = /(\+?\d[\s().-]?){10,}/;
// Moderation word lists, kept encoded so the source stays readable. STEMS match inside a word or a spaced-out word;
// WORDS must match a whole word.
const STEMS = atob("ZnVjayxzaGl0LGN1bnQsbmlnZyxmYWdnLGJpdGNoLHdob3JlLHJldGFyZCxwdXNzeSxiYXN0YXJkLGFzc2hvbGUsZGlja2hlYWQsY29ja3N1Y2ssbW90aGVyZixzbHV0dHksYnVsbHNoaXQsaG9yc2VzaGl0LGR1bWJhc3MsamFja2FzcyxzbWFydGFzcyxkaXBzaGl0LHNoaXRoZWFk").split(",");
const WORDS = new Set(atob("YXNzLGRpY2ssY29jayx0aXRzLHNsdXQsa2lrZSxzcGljLGNoaW5rLGZhZyxyYXBlLHJhcGlzdCxreXMsdHJhbm55LGR5a2UsdHdhdCx3YW5r").split(","));
const LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s", "!": "i", "+": "t" };

function hit(w) {
  if (WORDS.has(w)) return true;
  for (const s of STEMS) if (w.startsWith(s) || (s.length >= 5 && w.includes(s))) return true;
  return false;
}
function bad(text) {
  const t = text.toLowerCase().replace(/[013457@$!+]/g, (c) => LEET[c] || c);
  const tokens = t.replace(/[^a-z]+/g, " ").trim().split(" ").filter(Boolean);
  for (const w of tokens) if (hit(w)) return true;
  // letters spaced out or split by punctuation: "f u c k", "f.u.c.k"
  let run = "", n = 0;
  for (const w of tokens.concat([""])) {
    if (w.length > 0 && w.length <= 2) { run += w; n++; continue; }
    if (n >= 3 && hit(run)) return true;
    run = ""; n = 0;
  }
  return t.replace(/[^a-z]/g, "").includes("killyourself");
}

function cleanName(raw) {
  const v = String(raw || "").replace(/[​-‏‪-‮⁠-⁯﻿]/g, "").replace(/\s+/g, " ").trim();
  if (v.length < 2 || v.length > 20) return { ok: false, msg: "Pick a nickname with 2 to 20 characters." };
  if (!/^[A-Za-z0-9][A-Za-z0-9 _.'-]*$/.test(v)) return { ok: false, msg: "Use letters, numbers, spaces, dots, dashes or underscores." };
  if (RESERVED.test(v)) return { ok: false, msg: "That name is reserved. Pick another." };
  if (bad(v) || URL_RE.test(v)) return { ok: false, msg: "Pick a different nickname." };
  return { ok: true, v };
}

function cleanText(raw) {
  let s = String(raw || "").replace(/[​-‏‪-‮⁠-⁯﻿]/g, "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return { ok: false, code: "empty", msg: "Type something first." };
  if (s.length > MAX_TEXT) return { ok: false, code: "long", msg: "Keep it under " + MAX_TEXT + " characters." };
  s = s.replace(/(.)\1{5,}/g, "$1$1$1$1$1");
  if (EMAIL_RE.test(s) || PHONE_RE.test(s)) return { ok: false, code: "pii", msg: "Don't share contact info." };
  if (URL_RE.test(s)) return { ok: false, code: "link", msg: "No links, please." };
  if (bad(s)) return { ok: false, code: "clean", msg: "Keep it clean. That message wasn't sent." };
  return { ok: true, v: s };
}

const json = (obj, status = 200, headers = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers } });

async function hash(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].slice(0, 8).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function allowedOrigins(env) {
  const extra = String(env.ALLOW_ORIGINS || "").split(",").map((x) => x.trim()).filter(Boolean);
  return new Set(BASE_ORIGINS.concat(extra));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowed = allowedOrigins(env);
    const cors = origin && allowed.has(origin)
      ? { "access-control-allow-origin": origin, vary: "Origin", "access-control-allow-headers": "content-type, authorization", "access-control-allow-methods": "GET, POST, OPTIONS" }
      : { vary: "Origin" };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (url.pathname === "/") return json({ ok: true, service: "gatorbait-chat" }, 200, cors);
    const m = url.pathname.match(/^\/room\/([a-z0-9][a-z0-9-]{2,39})\/(ws|history|mod)$/);
    if (!m) return json({ error: "not found" }, 404, cors);
    const kind = m[2];
    if (kind === "ws") {
      if (request.headers.get("Upgrade") !== "websocket") return json({ error: "expected a websocket" }, 426, cors);
      if (!origin || !allowed.has(origin)) return json({ error: "origin not allowed" }, 403, cors);
    }
    if (kind === "history" && request.method !== "GET") return json({ error: "method not allowed" }, 405, cors);
    if (kind === "mod" && request.method !== "POST") return json({ error: "method not allowed" }, 405, cors);
    const stub = env.ROOM.get(env.ROOM.idFromName(m[1]));
    const res = await stub.fetch(request);
    if (kind === "ws") return res;
    const h = new Headers(res.headers);
    for (const [k, v] of Object.entries(cors)) h.set(k, v);
    return new Response(res.body, { status: res.status, headers: h });
  },
};

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, at INTEGER NOT NULL, name TEXT NOT NULL, text TEXT NOT NULL, staff INTEGER NOT NULL DEFAULT 0, hidden INTEGER NOT NULL DEFAULT 0, ip TEXT)");
    this.sql.exec("CREATE TABLE IF NOT EXISTS bans (k TEXT PRIMARY KEY, until INTEGER NOT NULL)");
    this.sql.exec("CREATE TABLE IF NOT EXISTS cfg (k TEXT PRIMARY KEY, v TEXT NOT NULL)");
  }

  getCfg() {
    const o = { open: true, slow: 3 };
    for (const r of this.sql.exec("SELECT k, v FROM cfg").toArray()) {
      if (r.k === "open") o.open = r.v === "1";
      if (r.k === "slow") o.slow = Math.max(1, Math.min(60, +r.v || 3));
    }
    return o;
  }
  setCfg(k, v) { this.sql.exec("INSERT INTO cfg (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v", k, String(v)); }
  recent(n) {
    return this.sql.exec("SELECT id, at, name, text, staff FROM messages WHERE hidden = 0 ORDER BY id DESC LIMIT ?", n).toArray().reverse();
  }
  isBanned(k) {
    if (!k) return false;
    const r = this.sql.exec("SELECT until FROM bans WHERE k = ?", k).toArray()[0];
    return !!r && r.until > Date.now();
  }
  count() { return this.ctx.getWebSockets().filter((w) => (w.deserializeAttachment() || {}).name).length; }
  send(ws, obj) { try { ws.send(JSON.stringify(obj)); } catch (e) { /* socket already gone */ } }
  broadcast(obj) { const s = JSON.stringify(obj); for (const w of this.ctx.getWebSockets()) { try { w.send(s); } catch (e) { /* ignore */ } } }
  err(ws, code, msg, wait) { this.send(ws, { t: "err", code, msg, wait }); }
  insert(at, name, text, staff, ip) {
    const row = this.sql.exec("INSERT INTO messages (at, name, text, staff, ip) VALUES (?, ?, ?, ?, ?) RETURNING id", at, name, text, staff, ip || null).toArray()[0];
    if (row.id % 50 === 0) this.sql.exec("DELETE FROM messages WHERE id < ?", row.id - KEEP);
    return { id: row.id, at, name, text, staff };
  }

  async fetch(request) {
    const kind = new URL(request.url).pathname.split("/").pop();
    if (kind === "history") return json({ msgs: this.recent(HISTORY), n: this.count(), cfg: this.getCfg() });
    if (kind === "mod") return this.mod(request);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const ipHash = await hash(ip + (this.env.SALT || "gb-chat"));
    if (this.isBanned(ipHash)) return json({ error: "banned" }, 403);
    const same = this.ctx.getWebSockets().filter((w) => (w.deserializeAttachment() || {}).ip === ipHash).length;
    if (same >= 6) return json({ error: "too many connections" }, 429);
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ ip: ipHash, name: null, last: 0, win: [], lastText: "" });
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, raw) {
    if (typeof raw !== "string" || raw.length > 1200) return;
    let d;
    try { d = JSON.parse(raw); } catch (e) { return; }
    const a = ws.deserializeAttachment() || {};
    if (d.t === "ping") return this.send(ws, { t: "pong" });
    if (d.t === "hello") {
      const nm = cleanName(d.name);
      if (!nm.ok) return this.err(ws, "name", nm.msg);
      if (this.isBanned(nm.v.toLowerCase()) || this.isBanned(a.ip)) return this.err(ws, "banned", "You can't join this chat.");
      a.name = nm.v;
      ws.serializeAttachment(a);
      this.send(ws, { t: "hist", msgs: this.recent(HISTORY), n: this.count(), cfg: this.getCfg(), you: a.name });
      return this.broadcast({ t: "n", n: this.count() });
    }
    if (d.t !== "say") return;
    if (!a.name) return this.err(ws, "name", "Pick a nickname first.");
    const cfg = this.getCfg();
    if (!cfg.open) return this.err(ws, "closed", "Chat is closed right now.");
    if (this.isBanned(a.ip) || this.isBanned(a.name.toLowerCase())) return this.err(ws, "banned", "You can't post in this chat.");
    const now = Date.now();
    const wait = cfg.slow * 1000 - (now - (a.last || 0));
    if (wait > 0) return this.err(ws, "slow", "Slow down.", wait);
    a.win = (a.win || []).filter((t) => now - t < 60000);
    if (a.win.length >= 12) return this.err(ws, "slow", "That's a lot of messages. Wait a bit.", 15000);
    const t = cleanText(d.text);
    if (!t.ok) return this.err(ws, t.code, t.msg);
    if (a.lastText && a.lastText === t.v.toLowerCase() && now - (a.last || 0) < 30000) return this.err(ws, "dupe", "You just said that.");
    a.last = now; a.win.push(now); a.lastText = t.v.toLowerCase();
    ws.serializeAttachment(a);
    this.broadcast({ t: "msg", m: this.insert(now, a.name, t.v, 0, a.ip) });
  }

  async webSocketClose(ws, code) {
    try { ws.close(code && code !== 1005 && code !== 1006 ? code : 1000, "bye"); } catch (e) { /* already closed */ }
    this.broadcast({ t: "n", n: this.count() });
  }
  async webSocketError(ws) {
    try { ws.close(1011, "error"); } catch (e) { /* already closed */ }
  }

  async mod(request) {
    const tok = this.env.MOD_TOKEN;
    if (!tok) return json({ error: "moderation is not configured" }, 503);
    const sent = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (sent.length !== tok.length || !crypto.subtle.timingSafeEqual(new TextEncoder().encode(sent), new TextEncoder().encode(tok))) return json({ error: "unauthorized" }, 401);
    let d;
    try { d = await request.json(); } catch (e) { return json({ error: "bad json" }, 400); }
    const act = d.action;
    if (act === "status") return json({ n: this.count(), cfg: this.getCfg(), msgs: this.sql.exec("SELECT COUNT(*) AS c FROM messages").toArray()[0].c, bans: this.sql.exec("SELECT COUNT(*) AS c FROM bans WHERE until > ?", Date.now()).toArray()[0].c });
    if (act === "say") {
      const t = cleanText(d.text);
      if (!t.ok) return json({ error: t.msg }, 400);
      const row = this.insert(Date.now(), String(d.name || "Jarvis").slice(0, 20), t.v, 1, null);
      this.broadcast({ t: "msg", m: row });
      return json({ ok: true, id: row.id });
    }
    if (act === "hide") {
      this.sql.exec("UPDATE messages SET hidden = 1 WHERE id = ?", +d.id || 0);
      this.broadcast({ t: "del", id: +d.id });
      return json({ ok: true });
    }
    if (act === "ban") {
      const r = this.sql.exec("SELECT name, ip FROM messages WHERE id = ?", +d.id || 0).toArray()[0];
      if (!r) return json({ error: "no such message" }, 404);
      const until = Date.now() + Math.max(1, Math.min(7 * 24 * 60, +d.minutes || 60)) * 60000;
      if (r.ip) this.sql.exec("INSERT INTO bans (k, until) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET until = excluded.until", r.ip, until);
      this.sql.exec("INSERT INTO bans (k, until) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET until = excluded.until", r.name.toLowerCase(), until);
      for (const x of this.sql.exec("SELECT id FROM messages WHERE hidden = 0 AND (ip = ? OR name = ?)", r.ip || "-", r.name).toArray()) { this.sql.exec("UPDATE messages SET hidden = 1 WHERE id = ?", x.id); this.broadcast({ t: "del", id: x.id }); }
      for (const w of this.ctx.getWebSockets()) { const a = w.deserializeAttachment() || {}; if (a.ip === r.ip || (a.name || "").toLowerCase() === r.name.toLowerCase()) { try { w.close(4003, "banned"); } catch (e) { /* ignore */ } } }
      return json({ ok: true, name: r.name, until });
    }
    if (act === "open") { this.setCfg("open", d.open ? "1" : "0"); const c = this.getCfg(); this.broadcast({ t: "cfg", cfg: c }); return json({ ok: true, cfg: c }); }
    if (act === "slow") { this.setCfg("slow", Math.max(1, Math.min(60, +d.seconds || 3))); const c = this.getCfg(); this.broadcast({ t: "cfg", cfg: c }); return json({ ok: true, cfg: c }); }
    if (act === "clear") {
      this.sql.exec("UPDATE messages SET hidden = 1");
      this.broadcast({ t: "clear" });
      return json({ ok: true });
    }
    return json({ error: "unknown action" }, 400);
  }
}
