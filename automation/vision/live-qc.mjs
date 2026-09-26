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

const IOS_UA=devices['iPhone 13'].userAgent;
function phone(width,height){
  return {
    userAgent:IOS_UA,
    viewport:{width,height},
    screen:{width,height},
    deviceScaleFactor:2,
    isMobile:true,
    hasTouch:true
  };
}
const PROFILES=[
  {name:'phone320',expectedWidth:320,context:phone(320,740)},
  {name:'phone390',expectedWidth:390,context:phone(390,844)},
  {name:'phone430',expectedWidth:430,context:phone(430,932)},
  {name:'desktop',expectedWidth:1365,context:{viewport:{width:1365,height:900},screen:{width:1365,height:900},deviceScaleFactor:1}}
];

function audit(input){
  const target=input.target;
  const requestedWidth=input.requestedWidth;
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

  if(Math.abs(innerWidth-requestedWidth)>4){
    hard.push('requested '+requestedWidth+'px profile rendered '+innerWidth+'px layout viewport');
  }
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

  const inspected=[];
  for(const el of document.querySelectorAll('h1,h2,h3,[data-hook],[data-testid]')){
    const txt=(el.textContent||'').replace(/\s+/g,' ').trim();
    if(!txt||!txt.toLowerCase().includes('the cowboy doesn')) continue;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    inspected.push({
      tag:el.tagName.toLowerCase(),
      id:el.id||null,
      cls:typeof el.className==='string'?el.className.slice(0,180):null,
      dataHook:el.getAttribute('data-hook'),
      dataTestid:el.getAttribute('data-testid'),
      fontSize:cs.fontSize,
      lineHeight:cs.lineHeight,
      fontFamily:cs.fontFamily,
      fontWeight:cs.fontWeight,
      width:Math.round(r.width),
      height:Math.round(r.height),
      top:Math.round(r.top+scrollY),
      visible:visible(el)
    });
  }
  const articleTitleCandidates=inspected.slice(0,12);

  const consentCandidates=[];
  for(const el of document.querySelectorAll('body *')){
    const txt=(el.textContent||'').replace(/\s+/g,' ').trim();
    if(!txt||!txt.includes('We use cookies for site performance and analytics')) continue;
    const cs=getComputedStyle(el),r=el.getBoundingClientRect();
    if(!visible(el)) continue;
    consentCandidates.push({
      tag:el.tagName.toLowerCase(),
      id:el.id||null,
      cls:typeof el.className==='string'?el.className.slice(0,180):null,
      dataHook:el.getAttribute('data-hook'),
      dataTestid:el.getAttribute('data-testid'),
      position:cs.position,
      zIndex:cs.zIndex,
      width:Math.round(r.width),
      height:Math.round(r.height),
      top:Math.round(r.top),
      bottom:Math.round(innerHeight-r.bottom)
    });
  }
  consentCandidates.sort((a,b)=>a.height-b.height);
  const consentDiagnostics=consentCandidates.slice(0,8);

  const first=headlines[0]||null;
  const firstHeadingEl=[...document.querySelectorAll('h1,h2,h3')].filter(visible).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0]||null;
  const firstBodyEl=[...document.querySelectorAll('p,li')].find(el=>visible(el)&&(el.textContent||'').trim().length>80)||null;
  const typeSample={
    heading:firstHeadingEl?{
      family:getComputedStyle(firstHeadingEl).fontFamily,
      size:getComputedStyle(firstHeadingEl).fontSize,
      weight:getComputedStyle(firstHeadingEl).fontWeight
    }:null,
    body:firstBodyEl?{
      family:getComputedStyle(firstBodyEl).fontFamily,
      size:getComputedStyle(firstBodyEl).fontSize,
      weight:getComputedStyle(firstBodyEl).fontWeight
    }:null
  };
  if(!first)hard.push('no visible headline detected');
  else if(first.top>innerHeight*1.25)warnings.push('first visible headline starts below first screen');

  // Wix consent is legally required, but the first layer still needs to behave
  // like a conventional compact publisher banner. Find the smallest visible
  // fixed/sticky container that owns Accept All + Decline All + Settings.
  let consent=null;
  const candidates=[...document.querySelectorAll('body *')].filter(el=>{
    if(!visible(el))return false;
    const text=(el.innerText||'').replace(/\s+/g,' ').trim();
    if(!text.includes('Accept All')||!text.includes('Decline All')||!text.includes('Settings'))return false;
    const pos=getComputedStyle(el).position;
    return pos==='fixed'||pos==='sticky';
  });
  candidates.sort((a,b)=>{
    const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
    return (ar.width*ar.height)-(br.width*br.height);
  });
  if(candidates[0]){
    const el=candidates[0],r=el.getBoundingClientRect();
    consent={
      height:Math.round(r.height),
      top:Math.round(r.top),
      ratio:Number((r.height/innerHeight).toFixed(3)),
      text:(el.innerText||'').replace(/\s+/g,' ').trim().slice(0,220)
    };
    if(innerWidth<=600&&consent.ratio>0.35){
      hard.push('mobile cookie consent panel consumes '+Math.round(consent.ratio*100)+'% of viewport height');
    }
    if(first){
      const hs=[...document.querySelectorAll('h1,h2,h3')].filter(visible).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];
      if(hs){
        const h=hs.getBoundingClientRect();
        const overlaps=h.bottom>r.top&&h.top<r.bottom&&h.right>r.left&&h.left<r.right;
        if(overlaps)hard.push('cookie consent panel overlaps first visible headline');
      }
    }
  }

  let small=0;
  for(const el of document.querySelectorAll('a,button,[role="button"]')){
    if(!visible(el))continue;
    const r=el.getBoundingClientRect();
    if(r.height<44||r.width<24)small++;
  }
  if(small>10)warnings.push(small+' interactive targets below 44px guideline');

  const viewportMeta=document.querySelector('meta[name="viewport"]')?.getAttribute('content')||null;
  return {
    url:location.href,
    viewportMeta,
    screen:{width:screen.width,height:screen.height},
    outer:{width:outerWidth,height:outerHeight},
    visualViewport:window.visualViewport?{width:Math.round(window.visualViewport.width),height:Math.round(window.visualViewport.height),scale:window.visualViewport.scale}:null,
    viewport:{width:innerWidth,height:innerHeight},
    layoutWidth:document.documentElement.scrollWidth,
    rootPresent,
    rootVisible,
    nativePagesVisible:nativeVisible,
    expectedTextPresent:textMatch,
    firstHeadline:first,
    typeSample,
    articleTitleCandidates,
    consentCandidates:consentDiagnostics,
    visibleImages:visibleImages.slice(0,8),
    smallTapTargets:small,
    hard,
    consent,
    warnings
  };
}

