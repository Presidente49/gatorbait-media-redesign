#!/usr/bin/env node
// speed-2026: derives <id8>-v2.html from <id8>-live.html with exact-match replacements (each must match once), so every
// byte outside the listed edits is identical to the live body. The header (7fee4de6) is not made here: it comes out of
// deploy/shell-2026/build.mjs from src/header.src.html and is copied in as 7fee4de6-v2.html.
// Usage: node deploy/speed-2026/embeds/make-v2.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
export const djb2 = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h; };
const LOGO_LIVE = 'https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp';
const LOGO_CUT = 'https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp/v1/fill/w_500,h_134,al_c,q_85,enc_auto/gatorbait.webp';

const EDITS = {
  // FB ViewContent: same 10 s window for fbq, 10 checks instead of 25.
  '5ab10e7b': [
    ['<script>(function(){if(window.__gbmFBVC)', '<!-- speed-2026 v2: fbq poll 10 x 1000 ms (was 25 x 400 ms), same 10 s window --><script>(function(){if(window.__gbmFBVC)'],
    ['if(n<25){setTimeout(function(){go(n+1);},400);}', 'if(n<10){setTimeout(function(){go(n+1);},1000);}'],
  ],
  // Post wide canvas: observer on the Wix page container, armed only while html.gbm-native-wide (set by fdc2127a on /post/) and at phone width.
  'a5452619': [
    [`var q=0;
function fit(){q=0;var h=document.documentElement;if(!h.classList.contains('gbm-native-wide')||innerWidth>750)return;
var r=document.querySelector('[data-hook=post-page-root]');if(!r)return;`,
     `var q=0,mo=null,off=0,root=null;
function on(){return document.documentElement.classList.contains('gbm-native-wide')&&innerWidth<=750;}
function fit(){q=0;if(!on())return;
var r=document.querySelector('[data-hook=post-page-root]');if(!r)return;`],
    [`function later(){if(!q)q=requestAnimationFrame(fit);}
new MutationObserver(later).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
addEventListener('resize',later);addEventListener('load',later);later();`,
     `function later(){if(!q)q=requestAnimationFrame(fit);}
// v2 (speed-2026): watch the Wix page container instead of the whole document, only while html.gbm-native-wide is set
// (fdc2127a sets it on /post/ only) and only at phone width; each arm stops after 60 s. An attribute-only observer on
// <html> plus resize and load re-arm it, so client-side navigation into a story still widens the column.
function stop(){if(mo)mo.disconnect();clearTimeout(off);}
function arm(){stop();later();if(!on())return;root=document.getElementById('SITE_CONTAINER')||document.getElementById('SITE_PAGES')||document.body;
if(!root){document.addEventListener('DOMContentLoaded',arm,{once:true});return;}
if(!mo)mo=new MutationObserver(later);mo.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});off=setTimeout(stop,60000);}
new MutationObserver(arm).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
addEventListener('resize',arm);addEventListener('load',arm);arm();`],
  ],
  // Post formatting normalizer: one debounced observer on the page container, armed on /post/ only, released after 60 s, re-armed on route change.
  'c91ad133': [
    ['<!-- GBM_POST_NORMALIZER_V1 -->', '<!-- GBM_POST_NORMALIZER_V1 --><!-- speed-2026 v2: scoped, debounced, bounded observer -->'],
    [`function go(){try{run();}catch(e){console.warn('[GatorBait] post normalizer',e);}}
var mo=new MutationObserver(function(){if(/^\\/post\\//.test(location.pathname))go();else document.documentElement.removeAttribute('data-gbm-unbold');});
function watch(){if(document.body)mo.observe(document.body,{childList:true,subtree:true});else document.addEventListener('DOMContentLoaded',watch,{once:true});}
go();watch();
window.addEventListener('load',go,{once:true});`,
     `function go(){try{run();}catch(e){console.warn('[GatorBait] post normalizer',e);}}
// v2 (speed-2026): one 100 ms-debounced observer on the Wix page container, armed only on /post/ and released 60 s after
// each (re)arm; popstate / gbmroutechange re-arm it or clear the unbold flag off /post/. run() and its selectors are unchanged.
var mo=null,q=0,off=0;
function onPost(){return /^\\/post\\//.test(location.pathname);}
function stop(){if(mo)mo.disconnect();mo=null;clearTimeout(q);q=0;clearTimeout(off);}
function arm(){stop();if(!onPost()){document.documentElement.removeAttribute('data-gbm-unbold');return;}
go();var root=document.getElementById('SITE_CONTAINER')||document.getElementById('SITE_PAGES')||document.body;
if(!root){document.addEventListener('DOMContentLoaded',arm,{once:true});return;}
mo=new MutationObserver(function(){if(!q)q=setTimeout(function(){q=0;go();},100);});
mo.observe(root,{childList:true,subtree:true});off=setTimeout(stop,60000);}
arm();
window.addEventListener('load',go,{once:true});
window.addEventListener('popstate',arm);window.addEventListener('gbmroutechange',arm);`],
  ],
  // News SEO: the 250 ms x 60 poll becomes one immediate try, a debounced observer on the page container that stops on success, and four fallback ticks; the 4 s author grace and 15 s cutoff are kept.
  '4d3ab24a': [
    ['<script>(function(){if(!/^\\/post\\//.test(location.pathname))return;if(location.pathname===', '<!-- speed-2026 v2: observer + 4 ticks instead of a 250 ms poll --><script>(function(){if(!/^\\/post\\//.test(location.pathname))return;if(location.pathname==='],
    ['if(!al&&n<16)return false;', 'if(!al&&Date.now()-t0<4000)return false;'],
    ['var n=0;var iv=setInterval(function(){n++;if(run()||n>60)clearInterval(iv);},250);})();</script>',
     "var t0=Date.now(),done=false,mo=null,q=0;function tick(){if(done)return;if(run()){done=true;if(mo)mo.disconnect();clearTimeout(q);}}tick();if(!done){var root=document.getElementById('SITE_CONTAINER')||document.body;if(root){mo=new MutationObserver(function(){if(!q)q=setTimeout(function(){q=0;tick();},100);});mo.observe(root,{childList:true,subtree:true});}[1000,4000,8000,15000].forEach(function(ms){setTimeout(tick,ms);});setTimeout(function(){done=true;if(mo)mo.disconnect();},15000);}})();</script>"],
  ],
  // Policies: no observer at all off /policies; on /policies a debounced observer on the page container.
  'fb8963cc': [
    ['<style id="gbm-legal-styles">', '<!-- speed-2026 v2: early return off /policies, scoped observer on it --><style id="gbm-legal-styles">'],
    ['function boot(){if(install())return;var o=new MutationObserver(function(){if(install())o.disconnect()});o.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){o.disconnect()},15000)}',
     'function boot(){if(install())return;if((location.pathname||"").replace(/\\/+$/,"")!=="/policies")return;var q=0,root=document.getElementById("SITE_CONTAINER")||document.body||document.documentElement;var o=new MutationObserver(function(){if(q)return;q=setTimeout(function(){q=0;if(install())o.disconnect()},100)});o.observe(root,{childList:true,subtree:true});setTimeout(function(){o.disconnect()},15000)}'],
  ],
  // Site Fixer: the post-page observer watches the page container and runs injectAll once per animation frame.
  '5a43ae83': [
    [`    function startObserver() {
      if (!document.body) { setTimeout(startObserver, 50); return; }
      var obs = new MutationObserver(function(mutations, observer){
        if (injectAll() && injected) {
          setTimeout(function(){ injectAll(); observer.disconnect(); }, 500);
        }
      });
      obs.observe(document.body, {childList: true, subtree: true});
      setTimeout(function(){ obs.disconnect(); }, 15000);
    }`,
     `    function startObserver() {
      // v2 (speed-2026): watch the Wix page container instead of body; one injectAll per animation frame.
      var root = document.getElementById('SITE_CONTAINER') || document.body, frame = 0;
      if (!root) { setTimeout(startObserver, 50); return; }
      var obs = new MutationObserver(function(mutations, observer){
        if (frame) return;
        frame = requestAnimationFrame(function(){
          frame = 0;
          if (injectAll() && injected) {
            setTimeout(function(){ injectAll(); observer.disconnect(); }, 500);
          }
        });
      });
      obs.observe(root, {childList: true, subtree: true});
      setTimeout(function(){ obs.disconnect(); }, 15000);
    }`],
  ],
  // Inner Page UI Layer: suppressAppInvite reads body.innerText once and returns unless an app-invite phrase is on the page (the
  // per-element innerText loop only runs when it can match); the observer watches body, debounced 100 ms (was 80).
  'a13b04e3': [
    ['<!-- GBM_UI_LAYER_V1 src=2b42f09 ui=f0a2dec -->', '<!-- GBM_UI_LAYER_V1 src=2b42f09 ui=f0a2dec --><!-- speed-2026 v2: app-invite precheck, body-scoped observer -->'],
    ['function suppressAppInvite(){var all=document.querySelectorAll(\'body *\');',
     "function invitePossible(){var b=document.body,t=b?norm(b.innerText):'';return t.indexOf('join us in our app')>-1||t.indexOf('join our app')>-1||t.indexOf('open in app')>-1||(t.indexOf('spaces by wix')>-1&&t.indexOf('join')>-1);}\nfunction suppressAppInvite(){if(!invitePossible())return;var all=document.querySelectorAll('body *');"],
    ["try{var pending=false;var o=new MutationObserver(function(){if(pending)return;pending=true;setTimeout(function(){pending=false;suppressAppInvite();suppressNativeNewsletter();},80);});o.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){o.disconnect();},65000);}catch(e){}",
     "try{var pending=false;var o=new MutationObserver(function(){if(pending)return;pending=true;setTimeout(function(){pending=false;suppressAppInvite();suppressNativeNewsletter();},100);});var watch=function(){if(document.body)o.observe(document.body,{childList:true,subtree:true});else document.addEventListener('DOMContentLoaded',watch,{once:true});};watch();setTimeout(function(){o.disconnect();},65000);}catch(e){}"],
  ],
  // Sports Home core / mobile shell: 500 px logo cut; the viewport observer watches the viewport meta's content attribute and head's direct children instead of every head descendant.
  'fdc2127a': [
    ['<!-- GBM_HOME_CORE_V4 src=2b42f09 ui=f0a2dec -->', '<!-- GBM_HOME_CORE_V4 src=2b42f09 ui=f0a2dec --><!-- speed-2026 v2: scoped viewport observer, 500 px logo cut -->'],
    [`var L='${LOGO_LIVE}',S=`, `var L='${LOGO_CUT}',S=`],
    [`sync();
new MutationObserver(sync).observe(document.head,{subtree:true,childList:true,attributes:true,attributeFilter:['content']});`,
     `sync();
// v2 (speed-2026): observe the viewport meta's content attribute, and head's direct children only for an added or removed
// <meta> (a replaced viewport tag), instead of every attribute and node change under <head>.
var mo=new MutationObserver(sync),meta=null;
function watch(){var m=document.querySelector('meta[name="viewport"]');if(m&&m!==meta){meta=m;mo.observe(m,{attributes:true,attributeFilter:['content']});}}
function metaIn(l){for(var i=0;i<l.length;i++)if(l[i].nodeName==='META')return true;return false;}
watch();new MutationObserver(function(rs){for(var i=0;i<rs.length;i++)if(metaIn(rs[i].addedNodes)||metaIn(rs[i].removedNodes)){watch();sync();return;}}).observe(document.head,{childList:true});`],
  ],
};

const out = {};
for (const [id, edits] of Object.entries(EDITS)) {
  let html = readFileSync(join(here, id + '-live.html'), 'utf8');
  for (const [from, to] of edits) {
    const n = html.split(from).length - 1;
    if (n !== 1) throw new Error(`${id}: edit matched ${n} times, expected 1: ${from.slice(0, 80)}`);
    html = html.replace(from, () => to);
  }
  if (html.length > 15000) throw new Error(`${id}: ${html.length} chars, over the 15,000 cap`);
  writeFileSync(join(here, id + '-v2.html'), html);
  out[id] = { length: html.length, djb2: djb2(html) };
}
console.log(JSON.stringify(out, null, 1));
