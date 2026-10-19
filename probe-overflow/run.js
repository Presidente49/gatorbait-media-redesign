// READ-ONLY overflow probe of live gatorbaitmedia.com. Default TLS verification. No writes.
const { chromium, webkit, devices } = require('playwright'); const fs = require('fs');
const BASE='https://www.gatorbaitmedia.com'; fs.mkdirSync('out',{recursive:true});
const MEASURE=()=>{
 const de=document.documentElement, vv=window.visualViewport;
 const meta=(document.querySelector('meta[name=viewport]')||{}).content||null;
 const vw=window.innerWidth; const off=[];
 document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return;
  if(r.right>vw+1||r.left<-1){let fixedAnc=null,clip=null;for(let n=e;n&&n!==document.documentElement;n=n.parentElement){const cs=getComputedStyle(n);if(!fixedAnc&&(cs.position==='fixed'||cs.position==='sticky'))fixedAnc=n.tagName+'#'+n.id;if(!clip&&/hidden|clip/.test(cs.overflowX)&&n!==e){clip=n.tagName+'#'+n.id+'.'+String(n.className).slice(0,40);}}
   off.push({tag:e.tagName,id:e.id,cls:String(e.className).slice(0,60),l:Math.round(r.left),r:Math.round(r.right),w:Math.round(r.width),anim:getComputedStyle(e).animationName,tf:getComputedStyle(e).transform.slice(0,40),fixedAnc,clipAnc:clip});}});
 off.sort((a,b)=>b.r-a.r);
 const bs=getComputedStyle(document.body),hs=getComputedStyle(de);
 return {meta,innerWidth:vw,clientWidth:de.clientWidth,docScrollWidth:de.scrollWidth,bodyScrollWidth:document.body.scrollWidth,
  vvScale:vv&&vv.scale,vvWidth:vv&&vv.width,vvPageLeft:vv&&vv.pageLeft,dpr:devicePixelRatio,
  htmlOverflowX:hs.overflowX,bodyOverflowX:bs.overflowX,htmlOverflowY:hs.overflowY,bodyOverflowY:bs.overflowY,
  canScrollX:(()=>{const x=scrollX;scrollTo(500,scrollY);const m=scrollX;scrollTo(x,scrollY);return m;})(),
  offCount:off.length,widest:off.slice(0,8)};};
(async()=>{
 const feed=await (await fetch(BASE+'/blog-feed.xml?cb='+Date.now())).text(); fs.writeFileSync('out/blog-feed.xml',feed);
 let urls=[...feed.matchAll(/<link>(https:\/\/www\.gatorbaitmedia\.com\/post\/[^<]+)<\/link>/g)].map(m=>m[1]);
 urls=[...new Set(urls)]; const bm=urls.find(u=>/buddy-martin-show-replay/.test(u));
 const pick=urls.slice(0,3); if(bm&&!pick.includes(bm))pick.push(bm);
 const targets=[['home',BASE+'/']].concat(pick.map((u,i)=>['post'+i,u]));
 const res=[];
 for(const eng of ['webkit','chromium']){
  const B=eng==='webkit'?webkit:chromium; const br=await B.launch();
  for(const w of [390,430]){
   const h=w===390?844:932;
   const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:true,hasTouch:true,deviceScaleFactor:2,userAgent:devices['iPhone 14'].userAgent});
   for(const [n,u] of targets){const p=await ctx.newPage();
    try{await p.goto(u+(u.includes('?')?'&':'?')+'cb='+Date.now(),{waitUntil:'load',timeout:45000});await p.waitForTimeout(4000);
     const m=await p.evaluate(MEASURE);
     // hide candidate ticker/offscreen widest and re-measure to attribute cause
     const top=m.widest[0];
     let after=null;
     if(top){after=await p.evaluate(({id,cls,tag})=>{const sel=id?'#'+CSS.escape(id):tag.toLowerCase()+'.'+cls.split(/\s+/)[0];const e=document.querySelector(sel);if(!e)return {note:'nosel '+sel};e.style.display='none';return {sel,docScrollWidth:document.documentElement.scrollWidth};},top);}
     await p.screenshot({path:`out/${eng}-${w}-${n}.jpg`,type:'jpeg',quality:50});
     res.push({eng,w,n,u,status:'ok',m,after});
    }catch(e){res.push({eng,w,n,u,error:String(e).slice(0,200)});}
    await p.close();}
   await ctx.close();}
  await br.close();}
 fs.writeFileSync('out/results.json',JSON.stringify(res,null,1));
})();
