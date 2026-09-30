/* Make the Call: Cloudflare Worker backend for the front-page score-pick module.
 * Storage: D1 (binding DB, schema in schema.sql). No KV: KV's free tier allows 1,000 writes a day and a Missouri
 * week would pass that; D1's free tier allows 100,000 row writes a day.
 *
 * Routes
 *   GET  /v1/health           liveness
 *   GET  /v1/game/:id         crowd distribution for one game (public, cached 10 s at the edge)
 *   POST /v1/pick             {gameId, fla, opp, token}: one pick per browser token per game, editable until kickoff
 *   OPTIONS *                 CORS preflight
 *
 * Rules
 *   CORS: only https://www.gatorbaitmedia.com and https://gatorbaitmedia.com (plus env.DEV_ORIGINS for local work).
 *   Rate limit: fixed one-minute windows in D1, per hashed client IP: 6 POST/min, 60 GET/min.
 *   Kickoff lock: a POST at or after games.kickoff returns 409; the GET reports locked:true.
 *   Privacy: the browser token is hashed (SHA-256) before it is stored; IPs are hashed and only live in the
 *   one-minute rate-limit rows. No names, emails or Wix member data anywhere.
 *
 * Deploy (Jarvis): wrangler.toml binds DB to gatorbait-dev-make-the-call (9d7f90bc-8b98-4182-a4b0-69ab0e9ddc7b).
 */

const ORIGINS = ['https://www.gatorbaitmedia.com', 'https://gatorbaitmedia.com'];
const LIMITS = { post: 6, get: 60 }; // per client IP per minute
const MAX_BODY = 1024;
const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'x-content-type-options': 'nosniff' };

// Margin bins, Florida's point of view. Labels are finished by the game's opponent name.
const BINS = [
  ['fla14', 'Florida by 14+', 'fla - opp >= 14'],
  ['fla7', 'Florida by 7-13', 'fla - opp BETWEEN 7 AND 13'],
  ['fla1', 'Florida by 1-6', 'fla - opp BETWEEN 1 AND 6'],
  ['opp1', '{opp} by 1-6', 'opp - fla BETWEEN 1 AND 6'],
  ['opp7', '{opp} by 7-13', 'opp - fla BETWEEN 7 AND 13'],
  ['opp14', '{opp} by 14+', 'opp - fla >= 14'],
];
const DIST_SQL = 'SELECT COUNT(*) AS n, AVG(fla) AS af, AVG(opp) AS ao, SUM(fla > opp) AS fw, ' +
  BINS.map((b) => 'SUM(' + b[2] + ') AS ' + b[0]).join(', ') + ' FROM picks WHERE game_id = ?';
const TOP_SQL = 'SELECT fla, opp, COUNT(*) AS n FROM picks WHERE game_id = ? GROUP BY fla, opp ORDER BY n DESC, fla DESC, opp ASC LIMIT 1';
const GAME_SQL = 'SELECT id, away, home, fla_home, kickoff, final_fla, final_opp FROM games WHERE id = ?';
const UPSERT_SQL = 'INSERT INTO picks (game_id, voter, fla, opp, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?5) ' +
  'ON CONFLICT (game_id, voter) DO UPDATE SET fla = excluded.fla, opp = excluded.opp, updated_at = excluded.updated_at ' +
  'RETURNING created_at = updated_at AS fresh';
const RATE_SQL = 'INSERT INTO rate_limits (bucket, n, expires) VALUES (?1, 1, ?2) ON CONFLICT (bucket) DO UPDATE SET n = n + 1 RETURNING n';