// The homepage and Magazine lead with the newest Buddy Martin post from the live feed, so the
// expected story follows that feed; the constants above remain the fallback when it is unreachable.
async function currentBuddyLead(){
  try{
    const res=await fetch('https://www.gatorbaitmedia.com/blog-feed.xml',{signal:AbortSignal.timeout(15000)});
    if(!res.ok)return null;
    const xml=await res.text();
    const decode=s=>s.replace(/^<!\[CDATA\[|\]\]>$/g,'').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
    const tag=(item,name)=>{const m=item.match(new RegExp('<'+name+'[^>]*>([\\s\\S]*?)</'+name+'>'));return m?decode(m[1]):'';};
    const posts=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>({title:tag(m[1],'title'),url:tag(m[1],'link'),author:tag(m[1],'dc:creator'),date:Date.parse(tag(m[1],'pubDate'))}))
      .filter(p=>p.title&&/^https:\/\/www\.gatorbaitmedia\.com\/post\//.test(p.url)&&Number.isFinite(p.date)).sort((a,b)=>b.date-a.date);
    return posts.find(p=>/buddy martin/i.test(p.author))||null;
  }catch{return null;}
}
const lead=await currentBuddyLead();
if(lead){
  for(const t of TARGETS)t.expectedText=lead.title;
  TARGETS.find(t=>t.name==='article').url=lead.url;
}

const browser=await chromium.launch();
const report={capturedAt:new Date().toISOString(),runs:[],hardFailureCount:0};

