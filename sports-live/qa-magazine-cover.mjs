// Same-build browser QA for the portrait Magazine entrance. No site writes.
import { chromium, devices } from 'playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const out='build/live-shots'; mkdirSync(out,{recursive:true});
const fixture=process.argv.includes('--fixture');
const candidate=process.argv.includes('--candidate');
const bundle=readFileSync('sports-live/magazine-postgame.js','utf8');
const expected=(bundle.match(/build ([a-f0-9]{8})\./)||[])[1];
const frame=readFileSync('sports-live/magazine-postgame-frame.html','utf8');
const url='https://www.gatorbaitmedia.com/magazine';
const browser=await chromium.launch();
const report={mode:fixture?'isolated fixture':candidate?'production shell with candidate bundle':'production',url,expected,at:new Date().toISOString(),checks:[]};
const assert=(v,label)=>{if(!v)throw Error(label);};
for(const [width,reduced] of [[320,false],[390,false],[430,false],[1366,false],[390,true]]){
 const id=width+(reduced?'-reduced':'');
 const ctx=await browser.newContext({viewport:{width,height:width<360?740:width<410?844:900},deviceScaleFactor:width<800?2:1,userAgent:devices[width<800?'iPhone 13':'Desktop Chrome'].userAgent,isMobile:width<800,hasTouch:width<800,reducedMotion:reduced?'reduce':'no-preference'});
 const page=await ctx.newPage();const result={width,reduced,errors:[]};report.checks.push(result);
 page.on('pageerror',e=>result.errors.push(String(e)));
 try{
  if(fixture)await page.route(url,route=>route.fulfill({contentType:'text/html',body:frame}));
  if(fixture||candidate)await page.route('**/sports-live/magazine-postgame.js',route=>route.fulfill({contentType:'text/javascript',body:bundle}));
  const response=await page.goto(url,{waitUntil:'load',timeout:60000});result.http=response.status();
  await page.locator('.pm-open').waitFor({state:'visible',timeout:30000});
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`${out}/cover-${id}.jpg`,type:'jpeg',quality:85});
  const accept=page.getByRole('button',{name:/^Accept( All)?$/i});if(await accept.count() && await accept.first().isVisible())await accept.first().click();
  result.cover=await page.evaluate(()=>{const d=document.documentElement,r=document.querySelector('#gbm-magazine-page'),p=r.querySelector('.pm-poster'),h=p.querySelector('h1'),b=p.querySelector('button'),i=p.querySelector('img');return{build:r.dataset.mzBuild,overflow:d.scrollWidth-d.clientWidth,ratio:p.clientWidth/p.clientHeight,title:h.textContent,headlineInside:h.getBoundingClientRect().bottom<=p.getBoundingClientRect().bottom,buttonHeight:b.clientHeight,photo:i.complete&&i.naturalWidth>0,transition:getComputedStyle(p).transitionDuration,stories:r.querySelectorAll('.pm-it').length,dateSize:parseFloat(getComputedStyle(r.querySelector('.pm-coverdate')).fontSize),creditSize:parseFloat(getComputedStyle(r.querySelector('.pm-covercredit')).fontSize)}});
  assert(result.cover.build===expected,'wrong bundle');assert(result.cover.overflow===0,'closed overflow');assert(Math.abs(result.cover.ratio-9/16)<.005,'cover ratio');assert(result.cover.headlineInside,'cover text clipping');assert(result.cover.photo,'cover image did not load');assert(result.cover.stories===7,'story package changed');assert(result.cover.dateSize>=12&&result.cover.creditSize>=12,'cover metadata too small');
  if(width>=1000) await page.locator('.pm-open').press('Enter'); else await page.locator('.pm-open').click();
  await page.locator('#gbm-magazine-page.pm-opened').waitFor();
  result.opened=await page.evaluate(()=>({focus:document.activeElement.id,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,top:document.querySelector('#pm-contents').getBoundingClientRect().top}));
  assert(result.opened.focus==='pm-contents','focus not moved to contents');assert(result.opened.overflow===0,'open overflow');
  await page.screenshot({path:`${out}/contents-${id}.jpg`,type:'jpeg',quality:85});
  await page.locator('.pm-reader-menu summary').click();
  await page.locator('.pm-reader-menu').getByRole('link',{name:'Report card',exact:true}).click();
  result.navigation=await page.evaluate(()=>({focus:document.activeElement.id,closed:!document.querySelector('.pm-reader-menu').open,top:document.querySelector('#pm-grades').getBoundingClientRect().top}));
  assert(result.navigation.focus==='pm-grades'&&result.navigation.closed,'menu navigation failed');assert(result.navigation.top>=57,'sticky bar covers target');
  await page.locator('.pm-reader-menu summary').click();await page.locator('.pm-reader-menu summary').press('Escape');
  assert(!await page.locator('.pm-reader-menu').evaluate(e=>e.open),'Escape menu close');
  await page.locator('[data-pm-cover]').click();assert(await page.locator('.pm-open').isVisible(),'return cover failed');
  await page.locator('.pm-open').press('Space');await page.locator('#gbm-magazine-page.pm-opened').waitFor();
  await page.emulateMedia({media:'print'});
  result.print=await page.evaluate(()=>({cover:getComputedStyle(document.querySelector('.pm-entrance')).display,bar:getComputedStyle(document.querySelector('.pm-readerbar')).display,story:document.querySelector('#pm-cover').getBoundingClientRect().height,stats:document.querySelector('#pm-damage').getBoundingClientRect().height}));
  assert(result.print.cover==='none'&&result.print.bar==='none'&&result.print.story>0&&result.print.stats>0,'print rules');
  if(reduced)assert(result.cover.transition==='0s','reduced motion transition');
  assert(result.errors.length===0,'page errors');result.pass=true;
 }catch(e){result.pass=false;result.failure=String(e);await page.screenshot({path:`${out}/failure-${id}.jpg`,type:'jpeg'}).catch(()=>{});}
 await ctx.close();
}
await browser.close();writeFileSync(`${out}/metrics.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
// Preserve screenshots even if a check fails; inspect metrics before promoting the build.
