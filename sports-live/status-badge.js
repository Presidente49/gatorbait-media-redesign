/* GatorBait "Site status" badge. Vanilla JS, Barlow only, no dependencies, light or dark page.
   Usage: <script src="https://presidente49.github.io/gatorbait-media-redesign/sports-live/status-badge.js" defer></script>
   Optional: <div id="gb-status"></div> where it should sit (else it is placed right after the script tag).
   Reads sports-live/uptime.json. On any failure, stale data or no data it renders NOTHING (never a false all-clear). */
(function () {
  var s = document.currentScript, base = s && s.src ? s.src.replace(/[^\/]*$/, '') : 'https://presidente49.github.io/gatorbait-media-redesign/sports-live/';
  var STALE = 45 * 60 * 1000;
  function ago(ms) { var m = Math.max(0, Math.round(ms / 60000)); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : Math.round(m / 60) + ' hr ago'; }
  function render(d) {
    var sm = d && d.summary, t = sm && Date.parse(sm.lastChecked), a = sm && sm.availability24h && sm.availability24h.overall;
    if (!sm || !isFinite(t) || Date.now() - t > STALE || (sm.state !== 'normal' && sm.state !== 'degraded')) return;
    var ok = sm.state === 'normal', host = document.getElementById('gb-status');
    if (!host) { host = document.createElement('div'); (s && s.parentNode ? s.parentNode.insertBefore(host, s.nextSibling) : document.body.appendChild(host)); }
    if (!document.getElementById('gb-status-css')) {
      var c = document.createElement('style'); c.id = 'gb-status-css';
      c.textContent = '.gbs{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap;font:500 14px/1.3 Barlow,sans-serif;color:inherit;text-decoration:none;padding:6px 12px;border:1px solid currentColor;border-radius:999px;opacity:.9}.gbs:hover{opacity:1}.gbs i{width:9px;height:9px;border-radius:50%;background:#1f9d55;flex:none}.gbs.d i{background:#e0a100}.gbs b{font-weight:700}.gbs span{opacity:.75}';
      document.head.appendChild(c);
    }
    var l = document.createElement('a');
    l.className = 'gbs' + (ok ? '' : ' d'); l.href = base + 'status.html'; l.target = '_blank'; l.rel = 'noopener';
    l.innerHTML = '<i></i><b></b><span></span>';
    l.children[1].textContent = ok ? 'All systems normal' : 'Degraded';
    l.children[2].textContent = (a == null ? '' : a.toFixed(2).replace(/\.?0+$/, '') + '% over 24h · ') + 'checked ' + ago(Date.now() - t);
    host.textContent = ''; host.appendChild(l);
  }
  try {
    fetch(base + 'uptime.json?t=' + Math.floor(Date.now() / 300000), { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(render).catch(function () {});
  } catch (e) {}
})();
