# Read-only actual public browser verification. Use --css-width for true390/430 CSS widths as well as default iPhone-UA device emulation.
import asyncio,json,time,re,sys,urllib.request
from pathlib import Path
from playwright.async_api import async_playwright
ROOT=Path(__file__).resolve().parents[2]
LIVE=True;CSS_WIDTH='--css-width' in sys.argv; OUT=ROOT/'deploy/broadcast-playlists-20261020'/('live-css-width' if CSS_WIDTH else 'live' if LIVE else 'candidate');OUT.mkdir(exist_ok=True)
async def main():
 results=[]
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  async def check(w):
   opts={**p.devices['iPhone 13'],'viewport':{'width':w,'height':1000},'device_scale_factor':1} if w<821 and not CSS_WIDTH else {'viewport':{'width':w,'height':1000}}
   c=await b.new_context(**opts);page=await c.new_page();errs=[];swaps=[];page.on('pageerror',lambda e:errs.append(str(e)))
   d={'width':w,'mode':'live' if LIVE else 'candidate'}
   try:
    await page.goto('https://www.gatorbaitmedia.com/the-buddy-martin-show?broadcast-qc='+str(w)+'-'+str(time.time_ns()),wait_until='domcontentloaded',timeout=65000)
    await page.wait_for_selector('#gbm-media-hub[data-bp-version="playlists-20261020"]',timeout=25000)
    await page.evaluate('document.fonts.ready');await page.wait_for_timeout(800)
    d.update(await page.locator('#gbm-media-hub').evaluate('''r=>({cssViewport:innerWidth,documentWidth:document.documentElement.scrollWidth,roots:document.querySelectorAll('#gbm-media-hub').length,heading:r.querySelector('h1').textContent,sections:[...r.querySelectorAll('.bp-module')].map(e=>({id:e.id,title:e.querySelector('h2').textContent})),iframesOnLoad:r.querySelectorAll('iframe').length,overflow:document.documentElement.scrollWidth-innerWidth,links:[...r.querySelectorAll('a')].map(a=>({text:a.textContent,url:a.href})),controls:[...r.querySelectorAll('button,a')].filter(e=>e.getBoundingClientRect().height).map(e=>({text:e.textContent.trim(),height:e.getBoundingClientRect().height})),font:getComputedStyle(r.querySelector('h1')).fontFamily,posterBackground:getComputedStyle(r.querySelector('.bp-poster')).backgroundImage,headerOrder:[...document.body.children].filter(e=>['gbm-site-header','gbm-mobile-shell-host','gbm-media-hub'].includes(e.id)).map(e=>e.id),nativeDisplay:getComputedStyle(document.querySelector('#SITE_CONTAINER')).display,inlineSource:document.querySelector('script[data-gbm-source]')?.dataset.gbmSource,scripts:[...document.scripts].map(s=>s.src).filter(s=>s.includes('broadcast-playlists'))})'''))
    assert d['roots']==1 and d['iframesOnLoad']==0 and d['overflow']<=1,d
    assert d['inlineSource']=='fa039be6f297d29a1849b38e4a52fd6638b3980a'
    assert 'linear-gradient' in d['posterBackground'] and 'GBMHubBarlow' in d['font']
    assert [s['id'] for s in d['sections']]==['lowdown','podcasts','shorts']
    assert d['headerOrder'][-1]=='gbm-media-hub'
    assert min(e['height'] for e in d['controls'])>=44
    await page.screenshot(path=str(OUT/f'{w}-top.png'))
    await page.locator('.bp-programs').screenshot(path=str(OUT/f'{w}-playlists.png'))
    d['players']=[]
    for key in ['live','lowdown','podcasts','shorts']:
     await page.locator('[data-bp-load="'+key+'"]').click()
     frame=page.locator('#gbm-media-hub iframe');assert await frame.count()==1
     src=await frame.get_attribute('src');assert 'autoplay=0' in src and 'playsinline=1' in src
     assert ('live_stream?channel=UCtR8b1sKFuwaRjKy5BiXRvA' if key=='live' else 'videoseries?list=') in src
     d['players'].append({'key':key,'src':src,'title':await frame.get_attribute('title')})
    await page.locator('[data-bp-close="shorts"]').click();assert await page.locator('#gbm-media-hub iframe').count()==0
    assert await page.locator('[data-bp-load="shorts"]').evaluate('e=>e===document.activeElement')
    # Route event cleanup and remount without touching any other embed.
    await page.evaluate("history.pushState({},'', '/contact');dispatchEvent(new Event('gbmroutechange'))")
    await page.wait_for_timeout(400);assert await page.locator('#gbm-media-hub').count()==0
    await page.evaluate("history.pushState({},'', '/the-buddy-martin-show');dispatchEvent(new Event('gbmroutechange'))")
    await page.wait_for_selector('#gbm-media-hub');assert await page.locator('#gbm-media-hub').count()==1
    d['routeCleanup']=True;d['passed']=True
   except Exception as e:d['passed']=False;d['error']=str(e)[:1000]
   d['pageErrors']=errs;d['swaps']=swaps;(OUT/f'{w}.json').write_text(json.dumps(d,indent=2));print(json.dumps({'width':w,'passed':d['passed'],'error':d.get('error'),'overflow':d.get('overflow')}),flush=True);results.append(d);await c.close()
  # Two contexts at once keeps the probe light.
  for widths in ([[390,430]] if CSS_WIDTH else [[320,390],[430,1366],[1920]]):await asyncio.gather(*(check(w) for w in widths))
  await b.close()
 (OUT/'summary.json').write_text(json.dumps({'passed':all(r['passed'] for r in results),'results':results},indent=2))
 if not all(r['passed'] for r in results):sys.exit(1)
if __name__=='__main__':asyncio.run(main())
