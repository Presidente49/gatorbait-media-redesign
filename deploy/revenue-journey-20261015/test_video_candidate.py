"""Bounded local fixture: no live site or actual YouTube traffic is requested."""
import asyncio,json,pathlib,re
from playwright.async_api import async_playwright
BASE=pathlib.Path(__file__).resolve().parent
CANDIDATE=(BASE/'video-candidate.html').read_text()
FIXTURE='''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}#gbm-site-header{height:70px;background:#123;color:white}#fixture-cookie-banner{position:fixed;bottom:0;left:0;right:0;height:100px;background:white;z-index:9000}</style></head><body><header id="gbm-site-header">Fixture header</header><div id="SITE_CONTAINER">Native Wix route fixture</div><div id="fixture-cookie-banner" role="dialog" aria-label="Cookie preferences">Cookie preference controls</div>'''+CANDIDATE+'</body></html>'
MOCK='''<!doctype html><html><body><button id="play">Play fixture video</button><script>window.playhead=0;window.playing=false;document.querySelector('button').onclick=()=>{window.playing=true;window.playhead=73};addEventListener('message',e=>{try{const m=JSON.parse(e.data);if(m.func==='pauseVideo')window.playing=false}catch{}});</script></body></html>'''
async def run(browser,w):
 context=await browser.new_context(viewport={'width':w,'height':844 if w==390 else 900},is_mobile=w==390)
 loads=[]
 async def fixture(route):
  url=route.request.url
  if '/embed/' in url and 'youtube.com' in url:
   loads.append(url);await route.fulfill(status=200,content_type='text/html',body=MOCK)
  elif 'fixture.local' in url:
   await route.fulfill(status=200,content_type='text/html',body=FIXTURE)
  else:await route.abort()
 await context.route('**/*',fixture)
 page=await context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 await page.goto('https://fixture.local/the-buddy-martin-show',wait_until='domcontentloaded')
 await page.locator('#gbm-persistent-player iframe').wait_for()
 await page.wait_for_timeout(350)
 frame=page.frames[-1]
 await frame.locator('#play').click()
 await page.evaluate("window.fixtureFrame=document.querySelector('#gbm-persistent-player iframe');window.fixtureWindow=fixtureFrame.contentWindow;")
 async def nav(path):
  await page.evaluate("p=>{history.pushState({},'',p);dispatchEvent(new Event('gbmroutechange'))}",path)
  await page.wait_for_timeout(350)
 await nav('/magazine')
 # Late cookie visibility changes must reposition without scrolling or rerouting.
 await page.locator('#fixture-cookie-banner').evaluate("e=>e.style.display='none'")
 await page.wait_for_timeout(50)
 await page.locator('#fixture-cookie-banner').evaluate("e=>e.style.display='block'")
 await page.wait_for_timeout(50)
 identity=await page.evaluate("fixtureFrame===document.querySelector('#gbm-persistent-player iframe')&&fixtureWindow===fixtureFrame.contentWindow")
 state=await frame.evaluate('({playhead,playing})')
 assert identity and state=={'playhead':73,'playing':True},(identity,state)
 assert len(loads)==1,loads
 geometry=await page.evaluate("() => {const a=document.querySelector('#gbm-persistent-player iframe').getBoundingClientRect(),c=document.querySelector('#fixture-cookie-banner').getBoundingClientRect();return {x:a.x,y:a.y,w:a.width,h:a.height,bottom:a.bottom,cookieTop:c.top,viewport:innerWidth}}");assert geometry['w']>=200 and geometry['h']>=200,geometry
 assert geometry['x']>=0 and geometry['x']+geometry['w']<=w and geometry['bottom']<=geometry['cookieTop'],geometry
 await page.get_by_role('button',name='Close and pause the episode player').click()
 await page.wait_for_timeout(50)
 assert await frame.evaluate('playing') is False
 assert await page.locator('#gbm-player-restore').is_visible()
 await page.locator('#fixture-cookie-banner').evaluate("e=>e.style.height='100vh'")
 await page.wait_for_timeout(50)
 assert await page.locator('#gbm-player-restore').is_hidden()
 await page.locator('#fixture-cookie-banner').evaluate("e=>e.style.height='100px'")
 await page.wait_for_timeout(50)
 assert await page.locator('#gbm-player-restore').is_visible()
 await nav('/the-buddy-martin-show')
 assert await page.locator('#gbm-persistent-player').is_hidden()
 assert await page.get_by_role('button',name='Restore episode player',exact=True).is_visible()
 await page.get_by_role('button',name='Restore episode player',exact=True).click()
 assert await frame.evaluate('({playhead,playing})')=={'playhead':73,'playing':False}
 assert await page.evaluate('fixtureWindow===fixtureFrame.contentWindow')
 assert len(loads)==1
 # Repeated route renders must not reset the player's browsing context or source.
 await nav('/contact');await nav('/the-buddy-martin-show')
 assert await page.evaluate('fixtureFrame===document.querySelector("#gbm-persistent-player iframe")&&fixtureWindow===fixtureFrame.contentWindow')
 assert len(loads)==1,loads
 assert not errors,errors
 receipt={'viewport':w,'sameIframeAndWindow':identity,'playheadPreserved':state['playhead'],'playingAcrossSpaDeparture':state['playing'],'lateCookieRepositioned':True,'restoreRespectedFullscreenConsent':True,'closePaused':True,'restoreDidNotAutoplay':True,'returnAfterDismissalStayedClosed':True,'iframeLoadsAfterRepeatedRoutes':len(loads),'dockGeometry':geometry,'errors':errors}
 await context.close();return receipt
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  receipts=[await run(browser,w) for w in [390,1366]]
  await browser.close()
  (BASE/'video-candidate-test.json').write_text(json.dumps({'fixtureOnly':True,'notRealYoutubePlaybackProof':True,'checks':receipts},indent=2))
  print(json.dumps(receipts))
asyncio.run(main())
