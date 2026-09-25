import { chromium } from '../../vendor/colorlib-email-templates/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const input=process.argv[2]||'build/newsletter/gatorbait-magazine.html';
const outDir=process.argv[3]||'build/newsletter';
mkdirSync(outDir,{recursive:true});

const profiles=[
  {name:'mobile390',width:390,height:844},
  {name:'desktop1000',width:1000,height:900}
];

const browser=await chromium.launch({channel:'chrome',headless:true});
const report={input,runs:[],hardFailureCount:0};

try{
  for(const profile of profiles){
    const context=await browser.newContext({
      viewport:{width:profile.width,height:profile.height},
      screen:{width:profile.width,height:profile.height},
      deviceScaleFactor:1
    });
    const page=await context.newPage();
    const failed=[];
    page.on('requestfailed',r=>failed.push({url:r.url().slice(0,220),error:r.failure()?.errorText||'failed'}));
    page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url().slice(0,220),status:r.status()});});

    await page.goto('file://'+resolve(input),{waitUntil:'load',timeout:45000});
    await page.evaluate(async()=>{
      if(document.fonts?.ready)await document.fonts.ready;
      await Promise.all([...document.images].map(img=>img.complete?Promise.resolve():new Promise(res=>{
        img.addEventListener('load',res,{once:true});img.addEventListener('error',res,{once:true});
      })));
    });
    await page.waitForTimeout(1500);

    const audit=await page.evaluate(()=>{
      const text=(document.body?.innerText||'').replace(/\s+/g,' ').trim();
      const images=[...document.images].map(img=>({
        src:(img.currentSrc||img.src||'').slice(0,200),
        alt:img.alt||'',
        loaded:img.complete&&img.naturalWidth>0,
        naturalWidth:img.naturalWidth,
        naturalHeight:img.naturalHeight
      }));
      const hard=[];
      if(document.documentElement.scrollWidth>innerWidth+2)hard.push('horizontal overflow');
      if(!text.includes('GATORBAIT MAGAZINE NEWSLETTER'))hard.push('newsletter masthead missing');
      if(!text.includes('The Swamp Knows Something the Big Ten Doesn’t'))hard.push('Buddy lead missing');
      if(!text.includes('YOUR OLE MISS GAME FILE'))hard.push('game-file section missing');
      if(images.length!==2)hard.push('expected exactly 2 images, found '+images.length);
      if(images.some(i=>!i.loaded))hard.push('one or more images failed to load');
      return {
        viewport:{width:innerWidth,height:innerHeight},
        layoutWidth:document.documentElement.scrollWidth,
        bodyWidth:Math.round(document.body.getBoundingClientRect().width),
        documentHeight:document.documentElement.scrollHeight,
        images,
        hard
      };
    });

    report.hardFailureCount+=audit.hard.length;
    const screenshot=outDir+'/preview-'+profile.name+'.jpg';
    await page.screenshot({path:screenshot,type:'jpeg',quality:82,fullPage:true});
    report.runs.push({profile:profile.name,screenshot,networkFailures:failed.slice(0,10),...audit});
    await context.close();
  }
}finally{
  await browser.close();
}

writeFileSync(outDir+'/preview-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(report.hardFailureCount)process.exit(1);
