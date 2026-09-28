import { createRequire } from 'module'; import fs from 'fs'; import { join } from 'path';
const { chromium } = createRequire('/tmp/claude-0/-home-user/fed92d52-1701-51e0-a673-f020aa6a1fc8/scratchpad/x.js')('playwright');
const HERE=new URL('.', import.meta.url).pathname, T=join(HERE,'../blog-post-template-v1/');
const tpl=fs.readFileSync(T+'post-template-embed.html','utf8'), norm=fs.readFileSync(HERE+'normalizer-embed.html','utf8');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport:{width:1366,height:900} });
let html=fs.readFileSync(HERE+'mock-buddy.html','utf8').replace('</head>', tpl+norm+'</head>');
await p.route('https://www.gatorbaitmedia.test/**', r => { const u=new URL(r.request().url()).pathname; if(u==='/post/the-sweet-music-chimes-again') return r.fulfill({contentType:'text/html; charset=utf-8', body:html}); r.fulfill({status:404,body:''}); });
await p.route(/^https:\/\/(?!www\.gatorbaitmedia\.test)/, r => r.abort());
await p.goto('https://www.gatorbaitmedia.test/post/the-sweet-music-chimes-again'); await p.waitForTimeout(600);
const st=()=>p.evaluate(()=>{const d=document.querySelector('[data-hook=post-description]');return {unbold:document.documentElement.hasAttribute('data-gbm-unbold'),empties:d.querySelectorAll('[data-gbm-empty]').length,heads:d.querySelectorAll('[data-gbm-h]').length,meta:d.querySelectorAll('[data-gbm-meta]').length};});
console.log('loaded', JSON.stringify(await st()));
// frame sampler: count frames where the article is re-rendered without our tags
await p.evaluate(()=>{window.__bad=0;const t=()=>{const d=document.querySelector('[data-hook=post-description]');if(d&&!d.querySelector('[data-gbm-empty]'))window.__bad++;requestAnimationFrame(t);};requestAnimationFrame(t);});
// Simulate hydration: replace the whole description with a clean clone (all our attributes stripped)
for(let k=0;k<3;k++){ await p.evaluate(()=>{const d=document.querySelector('[data-hook=post-description]');const c=d.cloneNode(true);c.querySelectorAll('*').forEach(e=>{[...e.attributes].forEach(a=>{if(a.name.startsWith('data-gbm'))e.removeAttribute(a.name);});});document.documentElement.removeAttribute('data-gbm-unbold');d.replaceWith(c);}); await p.waitForTimeout(200); }
console.log('after 3 re-renders', JSON.stringify(await st()), 'untagged frames:', await p.evaluate(()=>window.__bad));
// Cost: 200 unrelated mutations (ads etc.) should not rescan
const ms=await p.evaluate(async()=>{const t0=performance.now();for(let i=0;i<200;i++){const x=document.createElement('div');document.body.appendChild(x);await Promise.resolve();x.remove();await Promise.resolve();}return Math.round(performance.now()-t0);});
console.log('200 unrelated mutations took', ms, 'ms');
await b.close();
