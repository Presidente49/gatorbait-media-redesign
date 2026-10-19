import asyncio,json,re,time,sys
from pathlib import Path
from playwright.async_api import async_playwright
MODE=sys.argv[1] if len(sys.argv)>1 else 'before'
OUT=Path('/workspace/scratch/homepage-mobile-style-20261019')/MODE
OUT.mkdir(exist_ok=True)
JS=Path('/workspace/gatorbait-trivia-20261019/sports-live/broadcast-home-color.js').read_text()
CONFIG=Path('/workspace/gatorbait-trivia-20261019/sports-live/front-page.config.json').read_text()
async def run():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  async def check(w):
   opt={**p.devices['iPhone 13'],'viewport':{'width':w,'height':1000},'device_scale_factor':1} if w<=820 else {'viewport':{'width':w,'height':1000},'device_scale_factor':1}
   ctx=await b.new_context(**opt);page=await ctx.new_page();errors=[];hits=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   async def candidate(route):
    hits.append(route.request.url)
    await route.fulfill(status=200,content_type='application/javascript',body=JS)
   if MODE!='before': await page.route(re.compile(r'/sports-live/broadcast-home-color\.js(?:\?|$)'),candidate)
   # config remains production-owned and is read live
   try:
    await page.goto('https://www.gatorbaitmedia.com/?muse-candidate='+str(w)+'-'+str(int(time.time())),wait_until='domcontentloaded',timeout=60000)
    await page.wait_for_selector('#gbm-live .bc-photo-rows',timeout=30000)
    await page.wait_for_function("document.querySelector('#gbm-live').classList.contains('bc-fresh-news')",timeout=25000)
    await page.evaluate('document.fonts.ready');await page.wait_for_timeout(800)
    result=await page.evaluate('''() => {const root=document.querySelector('#gbm-live'),lead=root.querySelector('.bc-hero .sh-lead a[href]'),rows=[...root.querySelectorAll('.bc-photo-rows .bc-row')];const lo=root.querySelector('.sh-lower>div:has(.sh-coverage)');return {width:innerWidth,documentWidth:document.documentElement.scrollWidth,rootWidth:root.scrollWidth,fresh:root.classList.contains('bc-fresh-news'),lead:lead&&new URL(lead.href).pathname,rows:rows.map(r=>{const a=r.querySelector('a'),im=r.querySelector('img'),t=r.querySelector('time');return {title:r.querySelector('h3').textContent,path:new URL(a.href).pathname,byline:r.querySelector('.bc-by').textContent,datetime:t.dateTime,src:im.currentSrc||im.src,alt:im.alt,loaded:im.complete&&im.naturalWidth>0,credit:r.querySelector('.bc-credit')?.textContent||''}}),coverageHidden:lo&&getComputedStyle(lo).display==='none',sourceLinks:[...root.querySelectorAll('.bc-photo-sources a')].map(a=>a.href),nestedAnchors:root.querySelectorAll('.bc-run a a').length,footballLabel:root.querySelector('.bc-lbl')?.textContent,footballNext:root.querySelector('.bc-tag')?.textContent,score:[...root.querySelectorAll('.bc-sc .bc-tm')].map(r=>r.innerText.replace(/\\n/g,' ')),tagRect:root.querySelector('.bc-tag')?.getBoundingClientRect().toJSON()}}''')
    dates=[r['datetime'] for r in result['rows']];paths=[r['path'] for r in result['rows']]
    result['checks']={'intercepted':len(hits)>0,'eight_rows':len(paths)==8,'newest_first':dates==sorted(dates,reverse=True),'unique':len(paths)==len(set(paths)),'lead_excluded':result['lead'] not in paths,'all_loaded':all(r['loaded'] for r in result['rows']),'no_document_overflow':result['documentWidth']<=w,'only_wix_fit':all('static.wixstatic.com/media/' in r['src'] and '/v1/fit/w_480,h_320' in r['src'] for r in result['rows']),'all_credited':all(r['credit'] and r['credit'] in r['alt'] for r in result['rows']),'linked_sources':result['sourceLinks']==['https://floridagators.com/','https://www.instagram.com/hannahmorganphoto/','https://floridagators.com/galleries'] and result['nestedAnchors']==0,'coverage_replaced':result['coverageHidden'],'football_labels':result['footballLabel'].startswith('Football · Final') and result['footballNext'].startswith('Football · Next up')}
    result['heroHTML']=await page.locator('#gbm-live .bc-hero').evaluate('(e)=>e.outerHTML')
    result['layout']=await page.evaluate('''()=>Object.fromEntries(['.bc-hero','.sh-lead','h1','.sh-lead img','.sh-lead-copy','.bc-sc','.bc-nx','.bc-body','.bc-run','.bc-row a','.bc-side'].map(s=>{let e=document.querySelector('#gbm-live '+s),r=e.getBoundingClientRect(),c=getComputedStyle(e);return[s,{x:r.x,y:r.y,w:r.width,h:r.height,font:c.font,fontFamily:c.fontFamily,display:c.display,position:c.position,color:c.color,background:c.background,grid:c.gridTemplateColumns}]}))''')
    await page.screenshot(path=str(OUT/f'{w}-top.png'))
    await page.locator('#gbm-live .bc-run').screenshot(path=str(OUT/f'{w}-rundown.png'))
    first=page.locator('#gbm-live .bc-photo-rows .bc-row a').first;await first.focus();result['keyboard_focus']=await first.evaluate('(a)=>document.activeElement===a')
    result['script_hits']=hits;result['page_errors']=errors
   except Exception as e:
    result={'width':w,'error':str(e),'script_hits':hits,'page_errors':errors}
    await page.screenshot(path=str(OUT/f'{w}-error.png'))
   await ctx.close();(OUT/f'{w}.json').write_text(json.dumps(result,indent=2));print(json.dumps({'width':w,'checks':result.get('checks'),'error':result.get('error')}),flush=True);return result
  results=[]
  for group in [(320,390,430),(820,1366,1920)]:results+=await asyncio.gather(*(check(w) for w in group))
  (OUT/'qc.json').write_text(json.dumps(results,indent=2));await b.close()
asyncio.run(run())
