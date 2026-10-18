// READ-ONLY stale-story probe of live gatorbaitmedia.com. Default TLS verification.
const { chromium } = require('playwright'); const fs = require('fs');
const BASE='https://www.gatorbaitmedia.com'; fs.mkdirSync('out',{recursive:true});
const VIEWS=[{n:390,w:390,h:844,m:true},{n:1366,w:1366,h:900,m:false}];
const DUMP=()=>{const out={links:[],imgs:[],years:[],heads:[],ids:[]};
 const sec=el=>{const o=[];for(let n=el;n&&n!==document.body&&o.length<5;n=n.parentElement){o.push(n.id?'#'+n.id:(typeof n.className==='string'&&n.className.trim()?'.'+n.className.trim().split(/\s+/)[0]:n.tagName.toLowerCase()));}return o.join('<');};
 const vis=el=>{const r=el.getBoundingClientRect();return r.width>1&&r.height>1;};
 document.querySelectorAll('a[href*="/post/"]').forEach(a=>{const r=a.getBoundingClientRect();out.links.push({href:a.getAttribute('href').slice(0,140),text:(a.textContent||'').replace(/\s+/g,' ').trim().slice(0,90),y:Math.round(r.top+scrollY),vis:vis(a),sec:sec(a)});});
 document.querySelectorAll('img').forEach(i=>{const r=i.getBoundingClientRect();out.imgs.push({src:(i.currentSrc||i.src||'').slice(0,140),y:Math.round(r.top+scrollY),vis:vis(i),sec:sec(i)});});
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=n.nodeValue.replace(/\s+/g,' ').trim();if(!t)continue;const p=n.parentElement;if(!p||/SCRIPT|STYLE|NOSCRIPT/.test(p.tagName))continue;
  if(/\b(19|20)\d\d\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z.]*\s+\d{1,2}\b|\bago\b/i.test(t)&&t.length<200){const r=p.getBoundingClientRect();out.years.push({t:t.slice(0,120),y:Math.round(r.top+scrollY),vis:vis(p),sec:sec(p)});}
  if(/^H[1-4]$/.test(p.tagName)||/title|headline|hl\b/i.test(p.className||'')){const r=p.getBoundingClientRect();out.heads.push({t:t.slice(0,100),y:Math.round(r.top+scrollY),vis:vis(p),sec:sec(p)});}}
 document.querySelectorAll('[id]').forEach(e=>{if(/gbm|fp|bc/i.test(e.id))out.ids.push(e.id);});
 out.ls=Object.keys(localStorage).map(k=>[k,(localStorage.getItem(k)||'').length]);out.ss=Object.keys(sessionStorage).map(k=>[k,(sessionStorage.getItem(k)||'').length]);
 out.h=document.documentElement.scrollHeight;return out;};
(async()=>{const b=await chromium.launch();const summary={};
 for(const PG of [['allnews','/gatorbait-media-blogs'],['buddy','/gatorbait-media-blogs/categories/buddy-s-blog'],['recruit','/gatorbait-media-blogs/categories/gator-recruiting'],['football','/gatorbait-media-blogs/categories/gator-football']]) for(const v of VIEWS){
  for(const mode of ['cold','warm']){
   const ctx=mode==='cold'?await b.newContext({viewport:{width:v.w,height:v.h},isMobile:v.m,deviceScaleFactor:1}):global['wctx'+PG[0]+v.n];
   let c=ctx; if(mode==='warm'){c=global['wctx'+PG[0]+v.n];} else {global['wctx'+PG[0]+v.n]=ctx;}
   const p=await c.newPage();const net=[];
   p.on('response',async r=>{const u=r.url();if(/blog-feed|\.json|\.xml|github\.io|jsdelivr|raw\.githubusercontent|api\/|_api/.test(u)&&!/\.(woff2?|png|jpe?g|webp)/.test(u))net.push({u:u.slice(0,150),s:r.status(),age:r.headers()['age']||'',cc:(r.headers()['cache-control']||'').slice(0,40)});});
   await p.goto(BASE+PG[1]+'?cb='+Date.now(),{waitUntil:'domcontentloaded'});
   for(const t of [500,1000,2000,5000]){await p.waitForTimeout(t===500?500:t-({1000:500,2000:1000,5000:2000})[t]);await p.screenshot({path:`out/${PG[0]}-${v.n}-${mode}-${t}.jpg`,type:'jpeg',quality:55});}
   await p.waitForTimeout(3000);
   const d=await p.evaluate(DUMP);d.net=net;
   await p.screenshot({path:`out/${PG[0]}-${v.n}-${mode}-full.jpg`,type:'jpeg',quality:45,fullPage:true});
   fs.writeFileSync(`out/${PG[0]}-${v.n}-${mode}.json`,JSON.stringify(d,null,1));
   await p.close();
  }
  await global['wctx'+PG[0]+v.n].close();
 }
 // fresh context with fake populated stale storage
 const c3=await b.newContext({viewport:{width:390,height:844},isMobile:true});const p3=await c3.newPage();
 await p3.goto(BASE+'/about?cb='+Date.now(),{waitUntil:'domcontentloaded'});
 const feed=await (await fetch(BASE+'/blog-feed.xml?cb='+Date.now())).text();
 fs.writeFileSync('out/blog-feed.xml',feed);
 const gh=await (await fetch('https://presidente49.github.io/gatorbait-media-redesign/sports-live/current.json?cb='+Date.now())).text();fs.writeFileSync('out/pages-current.json',gh);
 await b.close();})();
