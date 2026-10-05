// Targeted landing-page repair QA through the existing live-shots workflow.
import {chromium,devices} from 'playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const request=JSON.parse(readFileSync('automation/vision/live-shots.request.json','utf8'));
const candidate=request.mode!=='production';
const bundle=readFileSync('sports-live/homepage.js','utf8'),expected=(bundle.match(/Build ([a-f0-9]{8})\./)||[])[1];
const out='build/live-shots';mkdirSync(out,{recursive:true});
const browser=await chromium.launch(),report={mode:candidate?'candidate in current live shell':'production',at:new Date().toISOString(),expected,checks:[]};
const assert=(x,s)=>{if(!x)throw Error(s)};
for(const [width,reduced] of [[320,false],[390,false],[430,false],[1366,false],[390,true]]){
 const ctx=await browser.newContext({viewport:{width,height:900},userAgent:devices[width<800?'iPhone 13':'Desktop Chrome'].userAgent,isMobile:width<800,hasTouch:width<800,deviceScaleFactor:width<800?2:1,reducedMotion:reduced?'reduce':'no-preference'});
 const page=await ctx.newPage(),r={width,reduced,errors:[],magazineRequests:0};report.checks.push(r);
 page.on('pageerror',e=>r.errors.push(String(e)));page.on('request',req=>{if(req.url().includes('/sports-live/magazine-postgame.js'))r.magazineRequests++});
 try{
  if(candidate)await page.route('**/sports-live/homepage.js',route=>route.fulfill({contentType:'text/javascript',body:bundle}));
  const res=await page.goto('https://www.gatorbaitmedia.com/?gbm_qc=landing-simple-'+(candidate?'candidate':'production'),{waitUntil:'load',timeout:60000});r.http=res.status();assert(r.http===200,'home HTTP');
  await page.locator('.fp-quick-links').waitFor({timeout:40000});await page.evaluate(()=>document.fonts.ready);
  r.quick=await page.locator('.fp-quick-links a').evaluateAll(links=>links.map(a=>({text:a.textContent,href:a.getAttribute('href')})));assert(r.quick.length===3,'quick links count');assert(r.quick[0].href.endsWith('#roster')&&r.quick[1].href.endsWith('#schedule')&&r.quick[2].href==='#fp-show-schedule','quick link destinations');
  await page.screenshot({path:`${out}/quick-links-${width}${reduced?'-reduced':''}.jpg`,type:'jpeg',quality:85});
  await page.locator('.fp-quick-links a').last().click();assert(await page.locator('#fp-show-schedule').isVisible(),'show schedule destination');
  r.destinations=await page.locator('.fp-mod-scores .fp-chips a').evaluateAll(links=>links.map(a=>({text:a.textContent,href:a.getAttribute('href'),target:a.target,rel:a.rel})));
  const stats=r.destinations.find(a=>a.text.startsWith('Stats')),standings=r.destinations.find(a=>a.text.startsWith('Standings'));assert(stats.href==='https://floridagators.com/sports/football/stats'&&stats.target==='_blank','Stats destination');assert(standings.href==='https://www.secsports.com/standings/football'&&standings.target==='_blank','Standings destination');
  assert(r.magazineRequests===0,'Magazine should stay lazy before opening');
  await page.locator('.fp-mag-open').scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const i=document.querySelector('.fp-mag-open img');return i&&i.complete&&i.naturalWidth>0},{},{timeout:20000});
  r.cover=await page.evaluate(()=>{const p=document.querySelector('.fp-mag-open'),i=p.querySelector('img');return{src:i.currentSrc,transform:getComputedStyle(p).transform,transition:getComputedStyle(p).transitionDuration,build:document.querySelector('#gbm-live').dataset.fpBuild,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}});
  assert(r.cover.build===expected,'wrong build');assert(r.cover.src.includes('91f6f4d83bd14a6f8b09340c5079040a~mv2.jpg'),'First Loss cover changed');assert(r.cover.transform==='none'&&r.cover.transition==='0s','cover still animated');assert(r.cover.overflow===0,'closed overflow');
  await page.screenshot({path:`${out}/cover-${width}${reduced?'-reduced':''}.jpg`,type:'jpeg',quality:85});
  if(width>=1000)await page.locator('.fp-mag-open').press('Enter');else await page.locator('.fp-mag-open').click();
  await page.locator('.fp-mag-close').waitFor({state:'visible'});
  const handle=await page.locator('#fp-mag-reader iframe').elementHandle(),frame=await handle.contentFrame();
  await frame.locator('#gbm-magazine-page.pm-opened').waitFor({timeout:40000});await frame.evaluate(()=>document.fonts.ready);
  r.opened=await frame.evaluate(()=>({top:scrollY,root:!!document.querySelector('#gbm-magazine-page'),contentsTop:document.querySelector('#pm-contents').getBoundingClientRect().top,entryDisplay:getComputedStyle(document.querySelector('.pm-entrance')).display,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,stories:document.querySelectorAll('.pm-it').length}));
  assert(r.opened.root&&r.opened.top<=2,'reader not at top');assert(r.opened.entryDisplay==='none','second cover should not need another spin');assert(r.opened.overflow===0,'iframe overflow');assert(r.opened.stories>=9,'issue content missing');
  await page.screenshot({path:`${out}/opened-${width}${reduced?'-reduced':''}.jpg`,type:'jpeg',quality:85});
  await frame.evaluate(()=>scrollTo(0,1000));await page.locator('.fp-mag-close').click();assert(await page.locator('.fp-mag-open').isVisible(),'close did not restore cover');assert(!await page.locator('#fp-mag-reader').isVisible(),'reader not hidden');
  await page.locator('.fp-mag-open').click();await page.locator('.fp-mag-close').waitFor({state:'visible'});r.reopenTop=await frame.evaluate(()=>scrollY);assert(r.reopenTop<=2,'reopen not at top');assert(r.magazineRequests===1,'reopen reloaded Magazine');await page.locator('.fp-mag-close').press('Escape');assert(await page.locator('.fp-mag-open').isVisible(),'Escape close');
  r.finalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);assert(r.finalOverflow===0,'final overflow');assert(r.errors.length===0,'page errors');r.pass=true;
 }catch(e){r.pass=false;r.failure=String(e);await page.screenshot({path:`${out}/failure-${width}${reduced?'-reduced':''}.jpg`,type:'jpeg',quality:85}).catch(()=>{})}
 await ctx.close();
}
await browser.close();report.pass=report.checks.every(r=>r.pass);writeFileSync(`${out}/metrics.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
