import { createRequire } from 'module'; import fs from 'fs'; import { join } from 'path';
const { chromium } = createRequire('/tmp/claude-0/-home-user/fed92d52-1701-51e0-a673-f020aa6a1fc8/scratchpad/x.js')('playwright');
const HERE=new URL('.', import.meta.url).pathname, T=join(HERE,'../blog-post-template-v1/');
const tpl=fs.readFileSync(T+'post-template-embed.html','utf8'), norm=fs.readFileSync(HERE+'normalizer-embed.html','utf8');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [w,on] of [[1366,true],[390,true],[390,false]]) {
  const p = await b.newPage({ viewport:{width:w,height:w<800?844:900}, deviceScaleFactor: w<800?2:1 });
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  let html=fs.readFileSync(HERE+'mock-buddy.html','utf8').replace('</head>', tpl+(on?norm:'')+'</head>');
  await p.route('https://www.gatorbaitmedia.test/**', r => { const u=new URL(r.request().url()).pathname; if(u.startsWith('/post/')) return r.fulfill({contentType:'text/html; charset=utf-8', body:html}); const f=join(HERE,'../..',u); if(fs.existsSync(f)) return r.fulfill({body:fs.readFileSync(f)}); r.fulfill({status:404,body:''}); });
  await p.route(/^https:\/\/(?!www\.gatorbaitmedia\.test)/, r => r.abort());
  await p.goto('https://www.gatorbaitmedia.test/post/the-sweet-music-chimes-again'); await p.waitForTimeout(1500);
  const m = await p.evaluate(()=>{ const d=document.querySelector('[data-hook=post-description]'); const cs=e=>getComputedStyle(e);
   const para=[...d.querySelectorAll('p')].find(x=>/Maya Angelou/.test(x.textContent)); const strong=para.querySelector('strong');
   return {unbold:d.hasAttribute('data-gbm-unbold'), empties:d.querySelectorAll('[data-gbm-empty]').length, heads:[...d.querySelectorAll('[data-gbm-h]')].map(x=>x.textContent), dek:!!d.querySelector('[data-gbm-dek]'), lede:!!d.querySelector('[data-gbm-lede]'), meta:d.querySelectorAll('[data-gbm-meta]').length, bodyWeight: cs(strong).fontWeight, headFont: d.querySelector('[data-gbm-h]')?cs(d.querySelector('[data-gbm-h]')).fontFamily.split(',')[0]+' '+cs(d.querySelector('[data-gbm-h]')).fontSize:null, sw:document.documentElement.scrollWidth}; });
  console.log(w, on?'ON':'OFF', JSON.stringify(m), errs.join(';'));
  await p.screenshot({ path: HERE+`shot-${w}-${on?'on':'off'}.png`, fullPage:true });
}
await b.close();
