import {createRequire} from 'node:module';
import {readFileSync,mkdirSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT || 'playwright');
const bundle=readFileSync(new URL('./magazine.js',import.meta.url),'utf8');
const out=new URL('../build/magazine-reader-qa/',import.meta.url).pathname;mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const assert=(condition,message)=>{if(!condition)throw Error(message);};
for(const width of [320,390,430,1366]){
 const page=await browser.newPage({viewport:{width,height:900}});
 await page.route('https://www.gatorbaitmedia.com/magazine',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><div id="SITE_CONTAINER"><div id="masterPage"><div id="PAGES_CONTAINER"><div id="SITE_PAGES_TRANSITION_GROUP"><div id="SITE_PAGES"></div></div></div></div></div><script>'+bundle+'</script>'}));
 await page.goto('https://www.gatorbaitmedia.com/magazine');
 await page.locator('.mz-passport').waitFor();await page.evaluate(()=>document.fonts.ready);
 const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,count:document.querySelectorAll('.mz-full-story').length,credits:document.querySelectorAll('.mz-body-photo figcaption').length,cover:(()=>{const a=document.querySelector('.mz-cover').getBoundingClientRect(),b=document.querySelector('.mz-cover-type').getBoundingClientRect();return b.bottom<=a.bottom+1})()}));
 assert(!metrics.overflow,'overflow '+width);assert(metrics.count===6,'missing article');assert(metrics.credits===5,'credit count');assert(metrics.cover,'clipped cover');
 await page.screenshot({path:out+'cover-'+width+'.png'});
 await page.locator('.mz-passport a').click();await page.locator('.mz-story-nav').first().scrollIntoViewIfNeeded();await page.waitForTimeout(2300);
 assert((await page.locator('.mz-passport span').first().innerText()).startsWith('1 of 6'),'passport end '+width);
 await page.reload();assert((await page.locator('.mz-passport span').first().innerText()).startsWith('1 of 6'),'resume storage');
 await page.addStyleTag({content:'#gbm-magazine-page.mz26{font-size:32px}#gbm-magazine-page.mz26 .mz-cover h1{font-size:72px}#gbm-magazine-page.mz26 .mz-cover .mz-dek{font-size:30px}'});
 assert(await page.evaluate(()=>document.querySelector('.mz-cover-type').getBoundingClientRect().bottom<=document.querySelector('.mz-cover').getBoundingClientRect().bottom+1),'enlarged cover');
 if(width===1366){await page.reload();await page.pdf({path:out+'full-issue.pdf',format:'A4',printBackground:true});}
 console.log('PASS same build width '+width+': 6 articles, 5 credits, cover growth, progress/reload.');await page.close();
}
await browser.close();
