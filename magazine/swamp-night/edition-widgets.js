/* GatorBait Magazine digital-edition widgets: kickoff countdown and the "Just posted" list.
 * Both are progressive: the page is complete without this file. The list reads the site's own
 * RSS feed (same origin as the page that mounts this document) and writes text only. */
(() => {
  'use strict';
  const cd = document.querySelector('.countdown[data-kickoff]');
  if (cd) {
    const end = Date.parse(cd.dataset.kickoff);
    const cell = u => cd.querySelector('[data-u="' + u + '"]');
    const tick = () => {
      const left = end - Date.now();
      if (!(left > 0)) { cd.hidden = true; return false; }
      const s = Math.floor(left / 1000);
      cell('d').textContent = Math.floor(s / 86400);
      cell('h').textContent = Math.floor(s % 86400 / 3600);
      cell('m').textContent = Math.floor(s % 3600 / 60);
      cell('s').textContent = s % 60;
      cd.hidden = false;
      return true;
    };
    if (tick()) { const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }
  }
  const box = document.querySelector('.live-feed');
  const list = box && box.querySelector('.live-list');
  let origin = '';
  try { origin = location.origin; } catch (_) {}
  if (!list || !/^https:\/\/www\.gatorbaitmedia\.com$/.test(origin)) return;
  const ago = t => {
    const m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'Just now';
    if (m < 60) return m + ' min ago';
    if (m < 1440) { const h = Math.round(m / 60); return h + (h === 1 ? ' hour ago' : ' hours ago'); }
    const d = Math.round(m / 1440); return d + (d === 1 ? ' day ago' : ' days ago');
  };
  fetch(origin + '/blog-feed.xml?mz=' + Date.now(), { cache: 'no-store', credentials: 'omit' })
    .then(r => { if (!r.ok) throw new Error('feed ' + r.status); return r.text(); })
    .then(xml => {
      const doc = new DOMParser().parseFromString(xml, 'text/xml');
      const text = (n, tag) => { const e = n.getElementsByTagName(tag)[0]; return e ? (e.textContent || '').trim() : ''; };
      const items = [...doc.getElementsByTagName('item')].map(n => ({
        title: text(n, 'title'), link: text(n, 'link'), by: text(n, 'dc:creator'), at: Date.parse(text(n, 'pubDate'))
      })).filter(i => i.title && i.at && /^https:\/\/www\.gatorbaitmedia\.com\/post\/[^\s"'<>]+$/.test(i.link))
        .sort((a, b) => b.at - a.at).slice(0, 6);
      if (!items.length) return;
      for (const i of items) {
        const li = document.createElement('li'), a = document.createElement('a');
        const when = document.createElement('small'), title = document.createElement('strong'), by = document.createElement('em');
        a.href = i.link; when.textContent = ago(i.at); title.textContent = i.title; by.textContent = i.by ? 'By ' + i.by : '';
        a.append(when, title, by); li.append(a); list.append(li);
      }
      box.hidden = false;
    }).catch(() => {});
})();
