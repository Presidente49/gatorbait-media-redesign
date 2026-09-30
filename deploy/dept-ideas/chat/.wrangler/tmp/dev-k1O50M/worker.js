var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker.mjs
var RING = 200;
var MAX_LEN = 240;
var LOCK_MIN = 5;
var HIDE_AT = 3;
var OPEN_BEFORE_MIN = 30;
var OPEN_AFTER_H = 5;
var WORDS = ["damn", "hell", "crap", "ass", "bitch", "shit", "fuck"];
var enc = new TextEncoder();
function b64u(buf) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(b64u, "b64u");
function unb64u(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), function(c) {
    return c.charCodeAt(0);
  });
}
__name(unb64u, "unb64u");
async function key(secret) {
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
__name(key, "key");
async function signToken(secret, payload) {
  var body = b64u(enc.encode(JSON.stringify(payload)));
  return body + "." + b64u(await crypto.subtle.sign("HMAC", await key(secret), enc.encode(body)));
}
__name(signToken, "signToken");
async function verifyToken(secret, token, now) {
  try {
    var parts = String(token || "").split(".");
    if (parts.length !== 2) return null;
    if (!await crypto.subtle.verify("HMAC", await key(secret), unb64u(parts[1]), enc.encode(parts[0]))) return null;
    var p = JSON.parse(new TextDecoder().decode(unb64u(parts[0])));
    if (!p || typeof p.sub !== "string" || typeof p.name !== "string" || !(p.exp > (now || Date.now()))) return null;
    return { sub: p.sub.slice(0, 64), name: p.name.replace(/[^\w .'-]/g, "").slice(0, 24) || "Reader", tier: /^(member|staff)$/.test(p.tier) ? p.tier : "reader" };
  } catch (_) {
    return null;
  }
}
__name(verifyToken, "verifyToken");
function et(ms) {
  var o = {};
  new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date(ms)).forEach(function(p) {
    o[p.type] = p.value;
  });
  return { wd: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday], min: Number(o.hour) % 24 * 60 + Number(o.minute) };
}
__name(et, "et");
function showWindow(ms) {
  var e = et(ms), prev = et(ms - 4 * 36e5);
  return [1, 3, 4].indexOf(e.wd) >= 0 && e.min >= 20 * 60 + 30 || [1, 3, 4].indexOf(prev.wd) >= 0 && e.min < 30;
}
__name(showWindow, "showWindow");
function roomInfo(sb, now, forceOpen) {
  var k = sb && sb.next ? Date.parse(sb.next.kickoffIso) : NaN, live = sb && sb.live && sb.live.status !== "final";
  var game = Number.isFinite(k) && now >= k - OPEN_BEFORE_MIN * 6e4 && now < k + OPEN_AFTER_H * 36e5;
  var lock = Number.isFinite(k) && now >= k && now < k + LOCK_MIN * 6e4;
  return {
    open: !!forceOpen || game || !!live || showWindow(now),
    lock,
    kickoff: Number.isFinite(k) ? new Date(k).toISOString() : null,
    lockUntil: Number.isFinite(k) ? new Date(k + LOCK_MIN * 6e4).toISOString() : null,
    why: forceOpen ? "forced" : game || live ? "game" : showWindow(now) ? "show" : "closed",
    next: sb && sb.next ? { opponent: sb.next.opponent, rank: sb.next.opponentRank, home: sb.next.home, tv: sb.next.tv, venue: sb.next.venue } : null,
    team: sb && sb.team ? sb.team : null,
    last: sb && sb.last ? { opponent: sb.last.opponent, rank: sb.last.opponentRank, score: sb.last.score, date: sb.last.date } : null,
    live: sb && sb.live || null
  };
}
__name(roomInfo, "roomInfo");
var RoomCore = class {
  static {
    __name(this, "RoomCore");
  }
  constructor(io, saved) {
    this.io = io;
    saved = saved || {};
    this.msgs = saved.msgs || [];
    this.reports = saved.reports || [];
    this.sb = saved.sb || null;
    this.settings = Object.assign({ slow: 30, memberOnly: false, open: true, forceOpen: false }, saved.settings || {});
    this.words = saved.words || WORDS;
    this.seq = saved.seq || 0;
    this.dirty = false;
  }
  toJSON() {
    return { msgs: this.msgs, reports: this.reports, sb: this.sb, settings: this.settings, words: this.words, seq: this.seq };
  }
  filterRe() {
    return this._re && this._reWords === this.words ? this._re : (this._reWords = this.words, this._re = new RegExp("\\b(" + this.words.map(function(w) {
      return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("|") + ")\\b", "gi"));
  }
  room() {
    return roomInfo(this.sb, this.io.now(), this.settings.forceOpen);
  }
  count() {
    var n = 0;
    for (var _ of this.io.sockets()) n++;
    return n;
  }
  send(ws, o) {
    try {
      this.io.send(ws, JSON.stringify(o));
    } catch (_) {
    }
  }
  cast(o, except) {
    var s = JSON.stringify(o);
    for (var ws of this.io.sockets()) if (ws !== except) {
      try {
        this.io.send(ws, s);
      } catch (_) {
      }
    }
  }
  join(ws, you) {
    this.io.set(ws, { sub: you.sub, name: you.name, tier: you.tier, last: 0 });
    var r = this.room();
    this.send(ws, { t: "welcome", you, settings: { slow: this.settings.slow, memberOnly: this.settings.memberOnly }, room: r, msgs: this.msgs.filter(function(m) {
      return !m.hidden;
    }).slice(-50).map(pub) });
    this.cast({ t: "count", n: this.count() });
  }
  leave() {
    this.cast({ t: "count", n: this.count() });
  }
  message(ws, raw) {
    var d = this.io.get(ws);
    if (!d) return this.io.close(ws, 1008, "no session");
    var o;
    try {
      o = JSON.parse(String(raw));
    } catch (_) {
      return this.send(ws, { t: "err", code: "bad", text: "Not JSON." });
    }
    if (!o || typeof o !== "object") return;
    if (o.t === "ping") return this.send(ws, { t: "pong", n: this.count() });
    if (o.t === "report") return this.report(ws, d, String(o.id || ""));
    if (o.t !== "msg") return;
    var r = this.room(), priv = d.tier === "member" || d.tier === "staff", now = this.io.now();
    if (!this.settings.open || !r.open) return this.send(ws, { t: "err", code: "closed", text: "The room is closed right now." });
    if (!priv && (this.settings.memberOnly || r.lock)) return this.send(ws, { t: "err", code: "members", text: r.lock ? "Members only for the first " + LOCK_MIN + " minutes after kickoff." : "Members only right now." });
    var wait = Math.ceil((d.last + this.settings.slow * 1e3 - now) / 1e3);
    if (!priv && this.settings.slow > 0 && wait > 0) return this.send(ws, { t: "err", code: "slow", wait, text: "Slow mode: " + wait + " s to go." });
    var text = String(o.text || "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_LEN);
    if (!text) return this.send(ws, { t: "err", code: "empty", text: "Say something first." });
    if (!priv && /https?:\/\/|www\./i.test(text)) return this.send(ws, { t: "err", code: "link", text: "Links are for members." });
    var masked = 0, clean = text.replace(this.filterRe(), function(w) {
      masked++;
      return w[0] + "***";
    });
    d.last = now;
    this.io.set(ws, d);
    var m = { id: String(++this.seq), sub: d.sub, name: d.name, tier: d.tier, text: clean, ts: now, reports: [], hidden: false, masked };
    this.msgs.push(m);
    if (this.msgs.length > RING) this.msgs.splice(0, this.msgs.length - RING);
    this.dirty = true;
    this.cast({ t: "msg", m: pub(m) });
    if (masked) this.send(ws, { t: "sys", text: "A word was masked by the filter. Keep it family friendly." });
  }
  report(ws, d, id) {
    var m = this.msgs.find(function(x) {
      return x.id === id;
    });
    if (!m || m.sub === d.sub) return this.send(ws, { t: "err", code: "report", text: "Nothing to report." });
    if (m.reports.indexOf(d.sub) < 0) m.reports.push(d.sub);
    this.reports.push({ id, by: d.sub, ts: this.io.now() });
    if (this.reports.length > 500) this.reports.splice(0, this.reports.length - 500);
    if (m.reports.length >= HIDE_AT && !m.hidden) {
      m.hidden = true;
      this.cast({ t: "del", id });
    }
    this.dirty = true;
    this.send(ws, { t: "sys", text: "Reported. A moderator will look." });
  }
  /* Moderator and desk commands (HTTP, MOD_KEY). */
  mod(cmd) {
    var s = this.settings, out = { ok: true };
    switch (cmd && cmd.cmd) {
      case "slow":
        s.slow = Math.max(0, Math.min(600, Number(cmd.seconds) || 0));
        break;
      case "memberOnly":
        s.memberOnly = !!cmd.on;
        break;
      case "open":
        s.open = !!cmd.on;
        break;
      case "forceOpen":
        s.forceOpen = !!cmd.on;
        break;
      case "words":
        if (Array.isArray(cmd.words)) this.words = cmd.words.map(String).filter(Boolean).slice(0, 500);
        break;
      case "del": {
        var m = this.msgs.find(function(x) {
          return x.id === String(cmd.id);
        });
        if (m) {
          m.hidden = true;
          this.cast({ t: "del", id: m.id });
        }
        out.found = !!m;
        break;
      }
      case "scoreboard":
        if (cmd.sb && typeof cmd.sb === "object") this.sb = cmd.sb;
        break;
      case "say":
        this.cast({ t: "sys", text: String(cmd.text || "").slice(0, MAX_LEN) });
        break;
      case "reports":
        out.reports = this.reports.slice(-100);
        out.hidden = this.msgs.filter(function(m2) {
          return m2.hidden;
        }).map(pub);
        break;
      case "state":
        break;
      default:
        return { ok: false, error: "unknown command" };
    }
    this.dirty = true;
    out.settings = s;
    out.room = this.room();
    out.count = this.count();
    out.messages = this.msgs.length;
    this.cast({ t: "room", room: out.room, settings: { slow: s.slow, memberOnly: s.memberOnly } });
    return out;
  }
};
function pub(m) {
  return { id: m.id, name: m.name, tier: m.tier, text: m.text, ts: m.ts };
}
__name(pub, "pub");
var StandsRoom = class {
  static {
    __name(this, "StandsRoom");
  }
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.core = null;
    this.fetchedAt = 0;
    var self = this, wm = /* @__PURE__ */ new WeakMap();
    this.io = {
      sockets: /* @__PURE__ */ __name(function() {
        return self.state.getWebSockets();
      }, "sockets"),
      send: /* @__PURE__ */ __name(function(ws, s) {
        ws.send(s);
      }, "send"),
      close: /* @__PURE__ */ __name(function(ws, c, r) {
        ws.close(c, r);
      }, "close"),
      get: /* @__PURE__ */ __name(function(ws) {
        var d = wm.get(ws);
        if (!d) {
          try {
            d = ws.deserializeAttachment();
          } catch (_) {
          }
          if (d) wm.set(ws, d);
        }
        return d || null;
      }, "get"),
      set: /* @__PURE__ */ __name(function(ws, d) {
        wm.set(ws, d);
        try {
          ws.serializeAttachment(d);
        } catch (_) {
        }
      }, "set"),
      now: /* @__PURE__ */ __name(function() {
        return Date.now();
      }, "now")
    };
  }
  async load() {
    if (this.core) return this.core;
    var saved = await this.state.storage.get("room");
    if (this.env.WORDS && (!saved || !saved.words)) {
      saved = saved || {};
      saved.words = String(this.env.WORDS).split(",").map(function(w) {
        return w.trim();
      }).filter(Boolean);
    }
    this.core = new RoomCore(this.io, saved);
    return this.core;
  }
  async save() {
    if (this.core && this.core.dirty) {
      this.core.dirty = false;
      await this.state.storage.put("room", this.core.toJSON());
    }
  }
  async scoreboard(core) {
    if (!this.env.SCOREBOARD_URL || Date.now() - this.fetchedAt < 6e4) return;
    this.fetchedAt = Date.now();
    try {
      var r = await fetch(this.env.SCOREBOARD_URL, { cf: { cacheTtl: 60 } });
      if (r.ok) {
        core.sb = await r.json();
        core.dirty = true;
      }
    } catch (_) {
    }
  }
  async fetch(req) {
    var core = await this.load(), url = new URL(req.url);
    if (url.pathname.endsWith("/ws")) {
      if (req.headers.get("Upgrade") !== "websocket") return new Response("Expected WebSocket", { status: 426 });
      var you = await verifyToken(this.env.TOKEN_SECRET, url.searchParams.get("token"));
      if (!you) return new Response("Sign in to chat", { status: 401 });
      await this.scoreboard(core);
      var pair = new WebSocketPair(), client = pair[0], server = pair[1];
      this.state.acceptWebSocket(server);
      core.join(server, you);
      await this.save();
      return new Response(null, { status: 101, webSocket: client });
    }
    if (url.pathname.endsWith("/mod")) {
      if (req.method !== "POST" || req.headers.get("Authorization") !== "Bearer " + this.env.MOD_KEY) return json({ ok: false, error: "unauthorized" }, 401);
      var out = core.mod(await req.json().catch(function() {
        return null;
      }));
      await this.save();
      return json(out);
    }
    await this.scoreboard(core);
    await this.save();
    return json({ room: core.room(), count: core.count(), settings: { slow: core.settings.slow, memberOnly: core.settings.memberOnly } });
  }
  async webSocketMessage(ws, msg) {
    var core = await this.load();
    core.message(ws, msg);
    await this.save();
  }
  async webSocketClose(ws) {
    var core = await this.load();
    core.leave(ws);
  }
  async webSocketError(ws) {
    var core = await this.load();
    core.leave(ws);
  }
};
function json(o, status) {
  return new Response(JSON.stringify(o), { status: status || 200, headers: { "content-type": "application/json", "access-control-allow-origin": "*" } });
}
__name(json, "json");
var worker_default = {
  async fetch(req, env) {
    var url = new URL(req.url), m = url.pathname.match(/^\/room\/([a-z]+-\d{4}-\d{2}-\d{2})\/(ws|state|mod)$/);
    if (m) {
      var id = env.ROOMS.idFromName(m[1]);
      return env.ROOMS.get(id).fetch(req);
    }
    if (url.pathname === "/token" && env.DEV_TOKENS === "1") {
      var name = url.searchParams.get("name") || "Reader", tier = url.searchParams.get("tier") || "reader";
      return json({ token: await signToken(env.TOKEN_SECRET, { sub: "dev-" + name.toLowerCase().replace(/\W+/g, "-"), name, tier, exp: Date.now() + 6e5 }) });
    }
    if (url.pathname === "/") return json({ service: "the-stands", routes: ["/room/{game|show}-YYYY-MM-DD/ws?token=", "/room/.../state", "/room/.../mod"] });
    return json({ error: "not found" }, 404);
  }
};

// ../../../../../../tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../../tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-fArcKL/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../../../../../tmp/claude-0/-home-user-gatorbait-media-redesign/cd3b0a89-2678-5856-96f6-cbc2d6d437c6/scratchpad/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-fArcKL/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  RoomCore,
  StandsRoom,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default,
  roomInfo,
  showWindow,
  signToken,
  verifyToken
};
//# sourceMappingURL=worker.js.map
