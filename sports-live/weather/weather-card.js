/* GatorBait game-day weather card. Live NWS hourly forecast for Gainesville, kickoff hour + next 6 hours.
   Mounts inside the game-day band (#gbm-gd) only. Refreshes every 10 minutes. Any failure removes the card. */
(function () {
  if (window.__GBM_WX__) return; window.__GBM_WX__ = 1;
  var KICK = Date.parse('2026-10-10T16:45:00Z'), KICK_LABEL = '12:45 p.m. ET', OPP = 'South Carolina';
  var HOURLY = 'https://api.weather.gov/gridpoints/JAX/43,32/forecast/hourly';
  var ALERTS = 'https://api.weather.gov/alerts/active?point=29.65,-82.34';
  var HIDE_AFTER = KICK + 5 * 36e5, EVERY = 6e5, root;

  var css = '#gbm-wx{box-sizing:border-box;margin:12px 0 0;border:1px solid #cfd8ea;border-radius:10px;background:#fff;color:#0b1f3a;font-family:Barlow,"Helvetica Neue",Arial,sans-serif;overflow:hidden}' +
    '#gbm-wx *{box-sizing:border-box}' +
    '#gbm-wx .wx-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;background:#0021a5;color:#fff;padding:9px 14px}' +
    '#gbm-wx .wx-k{font-weight:800;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#fa4616}' +
    '#gbm-wx .wx-t{font-weight:800;font-size:18px;line-height:1.15}' +
    '#gbm-wx .wx-s{padding:8px 14px 0;font-weight:600;font-size:15px;line-height:1.3;color:#0b1f3a}' +
    '#gbm-wx .wx-a{margin:8px 14px 0;padding:7px 10px;border-left:4px solid #fa4616;background:#fff3ee;font-weight:700;font-size:14px;line-height:1.3}' +
    '#gbm-wx .wx-g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;padding:10px 10px 6px}' +
    '#gbm-wx .wx-c{text-align:center;padding:6px 2px;border-radius:6px;background:#f3f6fc}' +
    '#gbm-wx .wx-c.on{background:#0021a5;color:#fff}' +
    '#gbm-wx .wx-hr{font-weight:700;font-size:12px}' +
    '#gbm-wx .wx-p{font-weight:800;font-size:17px;margin-top:2px}' +
    '#gbm-wx .wx-d{font-weight:800;font-size:17px;color:#c8380b}' +
    '#gbm-wx .on .wx-d{color:#ffb199}' +
    '#gbm-wx .wx-w{font-weight:500;font-size:11px;margin-top:1px;opacity:.85}' +
    '#gbm-wx .wx-f{padding:0 14px 9px;font-weight:500;font-size:12px;color:#44546a}' +
    '@media(max-width:480px){#gbm-wx .wx-t{font-size:16px}#gbm-wx .wx-g{padding:8px 6px 4px;gap:2px}#gbm-wx .wx-hr{font-size:10.5px}#gbm-wx .wx-p,#gbm-wx .wx-d{font-size:14px}#gbm-wx .wx-w{font-size:9.5px}}';

  function hide() { if (root && root.parentNode) root.parentNode.removeChild(root); root = null; }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function hour(ms) {
    var p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: true }).format(new Date(ms)).split(' ');
    return p[0] + ' ' + p[1].toLowerCase().replace(/(.)m/, '$1.m.');
  }
  function get(u) { return fetch(u, { cache: 'no-store', credentials: 'omit', headers: { Accept: 'application/geo+json' } }).then(function (r) { if (!r.ok) throw 0; return r.json(); }); }

  function render(periods, storm) {
    var now = Date.now(), start = Math.max(Math.floor(KICK / 36e5) * 36e5, Math.floor(now / 36e5) * 36e5);
    var rows = periods.filter(function (p) { return Date.parse(p.startTime) >= start; }).slice(0, 7);
    if (rows.length < 3) return hide();
    var kr = rows[0], pre = now < KICK;
    var box = el('div'); box.id = 'gbm-wx'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Game-day forecast for Gainesville');
    var h = el('div', 'wx-h'); var l = el('div'); l.appendChild(el('div', 'wx-k', 'Game-day forecast · Gainesville')); l.appendChild(el('div', 'wx-t', OPP + ' at Florida · Kickoff ' + KICK_LABEL)); h.appendChild(l); box.appendChild(h);
    if (storm) box.appendChild(el('div', 'wx-a', storm));
    var rain = kr.probabilityOfPrecipitation && kr.probabilityOfPrecipitation.value;
    box.appendChild(el('div', 'wx-s', (pre ? 'At kickoff: ' : 'Now: ') + kr.temperature + '°, ' + (rain == null ? '' : rain + '% chance of rain, ') + 'wind ' + kr.windDirection + ' ' + kr.windSpeed + '.'));
    var g = el('div', 'wx-g');
    rows.forEach(function (p, i) {
      var c = el('div', 'wx-c' + (i === 0 ? ' on' : '')), r = p.probabilityOfPrecipitation && p.probabilityOfPrecipitation.value;
      c.appendChild(el('div', 'wx-hr', hour(Date.parse(p.startTime))));
      c.appendChild(el('div', 'wx-p', r == null ? '–' : r + '%'));
      c.appendChild(el('div', 'wx-d', p.temperature + '°'));
      c.appendChild(el('div', 'wx-w', p.windSpeed.replace(' mph', '')));
      g.appendChild(c);
    });
    box.appendChild(g);
    box.appendChild(el('div', 'wx-f', 'Rain chance, temperature (°F), wind (mph) by hour. Source: National Weather Service. Updates every 10 minutes.'));
    var band = document.getElementById('gbm-gd'); if (!band) return hide();
    if (root && root.parentNode) root.parentNode.removeChild(root);
    band.appendChild(box); root = box;
  }

  function tick() {
    if (Date.now() > HIDE_AFTER) return hide();
    Promise.all([get(HOURLY), get(ALERTS).catch(function () { return null; })]).then(function (r) {
      var storm = null;
      ((r[1] && r[1].features) || []).forEach(function (f) { var p = f.properties || {}; if (!storm && /hurricane|tropical storm|storm surge/i.test(p.event || '')) storm = p.event + (p.headline ? ': ' + p.headline.replace(/^.*? issued /, 'issued ').slice(0, 140) : ''); });
      render(r[0].properties.periods, storm);
    }).catch(hide);
  }

  function boot() {
    if (!document.getElementById('gbm-wx-css')) { var s = document.createElement('style'); s.id = 'gbm-wx-css'; s.textContent = css; document.head.appendChild(s); }
    var tries = 0, w = setInterval(function () { if (document.getElementById('gbm-gd') || ++tries > 40) { clearInterval(w); if (document.getElementById('gbm-gd')) { tick(); setInterval(tick, EVERY); } } }, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
