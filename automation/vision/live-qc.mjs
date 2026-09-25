import { chromium, devices } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT='build/live-site-vision';
mkdirSync(OUT,{recursive:true});

const TARGETS=[
  {
    name:'home',
    url:'https://www.gatorbaitmedia.com/',
    root:'#gbm-live',
    expectedText:"The Cowboy Doesn’t Talk Very Often But His Actions Speak Even Louder"
  },
  {
    name:'magazine',
    url:'https://www.gatorbaitmedia.com/magazine',
    root:'#gbm-magazine-page',
    expectedText:"The Cowboy Doesn’t Talk Very Often But His Actions Speak Even Louder"
  },
  {
    name:'article',
    url:"https://www.gatorbaitmedia.com/post/the-cowboy-doesn-t-talk-very-often-but-his-actions-speak-even-louder",
    root:null,
    expectedText:"The Cowboy Doesn’t Talk Very Often But His Actions Speak Even Louder"
  }
];

const PROFILES=[
  {name:'phone320',context:{...devices['iPhone 13'],viewport:{width:320,height:740}}},
  {name:'phone390',context:{...devices['iPhone 13'],viewport:{width:390,height:844}}},
  {name:'phone430',context:{...devices['iPhone 14 Pro Max'],viewport:{width:430,height:932}}},
  {name:'desktop',context:{viewport:{width:1365,height:900},deviceScaleFactor:1}}
];

function audit(target){
  const root=target.root?document.querySelector(target.root):null;
  const nativePages=document.querySelector('#SITE_PAGES');
  const bodyText=(document.body?.innerText||'').replace(/\s+/g,' ').trim();
  const viewport=innerWidth;
  const visible=el=>{
    if(!el)return false;
    const s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>0&&r.width>0&&r.height>0;
  };

  const images=[...document.images].map(img=>{
    const r=img.getBoundingClientRect();
    return {
      src:(img.currentSrc||img.src||'').slice(0,180),
      alt:img.alt||'',
      loaded:img.complete&&img.naturalWidth>0,
      width:Math.round(r.width),
      height:Math.round(r.height),
      top:Math.round(r.top+scrollY),
      visible:visible(img)
    };
  });

  const visibleImages=images.filter(i=>i.visible&&i.top<innerHeight*2);
  const headlines=[...document.querySelectorAll('h1,h2,h3')]
    .filter(visible)
    .map(el=>{
      const r=el.getBoundingClientRect();
      return {text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,180),top:Math.round(r.top+scrollY),height:Math.round(r.height)};
    })
    .filter(x=>x.text)
    .sort((a,b)=>a.top-b.top);

  const hard=[];
  const warnings=[];
  const rootPresent=target.root?Boolean(root):true;
  const rootVisible=target.root?visible(root):true;
  if(target.root&&!rootPresent)hard.push('expected presentation root missing: '+target.root);
  if(target.root&&rootPresent&&!rootVisible)hard.push('expected presentation root not visible: '+target.root);

  const nativeVisible=visible(nativePages);
  if(target.name==='home'&&rootVisible&&nativeVisible)hard.push('home custom surface and native #SITE_PAGES are both visible');
  if(target.name==='magazine'&&rootVisible&&nativeVisible)hard.push('Magazine custom surface and native #SITE_PAGES are both visible');

  const sideways=document.documentElement.scrollWidth>viewport+2;
  if(sideways)hard.push('document scrollWidth exceeds viewport');

  const textMatch=bodyText.toLowerCase().includes(target.expectedText.toLowerCase());
  if(!textMatch)hard.push('expected current story text missing');

  if(visibleImages.length&&visibleImages.some(i=>!i.loaded))hard.push('visible image failed to load in first two screens');
  if(!visibleImages.length)warnings.push('no visible image detected in first two screens');

  const first=headlines[0]||null;
  if(!first)hard.push('no visible headline detected');
  else if(first.top>innerHeight*1.25)warnings.push('first visible headline starts below first screen');

  let small=0;
  for(const el of document.querySelectorAll('a,button,[role="button"]')){
    if(!visible(el))continue;
    const r=el.getBoundingClientRect();
    if(r.height<44||r.width<24)small++;
  }
  if(small>10)warnings.push(small+' interactive targets below 44px guideline');

  return {
    url:location.href,
    viewport:{width:innerWidth,height:innerHeight},
    layoutWidth:document.documentElement.scrollWidth,
    rootPresent,
    rootVisible,
    nativePagesVisible:nativeVisible,
    expectedTextPresent:textMatch,
    firstHeadline:first,
    visibleImages:visibleImages.slice(0,8),
    smallTapTargets:small,
    hard,
    warnings
  };
}

const browser=await chromium.launch();
const report={capturedAt:new Date().toISOString(),runs:[],hardFailureCount:0};

for(const profile of PROFILES){
  for(const target of TARGETS){
    const context=await browser.newContext(profile.context);
    const page=await context.newPage();
    const consoleErrors=[];
    page.on('pageerror',e=>consoleErrors.push(String(e).slice(0,220)));
    page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text().slice(0,220));});
    let status=null;
    try{
      const response=await page.goto(target.url,{waitUntil:'load',timeout:45000});
      status=response?.status()??null;
      await page.waitForTimeout(8000);
      const shot=OUT+'/'+target.name+'-'+profile.name+'.jpg';
      await page.screenshot({path:shot,type:'jpeg',quality:70,fullPage:false});
      const result=await page.evaluate(audit,target);
      if(status!==200)result.hard.push('HTTP status '+status);
      report.hardFailureCount+=result.hard.length;
      report.runs.push({target:target.name,profile:profile.name,status,screenshot:shot,consoleErrors:consoleErrors.slice(0,6),...result});
    }catch(error){
      report.hardFailureCount++;
      report.runs.push({target:target.name,profile:profile.name,status,error:String(error).slice(0,300),hard:['navigation/audit failed']});
    }
    await context.close();
  }
}
await browser.close();

writeFileSync(OUT+'/report.json',JSON.stringify(report,null,2));
const lines=['# GatorBait live visual QC','',report.capturedAt,''];
for(const r of report.runs){
  lines.push('## '+r.target+' · '+r.profile);
  if(r.error){lines.push('- HARD: '+r.error,'');continue;}
  lines.push('- HTTP: '+r.status);
  lines.push('- viewport: '+r.viewport.width+'×'+r.viewport.height+'; layout width '+r.layoutWidth);
  lines.push('- expected text: '+r.expectedTextPresent);
  lines.push('- presentation root: '+r.rootPresent+' / visible '+r.rootVisible);
  lines.push('- native pages visible: '+r.nativePagesVisible);
  lines.push('- first headline: '+(r.firstHeadline?('y='+r.firstHeadline.top+' — '+r.firstHeadline.text):'NONE'));
  lines.push('- visible images first two screens: '+r.visibleImages.length);
  if(r.hard.length)for(const f of r.hard)lines.push('- **HARD:** '+f);
  if(r.warnings.length)for(const f of r.warnings)lines.push('- warning: '+f);
  if(r.consoleErrors.length)lines.push('- console errors recorded: '+r.consoleErrors.length);
  lines.push('');
}
lines.push('**Hard failures: '+report.hardFailureCount+'**');
writeFileSync(OUT+'/REPORT.md',lines.join('\n'));
console.log(lines.join('\n'));
if(report.hardFailureCount)process.exit(1);
