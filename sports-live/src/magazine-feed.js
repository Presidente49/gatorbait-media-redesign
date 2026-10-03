  /* ================= Magazine feed picker (shared by the runtime and sports-live/refresh-magazine-feed.mjs) =================
   * Pure functions, no DOM, no network. Input posts use the homepage shape (front-page.js normalize / fetchRss):
   *   { title, url, author, firstPublishedDate, excerpt, html?, image: { src, width, height, alt } }
   * mfPick(issue, posts, nowMs, credits) returns { lead, items, leadChanged, cardsChanged } for issue.lead and issue.cards.items.
   * Rules (Brenden, Oct. 3; CLAUDE.md): the lead is the freshest column or feature by a named writer, Buddy Martin wins any
   * 12-hour tie, staff/news items never lead; cards are the remaining newest stories, newest first, each story once, never the
   * lead or a story already linked elsewhere on the page, only with a credited Wix photo, at most the current card count.
   * A story already in the issue keeps its curated object byte for byte. */
  var MF_WRITERS = ['Buddy Martin', 'Franz Beard', 'Loren Meadows', 'Eddie Gilley', 'Carlton Reese'];
  var MF_TIE_MS = 12 * 3600000, MF_DAY = 86400000, MF_LEAD_MAX_AGE = 7 * MF_DAY;
  var MF_MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var MF_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function mfStr(v) { return v == null || typeof v === 'object' ? '' : String(v).replace(/\s+/g, ' ').trim(); }
  function mfEsc(v) { return String(v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mfPath(u) {
    try { var x = new URL(String(u || ''), 'https://www.gatorbaitmedia.com'); return x.protocol === 'https:' && /^(www\.)?gatorbaitmedia\.com$/.test(x.hostname) && x.pathname.indexOf('/post/') === 0 ? x.pathname.replace(/\/+$/, '') : ''; } catch (_) { return ''; }
  }
  function mfWriter(author) {
    var a = mfStr(author).toLowerCase();
    for (var i = 0; i < MF_WRITERS.length; i++) if (a === MF_WRITERS[i].toLowerCase()) return MF_WRITERS[i];
    return '';
  }
  // Wix image: https://static.wixstatic.com/media/<id>~mv2.<ext>/v1/... -> { id, ext }
  function mfImage(src) {
    var m = /^https:\/\/static\.wixstatic\.com\/media\/([0-9a-f]+_[0-9a-f]{32})~mv2\.(jpe?g|png|webp|avif)(?:[\/?#].*)?$/i.exec(mfStr(src));
    return m ? { id: m[1], ext: m[2].toLowerCase() } : null;
  }
  function mfEt(ms) {
    var p = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month - 1, d: +p.day };
  }
  function mfShortDate(ms) { var e = mfEt(ms); return MF_MONTHS[e.m] + ' ' + e.d; }
  function mfLongDate(ms) { var e = mfEt(ms); return MF_FULL[e.m] + ' ' + e.d + ', ' + e.y; }
  // Excerpts sometimes open with the photo caption: "Caption (Photo by Chris Spears) Story..." (same rule as front-page.js).
  function mfExcerpt(raw) {
    var s = mfStr((typeof raw === 'string' ? raw : '').replace(/<[^>]*>/g, ' ')), cap = '', credit = '';
    var m = s.match(/^(.{8,220}?)\s*\(((?:UAA )?Photo(?: by)?[^)]{0,60}|[^)]{0,40} photo)\)\s*(.*)$/i);
    if (m) { cap = m[1]; credit = /spears/i.test(m[2]) ? 'Photo by Chris Spears, GatorBait Media' : m[2].replace(/^photo:?\s*/i, 'Photo: '); s = m[3]; }
    return { text: s, cap: cap, credit: credit };
  }
  // Teaser: drop everything up to a writer's "By <Name> " in the first 400 characters (photo caption, kicker, dateline),
  // then keep two or three whole sentences. Never a mid-word cut; curly quotes are left as they are.
  var MF_BYLINE = new RegExp('(^|[\\s.!?’”"])By (' + MF_WRITERS.join('|') + ')[.,:]?\\s+', 'i');
  function mfTeaser(raw, max) {
    var s = mfStr(raw), m = MF_BYLINE.exec(s.slice(0, 400 + 40));
    if (m && m.index <= 400) s = s.slice(m.index + m[0].length);
    max = max || 320;
    // A trailing "…" or "..." is Wix truncating the excerpt, not the end of a sentence.
    var re = /[.!?]+[’”"')\]]*(?=\s+[“"‘'(A-Z0-9]|$)/g, ends = [], x;
    while ((x = re.exec(s))) if (!/^\.\./.test(x[0])) ends.push(x.index + x[0].length);
    var out = '';
    for (var i = 0; i < ends.length && i < 3; i++) { var c = s.slice(0, ends[i]).trim(); if (i >= 2 && c.length > max) break; if (i >= 1 && c.length > max * 1.4) break; out = c; }
    if (out) return out;
    if (s.length <= max) return s;
    return s.slice(0, s.lastIndexOf(' ', max)).replace(/[,;:\-–—]+$/, '') + '…';
  }
  // Photo credit stated in the feed itself: "(Photo by X, Y)" or "(Photo: X)" in the image alt text or the caption.
  function mfCreditIn(v) {
    var m = /\((?:UAA )?Photo(?: by|:)\s*([^)]{2,80})\)/i.exec(mfStr(v));
    if (!m) return '';
    return /chris spears/i.test(m[1]) ? 'Photo by Chris Spears, GatorBait Media' : /^photo:/i.test(m[0].slice(1)) ? 'Photo: ' + m[1].trim() : 'Photo by ' + m[1].trim();
  }
  function mfNormalize(posts, nowMs, credits) {
    credits = credits || {};
    var seen = {}, out = [];
    (Array.isArray(posts) ? posts : []).forEach(function (p) {
      if (!p || typeof p !== 'object') return;
      var path = mfPath(p.url), title = mfStr(p.title), t = Date.parse(p.firstPublishedDate || p.date || '');
      if (!path || !title || !isFinite(t) || t > nowMs + MF_DAY || seen[path]) return;
      if (/^LIVE NOW:/i.test(title) && nowMs - t > 21600000) return;
      seen[path] = 1;
      var ex = mfExcerpt(p.excerpt), img = p.image && typeof p.image === 'object' ? p.image : {}, file = mfImage(img.src);
      var w = +img.width > 0 ? Math.round(+img.width) : 0, h = +img.height > 0 ? Math.round(+img.height) : 0;
      // The snapshot's 1600x900 is a placeholder; a non-square Wix fit box in the feed URL carries the photo's real shape.
      var box = /\/fit\/w_(\d+),h_(\d+)/.exec(mfStr(img.src));
      if (box && +box[1] !== +box[2] && (!w || (w === 1600 && h === 900))) { w = 1600; h = Math.round(1600 * box[2] / box[1]); }
      // Verified credit only: the curated/homepage credit map, then a credit the feed states for this photo. Otherwise ''.
      var credit = (file && credits[file.id]) || ex.credit || mfCreditIn(img.alt) || mfCreditIn(img.caption) || '';
      out.push({ title: title, path: path, author: mfStr(p.author) || 'GatorBait Staff', writer: mfWriter(p.author), t: t, excerpt: mfTeaser(ex.text), cap: ex.cap, credit: credit,
        html: typeof p.html === 'string' ? p.html : '', file: file, width: w, height: h, alt: mfStr(img.alt) || title });
    });
    return out.sort(function (a, b) { return b.t - a.t || (a.path < b.path ? -1 : 1); });
  }
  // News items under a writer's name (BREAKING / LIVE NOW / UPDATE) never lead; galleries never lead.
  // A lead needs a photo with a verified credit (Brenden/Jarvis, Oct. 3); the Buddy tie rule applies among those.
  function mfLeadable(p) { return !!p.writer && !!p.file && !!p.credit && !/^(BREAKING|LIVE NOW|UPDATE|WATCH)\b/i.test(p.title) && !/best shots|photo gallery/i.test(p.title); }
  function mfPickLead(posts, nowMs) {
    var c = posts.filter(function (p) { return mfLeadable(p) && nowMs - p.t <= MF_LEAD_MAX_AGE; });
    if (!c.length) return null;
    var top = c[0];
    if (top.writer !== 'Buddy Martin') { var b = c.find(function (p) { return p.writer === 'Buddy Martin'; }); if (b && top.t - b.t <= MF_TIE_MS) top = b; }
    return top;
  }
  // Every /post/ URL the issue links outside the lead and the cards (cover, best shots, keys, reference...), so a card never repeats one.
  function mfLinked(issue) {
    var out = {};
    (function walk(v, key) {
      if (Array.isArray(v)) { v.forEach(function (x) { walk(x, key); }); return; }
      if (v && typeof v === 'object') { Object.keys(v).forEach(function (k) { if (key === '' && (k === 'lead' || k === 'cards')) return; walk(v[k], k); }); return; }
      if (key === 'url' && typeof v === 'string') { var p = mfPath(v); if (p) out[p] = 1; }
    })(issue, '');
    return out;
  }
  // Credits we already know: every credited image in the issue, then the shared homepage credit map, then the excerpt caption.
  function mfCredits(issue, extra) {
    var out = {};
    (function walk(v) {
      if (Array.isArray(v)) { v.forEach(walk); return; }
      if (v && typeof v === 'object') { if (typeof v.id === 'string' && mfStr(v.credit) && !out[v.id]) out[v.id] = mfStr(v.credit); Object.keys(v).forEach(function (k) { walk(v[k]); }); }
    })(issue);
    Object.keys(extra || {}).forEach(function (k) { if (!out[k] && mfStr(extra[k])) out[k] = mfStr(extra[k]); });
    return out;
  }
  function mfImg(p, credit) {
    var alt = /^featured image for /i.test(p.alt) ? p.title : p.alt;
    return { id: p.file.id, ext: p.file.ext, width: p.width || 1600, height: p.height || 900, alt: alt + (credit && alt.indexOf('(') < 0 ? ' (' + credit + ')' : ''), credit: credit };
  }
  function mfKicker(p) {
    if (p.writer === 'Franz Beard' && /^thoughts of the day/i.test(p.title)) return 'Franz Beard · Thoughts of the Day';
    if (p.writer === 'Franz Beard' && /^the soothsayer/i.test(p.title)) return 'Franz Beard · The Soothsayer';
    if (p.writer) return p.writer + ' · Column';
    return 'News · ' + (/staff$/i.test(p.author.replace(/\s+/g, '')) ? 'GatorBait Staff' : p.author);
  }
  // Lead body: the post's own first paragraphs when the feed carries the text, else its excerpt. Never another story's copy.
  function mfLeadHtml(p) {
    var paras = [];
    if (p.html) {
      var re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi, m;
      while ((m = re.exec(p.html)) && paras.length < 4) {
        var inner = m[1].replace(/<a\b[^>]*href="([^"]*)"[^>]*>/gi, function (_, h) { var q = mfPath(h); return q ? '<a href="' + q + '">' : '<a>'; })
          .replace(/<(?!\/?(?:a|strong|em)\b)[^>]*>/gi, '').replace(/<a>([\s\S]*?)<\/a>/gi, '$1').trim();
        var plain = mfStr(inner.replace(/<[^>]*>/g, ''));
        // Nothing before the byline: a paragraph holding "By <Writer>" restarts the body after it; caption lines are skipped.
        var by = MF_BYLINE.exec(plain);
        if (by) { paras = []; if (by.index + by[0].length >= plain.length - 20) continue; inner = mfEsc(plain.slice(by.index + by[0].length)); plain = inner; }
        if (/\((?:UAA )?Photo(?: by|:)/i.test(plain) && plain.length < 260) continue;
        if (plain.length > 20) paras.push('<p>' + inner + '</p>');
      }
    }
    return paras.length ? paras.join('') : (p.excerpt ? '<p>' + mfEsc(p.excerpt) + '</p>' : '');
  }
  function mfPick(issue, posts, nowMs, extraCredits) {
    var D = issue && typeof issue === 'object' ? issue : {}, oldLead = D.lead && typeof D.lead === 'object' ? D.lead : null;
    var oldCards = D.cards && Array.isArray(D.cards.items) ? D.cards.items : [];
    var credits = mfCredits(D, extraCredits), all = mfNormalize(posts, nowMs, credits);
    var res = { lead: oldLead, items: oldCards, leadChanged: false, cardsChanged: false, posts: all.length };
    if (!all.length) return res;
    var pick = mfPickLead(all, nowMs), leadPath = oldLead ? mfPath(oldLead.url) : '';
    if (pick && pick.path !== leadPath) {
      var body = mfLeadHtml(pick);
      if (body) {
        var cr = pick.credit;
        res.lead = { label: 'The Lead', kicker: pick.writer, author: pick.writer, title: pick.title, url: pick.path, html: body,
          'continue': 'Read the full column', date: mfLongDate(pick.t), image: mfImg(pick, cr), caption: pick.cap };
        res.leadChanged = true; leadPath = pick.path;
      }
    }
    var max = oldCards.length || 3, linked = mfLinked(D), byPath = {};
    oldCards.forEach(function (c) { var q = c && mfPath(c.url); if (q) byPath[q] = c; });
    var items = [];
    for (var i = 0; i < all.length && items.length < max; i++) {
      var p = all[i];
      if (p.path === leadPath || linked[p.path]) continue;
      if (byPath[p.path]) { items.push(byPath[p.path]); continue; }
      if (!p.file) continue;
      var credit = p.credit;
      if (!credit) continue;
      items.push({ kicker: mfKicker(p), title: p.title, url: p.path, excerpt: mfTeaser(p.excerpt, 220), image: mfImg(p, credit), date: mfShortDate(p.t) });
    }
    if (items.length && (items.length !== oldCards.length || items.some(function (c, k) { return c !== oldCards[k]; }))) { res.items = items; res.cardsChanged = true; }
    return res;
  }
  // Live score line for the Magazine ticker, from sports-live/scoreboard.json (same contract front-page.js reads).
  // Returns '' outside the game: the countdown then keeps the slot.
  function mfScoreLine(raw, opponent, kickoffISO, nowMs) {
    if (!raw || typeof raw !== 'object') return '';
    var k = Date.parse(kickoffISO || ''), opp = mfStr(opponent);
    if (!isFinite(k) || !opp || nowMs < k - 1800000 || nowMs > k + 12 * 3600000) return '';
    function n(v) { return typeof v === 'number' && isFinite(v) ? v : null; }
    function ab(name) { return ({ Florida: 'FLA', Missouri: 'MIZ', 'Ole Miss': 'MISS', Georgia: 'UGA', Tennessee: 'TENN', LSU: 'LSU', Kentucky: 'UK', 'South Carolina': 'SC', Texas: 'TEX' })[name] || name.slice(0, 4).toUpperCase(); }
    var O = ab(opp), lv = raw.live, nx = raw.next, ls = raw.last;
    if (lv && typeof lv === 'object' && lv.score && n(lv.score.fla) !== null && n(lv.score.opp) !== null && (!nx || mfStr(nx.opponent) === opp)) {
      var clk = mfStr(lv.clock).slice(0, 16), per = n(lv.period);
      var when = /half/i.test(clk) ? 'Half' : ((per ? (per > 4 ? 'OT' : 'Q' + per) : '') + (per && clk ? ' ' : '') + clk);
      return 'FLA ' + lv.score.fla + ' ' + O + ' ' + lv.score.opp + (when ? ' · ' + when : '');
    }
    if (ls && typeof ls === 'object' && mfStr(ls.opponent) === opp && /final/i.test(mfStr(ls.status)) && ls.score && n(ls.score.fla) !== null && n(ls.score.opp) !== null && Math.abs(Date.parse(ls.date || '') - k) < MF_DAY) {
      return 'Final: FLA ' + ls.score.fla + ' ' + O + ' ' + ls.score.opp;
    }
    return '';
  }
