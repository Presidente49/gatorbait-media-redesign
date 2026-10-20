# Read-only cold-load sampling; no production writes, intercepts or persistent polling.
import asyncio,json,time,sys
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[2];LIVE=True
OUT=ROOT/'deploy/broadcast-playlists-20261020'/'inline-head-live';OUT.mkdir(exist_ok=True)
INIT="""window.paintStates=[];let elapsed=0;const paintTimer=setInterval(()=>{elapsed+=50;let n=document.querySelector('#SITE_CONTAINER'),r=document.querySelector('#gbm-media-hub');let style=n?getComputedStyle(n):null;window.paintStates.push({ms:performance.now(),root:!!r,nativeDisplay:style?.display,nativeHeight:n?.getBoundingClientRect().height,nativeText:n?.innerText?.slice(0,120),nativeFlash:!!(n&&!r&&style.display!=='none'&&style.visibility!=='hidden'&&n.getBoundingClientRect().height>0&&n.innerText.includes('WELCOME TO'))});if(elapsed>=6500)clearInterval(paintTimer)},50);"""
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);results=[]
  async def check(w):
   opts={**p.devices['iPhone 13'],'viewport':{'width':w,'height':1000},'device_scale_factor':1} if w<821 else {'viewport':{'width':w,'height':1000}}
   c=await b.new_context(**opts);await c.add_init_script(INIT);page=await c.new_page()
   await page.goto('https://www.gatorbaitmedia.com/the-buddy-martin-show?head-qc='+str(w)+'-'+str(time.time_ns()),wait_until='domcontentloaded',timeout=60000)
   await page.wait_for_selector('#gbm-media-hub',timeout=20000);await page.wait_for_timeout(6700)
   states=await page.evaluate('paintStates');d={'width':w,'mode':'actual' if LIVE else 'head position candidate','nativeFlashSamples':[v for v in states if v['nativeFlash']],'firstRoot':next((v['ms'] for v in states if v['root']),None),'rootCount':await page.locator('#gbm-media-hub').count(),'overflow':await page.evaluate('document.documentElement.scrollWidth-innerWidth'),'states':states}
   await page.screenshot(path=str(OUT/f'{w}-top.png'));(OUT/f'{w}.json').write_text(json.dumps(d,indent=2));results.append(d);print(w,'flashSamples',len(d['nativeFlashSamples']),'root',d['firstRoot'],'overflow',d['overflow'],flush=True);await c.close()
  await asyncio.gather(check(390),check(1920));await b.close()
 (OUT/'summary.json').write_text(json.dumps(results,indent=2));assert all(not r['nativeFlashSamples'] and r['rootCount']==1 and r['overflow']==0 for r in results)
asyncio.run(main())
