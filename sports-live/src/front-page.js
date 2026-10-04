  /* Runtime for GatorBait Front Page 2026. CSS and BUNDLE are injected by build-front-page.mjs.
   * Contract kept from the previous renderer: one root #gbm-live.gbm-gazette.gbm-sports-home,
   * window.__GBM_GAZETTE_RUNTIME__ {sync, ready}, __GBM_GAZETTE_BOOT__.ready/fallback, the
   * gbm:gazette-ready event, the 15-minute session feed cache and paint-once (no jump). */
  var VERSION = 'front-page-2026.1';
  var PAGES = 'https://presidente49.github.io/gatorbait-media-redesign/';
  var RSS = '/blog-feed.xml';
  var TZ = 'America/New_York';
  var TSP = 'https://cdn.jsdelivr.net/npm/@tsparticles/slim@3.9.1/tsparticles.slim.bundle.min.js';
  var FONTS = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@600;700;800&display=swap';
  var DAY = 86400000;
  var doc = document.documentElement;
  var L = BUNDLE.links;
  function home() { return (location.pathname.replace(/\/+$/, '') || '/') === '/'; }
  if (window.__GBM_GAZETTE_RUNTIME__) { window.__GBM_GAZETTE_RUNTIME__.sync(); return; }
  var loading = false, tickTimer = 0, particles = null, io = null;

  function now() { var t = Number(window.__GBM_FP_NOW__); return Number.isFinite(t) && t > 0 ? t : Date.now(); }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function reduced() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } }
  function prefersDark() { try { return matchMedia('(prefers-color-scheme: dark)').matches; } catch (_) { return false; } }
  // Links: our own site paths, our YouTube/Facebook, the store. Nothing else renders.
  function safeUrl(value, kind) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      var u = new URL(String(value), 'https://www.gatorbaitmedia.com');
      if (u.protocol !== 'https:' || u.username || u.password) return '';
      if (kind === 'image') return u.hostname === 'static.wixstatic.com' || u.hostname === 'i.ytimg.com' ? u.href : '';
      if (kind === 'post') return /^(www\.)?gatorbaitmedia\.com$/.test(u.hostname) && u.pathname.indexOf('/post/') === 0 ? u.href : '';
      if (/^(www\.)?gatorbaitmedia\.com$/.test(u.hostname)) return u.pathname + u.search + u.hash;
      if (/^(www\.youtube\.com|www\.facebook\.com|gatorbait2026\.itemorder\.com)$/.test(u.hostname)) return u.href;
      return '';
    } catch (_) { return ''; }
  }
  function path(url) { try { return new URL(url, 'https://www.gatorbaitmedia.com').pathname; } catch (_) { return ''; } }

  /* ---------- Time (America/New_York) ---------- */
  var MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var WDS = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
  function et(ms) {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date(ms)).forEach(function (p) { o[p.type] = p.value; });
    return { wd: WD[o.weekday], h: Number(o.hour) % 24, m: Number(o.minute), ymd: o.year + '-' + o.month + '-' + o.day, y: Number(o.year), mo: Number(o.month) - 1, d: Number(o.day) };
  }
  function ymdOf(v) { if (/^\d{4}-\d{2}-\d{2}$/.test(String(v || ''))) return String(v); var t = Date.parse(v); return Number.isFinite(t) ? et(t).ymd : ''; }
  function clock(ms) { var e = et(ms), h = e.h % 12 || 12; return h + (e.m ? ':' + String(e.m).padStart(2, '0') : '') + (e.h < 12 ? ' a.m.' : ' p.m.'); }
  function shortDate(ms) { var e = et(ms); return MONTHS[e.mo] + ' ' + e.d; }
  function gameWhen(iso) { var t = Date.parse(iso); if (!Number.isFinite(t)) return ''; var e = et(t); return WDS[e.wd] + ', ' + MONTHS[e.mo] + ' ' + e.d + ' · ' + clock(t) + ' ET'; }
  function ago(date) {
    var mins = Math.max(0, Math.round((now() - date.getTime()) / 60000));
    if (mins < 60) return mins <= 1 ? 'Now' : mins + 'm';
    if (mins < 24 * 60) return Math.round(mins / 60) + 'h';
    return shortDate(date.getTime());
  }
  function dateline() {
    var d = new Date(now());
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: TZ });
  }

  /* ---------- Stories ---------- */
  function normalize(data) {
    var seen = new Set(), t = now();
    return (data && Array.isArray(data.posts) ? data.posts : []).map(function (p) {
      var u = safeUrl(p.url, 'post'), date = new Date(p.firstPublishedDate);
      if (!u || !p.title || !Number.isFinite(date.getTime()) || date.getTime() > t + DAY || seen.has(u)) return null;
      if (/^LIVE NOW:/i.test(String(p.title)) && t - date.getTime() > 21600000) return null;
      seen.add(u);
      var raw = String(p.excerpt || '').replace(/\s+/g, ' ').trim(), cap = '', credit = '';
      // Franz-style excerpts open with the photo caption: "Caption (Photo by Chris Spears) Story..."
      var m = raw.match(/^(.{8,220}?)\s*\(((?:UAA )?Photo(?: by)?[^)]{0,60}|[^)]{0,40} photo)\)\s*(.*)$/i);
      if (m) { cap = m[1]; credit = /spears/i.test(m[2]) ? 'Photo by Chris Spears, GatorBait Media' : m[2].replace(/^photo:?\s*/i, 'Photo: '); raw = m[3]; }
      var image = safeUrl(p.image && p.image.src, 'image');
      var key = (image.match(/media\/([0-9a-f]+_[0-9a-f]+)/) || [])[1] || '';
      if (BUNDLE.credits[key]) credit = BUNDLE.credits[key];
      return { title: String(p.title).trim(), url: u, path: path(u), author: String(p.author || 'GatorBait Staff'), date: date, excerpt: raw,
        cap: cap, credit: credit, image: image, key: key, alt: String(p.image && p.image.alt || p.title), cover: (BUNDLE.covers || []).indexOf(key) >= 0,
        portrait: !!(p.image && Number(p.image.width) > 0 && Number(p.image.height) > Number(p.image.width)) };
    }).filter(Boolean).sort(function (a, b) { return b.date - a.date; }).slice(0, 30);
  }
  function isSpears(p) { return /chris spears/i.test(p.author) || /^chris spears/i.test(p.title); }
  function byColumnist(p, name) { return name === 'Chris Spears' ? isSpears(p) : p.author.toLowerCase().indexOf(name.toLowerCase()) >= 0; }

  // Home Code lead rule: breaking pin > timed pin (unless a newer Buddy piece) > newest Buddy <= 7 days > newest.
  function pickLead(posts) {
    var t = now(), pins = {}, extra = window.__GBM_HOME_PINS__;
    ['breaking', 'timed'].forEach(function (k) { pins[k] = extra && extra.hasOwnProperty(k) ? extra[k] : BUNDLE.pins[k]; });
    function find(pin) {
      if (!pin || !pin.path) return null;
      if (pin.until && !(t < Date.parse(pin.until))) return null;
      return posts.find(function (p) { return p.path.indexOf(pin.path) === 0; }) || null;
    }
    var breaking = find(pins.breaking);
    if (breaking) return { post: breaking, why: 'breaking' };
    var buddy = posts.find(function (p) { return /buddy martin/i.test(p.author) && t - p.date.getTime() < 7 * DAY; });
    var timed = find(pins.timed);
    if (timed && !(buddy && buddy.date > timed.date)) return { post: timed, why: 'pin' };
    if (buddy) return { post: buddy, why: 'buddy' };
    return { post: posts[0], why: 'newest' };
  }

  /* ---------- Scoreboard feed (sports-live/scoreboard.json, contract in README "Scoreboard feed") ----------
   * { updatedAt, season, team:{name,rank,record,conf},
   *   last:{opponent,opponentRank,home,date,status,score:{fla,opp},quarters:{fla:[],opp:[]}|null,venue,recapUrl,galleryUrl}|null,
   *   next:{opponent,opponentRank,home,kickoffIso,tv,venue,previewUrl}|null,
   *   schedule:[{date,opponent,opponentRank,home,status,score|null,tv,storyUrl}],
   *   standings:[{team,confRecord,overall}], live:null|{clock,period,score:{fla,opp},possession,lastPlay} }
   * Every field is validated on its own; anything missing or malformed keeps the bundled fact. */
  function num(v) { return typeof v === 'number' && Number.isFinite(v) ? v : null; }
  function str(v, max) { return typeof v === 'string' && v.trim() ? v.trim().slice(0, max || 80) : null; }
  function arr(v) { return Array.isArray(v) && v.length <= 8 && v.every(function (x) { return num(x) !== null; }) ? v.slice() : null; }
  function mergeGame(base, g, kind) {
    var out = Object.assign({}, base);
    if (!g || typeof g !== 'object') return out;
    ['opponent', 'opponentAbbr', 'venue', 'tv'].forEach(function (k) { var s = str(g[k], 90); if (s) out[k] = s; });
    ['recapUrl', 'previewUrl', 'galleryUrl'].forEach(function (k) { var u = safeUrl(g[k]); if (u && u.charAt(0) === '/') out[k] = u; });
    if (g.hasOwnProperty('opponentRank') && (num(g.opponentRank) !== null || g.opponentRank === null)) out.opponentRank = num(g.opponentRank);
    if (str(g.opponentRecord, 12)) out.opponentRecord = str(g.opponentRecord, 12);
    if (typeof g.home === 'boolean') out.home = g.home;
    if (kind === 'last') {
      if (g.score && num(g.score.fla) !== null && num(g.score.opp) !== null) out.score = { fla: g.score.fla, opp: g.score.opp };
      if (g.quarters && arr(g.quarters.fla) && arr(g.quarters.opp)) out.quarters = { fla: arr(g.quarters.fla), opp: arr(g.quarters.opp) };
      else if (g.hasOwnProperty('quarters')) out.quarters = null;
      if (g.stats && typeof g.stats === 'object') { var s = {}; ['totalYards', 'rushYards', 'firstDowns', 'attendance'].forEach(function (k) { if (num(g.stats[k]) !== null) s[k] = g.stats[k]; }); out.stats = s; }
      if (ymdOf(g.date)) out.date = g.date;
    } else {
      if (Number.isFinite(Date.parse(g.kickoffIso))) out.kickoffIso = g.kickoffIso;
      if (/^\d{6,12}$/.test(String(g.eventId || ''))) out.eventId = String(g.eventId); // ESPN event id: keys Make the Call
    }
    return out;
  }
  // Season rows keep the feed's field names (opponentRank, storyUrl) so the band and the hub read one shape; `rank` stays as an alias.
  function normSchedule(list) {
    return Array.isArray(list) ? list.slice(0, 20).map(function (g) {
      if (!g || !str(g.opponent, 40) || !Number.isFinite(Date.parse(g.date))) return null;
      var rank = num(g.opponentRank);
      return { opponent: str(g.opponent, 40), opponentRank: rank, rank: rank, home: g.home === true, date: g.date, status: str(g.status, 16) || '', tv: str(g.tv, 24) || '',
        score: g.score && num(g.score.fla) !== null && num(g.score.opp) !== null ? { fla: g.score.fla, opp: g.score.opp } : null, storyUrl: str(g.storyUrl, 300) || '' };
    }).filter(Boolean) : [];
  }
  function readScoreboard(raw) {
    var fb = BUNDLE.scoreboard, sb = { team: Object.assign({}, fb.team), last: Object.assign({}, fb.last), next: Object.assign({}, fb.next), schedule: normSchedule(fb.schedule), standings: [], live: null, source: 'bundled' };
    if (!raw || typeof raw !== 'object' || !raw.team) return sb;
    sb.source = 'feed';
    if (raw.team.hasOwnProperty('rank') && (num(raw.team.rank) !== null || raw.team.rank === null)) sb.team.rank = num(raw.team.rank);
    if (str(raw.team.record, 12)) sb.team.record = str(raw.team.record, 12);
    // A different opponent replaces the whole game, so old quarters/stats never mix with a new score.
    if (raw.last === null) sb.last = null;
    else if (raw.last && str(raw.last.opponent) && raw.last.opponent !== fb.last.opponent) sb.last = mergeGame({ opponent: '', home: true }, raw.last, 'last');
    else sb.last = mergeGame(sb.last, raw.last, 'last');
    if (raw.next === null) sb.next = null;
    else if (raw.next && str(raw.next.opponent) && raw.next.opponent !== fb.next.opponent) sb.next = mergeGame({ opponent: '', home: false }, raw.next, 'next');
    else sb.next = mergeGame(sb.next, raw.next, 'next');
    if (sb.next && !Number.isFinite(Date.parse(sb.next.kickoffIso))) sb.next = null;
    if (Array.isArray(raw.standings)) sb.standings = raw.standings.slice(0, 16).map(function (r) {
      return r && str(r.team, 40) ? { team: str(r.team, 40), conf: str(r.confRecord, 8) || str(r.conf, 8) || '', overall: str(r.overall, 8) || '' } : null; }).filter(Boolean);
    if (Array.isArray(raw.schedule) && normSchedule(raw.schedule).length) sb.schedule = normSchedule(raw.schedule);
    var lv = raw.live;
    if (lv && typeof lv === 'object' && lv.score && num(lv.score.fla) !== null && num(lv.score.opp) !== null) {
      var clk = str(lv.clock, 16) || '', per = num(lv.period);
      sb.live = { status: /half/i.test(clk) ? 'half' : 'live', clock: (per ? (per > 4 ? 'OT' : 'Q' + per) + (clk ? ' ' : '') : '') + clk, score: { fla: lv.score.fla, opp: lv.score.opp }, quarters: null,
        drive: (lv.possession === 'fla' ? 'Florida ball. ' : lv.possession === 'opp' ? 'Opponent ball. ' : '') + (str(lv.lastPlay, 200) || ''), updates: [] };
    }
    if (str(raw.updatedAt, 40)) sb.updatedAt = raw.updatedAt;
    return sb;
  }
  function abbr(name, given) { return given || ({ Florida: 'FLA', 'Ole Miss': 'MISS', Missouri: 'MIZ', Georgia: 'UGA', Tennessee: 'TENN', LSU: 'LSU', Kentucky: 'UK' })[name] || String(name || '').slice(0, 4).toUpperCase(); }
  function ranked(rank, name) { return (rank ? 'No. ' + rank + ' ' : '') + name; }

  // Game state for the score bug and the Saturday stadium board. Desk data (window.__GBM_GAMEDAY__) wins.
  function gameState(sb) {
    var t = now(), gd = window.__GBM_GAMEDAY__, n = sb.next, l = sb.last;
    if (gd && gd.away && gd.home && !(t > Date.parse(gd.until)) && Number.isFinite(Date.parse(gd.kickoff))) {
      var k = Date.parse(gd.kickoff), phase = gd.status === 'final' ? 'final' : t < k ? 'pre' : gd.status === 'half' ? 'half' : 'live';
      function side(s) { return { name: String(s.name || ''), abbr: abbr(s.name), rank: num(s.rank), record: str(s.record, 12) || '', score: num(s.score), q: arr(s.quarters) || [] }; }
      return { src: 'desk', phase: phase, kickoff: k, clock: str(gd.clock, 24) || '', away: side(gd.away), home: side(gd.home), when: str(gd.when, 90) || gameWhen(gd.kickoff),
        venue: str(gd.venue, 90) || '', drive: str(gd.drive, 160) || (Array.isArray(gd.ld) ? gd.ld.map(String).join(' · ').slice(0, 200) : ''),
        updates: (gd.updates || []).slice(0, 4).map(function (u) { return [String(u[0] || ''), String(u[1] || '')]; }),
        links: (gd.links || []).filter(function (x) { return x && /^\/post\//.test(x[1]); }).slice(0, 4), headline: str(gd.headline, 120) || '' };
    }
    var fla = { name: 'Florida', abbr: 'FLA', rank: sb.team.rank, record: sb.team.record };
    if (n && Number.isFinite(Date.parse(n.kickoffIso))) {
      var kk = Date.parse(n.kickoffIso), opp = { name: n.opponent, abbr: abbr(n.opponent, n.opponentAbbr), rank: n.opponentRank, record: n.opponentRecord || '' };
      var live = sb.live, ph = live ? live.status : t < kk ? 'pre' : 'live';
      if (live || t < kk + 5 * 3600000) {
        var fq = live && live.quarters ? live.quarters.fla : [], oq = live && live.quarters ? live.quarters.opp : [];
        var F = Object.assign({}, fla, { score: live ? live.score.fla : null, q: fq }), O = Object.assign({}, opp, { score: live ? live.score.opp : null, q: oq });
        return { src: 'scoreboard', phase: ph, kickoff: kk, clock: live ? live.clock : '', away: n.home ? O : F, home: n.home ? F : O, when: gameWhen(n.kickoffIso) + (n.tv ? ' · ' + n.tv : ''),
          venue: n.venue || '', drive: live ? live.drive : '', updates: live ? live.updates : [], links: n.previewUrl ? [['Preview', n.previewUrl]] : [], headline: '' };
      }
    }
    if (l && l.score && ymdOf(l.date) === et(t).ymd) {
      var o2 = { name: l.opponent, abbr: abbr(l.opponent, l.opponentAbbr), rank: l.opponentRank, record: l.opponentRecord || '', score: l.score.opp, q: l.quarters ? l.quarters.opp : [] };
      var f2 = Object.assign({}, fla, { score: l.score.fla, q: l.quarters ? l.quarters.fla : [] });
      return { src: 'scoreboard', phase: 'final', kickoff: 0, clock: '', away: l.home ? o2 : f2, home: l.home ? f2 : o2, when: '', venue: l.venue || '', drive: '', updates: [], links: l.recapUrl ? [['Recap', l.recapUrl]] : [], headline: '' };
    }
    return null;
  }
  function gameToday(sb) {
    var today = et(now()).ymd, gd = window.__GBM_GAMEDAY__;
    return [sb.next && sb.next.kickoffIso, sb.last && sb.last.date, gd && gd.kickoff].some(function (d) { return d && ymdOf(d) === today; });
  }
  function modes(sb) {
    var q = ''; try { q = new URLSearchParams(location.search).get('gbm_fp') || ''; } catch (_) {}
    var e = et(now()), gameday = q === 'gameday' || (q !== 'day' && q !== 'night' && e.wd === 6 && gameToday(sb));
    var timeNight = e.h >= 19 || e.h < 6 || (gameday && e.h >= 17);
    // Brenden, Sept. 29: Swamp Night is the everyday look. `look: "swamp-night"` in the config keeps
    // the night palette and embers on all day; ?gbm_fp=day still shows the daytime look for QA.
    var always = BUNDLE.look === 'swamp-night';
    var night = q === 'night' || (q !== 'day' && (always || timeNight || prefersDark()));
    return { gameday: gameday, night: night, embers: night && (q === 'night' || always || timeNight) };
  }

  /* ---------- Markup helpers ---------- */
  function link(href, content, cls, extra) { return href ? '<a' + (cls ? ' class="' + cls + '"' : '') + ' href="' + esc(href) + '"' + (extra || '') + '>' + content + '</a>' : '<span' + (cls ? ' class="' + cls + '"' : '') + '>' + content + '</span>'; }
  // Wix media URLs from the feed ask for a 1000px PNG cut ("/v1/fit/w_1000,h_1000,al_c,q_80/file.png"): a JPEG photo came
  // back as a 1 MB PNG (live speed run 36757168414, Sept. 30: the lead cover was 975 KB and a card 1,018 KB, LCP 28 s on a
  // throttled phone). Re-cut every static.wixstatic.com image to the box it fills, let Wix pick the encoding (enc_auto:
  // AVIF/WebP), and offer three widths; the original URL stays on the element and comes back if the re-cut ever 404s.
  var WIX_MEDIA = /^(https:\/\/static\.wixstatic\.com\/media\/[^\/?#]+)(?:\/v1\/[^?#]*)?(?:[?#].*)?$/;
  function wixCut(src, w, h) { var m = WIX_MEDIA.exec(String(src || '')); return m ? m[1] + '/v1/fit/w_' + w + ',h_' + h + ',al_c,q_80,enc_auto/gatorbait.jpg' : ''; }
  function img(src, alt, eager, w, h) {
    if (!src) return '';
    var W = w || 1000, H = h || 667, cut = wixCut(src, W, H);
    var set = cut ? [480, 800, 1200].map(function (x) { return wixCut(src, x, Math.round(x * H / W)) + ' ' + x + 'w'; }).join(', ') : '';
    return '<img src="' + esc(cut || src) + '"' + (set ? ' srcset="' + esc(set) + '" sizes="(max-width: 700px) 100vw, 60vw" data-fp-orig="' + esc(src) + '"' : '') + ' alt="' + esc(alt) + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async"' + (eager ? ' fetchpriority="high"' : '') + ' width="' + W + '" height="' + H + '">';
  }
  // If a re-cut URL fails, fall back to the feed's own URL once (delegated: the grid is innerHTML).
  function imgFallback(root) {
    root.addEventListener('error', function (e) {
      var t = e.target, o = t && t.tagName === 'IMG' && t.getAttribute('data-fp-orig');
      if (!o) return; t.removeAttribute('data-fp-orig'); t.removeAttribute('srcset'); t.removeAttribute('sizes'); t.src = o;
    }, true);
  }
  function by(p) { return '<p class="fp-meta">' + esc(p.author) + ' · ' + esc(shortDate(p.date.getTime())) + '</p>'; }
  function kicker(p, why) {
    if (why === 'breaking') return 'Breaking';
    if (/buddy martin/i.test(p.author)) return 'The Column · Buddy Martin';
    if (isSpears(p)) return 'Photographs · Chris Spears';
    return p.author && !/staff/i.test(p.author) ? p.author : 'Top story';
  }
  // Long headlines split at a sentence boundary: the first sentences lead, the rest becomes the dek.
  function splitTitle(title) {
    var parts = title.match(/[^.!?]+[.!?]+['’"”]?\s*|[^.!?]+$/g) || [title], head = '';
    while (parts.length && (head + parts[0]).trim().length <= 56) head += parts.shift();
    if (!head.trim() || !parts.length) return { h: title, dek: '' };
    return { h: head.trim(), dek: parts.join('').trim() };
  }
  function words(text) { return esc(text).split(/\s+/).map(function (w, i) { return '<span class="fp-w" style="--i:' + i + '">' + w + '</span>'; }).join(' '); }
  function cd(iso) { return '<span class="fp-cd" data-fp-count="' + esc(iso) + '" aria-label="Countdown to kickoff"></span>'; }
  function fmtNum(n) { return Number(n).toLocaleString('en-US'); }

  /* ---------- Zones ---------- */
  function tickerHtml(posts, sb, gs) {
    var items = [];
    if (gs && gs.phase !== 'pre') items.push('<li><b>' + (gs.phase === 'final' ? 'Final' : 'Live') + '</b>' + esc(gs.away.name + ' ' + (gs.away.score == null ? '' : gs.away.score) + ', ' + gs.home.name + ' ' + (gs.home.score == null ? '' : gs.home.score)) + '</li>');
    else if (sb.last && sb.last.score) items.push('<li><b>Final</b>' + link(sb.last.recapUrl, esc((sb.last.score.fla > sb.last.score.opp ? 'Florida ' + sb.last.score.fla + ', ' + sb.last.opponent + ' ' + sb.last.score.opp : sb.last.opponent + ' ' + sb.last.score.opp + ', Florida ' + sb.last.score.fla))) + '</li>');
    if (gs) gs.updates.slice(0, 2).forEach(function (u) { items.push('<li><b>' + esc(u[0]) + '</b>' + esc(u[1]) + '</li>'); });
    if (sb.next) items.push('<li><b>Next</b>' + link(sb.next.previewUrl, esc(ranked(sb.team.rank, 'Florida') + (sb.next.home ? ' vs. ' : ' at ') + ranked(sb.next.opponentRank, sb.next.opponent) + ' · ' + gameWhen(sb.next.kickoffIso) + (sb.next.tv ? ' · ' + sb.next.tv : ''))) + '</li>');
    posts.slice(0, 8).forEach(function (p) { items.push('<li><b>' + esc(ago(p.date)) + '</b>' + link(p.url, esc(p.title)) + '</li>'); });
    var list = items.join('');
    return '<div class="fp-ticker" role="region" aria-label="Latest headlines and scores"><span class="fp-tk-tag">Latest</span><div class="fp-tk-view"><div class="fp-tk-track" style="--fp-tk-dur:' + Math.max(40, items.length * 7) + 's"><ul class="fp-tk-list">' + list + '</ul><ul class="fp-tk-list fp-tk-dup" aria-hidden="true">' + list.replace(/<a /g, '<a tabindex="-1" ') + '</ul></div></div></div>';
  }
  function mastHtml() {
    return '<header class="fp-mast"><div class="fp-wrap"><p class="fp-date"><span>' + esc(dateline()) + '</span><span>Gainesville, Fla.</span></p>' +
      '<a class="fp-wordmark" href="/" aria-label="GatorBait Media home">GatorBait<small>Media</small></a>' +
      '<div class="fp-mast-right"><a class="fp-signin" href="' + esc(L.signin) + '">Sign in</a><a class="fp-btn" href="' + esc(L.subscribe) + '"><span class="fp-cta-long">Join All Access</span><span class="fp-cta-short">Join</span> <span aria-hidden="true">→</span></a></div></div></header>';
  }
  function bugHtml(sb, gs) {
    var lastA = '', nextA = '';
    if (gs && gs.phase !== 'pre') {
      lastA = '<a class="fp-bug-last" href="' + esc((gs.links[0] && gs.links[0][1]) || L.schedule) + '"><span class="fp-bug-tag" data-state="' + (gs.phase === 'final' ? 'final' : 'live') + '">' + (gs.phase === 'final' ? 'Final' : gs.phase === 'half' ? 'Half' : 'Live') + '</span>' +
        team(gs.away) + team(gs.home) + '</a>';
    } else if (sb.last && sb.last.score) {
      var w = sb.last.score.fla >= sb.last.score.opp;
      lastA = '<a class="fp-bug-last" href="' + esc(sb.last.recapUrl || L.schedule) + '" aria-label="Final: Florida ' + sb.last.score.fla + ', ' + esc(sb.last.opponent) + ' ' + sb.last.score.opp + '"><span class="fp-bug-tag">Final</span>' +
        '<span class="fp-bug-team' + (w ? '' : ' fp-lose') + '">FLA <strong class="fp-num">' + sb.last.score.fla + '</strong></span><span class="fp-bug-team' + (w ? ' fp-lose' : '') + '">' + esc(abbr(sb.last.opponent, sb.last.opponentAbbr)) + ' <strong class="fp-num">' + sb.last.score.opp + '</strong></span></a>';
    }
    if (sb.next && (!gs || gs.phase === 'pre')) {
      nextA = '<a class="fp-bug-next" href="' + esc(sb.next.previewUrl || L.schedule) + '"><span class="fp-bug-tag">Next</span><span class="fp-bug-match">' + (sb.next.home ? 'vs. ' : 'at ') + esc(ranked(sb.next.opponentRank, abbr(sb.next.opponent, sb.next.opponentAbbr))) +
        '<small>' + esc(gameWhen(sb.next.kickoffIso).replace(/^(\w+\.), \w+\.? \d+ · /, '$1 ') + (sb.next.tv ? ' · ' + sb.next.tv : '')) + '</small></span>' + cd(sb.next.kickoffIso) + '</a>';
    }
    return '<div class="fp-bug" aria-label="Scoreboard">' + lastA + nextA + '</div>';
    function team(s) { return '<span class="fp-bug-team">' + esc(s.abbr) + ' <strong class="fp-num">' + (s.score == null ? '–' : esc(s.score)) + '</strong></span>'; }
  }
  function navHtml(sb, gs) {
    return '<nav class="fp-nav" aria-label="GatorBait sections"><div class="fp-wrap"><div class="fp-links"><a href="/" aria-current="page">Front Page</a><a href="' + esc(L.latest) + '">Latest</a><a href="' + esc(L.magazine) + '">Magazine</a><a href="#fp-columnists">Columnists</a><a href="' + esc(L.show) + '">TV &amp; Podcasts</a><a href="' + esc(L.schedule) + '">Scores</a><a class="fp-store" href="' + esc(L.store) + '" target="_blank" rel="noopener" aria-label="Shop GatorBait gear (opens in a new tab)">Store <span aria-hidden="true">↗</span></a></div>' + bugHtml(sb, gs) + '</div></nav>';
  }
  function lineTable(gs, cls) {
    var n = Math.max(4, gs.away.q.length, gs.home.q.length), head = '', i;
    for (i = 0; i < n; i++) head += '<th scope="col">' + (i < 4 ? i + 1 : 'OT' + (i > 4 ? i - 3 : '')) + '</th>';
    function row(s) {
      var cells = ''; for (var j = 0; j < n; j++) cells += '<td>' + (s.q[j] == null ? '–' : esc(s.q[j])) + '</td>';
      return '<tr><th scope="row" class="fp-lt">' + esc(cls === 'fp-mini' ? s.abbr : s.name) + (cls === 'fp-line' ? '<small>' + esc((s.rank ? 'No. ' + s.rank + ' · ' : '') + s.record) + '</small>' : '') + '</th>' + cells + '<td class="fp-tot fp-num">' + (s.score == null ? '–' : esc(s.score)) + '</td></tr>';
    }
    return '<table class="' + cls + '"><thead><tr><th class="fp-lt" scope="col"><span class="fp-sr">Team</span></th>' + head + '<th scope="col">T</th></tr></thead><tbody>' + row(gs.away) + row(gs.home) + '</tbody></table>';
  }
  function boardHtml(gs) {
    if (!gs) return '';
    var status = gs.phase === 'pre' ? cd(new Date(gs.kickoff).toISOString()) : esc(gs.phase === 'final' ? 'Final' : gs.phase === 'half' ? 'Halftime' : 'Live' + (gs.clock ? ' · ' + gs.clock : ''));
    return '<section class="fp-board" aria-label="Game day scoreboard"><div class="fp-wrap"><div class="fp-board-top"><span class="fp-pill">Game Day</span><span>' + esc(gs.when) + '</span>' + (gs.venue ? '<span>' + esc(gs.venue) + '</span>' : '') +
      '<span class="fp-status" data-state="' + (gs.phase === 'pre' ? 'pre' : gs.phase === 'final' ? 'final' : 'live') + '">' + (gs.phase === 'pre' ? 'Kickoff in ' : '') + status + '</span></div>' +
      lineTable(gs, 'fp-line') +
      '<div class="fp-board-side">' + (gs.drive ? '<p class="fp-drive"><b>Drive</b>' + esc(gs.drive) + '</p>' : gs.headline ? '<p class="fp-drive"><b>Up next</b>' + esc(gs.headline) + '</p>' : '') +
      (gs.updates.length ? '<ul class="fp-board-latest" aria-label="Latest game updates">' + gs.updates.map(function (u) { return '<li><b>' + esc(u[0]) + '</b>' + esc(u[1]) + '</li>'; }).join('') + '</ul>' : '') + '</div>' +
      (gs.links.length ? '<div class="fp-board-links">' + gs.links.map(function (l) { return '<a href="' + esc(l[1]) + '">' + esc(l[0]) + '</a>'; }).join('') + '</div>' : '') + '</div></section>';
  }
  function photoBlock(p, eager, cls) {
    if (!p.image) return '';
    return '<figure class="' + (cls || '') + '">' + link(p.url, img(p.image, p.alt, eager), 'fp-frame' + (p.portrait ? ' fp-portrait' : '') + (p.cover ? ' fp-cover' : ''), ' tabindex="-1" aria-hidden="true"') +
      ((p.cap || p.credit) ? '<figcaption class="fp-cap"><span>' + esc(p.cap) + '</span>' + (p.credit ? '<b>' + esc(p.credit) + '</b>' : '') + '</figcaption>' : '') + '</figure>';
  }
  function leadHtml(lead, why) {
    var s = splitTitle(lead.title);
    return '<section class="fp-lead" aria-label="Lead story"><div id="fp-embers" aria-hidden="true"></div><div class="fp-night-glow" aria-hidden="true"></div>' + photoBlock(lead, true, 'fp-lead-photo') +
      '<div class="fp-lead-copy"><p class="fp-kick">' + esc(kicker(lead, why)) + '</p><h1 data-len="' + (s.h.length > 60 ? 'long' : 'short') + '">' + link(lead.url, words(s.h), 'fp-hl') + '</h1>' +
      (s.dek ? '<p class="fp-dek">' + esc(s.dek) + '</p>' : '') + '<p class="fp-by">By ' + esc(lead.author) + '<span>' + esc(shortDate(lead.date.getTime())) + '</span></p>' +
      (lead.excerpt ? '<p class="fp-body">' + esc(lead.excerpt) + '</p>' : '') + '<a class="fp-more" href="' + esc(lead.url) + '">Continue reading <span aria-hidden="true">&nbsp;→</span></a></div></section>';
  }
  function quoteHtml(lead, posts) {
    var q = null, t = now();
    Object.keys(BUNDLE.quotes).some(function (k) { if (lead.path.indexOf(k) === 0) { q = BUNDLE.quotes[k]; return true; } return false; });
    if (!q) posts.some(function (p) { return Object.keys(BUNDLE.quotes).some(function (k) { if (p.path.indexOf(k) === 0 && t - p.date.getTime() < 7 * DAY) { q = Object.assign({ url: p.url }, BUNDLE.quotes[k]); return true; } return false; }); });
    if (!q) return '';
    return '<figure class="fp-quote"><blockquote>' + esc(q.text) + '</blockquote><figcaption><cite><b>' + esc(q.who) + '</b>' + esc(q.context) + '</cite></figcaption></figure>';
  }
  function secondHtml(feature, list, cols) {
    return '<section class="fp-second" aria-label="More top stories">' +
      (feature ? '<article class="fp-feature">' + photoBlock(feature, false) + '<p class="fp-kick">' + esc(kicker(feature)) + '</p>' + link(feature.url, '<h2 class="fp-hl">' + esc(feature.title) + '</h2>') + (feature.excerpt ? '<p class="fp-ex">' + esc(feature.excerpt.slice(0, 220)) + (feature.excerpt.length > 220 ? '…' : '') + '</p>' : '') + by(feature) + '</article>' : '') +
      '<ol class="fp-list" aria-label="Top stories">' + list.map(function (p) { return '<li>' + link(p.url, '<h3 class="fp-hl">' + esc(p.title) + '</h3>' + (p.excerpt ? '<p class="fp-ex">' + esc(p.excerpt.slice(0, 120)) + (p.excerpt.length > 120 ? '…' : '') + '</p>' : '') + by(p)) + '</li>'; }).join('') + '</ol>' +
      '<aside class="fp-rail" id="fp-columnists" aria-label="Columnists"><h2>Columnists</h2><div class="fp-rail-cols">' + cols + '</div></aside></section>';
  }
  function columnistsHtml(posts) {
    return BUNDLE.columnists.map(function (c) {
      var p = posts.find(function (x) { return byColumnist(x, c.name); });
      var page = safeUrl(c.href) || (p && p.url) || L.latest;
      return '<div class="fp-col">' + link(page, esc(c.initials), 'fp-roundel', ' aria-hidden="true" tabindex="-1"') + link(page, esc(c.name), 'fp-col-name') +
        (p ? link(p.url, esc(p.title), 'fp-col-story') : '<span class="fp-col-story">Latest columns</span>') + '</div>';
    }).join('');
  }
  function showNext() {
    var cfg = BUNDLE.show, t = now(), e = et(t), mins = e.h * 60 + e.m, start = cfg.hour * 60;
    if (cfg.days.indexOf(e.wd) >= 0 && mins >= start && mins < start + cfg.minutes) return { live: true, label: 'Live now' };
    for (var d = 0; d < 8; d++) {
      var wd = (e.wd + d) % 7;
      if (cfg.days.indexOf(wd) >= 0 && (d > 0 || mins < start)) return { live: false, label: (d === 0 ? 'Tonight' : d === 1 ? 'Tomorrow' : WDS[wd]) + ', ' + (cfg.hour % 12 || 12) + ' p.m. ET' };
    }
    return { live: false, label: '' };
  }
  /* ---------- The Road Ahead: season band under the lead ---------- */
  function roadHtml(sb) {
    var games = (sb.schedule || []).slice(0, 14);
    if (games.length < 3) return '';
    var W = 0, Ls = 0, nx = -1, fm = new Intl.DateTimeFormat('en-US', { timeZone: TZ, month: 'short', day: 'numeric' });
    var cards = games.map(function (g, i) {
      var fin = g.status === 'final' && g.score, win = fin && g.score.fla > g.score.opp;
      if (fin) { if (win) W++; else Ls++; } else if (nx < 0) nx = i;
      var top = '<div class="dt">' + esc(fm.format(new Date(g.date))) + ' · ' + (g.home ? 'Home' : 'Away') + '</div><div class="op">' + (g.opponentRank ? '<span class="rk">No. ' + g.opponentRank + '</span>' : '') + esc(g.opponent) + '</div>', body;
      if (fin) body = '<div class="sc">' + (win ? 'W ' : 'L ') + g.score.fla + '–' + g.score.opp + '</div><div class="bar"><i data-w="' + Math.max(6, Math.min(100, Math.round((g.score.fla - g.score.opp) / 40 * 100))) + '"></i></div><div class="sub">' + esc(g.tv || 'Final') + '</div>';
      else if (i === nx) body = '<div class="cd" data-k="' + esc(g.date) + '">…</div><div class="sub">to kickoff' + (g.tv ? ' · ' + esc(g.tv) : '') + '</div>';
      else body = '<div class="sub" style="margin-top:auto">' + esc(g.tv || 'Kickoff TBA') + '</div>';
      var cls = 'g' + (win ? ' w' : '') + (i === nx ? ' nx' : '') + (g.opponentRank && g.opponentRank <= 5 && !fin ? ' boss' : '');
      var url = g.storyUrl ? safeUrl(g.storyUrl, 'post') : '';
      return (url ? '<a href="' + esc(url) + '"' : '<div') + ' class="' + cls + '" role="listitem">' + top + body + (url ? '</a>' : '</div>');
    }).join('');
    var sig = games.map(function (g) { return g.date + ':' + g.status + ':' + (g.score ? g.score.fla + '-' + g.score.opp : ''); }).join('|');
    return '<section id="gbm-road" aria-label="Florida season road" data-sig="' + esc(sig) + '"><div class="hd"><h2>The road <span>ahead</span></h2><div class="rec"><b>' + W + '–' + Ls + '</b>' + (sb.team && sb.team.season ? esc(sb.team.season) : '2026') + ' record</div></div><div class="track" id="gr-track" role="list"><div class="line"><i id="gr-line"></i></div>' + cards + '</div></section>';
  }
  function initRoad(root) {
    var T = root.querySelector('#gr-track'); if (!T) return;
    var L = T.querySelector('.line'), nodes = Array.prototype.slice.call(T.querySelectorAll('.g')), nxEl = T.querySelector('.g.nx');
    function tick() {
      var c = T.querySelector('.cd'); if (!c) return;
      var ms = new Date(c.getAttribute('data-k')) - now(); if (ms <= 0) { c.textContent = 'Live'; return; }
      c.textContent = Math.floor(ms / 864e5) + 'd ' + Math.floor(ms % 864e5 / 36e5) + 'h ' + Math.floor(ms % 36e5 / 6e4) + 'm';
    }
    tick(); if (root.__gbmRoadTick) clearInterval(root.__gbmRoadTick); root.__gbmRoadTick = setInterval(tick, 30000);
    function run() {
      var upto = nxEl || nodes[nodes.length - 1]; if (!upto) return;
      var pad = parseFloat(getComputedStyle(T).paddingLeft) || 16;
      // The rail spans the whole scroll width; the glow ends at the next game's dot (14px in, 13px wide).
      L.style.right = 'auto'; L.style.width = (T.scrollWidth - 2 * pad) + 'px';
      L.firstChild.style.width = Math.max(0, upto.offsetLeft + 20.5 - pad) + 'px';
      T.querySelectorAll('.bar i').forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
      // Phones: keep the last result and the next game in view together; wider tracks stay at the start.
      var prev = nxEl && nodes[nodes.indexOf(nxEl) - 1];
      if (nxEl && nxEl.offsetLeft + nxEl.offsetWidth > T.clientWidth) T.scrollLeft = Math.max(0, (prev || nxEl).offsetLeft - pad);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { run(); o.disconnect(); } }, { threshold: .25 }).observe(T); else run();
  }

  /* ---------- The Tunnel: game-day opener (Brenden, Sept. 30: "tunnel") ----------
   * Renders all three states (countdown, live score, final) and shows one by data-phase, so the feed can
   * move it from pre to live to final in place. Stories about the opponent ride below, never the lead. */
  function tunnelHtml(gs, sb, posts, leadUrl) {
    if (!gs || !gs.away || !gs.home) return '';
    var phase = gs.phase === 'half' ? 'half' : gs.phase, opp = gs.away.name === 'Florida' ? gs.home : gs.away;
    function team(s) { return '<span class="fp-tn-team"><small>' + esc([s.rank ? 'No. ' + s.rank : '', s.record || ''].filter(Boolean).join(' · ') || ' ') + '</small><b>' + esc(s.name) + '</b></span>'; }
    var re = new RegExp(String(opp.name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\  function hubHtml(latest, sb, posts, used) {'), 'i');
    var about = posts.filter(function (p) { return p.url !== leadUrl && re.test(p.title + ' ' + (p.excerpt || '')); }).slice(0, 3);
    var first = gs.links[0], primary = first ? [first[0], first[1]] : sb.next && sb.next.previewUrl ? ['Game preview', sb.next.previewUrl] : sb.last && sb.last.recapUrl && gs.phase === 'final' ? ['Read the recap', sb.last.recapUrl] : ['Scores & schedule', L.schedule];
    var when = gs.when || '', score = '<div class="fp-tn-score"><b data-tn="away">' + (gs.away.score == null ? '0' : esc(gs.away.score)) + '</b><span>–</span><b data-tn="home">' + (gs.home.score == null ? '0' : esc(gs.home.score)) + '</b></div>';
    return '<section class="fp-tunnel" data-phase="' + esc(phase) + '" aria-label="Game day: ' + esc(gs.away.name + ' at ' + gs.home.name) + '">' +
      '<div class="fp-tn-scene" aria-hidden="true"><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><i class="fp-tn-ring"></i><b class="fp-tn-light"></b><u class="fp-tn-floor"></u></div>' +
      '<div class="fp-wrap fp-tn-wrap"><p class="fp-tn-top"><span class="fp-pill">Game day</span>' + (when ? '<span>' + esc(when) + '</span>' : '') + (gs.venue ? '<span>' + esc(gs.venue) + '</span>' : '') + '</p>' +
      '<h2 class="fp-tn-match">' + team(gs.away) + '<span class="fp-tn-vs">at</span>' + team(gs.home) + '</h2>' +
      '<div class="fp-tn-mid">' +
        '<div class="fp-tn-pre"><p class="fp-tn-label">Kickoff in</p>' + (gs.kickoff ? cd(new Date(gs.kickoff).toISOString()) : '') + '</div>' +
        '<div class="fp-tn-kick"><p>Out of the tunnel</p><p class="fp-tn-label">Kickoff' + (when ? ' · ' + esc(when.replace(/^[^·]*·\s*/, '')) : '') + '</p></div>' +
        '<div class="fp-tn-live">' + score + '<p class="fp-tn-clock" data-tn="clock">' + esc(gs.phase === 'half' ? 'Halftime' : gs.clock || 'Live') + '</p>' + (gs.drive ? '<p class="fp-tn-drive"><b>Drive</b><span data-tn="drive">' + esc(gs.drive) + '</span></p>' : '<p class="fp-tn-drive" hidden><b>Drive</b><span data-tn="drive"></span></p>') + '</div>' +
        '<div class="fp-tn-final">' + score.replace(/data-tn="(away|home)"/g, 'data-tn="$1-final"') + '<p class="fp-tn-clock">Final</p></div>' +
      '</div>' +
      '<div class="fp-tn-cta"><a class="fp-btn" href="' + esc(primary[1]) + '">' + esc(primary[0]) + '</a><a class="fp-btn fp-ghost" href="#gbm-road">The road ahead</a></div>' +
      (about.length ? '<ul class="fp-tn-stories" aria-label="More on ' + esc(opp.name) + '">' + about.map(function (p) { return '<li><a href="' + esc(p.url) + '">' + esc(p.title) + '<span>' + esc(p.author + ' · ' + shortDate(p.date.getTime())) + '</span></a></li>'; }).join('') + '</ul>' : '') +
      '</div></section>';
  }
  // Feed updates after paint: phase, score, clock and drive change in place; nothing moves.
  function patchTunnel(root, sb) {
    var t = root.querySelector('.fp-tunnel'); if (!t) return;
    var gs = gameState(sb); if (!gs || !gs.away || !gs.home) return;
    var phase = gs.phase, cur = t.getAttribute('data-phase');
    if (phase === 'pre' && (cur === 'kick' || cur === 'live' || cur === 'half' || cur === 'final')) phase = cur === 'kick' ? 'kick' : cur;
    function put(sel, v) { var el = t.querySelector('[data-tn="' + sel + '"]'); if (el && v != null && el.textContent !== String(v)) el.textContent = String(v); }
    put('away', gs.away.score == null ? '0' : gs.away.score); put('home', gs.home.score == null ? '0' : gs.home.score);
    put('away-final', gs.away.score == null ? '0' : gs.away.score); put('home-final', gs.home.score == null ? '0' : gs.home.score);
    put('clock', gs.phase === 'half' ? 'Halftime' : gs.clock || 'Live');
    var d = t.querySelector('.fp-tn-drive'); if (d) { put('drive', gs.drive || ''); d.hidden = !gs.drive; }
    if (phase !== cur) t.setAttribute('data-phase', phase);
  }
  function hubHtml(latest, sb, posts, used) {
    var sn = showNext(), ep = BUNDLE.show.episode;
    var mLatest = '<section class="fp-mod fp-mod-latest" aria-label="Latest stories"><h2>Latest</h2><ol class="fp-latest">' + latest.map(function (p) {
      return '<li>' + link(p.url, '<time datetime="' + p.date.toISOString() + '">' + esc(ago(p.date)) + '</time><div><h3 class="fp-hl">' + esc(p.title) + '</h3><p class="fp-meta">' + esc(p.author) + '</p></div>') + '</li>'; }).join('') +
      '</ol><a class="fp-more" href="' + esc(L.latest) + '">All stories <span aria-hidden="true">&nbsp;→</span></a></section>';
    var mShow = '<section class="fp-mod fp-mod-show fp-show" data-live="' + (sn.live ? 1 : 0) + '" aria-label="The Buddy Martin Show"><h2>The Buddy Martin Show</h2><p class="fp-show-when"><span class="fp-live-dot" aria-hidden="true"></span><span data-fp-show>' + esc(sn.live ? 'Live now' : 'Next live: ' + sn.label) + '</span></p>' +
      '<p class="fp-ex">Mondays, Wednesdays and Thursdays at 9 p.m. ET.</p><div class="fp-actions"><a class="fp-btn" href="' + esc(L.youtubeLive) + '" rel="noopener">Watch on YouTube</a><a class="fp-btn fp-ghost" href="' + esc(L.facebook) + '" rel="noopener">Facebook</a></div>' +
      (ep ? '<a class="fp-vid" href="https://www.youtube.com/watch?v=' + esc(ep.id) + '" rel="noopener"><span class="fp-frame">' + img('https://i.ytimg.com/vi/' + ep.id + '/hqdefault.jpg', '', false, 480, 360) + '<span class="fp-play"></span></span><span><b>' + esc(ep.title) + '</b><span>From the show · ' + esc(shortDate(Date.parse(ep.date + 'T16:00:00Z'))) + '</span></span></a>' : '') +
      '<a class="fp-more" href="' + esc(L.show) + '">GatorBait TV &amp; podcasts <span aria-hidden="true">&nbsp;→</span></a></section>';
    var mClips = BUNDLE.clips.length ? '<section class="fp-mod fp-mod-clips" aria-label="Clips"><h2>Clips</h2><div class="fp-clips">' + BUNDLE.clips.slice(0, 2).map(function (c) {
      return '<a class="fp-clip" href="https://www.youtube.com/shorts/' + esc(c.id) + '" rel="noopener"><span class="fp-frame">' + img('https://i.ytimg.com/vi/' + c.id + '/hqdefault.jpg', '', false, 480, 360) + '<span class="fp-play"></span></span><b>' + esc(c.title) + '</b></a>'; }).join('') +
      '</div><a class="fp-more" href="' + esc(L.youtubeChannel) + '" rel="noopener">More on YouTube <span aria-hidden="true">&nbsp;→</span></a></section>' : '';
    var gal = posts.filter(function (p) { return p.image && /spears/i.test(p.title + ' ' + p.author) && /(photo|galler|best shots)/i.test(p.title); }).slice(0, 2)
      .map(function (p) { return { title: p.title, url: p.url, image: p.image }; });
    if (!gal.length) gal = BUNDLE.galleries.slice(0, 2);
    var mPhotos = '<section class="fp-mod fp-mod-photos" aria-label="Photographs"><h2>Photos · Chris Spears</h2><div class="fp-photos">' + gal.map(function (g) {
      return '<a class="fp-photo" href="' + esc(g.url) + '"><span class="fp-frame">' + img(g.image, g.title, false) + '</span><span class="fp-cap"><b>Photo by Chris Spears, GatorBait Media</b></span><b>' + esc(g.title) + '</b></a>'; }).join('') + '</div></section>';
    var l = sb.last, n = sb.next, scores = '';
    if (l && l.score) {
      var F = { abbr: 'FLA', score: l.score.fla, q: l.quarters ? l.quarters.fla : [] }, O = { abbr: abbr(l.opponent, l.opponentAbbr), score: l.score.opp, q: l.quarters ? l.quarters.opp : [] };
      scores += '<div class="fp-score-head"><span>Final · ' + esc(ranked(l.opponentRank, l.opponent)) + '</span><span>' + esc(ymdOf(l.date) ? MONTHS[Number(ymdOf(l.date).slice(5, 7)) - 1] + ' ' + Number(ymdOf(l.date).slice(8)) : '') + '</span></div>' +
        lineTable({ away: l.home ? O : F, home: l.home ? F : O }, 'fp-mini');
      var st = l.stats || {}, tape = [['totalYards', 'Total yards'], ['rushYards', 'Rushing yards'], ['firstDowns', 'First downs'], ['attendance', 'In The Swamp']].filter(function (x) { return st[x[0]] != null; });
      if (tape.length) scores += '<div class="fp-tape">' + tape.map(function (x) { return '<div><strong data-fp-num="' + st[x[0]] + '">' + fmtNum(st[x[0]]) + '</strong><span>' + (x[0] === 'attendance' && !l.home ? 'Attendance' : x[1]) + '</span></div>'; }).join('') + '</div>';
      if (l.recapUrl) scores += '<a class="fp-more" href="' + esc(l.recapUrl) + '">Read the recap <span aria-hidden="true">&nbsp;→</span></a>';
    }
    if (n) scores += '<a class="fp-next" href="' + esc(n.previewUrl || L.schedule) + '"><span>Next · ' + esc(n.tv || '') + '</span><b>' + esc(ranked(sb.team.rank, 'Florida') + (n.home ? ' vs. ' : ' at ') + ranked(n.opponentRank, n.opponent)) + '</b><span>' + esc(gameWhen(n.kickoffIso) + (n.venue ? ' · ' + n.venue : '')) + '</span>' + cd(n.kickoffIso) + '</a>';
    var upcoming = sb.schedule.filter(function (g) { return g.status === 'scheduled' && (!n || g.date !== n.kickoffIso); }).slice(0, 3);
    if (upcoming.length) scores += '<table class="fp-stand"><caption class="fp-sr">Upcoming schedule</caption><thead><tr><th scope="col">Coming up</th><th scope="col">Date</th><th scope="col">TV</th></tr></thead><tbody>' + upcoming.map(function (g) {
      var t = Date.parse(g.date), e = et(t), tba = /T0[45]:00:00/.test(g.date);
      return '<tr><td>' + esc((g.home ? 'vs. ' : 'at ') + ranked(g.rank, g.opponent)) + '</td><td>' + esc(tba ? MONTHS[new Date(t).getUTCMonth()] + ' ' + new Date(t).getUTCDate() : MONTHS[e.mo] + ' ' + e.d) + '</td><td>' + esc(g.tv || 'TBA') + '</td></tr>'; }).join('') + '</tbody></table>';
    if (sb.standings.length) scores += '<table class="fp-stand"><caption class="fp-sr">SEC standings</caption><thead><tr><th scope="col">SEC</th><th scope="col">Conf.</th><th scope="col">Overall</th></tr></thead><tbody>' + sb.standings.slice(0, 6).map(function (r) { return '<tr' + (/^florida$/i.test(r.team) ? ' class="fp-us"' : '') + '><td>' + esc(r.team) + '</td><td>' + esc(r.conf) + '</td><td>' + esc(r.overall) + '</td></tr>'; }).join('') + '</tbody></table>';
    scores += '<div class="fp-chips"><a href="' + esc(L.schedule) + '">Schedule</a><a href="' + esc(L.roster) + '">Roster</a><a href="' + esc(L.stats) + '">Stats</a><a href="' + esc(L.standings) + '">Standings</a></div>';
    var mScores = '<section class="fp-mod fp-mod-scores" aria-label="Scores and schedule"><h2>Scores &amp; Schedule · Florida ' + esc(sb.team.record || '') + '</h2>' + scores + '</section>';
    var cover = posts.find(function (p) { return p.image && !used[p.image] && !p.portrait && !isSpears(p); }) || posts.find(function (p) { return p.image; });
    var mMag = '<section class="fp-mod fp-mag" aria-label="GatorBait Magazine"><div class="fp-mag-copy"><h2>The Thursday Magazine</h2><p class="fp-ex">The columns, characters and photographs worth keeping. The cover lives on the Magazine, not here.</p><div class="fp-actions"><a class="fp-btn" href="' + esc(L.magazine) + '">Open the Magazine <span aria-hidden="true">→</span></a></div></div>' +
      (cover ? '<a class="fp-cover" href="' + esc(L.magazine) + '" aria-label="GatorBait Magazine">' + img(cover.image, '', false) + '<span class="fp-cover-mh">GatorBait<small>Magazine · Thursday</small></span><span class="fp-cover-t"><em>' + esc(cover.author) + '</em>' + esc(splitTitle(cover.title).h) + '</span></a>' : '') + '</section>';
    // GatorBait Magazine signup (sports-live/src/capture.js, source "home"); the plain link module is the fallback if it is absent.
    var mNews = window.GBM_CAPTURE ? window.GBM_CAPTURE.html('home') : '<section class="fp-mod fp-mod-news" aria-label="Newsletter"><h2>The GatorBait Email</h2><p class="fp-ex">One email a day with the Gators stories that matter. Free to join.</p><div class="fp-actions"><a class="fp-btn fp-ghost" href="' + esc(L.newsletter) + '">Sign up <span aria-hidden="true">→</span></a></div></section>';
    return '<section class="fp-hub" aria-label="The GatorBait hub"><div class="fp-wrap"><div class="fp-hub-head"><h2>The Hub</h2><p>Stories, scores, the show, clips and photos. Everything GatorBait, in one place.</p></div><div class="fp-hub-grid">' +
      mLatest + mScores + mShow + (window.GBM_CAPTURE ? mNews : '') + mClips + mPhotos + mMag + (window.GBM_CAPTURE ? '' : mNews) + '</div></div></section>';
  }

  /* ---------- Live bits: countdowns, count-up, show status, embers ---------- */
  function renderCountdowns(root) {
    var t = now();
    root.querySelectorAll('[data-fp-count]').forEach(function (el) {
      var k = Date.parse(el.getAttribute('data-fp-count')), s = Math.max(0, Math.floor((k - t) / 1000));
      var parts = [[Math.floor(s / 86400), 'd'], [Math.floor(s / 3600) % 24, 'h'], [Math.floor(s / 60) % 60, 'm'], [s % 60, 's']];
      if (!el.firstChild) el.innerHTML = parts.map(function (p, i) { return '<span' + (i === 3 ? ' class="fp-cd-s"' : '') + '><b></b><b></b><i>' + p[1] + '</i></span>'; }).join('');
      var bs = el.querySelectorAll('b');
      parts.forEach(function (p, i) {
        var two = String(p[0]).padStart(2, '0');
        [0, 1].forEach(function (j) { var b = bs[i * 2 + j]; if (b && b.textContent !== two[j]) { var first = !b.textContent; b.textContent = two[j]; if (!first) { b.classList.remove('fp-flip'); void b.offsetWidth; b.classList.add('fp-flip'); } } });
      });
      el.hidden = s === 0;
      if (s === 0) { var tn = el.closest('.fp-tunnel'); if (tn && tn.getAttribute('data-phase') === 'pre') tn.setAttribute('data-phase', 'kick'); }
      el.setAttribute('aria-label', parts[0][0] + ' days ' + parts[1][0] + ' hours ' + parts[2][0] + ' minutes to kickoff');
    });
    var show = root.querySelector('.fp-show');
    if (show) { var sn = showNext(), label = sn.live ? 'Live now' : 'Next live: ' + sn.label, sp = show.querySelector('[data-fp-show]'); if (sp && sp.textContent !== label) sp.textContent = label; show.setAttribute('data-live', sn.live ? '1' : '0'); }
  }
  function startTicking(root) {
    stopTicking();
    renderCountdowns(root);
    if (!root.querySelector('[data-fp-count]') && !root.querySelector('.fp-show')) return;
    tickTimer = setInterval(function () { if (!document.hidden && root.isConnected) renderCountdowns(root); if (!root.isConnected) stopTicking(); }, 1000);
  }
  function stopTicking() { if (tickTimer) clearInterval(tickTimer); tickTimer = 0; }
  function countUp(root) {
    if (reduced() || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return; io.unobserve(en.target);
        var el = en.target, end = Number(el.getAttribute('data-fp-num')), t0 = performance.now();
        (function step(ts) { var k = Math.min(1, (ts - t0) / 900), v = Math.round(end * (1 - Math.pow(1 - k, 3))); el.textContent = fmtNum(v); if (k < 1) requestAnimationFrame(step); })(t0);
      });
    }, { threshold: 0.6 });
    root.querySelectorAll('[data-fp-num]').forEach(function (el) { io.observe(el); });
  }
  function embers(root) {
    if (reduced() || !root.classList.contains('fp-embers-on')) return;
    var opts = { fullScreen: { enable: false }, fpsLimit: 40, detectRetina: true, pauseOnBlur: true, pauseOnOutsideViewport: true, background: { color: 'transparent' },
      particles: { number: { value: innerWidth < 700 ? 45 : 80 }, color: { value: ['#fa4616', '#ff7a3d', '#ffb27a'] }, shape: { type: 'circle' },
        opacity: { value: { min: 0.15, max: 0.75 }, animation: { enable: true, speed: 0.6, sync: false } }, size: { value: { min: 0.8, max: 2.6 } },
        move: { enable: true, direction: 'top', speed: { min: 0.3, max: 1.1 }, random: true, straight: false, outModes: { default: 'out' } } } };
    function go() {
      if (!root.isConnected || !window.tsParticles || !document.getElementById('fp-embers')) return;
      window.tsParticles.load({ id: 'fp-embers', options: opts }).then(function (c) { particles = c; if (document.hidden && c) c.pause(); }).catch(function () {});
    }
    if (window.tsParticles) { go(); return; }
    // The 44 KB library rode with the first paint (speed run 36757168414). It now waits for the page to settle and an idle
    // slot, and stays off on data-saver or a 2G/3G connection: the embers are decoration.
    var conn = navigator.connection || {};
    if (conn.saveData || /(^|[^4-9])[23]g$/.test(String(conn.effectiveType || ''))) return;
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
    setTimeout(function () {
      idle(function () {
        if (!root.isConnected) return;
        var s = document.getElementById('gbm-fp-tsparticles');
        if (!s) { s = document.createElement('script'); s.id = 'gbm-fp-tsparticles'; s.src = TSP; s.async = true; s.crossOrigin = 'anonymous'; document.head.appendChild(s); }
        if (window.tsParticles) go(); else s.addEventListener('load', go, { once: true });
      }, { timeout: 1200 });
    }, 1000);
  }
  document.addEventListener('visibilitychange', function () {
    if (!particles) return;
    try { if (document.hidden) particles.pause(); else particles.play(); } catch (_) {}
  });
  function ensureFonts() {
    if (!document.getElementById('gbm-fp-fonts') && !document.querySelector('link[rel="stylesheet"][href*="Barlow+Condensed"]')) {
      var l = document.createElement('link'); l.id = 'gbm-fp-fonts'; l.rel = 'stylesheet'; l.href = FONTS; document.head.appendChild(l);
    }
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.race([Promise.all([document.fonts.load('800 88px "Barlow Condensed"'), document.fonts.load('400 16px "Barlow"')]).catch(function () {}),
      new Promise(function (r) { setTimeout(r, 900); })]);
  }

  /* ---------- Render ---------- */
  function failure(error) {
    loading = false;
    if (window.__GBM_GAZETTE_BOOT__ && window.__GBM_GAZETTE_BOOT__.fallback) window.__GBM_GAZETTE_BOOT__.fallback(error);
    else console.error('[GatorBait front page]', error);
  }
  function render(posts, fresh, sb) {
    if (!home()) { loading = false; return; }
    if (posts.length < 3) throw new Error('Insufficient public stories');
    var existing = document.getElementById('gbm-live');
    if (existing && existing.classList.contains('gbm-gazette')) { loading = false; return; }
    if (existing) throw new Error('Another homepage owner already mounted');
    var picked = pickLead(posts), lead = picked.post, shown = {}, used = {};
    shown[lead.url] = 1; if (lead.image) used[lead.image] = 1;
    function take(list, n, test) { var out = []; list.forEach(function (p) { if (out.length < n && !shown[p.url] && (!test || test(p))) { shown[p.url] = 1; if (p.image) used[p.image] = 1; out.push(p); } }); return out; }
    // Secondary feature: newest columnist story with a photo (Franz first), then any story with a photo.
    var feature = take(posts, 1, function (p) { return p.image && /franz beard/i.test(p.author); })[0] ||
      take(posts, 1, function (p) { return p.image && !/staff/i.test(p.author) && !isSpears(p); })[0] || take(posts, 1, function (p) { return !!p.image; })[0];
    var list = take(posts, 4, function (p) { return !isSpears(p) || !/(photo|galler|best shots)/i.test(p.title); });
    var cols = columnistsHtml(posts);
    var latest = take(posts, 8);
    var gs = gameState(sb), mode = modes(sb);
    lastSb = sb;
    var root = document.createElement('div');
    root.id = 'gbm-live';
    root.className = 'gbm-gazette gbm-sports-home fp26' + (mode.night ? ' fp-night' : ' fp-day') + (mode.gameday ? ' fp-gameday' : '') + (mode.embers ? ' fp-embers-on' : '');
    root.setAttribute('data-theme', mode.night ? 'dark' : 'light');
    root.setAttribute('data-fp', VERSION);
    root.setAttribute('data-fp-build', String(BUNDLE.build || ''));
    root.setAttribute('data-fp-lead', picked.why);
    root.setAttribute('data-fp-scoreboard', sb.source);
    root.setAttribute('data-gazette-source', fresh ? 'current-feed' : 'last-known-feed');
    root.setAttribute('data-gazette-newest', posts[0].date.toISOString());
    root.innerHTML = '<a class="fp-skip" href="#sh-main">Skip to stories</a>' + tickerHtml(posts, sb, gs) + mastHtml() + navHtml(sb, gs) +
      (mode.gameday ? tunnelHtml(gs, sb, posts, lead.url) + (gs && gs.phase !== 'pre' ? boardHtml(gs) : '') : '') +
      '<main id="sh-main"><div class="fp-wrap"><div id="sh-freshness"></div>' + leadHtml(lead, picked.why) + quoteHtml(lead, posts) + secondHtml(feature, list, cols) + '</div>' +
      roadHtml(sb) + hubHtml(latest, sb, posts, used) + '</main>';
    if (!document.getElementById('gbm-fp26-styles')) {
      var style = document.createElement('style'); style.id = 'gbm-fp26-styles'; style.textContent = CSS; document.head.appendChild(style);
    }
    // The split Wix-served embeds still inject the old renderer's #gbgz-styles; switch it off, keep the element.
    var old = document.getElementById('gbgz-styles'); if (old && old.media !== 'not all') old.media = 'not all';
    var shell = document.getElementById('gbm-mobile-shell-host');
    if (shell && shell.parentNode) shell.parentNode.insertBefore(root, shell.nextSibling);
    else document.body.insertBefore(root, document.body.firstChild);
    doc.classList.add('gbm-gazette-live', 'gbm-standalone-live');
    try { initRoad(root); } catch (_) {}
    try { imgFallback(root); } catch (_) {}
    loading = false;
    window.__GBM_GAZETTE_RUNTIME__.ready = true;
    if (window.__GBM_GAZETTE_BOOT__ && window.__GBM_GAZETTE_BOOT__.ready) window.__GBM_GAZETTE_BOOT__.ready();
    requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.remove('gbm-prepaint-v2'); }); });
    startTicking(root); countUp(root); embers(root);
    document.dispatchEvent(new CustomEvent('gbm:gazette-ready', { detail: { stories: posts.length, fresh: fresh, lead: picked.why, version: VERSION } }));
    setTimeout(function () { loadModules(root); }, 50); // after first paint, never before it
  }
  // After paint the scoreboard can only change values in place (never structure), so nothing moves.
  function patchScores(raw) {
    var root = document.getElementById('gbm-live'); if (!root || !root.classList.contains('fp26')) return;
    var sb = readScoreboard(raw);
    lastSb = sb;
    root.setAttribute('data-fp-scoreboard', sb.source);
    if (sb.next) root.querySelectorAll('[data-fp-count]').forEach(function (el) { if (el.getAttribute('data-fp-count') !== sb.next.kickoffIso && Date.parse(sb.next.kickoffIso) > now()) { el.setAttribute('data-fp-count', sb.next.kickoffIso); el.innerHTML = ''; } });
    renderCountdowns(root);
    patchRoad(root, sb);
    patchTunnel(root, sb);
  }
  // The season band is the one block allowed to change after paint: it sits below the fold, so a band that the
  // feed adds or refreshes only swaps while it is off screen (same card count keeps the same height).
  function patchRoad(root, sb) {
    var html = roadHtml(sb); if (!html) return;
    var tmp = document.createElement('div'); tmp.innerHTML = html;
    var fresh = tmp.firstChild, cur = root.querySelector('#gbm-road'), hub = root.querySelector('.fp-hub');
    var anchor = cur || hub; if (!fresh || !anchor) return;
    var box = anchor.getBoundingClientRect(); if (box.bottom > 0 && box.top < innerHeight + 120) return;
    if (cur) {
      if (cur.getAttribute('data-sig') === fresh.getAttribute('data-sig') || cur.querySelectorAll('.g').length !== fresh.querySelectorAll('.g').length) return;
      cur.parentNode.replaceChild(fresh, cur);
    } else hub.parentNode.insertBefore(fresh, hub);
    try { initRoad(root); } catch (_) {}
  }

  /* ---------- Fan modules: Make the Call, Ask GatorBait, The Stands ----------
   * Bundled from sports-live/src/{make-the-call,ask-gatorbait,the-stands}.js. Their Workers exist only once
   * deploy/cloudflare/endpoints.json on Pages names them ({call, ask, stands}); it is read after first paint and a
   * missing file or field mounts nothing: no placeholder, no reserved box. A module enters the page only while its
   * anchor is off screen (patchRoad's rule) and any scroll offset it causes above the viewport is paid back, so
   * nothing the reader is looking at moves. */
  var ENDPOINTS = PAGES + 'deploy/cloudflare/endpoints.json';
  var lastSb = null, modulesDone = false;
  function endpointUrl(v) {
    try {
      var u = new URL(String(v || ''));
      if (u.protocol !== 'https:' || u.username || u.password || u.search || u.hash) return '';
      return /(^|\.)(workers\.dev|gatorbaitmedia\.com)$/.test(u.hostname) ? u.href.replace(/\/+$/, '') : '';
    } catch (_) { return ''; }
  }
  function offScreen(el) { var b = el.getBoundingClientRect(); return b.bottom <= 0 || b.top >= innerHeight; }
  // Insert `make()`'s node relative to `ref` only while `ref` is out of view; until then, retry on scroll/resize.
  function mountQuiet(ref, make) {
    var armed = false;
    function go() {
      if (!ref.isConnected) { off(); return; }
      if (!offScreen(ref)) { arm(); return; }
      off();
      var probe = document.elementFromPoint(Math.floor(innerWidth / 2), Math.floor(innerHeight / 2));
      probe = probe && (probe.closest('section,article,main,nav,header,footer') || probe);
      var before = probe ? probe.getBoundingClientRect().top : 0;
      try { make(); } catch (_) { return; }
      var d = probe ? probe.getBoundingClientRect().top - before : 0; // browsers with scroll anchoring already give 0
      if (Math.abs(d) > 0.5) scrollBy(0, d);
    }
    var pending = 0;
    function onMove() { if (!pending) pending = requestAnimationFrame(function () { pending = 0; go(); }); }
    function arm() { if (armed) return; armed = true; addEventListener('scroll', onMove, { passive: true }); addEventListener('resize', onMove); }
    function off() { if (!armed) return; armed = false; removeEventListener('scroll', onMove); removeEventListener('resize', onMove); }
    go();
  }
  function mountModules(root, ep) {
    var sb = lastSb, gs = sb && gameState(sb), mode = sb && modes(sb), tunnel = root.querySelector('.fp-tunnel');
    if (ep.call && window.GBM_CALL && sb && !root.querySelector('#gbm-call')) {
      var game = GBM_CALL.game(sb), road = root.querySelector('#gbm-road'), hub = root.querySelector('.fp-hub');
      if (game && (road || hub)) {
        window.__GBM_CALL_API__ = ep.call + '/v1';
        mountQuiet(road || hub, function () { (road || hub).insertAdjacentHTML(road ? 'afterend' : 'beforebegin', GBM_CALL.html(game)); GBM_CALL.init(root); });
      }
    }
    if (ep.ask && window.GBM_ASK && !root.querySelector('.fp-ask')) {
      var after = mode && mode.gameday && tunnel ? tunnel : root.querySelector('.fp-mod-show');
      if (after) { window.__GBM_ASK_URL__ = ep.ask; mountQuiet(after, function () { GBM_ASK.mount(after); }); }
    }
    if (ep.stands && window.GBM_STANDS && mode && mode.gameday && tunnel && gs && gs.kickoff && !root.querySelector('#gbm-stands')) {
      var cta = tunnel.querySelector('.fp-tn-cta');
      var cfg = { api: ep.stands, room: 'game-' + et(gs.kickoff).ymd, mount: '#gbm-stands', tokenUrl: ep.standsToken || '/_functions/standsToken', signin: L.signin };
      if (cta) { window.__GBM_STANDS__ = cfg; mountQuiet(cta, function () { var host = document.createElement('div'); host.id = 'gbm-stands'; cta.parentNode.insertBefore(host, cta.nextSibling); GBM_STANDS.mount(Object.assign({}, cfg, { mount: host })); }); }
    }
  }
  function loadModules(root) {
    if (modulesDone) return; modulesDone = true;
    fetchJson(ENDPOINTS + '?t=' + Math.floor(Date.now() / 60000), 800).then(function (j) {
      if (!j || typeof j !== 'object' || !root.isConnected) return;
      var ep = { call: endpointUrl(j.call), ask: endpointUrl(j.ask), stands: endpointUrl(j.stands), standsToken: typeof j.standsToken === 'string' && /^\/[\w\/-]*$/.test(j.standsToken) ? j.standsToken : '' };
      root.setAttribute('data-fp-modules', ['call', 'ask', 'stands'].filter(function (k) { return ep[k]; }).join(' ') || 'none');
      if (ep.call || ep.ask || ep.stands) fanChunk().then(function () { if (root.isConnected) mountModules(root, ep); }).catch(function () {});
    }).catch(function () { if (root.isConnected) root.setAttribute('data-fp-modules', 'none'); });
  }
  // The three modules (44 KB raw) live in sports-live/fan-modules.js next to this bundle and load only when a Worker exists.
  function fanChunk() {
    if (window.GBM_CALL && window.GBM_ASK && window.GBM_STANDS) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var have = document.getElementById('gbm-fp26-fan');
      if (have) { have.addEventListener('load', resolve, { once: true }); have.addEventListener('error', reject, { once: true }); return; }
      var b = document.getElementById('gbm-fp26-bundle'), src = (b && b.src) || (document.currentScript && document.currentScript.src) || '';
      var url = /\/sports-live\/homepage\.js/.test(src) ? src.replace(/\/sports-live\/homepage\.js.*$/, '/sports-live/fan-modules.js') : PAGES + 'sports-live/fan-modules.js';
      var s = document.createElement('script'); s.id = 'gbm-fp26-fan'; s.async = true; s.src = url;
      s.onload = resolve; s.onerror = function () { s.remove(); reject(new Error('fan modules failed to load')); };
      document.head.appendChild(s);
    });
  }

  function fetchJson(url, ms) {
    var c = new AbortController(), t = setTimeout(function () { c.abort(); }, ms);
    return fetch(url, { signal: c.signal, credentials: 'omit', cache: 'no-store' }).then(function (r) { clearTimeout(t); if (!r.ok) throw new Error(url + ' ' + r.status); return r.json(); });
  }
  function fetchRss() {
    var c = new AbortController(), t = setTimeout(function () { c.abort(); }, 4000);
    return fetch(RSS + '?t=' + Math.floor(Date.now() / 60000), { signal: c.signal, credentials: 'omit', cache: 'no-store' }).then(function (r) {
      clearTimeout(t); if (!r.ok) throw new Error('Content response ' + r.status);
      return r.text().then(function (xml) {
        var feed = new DOMParser().parseFromString(xml, 'text/xml');
        function text(n, key) { var el = Array.from(n.children).find(function (c) { return c.localName === key; }); return el ? el.textContent.trim() : ''; }
        return { posts: Array.from(feed.querySelectorAll('item')).map(function (n) { var enc = n.querySelector('enclosure'); return { title: text(n, 'title'), excerpt: text(n, 'description'), author: text(n, 'creator'), url: text(n, 'link'), firstPublishedDate: text(n, 'pubDate'), image: { src: enc ? enc.getAttribute('url') : '', alt: text(n, 'title') } }; }) };
      });
    });
  }
  function start() {
    if (!home() || loading || document.querySelector('#gbm-live.gbm-gazette')) return;
    loading = true;
    // Fallback: the bundled snapshot, or the Wix-served data part when it is newer.
    var fallback = { posts: BUNDLE.posts }, wixData = window.__GBM_HOME_FALLBACK__, cached;
    try { if (wixData && normalize(wixData).length >= 3 && normalize(wixData)[0].date > normalize(fallback)[0].date) fallback = wixData; } catch (_) {}
    var initial = fallback;
    try { cached = JSON.parse(sessionStorage.getItem('gbm-public-feed') || 'null'); if (cached && Date.now() - cached.saved < 900000 && normalize(cached.data).length >= 3 && normalize(cached.data)[0].date >= normalize(fallback)[0].date) initial = cached.data; } catch (_) {}
    var painted = false, scoreRaw, scoreDone = false, fontsDone = false, feedData = null, deadline = false;
    function paint(data, fresh) {
      if (painted) return; painted = true;
      try { render(normalize(data), fresh, readScoreboard(scoreRaw)); } catch (error) { failure(error); }
    }
    function maybePaint() {
      if (painted || !fontsDone) return;
      if (feedData && (scoreDone || deadline)) paint(feedData, true);
      else if (deadline) paint(initial, initial !== fallback);
    }
    ensureFonts().then(function () { fontsDone = true; maybePaint(); });
    // Same 1.5 s budget as the previous renderer: paint once with the best data in hand, never repaint.
    var timer = setTimeout(function () { deadline = true; fontsDone = true; maybePaint(); }, 1500);
    if (initial !== fallback) feedData = initial;
    fetchJson(PAGES + 'sports-live/scoreboard.json?t=' + Math.floor(Date.now() / 60000), 2500).then(function (raw) {
      if (!painted) { scoreRaw = raw; scoreDone = true; maybePaint(); } else patchScores(raw);
    }).catch(function () { scoreDone = true; maybePaint(); });
    fetchRss().catch(function () { return fetchJson(PAGES + 'gazette-live/posts.json', 3000); }).then(function (data) {
      var posts = normalize(data); if (posts.length < 3) throw new Error('Invalid current content');
      try { sessionStorage.setItem('gbm-public-feed', JSON.stringify({ saved: Date.now(), data: data })); } catch (_) {}
      if (!painted) { feedData = data; maybePaint(); return; }
      var root = document.getElementById('gbm-live');
      if (root && posts[0].date.toISOString() !== root.getAttribute('data-gazette-newest')) {
        var freshness = document.getElementById('sh-freshness');
        if (freshness) { freshness.textContent = ''; var a = document.createElement('a'); a.href = '/'; a.textContent = 'New stories available — refresh'; a.addEventListener('click', function (event) { event.preventDefault(); event.stopPropagation(); location.reload(); }); freshness.appendChild(a); }
      } else if (root) root.setAttribute('data-gazette-source', 'current-feed');
    }).catch(function () { clearTimeout(timer); deadline = true; fontsDone = true; maybePaint(); });
  }

  function sync() {
    if (!home()) {
      var root = document.querySelector('#gbm-live.gbm-gazette'); if (root) root.remove();
      stopTicking(); if (io) { io.disconnect(); io = null; }
      if (particles) { try { particles.destroy(); } catch (_) {} particles = null; }
      doc.classList.remove('gbm-gazette-live', 'gbm-standalone-live');
      window.__GBM_GAZETTE_RUNTIME__.ready = false;
      modulesDone = false;
    } else start();
  }
  window.__GBM_GAZETTE_RUNTIME__ = { sync: sync, ready: false, version: VERSION };
  window.addEventListener('popstate', sync);
  window.addEventListener('gbmroutechange', sync);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
