// Builds the Broadcast S4 candidate embeds from src/ into <id8>/rev<N>.html.
// node deploy/broadcast-2026/s4/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const rd = (p) => readFileSync(join(p.startsWith('src/') ? here : root, p), 'utf8');
const LIMIT = 15000;

export function djb2(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}
const css = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n+/g, '').replace(/\s*([{};,])\s*/g, '$1').trim();
const js = (s) => s.replace(/^\/\*.*\*\/$/gm, '').replace(/\n+/g, '\n').trim();

const out = {};

// 7fee4de6 Header: macro CSS loader + header runtime + brand script kept verbatim from rev36.
{
  const prev = rd('7fee4de6/rev36.html');
  const brand = prev.slice(prev.indexOf('<script id="gbm-official-brand-script-v1">'));
  const loader = '<script>(function(i,e,o){i.getElementById("gbm-shared-site-design-v6")||(o=i.createElement("style"),o.id="gbm-shared-site-design-v6",o.textContent='
    + JSON.stringify(css(rd('src/header.css')))
    + '.replace(/\\^/g,"html:has(`) ").replace(/`/g,"#gbm-site-header").replace(/\\$/g,"!important").replace(/~/g,\'"Barlow Condensed",Barlow,sans-serif\').replace(/§/g,"#gbm-mobile-drawer-root").replace(/¶/g,"#gbm-mobile-shell"),e&&e.parentNode?e.parentNode.insertBefore(o,e):i.head.appendChild(o))})(document,document.currentScript);</script>';
  out['7fee4de6/rev37.html'] = loader + '<script>' + js(rd('src/header.js')) + '</script>' + brand;
}

// c66d5b7f Theme: rev8 kept verbatim (homepage rules) + Broadcast skin for S4 pages.
{
  const prev = rd('c66d5b7f/rev8.html');
  // Source stays plain CSS; the build packs repeated strings into one-character macros expanded at runtime.
  const packed = css(rd('src/theme.css'))
    .replaceAll('!important', '$')
    .replaceAll('html.gbm-bc #SITE_PAGES ', '^')
    .replaceAll('html:has(#gbm-site-header)', '`')
    .replaceAll('"Barlow Condensed",Barlow,sans-serif', '~')
    .replaceAll('#gbm-mobile-drawer-root', '§')
    .replaceAll('#gbm-mobile-shell', '¶');
  out['c66d5b7f/rev9.html'] = prev + '<script>(function(d,s){d.getElementById("gbm-broadcast-skin-v1")||(s=d.createElement("style"),s.id="gbm-broadcast-skin-v1",s.textContent='
    + JSON.stringify(packed)
    + '.replace(/\\$/g,"!important").replace(/\\^/g,"html.gbm-bc #SITE_PAGES ").replace(/`/g,"html:has(#gbm-site-header)").replace(/~/g,\'"Barlow Condensed",Barlow,sans-serif\').replace(/§/g,"#gbm-mobile-drawer-root").replace(/¶/g,"#gbm-mobile-shell"),d.head.appendChild(s))})(document);'
    + js(rd('src/theme.js')) + '</script>';
}

// 82c4ca83 TV: new Broadcast stylesheet; script kept from rev37 except the hub now sits after the phone bar too.
{
  const prev = rd('82c4ca83/rev37.html');
  let script = prev.slice(prev.indexOf('</style>') + 8);
  const last = "var A=[document.getElementById('gbm-site-header'),document.getElementById('gbm-mobile-shell-host')].filter(function(e){return e&&e.parentNode===document.body}).sort(function(a,b){return a.compareDocumentPosition(b)&4?-1:1}).pop();";
  const swaps = [
    ["if(old){var header=document.getElementById('gbm-site-header');if(header&&header.parentNode===document.body&&header.nextElementSibling!==old)header.after(old);return}",
     "if(old){" + last + "if(A&&A.nextElementSibling!==old)A.after(old);return}"],
    ["var anchor=document.getElementById('gbm-site-header')||document.getElementById('gbm-mobile-shell-host');if(anchor&&anchor.parentNode===document.body)document.body.insertBefore(m,anchor.nextSibling);else document.body.insertBefore(m,document.body.firstChild);",
     last + "if(A)A.after(m);else document.body.insertBefore(m,document.body.firstChild);"],
  ];
  for (const [a, b] of swaps) { if (!script.includes(a)) throw new Error('TV anchor not found'); script = script.replace(a, () => b); }
  const packed = css(rd('src/tv.css'))
    .replaceAll('!important', '$')
    .replaceAll('html:has(#gbm-media-hub) ', '`')
    .replaceAll('#gbm-media-hub ', '^')
    .replaceAll('"Barlow Condensed",Barlow,sans-serif', '~')
    .replaceAll('text-transform:uppercase', '¤')
    .replaceAll('clip-path:polygon(', '¢');
  out['82c4ca83/rev38.html'] = '<script>(function(d,s){d.getElementById("gbm-media-hub-v2")||(s=d.createElement("style"),s.id="gbm-media-hub-v2",s.textContent='
    + JSON.stringify(packed)
    + '.replace(/\\$/g,"!important").replace(/`/g,"html:has(#gbm-media-hub) ").replace(/\\^/g,"#gbm-media-hub ").replace(/~/g,\'"Barlow Condensed",Barlow,sans-serif\').replace(/¤/g,"text-transform:uppercase").replace(/¢/g,"clip-path:polygon("),d.head.appendChild(s))})(document);</script>' + script;
}