for(const profile of PROFILES){
  for(const target of TARGETS){
    const context=await browser.newContext(profile.context);
    const page=await context.newPage();
    const consoleErrors=[];
    const networkFailures=[];
    page.on('pageerror',e=>consoleErrors.push(String(e).slice(0,220)));
    page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text().slice(0,220));});
    page.on('requestfailed',req=>{
      networkFailures.push({url:req.url().slice(0,260),error:req.failure()?.errorText||'request failed'});
    });
    page.on('response',res=>{
      if(res.status()>=400)networkFailures.push({url:res.url().slice(0,260),status:res.status()});
    });
    let status=null;
    try{
      const response=await page.goto(target.url,{waitUntil:'load',timeout:45000});
      status=response?.status()??null;
      await page.waitForTimeout(8000);
      const shot=OUT+'/'+target.name+'-'+profile.name+'.jpg';
      await page.screenshot({path:shot,type:'jpeg',quality:70,fullPage:false});
      const result=await page.evaluate(audit,{target,requestedWidth:profile.expectedWidth});
      let viewportCandidate=null;
      if(profile.expectedWidth<=600&&Math.abs(result.viewport.width-profile.expectedWidth)>4){
        viewportCandidate=await page.evaluate(async expectedWidth=>{
          const meta=document.querySelector('meta[name="viewport"]');
          const before=meta?.getAttribute('content')||null;
          if(meta)meta.setAttribute('content','width=device-width, initial-scale=1, viewport-fit=cover');
          await new Promise(r=>setTimeout(r,750));
          const root=document.querySelector('#gbm-live,#gbm-magazine-page,#SITE_PAGES');
          const rr=root?.getBoundingClientRect();
          return {
            expectedWidth,
            metaBefore:before,
            metaAfter:meta?.getAttribute('content')||null,
            innerWidth,
            layoutWidth:document.documentElement.scrollWidth,
            screenWidth:screen.width,
            visualViewportWidth:window.visualViewport?Math.round(window.visualViewport.width):null,
            rootWidth:rr?Math.round(rr.width):null,
            horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2
          };
        },profile.expectedWidth);
        const candidateShot=OUT+'/'+target.name+'-'+profile.name+'-viewport-candidate.jpg';
        await page.screenshot({path:candidateShot,type:'jpeg',quality:70,fullPage:false});
        viewportCandidate.screenshot=candidateShot;
      }
      if(status!==200)result.hard.push('HTTP status '+status);
      // Game-day roster panel: only while the band carries the "Rosters & numbers" button.
      if(target.name==='home'&&await page.$('#gbm-gd .gd-rbtn')){
        const rp={};
        try{
          await page.waitForFunction(()=>!!window.__GBM_ROSTERS__&&typeof window.__GBM_ROSTER_UI__==='function',null,{timeout:10000}).catch(()=>{});
          const before=page.url();
          await page.click('#gbm-gd .gd-rbtn');
          await page.waitForTimeout(700);
          rp.navigatedAway=page.url()!==before;
          rp.open=await page.$eval('#gbm-rp',p=>!p.hidden&&p.getBoundingClientRect().height>0).catch(()=>false);
          if(rp.open){
            await page.fill('#gbm-rp input','13');
            await page.waitForTimeout(400);
            rp.hits13=await page.$$eval('#gbm-rp .rp-hit',els=>els.map(e=>e.textContent.replace(/\s+/g,' ').trim()));
            rp.tabs=await page.$$eval('#gbm-rp [role=tab]',els=>els.map(e=>e.textContent.trim()));
            rp.sideways=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
            rp.screenshot=OUT+'/home-'+profile.name+'-rosters.jpg';
            await page.screenshot({path:rp.screenshot,type:'jpeg',quality:70,fullPage:false});
          }
        }catch(error){rp.error=String(error).slice(0,200);}
        if(rp.navigatedAway)result.hard.push('Rosters button navigated away instead of opening the panel');
        else if(!rp.open)result.hard.push('Rosters panel did not open'+(rp.error?': '+rp.error:''));
        else if(!(rp.hits13||[]).some(h=>/\S/.test(h)))result.hard.push('Rosters number lookup returned nothing for No. 13');
        else if(rp.sideways)result.hard.push('Rosters panel causes sideways scroll');
        result.rosters=rp;
      }
      report.hardFailureCount+=result.hard.length;
      report.runs.push({target:target.name,profile:profile.name,requestedWidth:profile.expectedWidth,status,screenshot:shot,viewportCandidate,consoleErrors:consoleErrors.slice(0,6),networkFailures:networkFailures.slice(0,10),...result});
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
  lines.push('- requested/rendered viewport: '+r.requestedWidth+' / '+r.viewport.width+'×'+r.viewport.height+'; layout width '+r.layoutWidth);
  lines.push('- viewport meta: '+r.viewportMeta);
  lines.push('- screen / visual viewport: '+r.screen.width+' / '+(r.visualViewport?r.visualViewport.width:'n/a'));
  if(r.viewportCandidate)lines.push('- test-only device-width candidate: '+JSON.stringify(r.viewportCandidate));
  lines.push('- expected text: '+r.expectedTextPresent);
  lines.push('- presentation root: '+r.rootPresent+' / visible '+r.rootVisible);
  lines.push('- native pages visible: '+r.nativePagesVisible);
  lines.push('- first headline: '+(r.firstHeadline?('y='+r.firstHeadline.top+' — '+r.firstHeadline.text):'NONE'));
  if(r.typeSample)lines.push('- computed type: '+JSON.stringify(r.typeSample));
  if(r.articleTitleCandidates?.length) lines.push('- article title candidate: '+JSON.stringify(r.articleTitleCandidates[0]));
  if(r.consentCandidates?.length) lines.push('- consent candidate: '+JSON.stringify(r.consentCandidates[0]));
  lines.push('- visible images first two screens: '+r.visibleImages.length);
  if(r.consent)lines.push('- cookie consent: '+r.consent.height+'px ('+Math.round(r.consent.ratio*100)+'% of viewport height)');
  if(r.rosters)lines.push('- rosters panel: open '+r.rosters.open+'; tabs '+JSON.stringify(r.rosters.tabs||[])+'; No. 13 → '+JSON.stringify(r.rosters.hits13||[]));
  if(r.hard.length)for(const f of r.hard)lines.push('- **HARD:** '+f);
  if(r.warnings.length)for(const f of r.warnings)lines.push('- warning: '+f);
  if(r.consoleErrors.length)lines.push('- console errors recorded: '+r.consoleErrors.length);
  if(r.networkFailures?.length)lines.push('- failed/4xx network requests recorded: '+r.networkFailures.length);
  lines.push('');
}
lines.push('**Hard failures: '+report.hardFailureCount+'**');
writeFileSync(OUT+'/REPORT.md',lines.join('\n'));
console.log(lines.join('\n'));
if(report.hardFailureCount)process.exit(1);
