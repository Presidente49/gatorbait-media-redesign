// Read-only phone render of one live post. Prints a JSON report; saves screenshots to build/post-probe.
import {chromium, devices} from 'playwright';
import fs from 'node:fs';
const URL_=process.env.PROBE_URL||'https://www.gatorbaitmedia.com/post/florida-basketball-urban-renewal-klavzar-aberdeen-stetson-exhibition';
const OUT='build/post-probe'; fs.mkdirSync(OUT,{recursive:true});
const UA=devices['iPhone 13'].userAgent;
const phone=(w,h)=>({userAgent:UA,viewport:{width:w,height:h},screen:{width:w,height:h},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const profiles=[{name:'phone390',ctx:phone(390,844)},{name:'phone430',ctx:phone(430,932)},{name:'desktop1366',ctx:{viewport:{width:1366,height:900},screen:{width:1366,height:900},deviceScaleFactor:1}},{name:'desktop1920',ctx:{viewport:{width:1920,height:1080},screen:{width:1920,height:1080},deviceScaleFactor:1}}];
const browser=await chromium.launch();
const report=[];
for(const p of profiles){
  const context=await browser.newContext(p.ctx);
  const page=await context.newPage();
  const url=URL_+(URL_.includes('?')?'&':'?')+'probe='+Date.now();
  await page.goto(url,{waitUntil:'networkidle',timeout:90000}).catch(e=>console.log('goto',p.name,e.message));
  await page.waitForTimeout(5000);
  await page.evaluate(()=>{for(const b of document.querySelectorAll('button')){if(/accept all/i.test(b.textContent||'')){b.click();break;}}}).catch(()=>{});
  await page.waitForTimeout(1000);
  const r=await page.evaluate(()=>{
    const vw=innerWidth; const q=s=>document.querySelector(s);
    const rect=el=>{if(!el)return null;const b=el.getBoundingClientRect();return {left:Math.round(b.left),right:Math.round(b.right),width:Math.round(b.width),height:Math.round(b.height)};};
    const title=q('[data-hook=post-title]')||q('h1');
    const header=q('[data-hook=post] > div > header');
    const kicker=header?getComputedStyle(header,'::before').content:null;
    const author=q('[data-hook=user-name]');
    const body=q('[data-hook=post-description]');
    const imgs=[...document.querySelectorAll('[data-hook=post-description] img')].map(i=>({w:Math.round(i.getBoundingClientRect().width),h:Math.round(i.getBoundingClientRect().height),right:Math.round(i.getBoundingClientRect().right),alt:(i.alt||'').slice(0,40)}));
    const txt=(body?.innerText||'');
    const hard=[];
    if(document.documentElement.scrollWidth>vw+2)hard.push('document scrollWidth '+document.documentElement.scrollWidth+' > viewport '+vw);
    const tr=rect(title); if(tr&&(tr.right>vw+1||tr.left<-1))hard.push('title outside viewport '+JSON.stringify(tr));
    imgs.forEach((i,n)=>{if(i.right>vw+1)hard.push('image '+n+' overflows: right '+i.right);});
    const br=rect(body); if(br&&vw<=600&&br.width<vw*0.82)hard.push('article column narrow: '+br.width+' of '+vw);
    return {vw,scrollWidth:document.documentElement.scrollWidth,title:title?.innerText?.slice(0,80),titleRect:tr,kicker,author:author?.innerText,byline:/By GatorBait Media Staff/.test(txt),captions:(txt.match(/Photo by Chris Spears\/GatorBait Media/g)||[]).length,coverCreditLast:/Cover photo:.*Chris Spears\/GatorBait Media\.\s*$/s.test(txt.trim()),images:imgs,bodyRect:br,hard};
  });
  const shot=OUT+'/'+p.name+'.jpg';
  await page.screenshot({path:shot,fullPage:true,type:'jpeg',quality:60}).catch(()=>{});
  report.push({profile:p.name,...r,status:r.hard.length?'FAIL':'PASS'});
  await context.close();
}
await browser.close();
console.log(JSON.stringify(report,null,2));
fs.writeFileSync(OUT+'/report.json',JSON.stringify(report,null,2));
if(report.some(r=>r.status!=='PASS'))process.exit(1);