function now(env) { const t = Number(env && env.NOW_OVERRIDE); return Number.isFinite(t) && t > 0 ? t : Date.now(); }
function iso(ms) { return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z'); }
function allowedOrigins(env) { return ORIGINS.concat(String(env && env.DEV_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)); }
function cors(request, env) {
  const origin = request.headers.get('origin') || '';
  const ok = allowedOrigins(env).includes(origin);
  const h = { vary: 'origin' };
  if (ok) {
    h['access-control-allow-origin'] = origin;
    h['access-control-allow-methods'] = 'GET, POST, OPTIONS';
    h['access-control-allow-headers'] = 'content-type';
    h['access-control-max-age'] = '86400';
  }
  return { ok, origin, headers: h };
}
function json(body, status, extra) {
  return new Response(JSON.stringify(body), { status: status || 200, headers: Object.assign({}, JSON_HEADERS, extra || {}) });
}
async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(text)));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function rateLimit(env, request, kind, t) {
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  const win = Math.floor(t / 60000);
  const bucket = kind + ':' + (await sha256(ip)).slice(0, 16) + ':' + win;
  const row = await env.DB.prepare(RATE_SQL).bind(bucket, (win + 1) * 60000).first();
  const n = row ? Number(row.n) : 1;
  // Opportunistic sweep of expired windows, about one request in 40.
  if (Math.random() < 0.025) await env.DB.prepare('DELETE FROM rate_limits WHERE expires < ?').bind(t).run();
  return n <= LIMITS[kind] ? null : { retry: Math.max(1, Math.ceil(((win + 1) * 60000 - t) / 1000)) };
}
async function loadGame(env, id) {
  if (!/^\d{6,12}$/.test(String(id || ''))) return null;
  return env.DB.prepare(GAME_SQL).bind(String(id)).first();
}
async function distribution(env, game, t) {
  const [d, top] = await env.DB.batch([env.DB.prepare(DIST_SQL).bind(game.id), env.DB.prepare(TOP_SQL).bind(game.id)]);
  const row = (d.results && d.results[0]) || {}, n = Number(row.n) || 0, opp = game.fla_home ? game.away : game.home;
  const tr = top.results && top.results[0];
  return {
    gameId: game.id, away: game.away, home: game.home, flaHome: !!game.fla_home, kickoff: game.kickoff,
    locked: t >= Date.parse(game.kickoff), final: game.final_fla == null ? null : { fla: game.final_fla, opp: game.final_opp },
    count: n,
    avg: n ? { fla: Math.round(Number(row.af)), opp: Math.round(Number(row.ao)) } : null,
    flaShare: n ? Number(row.fw) / n : null,
    bins: BINS.map((b) => { const k = Number(row[b[0]]) || 0; return { key: b[0], label: b[1].replace('{opp}', opp), n: k, share: n ? k / n : 0 }; }),
    top: tr ? { fla: Number(tr.fla), opp: Number(tr.opp), n: Number(tr.n) } : null,
    serverTime: iso(t),
  };
}
function intScore(v) { return Number.isInteger(v) && v >= 0 && v <= 99 ? v : null; }

export default {
  async fetch(request, env) {
    const url = new URL(request.url), t = now(env), c = cors(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: c.ok ? 204 : 403, headers: c.headers });
    if (!env || !env.DB) return json({ error: 'no database binding' }, 500, c.headers);
    try {
      if (request.method === 'GET' && url.pathname === '/v1/health') return json({ ok: true, serverTime: iso(t) }, 200, c.headers);

      const m = url.pathname.match(/^\/v1\/game\/(\d{6,12})$/);
      if (request.method === 'GET' && m) {
        const rl = await rateLimit(env, request, 'get', t);
        if (rl) return json({ error: 'rate limited', retryAfter: rl.retry }, 429, Object.assign({ 'retry-after': String(rl.retry) }, c.headers));
        const game = await loadGame(env, m[1]);
        if (!game) return json({ error: 'unknown game' }, 404, c.headers);
        return json(await distribution(env, game, t), 200, Object.assign({ 'cache-control': 'public, max-age=10, s-maxage=10' }, c.headers));
      }

      if (request.method === 'POST' && url.pathname === '/v1/pick') {
        if (!c.ok) return json({ error: 'origin not allowed' }, 403, c.headers);
        const rl = await rateLimit(env, request, 'post', t);
        if (rl) return json({ error: 'rate limited', retryAfter: rl.retry }, 429, Object.assign({ 'retry-after': String(rl.retry) }, c.headers));
        const text = await request.text();
        if (text.length > MAX_BODY) return json({ error: 'body too large' }, 413, c.headers);
        let body; try { body = JSON.parse(text); } catch (_) { return json({ error: 'invalid JSON' }, 400, c.headers); }
        const fla = intScore(body.fla), opp = intScore(body.opp), token = typeof body.token === 'string' && /^[A-Za-z0-9_-]{16,64}$/.test(body.token) ? body.token : null;
        if (fla === null || opp === null) return json({ error: 'scores must be whole numbers from 0 to 99' }, 422, c.headers);
        if (fla === opp) return json({ error: 'no ties: pick a winner' }, 422, c.headers);
        if (!token) return json({ error: 'missing token' }, 422, c.headers);
        const game = await loadGame(env, body.gameId);
        if (!game) return json({ error: 'unknown game' }, 404, c.headers);
        if (t >= Date.parse(game.kickoff)) return json({ error: 'locked', kickoff: game.kickoff }, 409, c.headers);
        const voter = (await sha256('gbm-call:' + token)).slice(0, 32);
        const res = await env.DB.prepare(UPSERT_SQL).bind(game.id, voter, fla, opp, iso(t)).first();
        const dist = await distribution(env, game, t);
        return json(Object.assign({ ok: true, yours: { fla, opp } }, dist), res && Number(res.fresh) === 1 ? 201 : 200, Object.assign({ 'cache-control': 'no-store' }, c.headers));
      }

      return json({ error: 'not found' }, 404, c.headers);
    } catch (err) {
      return json({ error: 'server error', detail: String(err && err.message || err).slice(0, 200) }, 500, c.headers);
    }
  },
};