// 360c9265 Roster and schedule card: Broadcast card styles, guide-table rules and script kept from rev4.
{
  const prev = rd('360c9265/rev4.html');
  out['360c9265/rev5.html'] = '<style id="gbm-football-tools-style">\n' + rd('src/roster.css') + '</style>' + prev.slice(prev.indexOf('</style>') + 8);
}

// a13b04e3 UI layer: modal type and buttons to Broadcast, Barlow only; logic unchanged.
{
  let h = rd('a13b04e3/rev5.html');
  const swaps = [
    ['-apple-system,BlinkMacSystemFont,\\"Segoe UI\\",Arial,sans-serif', 'Barlow,sans-serif', 5],
    ['.gbm-modal-card{position:relative;width:min(520px,100%);max-height:min(720px,calc(100vh - 32px));overflow:auto;background:#fff;color:#101827;border-top:6px solid #fa4616;',
     '.gbm-modal-card{position:relative;width:min(520px,100%);max-height:min(720px,calc(100vh - 32px));overflow:auto;background:#fffaf0;color:#10264b;border-top:6px solid #fa4616;', 1],
    ['font:700 32px/1.05 Barlow,Arial,sans-serif!important;letter-spacing:-.02em}',
     'font:italic 800 36px/.95 \\"Barlow Condensed\\",Barlow,sans-serif!important;letter-spacing:-.01em;text-transform:uppercase}', 1],
    ['.gbm-modal-eyebrow{display:block;margin-bottom:8px;color:#0021a5;font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}',
     '.gbm-modal-eyebrow{display:inline-block;margin-bottom:10px;padding:6px 14px 6px 10px;background:#fa4616;color:#08132f;font:800 13px/1 \\"Barlow Condensed\\",Barlow,sans-serif;letter-spacing:.12em;text-transform:uppercase;clip-path:polygon(0 0,100% 0,calc(100% - 8px) 100%,0 100%)}', 1],
    ['.gbm-modal-btn{display:flex;align-items:center;justify-content:center;min-height:48px;padding:12px 16px;border:2px solid #08132f;background:#08132f;color:#fff!important;text-decoration:none!important;font-size:13px;font-weight:900;letter-spacing:.03em;',
     '.gbm-modal-btn{display:flex;align-items:center;justify-content:center;min-height:48px;padding:12px 16px;border:2px solid #0a1a6b;background:#0a1a6b;color:#fff!important;text-decoration:none!important;font:800 18px/1.1 \\"Barlow Condensed\\",Barlow,sans-serif;text-transform:uppercase;letter-spacing:.04em;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);', 1],
    ['.gbm-modal-btn{min-height:52px;font-size:14px}', '.gbm-modal-btn{min-height:52px;font-size:18px}', 1],
  ];
  for (const [a, b, n] of swaps) {
    const c = h.split(a).length - 1;
    if (c !== n) throw new Error(`UI layer: expected ${n} of ${a.slice(0, 40)}, found ${c}`);
    h = h.split(a).join(b);
  }
  out['a13b04e3/rev6.html'] = h;
}

// 5a43ae83 Site Fixer: JSON-LD and redirects unchanged. Retires the late "Published" date line (Wix's hydration wipes it ~4 s
// after load, which made the story jump 27 px) and adds the Broadcast members card on paywalled stories.
{
  let h = rd('5a43ae83/rev24.html');
  const a = h.indexOf('    // Native Wix owns post titles'), b = h.indexOf('  } catch(e) {}');
  if (a < 0 || b < a) throw new Error('Site Fixer: date block not found');
  h = h.slice(0, a) + h.slice(b);
  out['5a43ae83/rev25.html'] = h + '<style id="gbm-gate-v1">' + css(rd('src/gate.css')) + '</style><script>' + js(rd('src/gate.js')) + '</script>';
}

let bad = 0;
for (const [p, html] of Object.entries(out)) {
  writeFileSync(join(root, p), html);
  const ok = html.length < LIMIT;
  if (!ok) bad++;
  console.log(`${ok ? 'ok ' : 'BIG'} ${p} ${html.length} chars djb2 ${djb2(html)}`);
}
process.exit(bad ? 1 : 0);
