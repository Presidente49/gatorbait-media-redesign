// Bounded QA for the October 5 homepage Magazine picture and Eddie card release.
// Runs through the existing live-shots workflow, read-only against production.
import { chromium, devices } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const request=JSON.parse(readFileSync('automation/vision/live-shots.request.json','utf8'));
const candidate=request.mode!=='production';
const home=readFileSync('sports-live/homepage.js','utf8');
const magazine=readFileSync('sports-live/magazine-postgame.js','utf8');
const expectedHome=(home.match(/Build ([a-f0-9]{8})\./)||[])[1];
const expectedMagazine=(magazine.match(/build ([a-f0-9]{8})\./)||[])[1];
const out='build/live-shots';mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
const report={mode:candidate?'candidate in live Wix shell':'published production',at:new Date().toISOString(),expectedHome,expectedMagazine,checks:[]};
const assert=(v,s)=>{if(!v)throw Error(s);};
for(const width of [320,390,430,1366]){
 for(const kind of ['home','magazine']){
 const ctx=await browser.newContext({viewport:{width,height:width<800?900:1000},userAgent:devices[width<800?'iPhone 13':'Desktop Chrome'].userAgent,isMobile:width<800,hasTouch:width<800,deviceScaleFactor:width<800?2:1,reducedMotion:'reduce'});
 const page=await ctx.newPage(),r={width,kind,errors:[]};report.checks.push(r);
 page.on('pageerror',e=>r.errors.push(String(e)));
 try{
  if(candidate){await page.route('**/sports-live/homepage.js',route=>route.fulfill({contentType:'text/javascript',body:home}));await page.route('**/sports-live/magazine-postgame.js',route=>route.fulfill({contentType:'text/javascript',body:magazine}));}
  const url='https://www.gatorbaitmedia.com/'+(kind==='magazine'?'magazine':'')+'?gbm_qc=home-mag-20261005-'+(candidate?'candidate':'live');
  const response=await page.goto(url,{waitUntil:'load',timeout:60000});r.http=response.status();assert(r.http===200,'HTTP not 200');
  const root=kind==='home'?'#gbm-live':'#gbm-magazine-page';await page.locator(root).waitFor({timeout:45000});
  await page.evaluate(()=>document.fonts.ready);
  if(kind==='home'){
   await page.locator('.fp-mag').scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>{const i=document.querySelector('.fp-mag img');return i&&i.complete&&i.naturalWidth>0},{},{timeout:20000});
   r.data=await page.evaluate(()=>{const root=document.querySelector('#gbm-live'),card=document.querySelector('.fp-mag'),image=card.querySelector('img');return{build:root.dataset.fpBuild,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,src:image.currentSrc,imageLoaded:image.complete&&image.naturalWidth>0,links:Array.from(card.querySelectorAll('a')).map(a=>a.getAttribute('href')),title:card.querySelector('.fp-cover-t strong').textContent};});
   assert(r.data.build===expectedHome,'wrong homepage build');assert(r.data.src.includes('16b519_be903de5f60d4510963f83dce1b90109~mv2.jpg'),'wrong cover source');assert(r.data.imageLoaded,'picture not loaded');assert(r.data.links.every(h=>h==='/magazine'),'wrong Magazine links');assert(r.data.title.includes('how will the Gators respond'),'wrong cover title');
   await page.screenshot({path:`${out}/home-magazine-${width}.jpg`,type:'jpeg',quality:85});
   await page.locator('.fp-mag a.fp-cover').click();await page.waitForURL('**/magazine');await page.locator('.pm-open').waitFor({timeout:30000});r.magazineLinkWorks=true;
  }else{
   await page.locator('.pm-open').waitFor({timeout:30000});await page.waitForFunction(()=>{const i=document.querySelector('.pm-poster img');return i&&i.complete&&i.naturalWidth>0},{},{timeout:20000});
   r.data=await page.evaluate(()=>{const root=document.querySelector('#gbm-magazine-page'),image=root.querySelector('.pm-poster img');return{build:root.dataset.mzBuild,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,photoLoaded:image.complete&&image.naturalWidth>0,title:root.querySelector('h1').textContent};});assert(r.data.build===expectedMagazine,'wrong Magazine build');assert(r.data.photoLoaded,'Magazine photo missing');
   await page.screenshot({path:`${out}/magazine-cover-${width}.jpg`,type:'jpeg',quality:85});
   await page.locator('.pm-open').click();await page.locator('#gbm-magazine-page.pm-opened').waitFor();
   await page.locator('.pm-it').last().scrollIntoViewIfNeeded();
   r.package=await page.evaluate(()=>{const all=Array.from(document.querySelectorAll('.pm-it')),eddie=all.filter(e=>e.querySelector('a').getAttribute('href')==='/post/florida-gave-on-saturday');return{count:all.length,eddieCount:eddie.length,lastUrl:all.at(-1).querySelector('a').getAttribute('href'),lastText:all.at(-1).textContent,next:document.querySelector('#pm-next').textContent,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};});
   assert(r.package.count===9&&r.package.eddieCount===1,'Eddie missing or duplicate');assert(r.package.lastUrl==='/post/florida-gave-on-saturday','Eddie not last');assert(r.package.lastText.includes('Eddie Gilley'),'wrong Eddie byline');assert(r.package.next.includes('12:45 p.m. ET')&&r.package.next.includes('SEC Network'),'kickoff metadata');assert(r.package.overflow===0,'opened overflow');
   await page.screenshot({path:`${out}/magazine-eddie-${width}.jpg`,type:'jpeg',quality:85});
   await page.locator('.pm-it').last().locator('a').click();await page.waitForURL('**/post/florida-gave-on-saturday');r.eddieLinkWorks=true;
  }
  assert(r.data.overflow===0,'page overflow');assert(r.errors.length===0,'page errors');r.pass=true;
 }catch(e){r.pass=false;r.failure=String(e);await page.screenshot({path:`${out}/failure-${kind}-${width}.jpg`,type:'jpeg'}).catch(()=>{});}
 await ctx.close();
 }
}
await browser.close();report.pass=report.checks.every(r=>r.pass);writeFileSync(`${out}/metrics.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
