#!/usr/bin/env python3
"""Bounded public Wix verification; distinguish unchanged upstream access blockers."""
from pathlib import Path
import datetime as dt
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
PHASE=json.loads((ROOT/'automation/gazette/check-request.json').read_text())['phase']
assert PHASE in ('candidate','live')
OUT=ROOT/'.gazette-check';OUT.mkdir(exist_ok=True)
BUNDLE=(ROOT/'gazette-live/homepage.js').read_text()
DATA=(ROOT/'gazette-live/posts.json').read_text()
DATA_URL='https://presidente49.github.io/gatorbait-media-redesign/gazette-live/posts.json'
HOME='https://www.gatorbaitmedia.com/'
checks,pages,failures,blocked=[],[],[],[]
def check(name,ok,detail=None): checks.append({'name':name,'passed':bool(ok),'detail':detail})
def candidate(context):
 context.add_init_script('window.__GBM_EDITORIAL_FILTER_V1__=1;window.__GBM_STANDALONE_NEWSROOM__=1;window.__GBM_UI_LAYER__=1;')
 context.add_init_script(BUNDLE)
 context.route(DATA_URL,lambda r:r.fulfill(status=200,content_type='application/json',body=DATA,headers={'Access-Control-Allow-Origin':'*'}))
 context.route('**/newsroom-preview/wix-live*',lambda r:r.abort() if any(r.request.url.split('?')[0].endswith('/'+n) for n in ('wix-live.js','wix-live.css','wix-live-ui.js','wix-live-ui.css')) else r.continue_())
with sync_playwright() as p:
 baseline_browser=p.chromium.launch()
 baseline_context=baseline_browser.new_context(viewport={'width':390,'height':900})
 bp=baseline_context.new_page()
 baseline={}
 for route in ('account/my-account','pricing-plans'):
  try:
   response=bp.goto(HOME+route,wait_until='domcontentloaded',timeout=60000)
   baseline[route]=response.status
  except Exception as e:baseline[route]=str(e)
 baseline_browser.close()
 for engine,width in [('chromium',390),('chromium',430),('chromium',1440),('webkit',390)]:
  label=engine+'-'+str(width)
  browser=getattr(p,engine).launch()
  options={'viewport':{'width':width,'height':900},'device_scale_factor':1,'reduced_motion':'reduce'}
  if width<820:
   options.update(is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1')
  context=browser.new_context(**options)
  if PHASE=='candidate':candidate(context)
  context.add_init_script("window.__gbgzCLS=0;try{new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__gbgzCLS+=e.value})).observe({type:'layout-shift',buffered:true})}catch(e){}")
  page=context.new_page();errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  try:
   response=page.goto(HOME,wait_until='domcontentloaded',timeout=60000)
   check(label+' homepage HTTP',response.status==200,response.status)
   page.wait_for_selector('#gbm-live.gbm-gazette',timeout=25000)
   page.wait_for_timeout(6500)
   m=page.evaluate("""() => {
    const root=document.querySelector('#gbm-live.gbm-gazette');
    const visible=e=>!!e&&e.getBoundingClientRect().height>0&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden';
    const rr=root.getBoundingClientRect(),foot=document.getElementById('gbm-footer'),image=root.querySelector('[data-gbgz-image]');
    return {client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,documentClasses:document.documentElement.className,
     rootCount:document.querySelectorAll('#gbm-live').length,rootTop:rr.top,rootHeight:rr.height,
     overflow:[...root.querySelectorAll('*')].filter(visible).filter(e=>{let r=e.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5}).slice(0,8).map(e=>({tag:e.tagName,cl:e.className})),
     headers:[document.getElementById('SITE_HEADER'),document.getElementById('gbm-mobile-shell'),root.querySelector('.gbm-header')].filter(visible).length,
     footerVisible:visible(foot),footerGap:foot?foot.getBoundingClientRect().top-rr.bottom:null,
     image:!!image&&image.complete&&image.naturalWidth>0,rows:root.querySelectorAll('[data-gbgz-row-link]').length,
     leadFont:getComputedStyle(root.querySelector('[data-gbgz-title]')).fontSize,feedSource:root.getAttribute('data-gazette-source'),newest:root.getAttribute('data-gazette-newest'),
     cls:window.__gbgzCLS,canonical:document.querySelector('link[rel=canonical]')?.href,
     noindex:[...document.querySelectorAll('meta[name=robots]')].some(n=>n.content.includes('noindex')),
     previewCopy:/Design preview|Public story excerpts/.test(root.innerText),adLoaders:document.querySelectorAll('script[src*="adsbygoogle.js"]').length,
     title:root.querySelector('[data-gbgz-title]').textContent,topArticle:root.querySelector('[data-gbgz-row-link]').href};
   }""")
   pages.append({'viewport':label,'mobileEmulation':width<820,**m,'pageErrors':errors[:8]})
   check(label+' single root',m['rootCount']==1)
   check(label+' no horizontal overflow',m['scroll']<=m['client'] and not m['overflow'],m['overflow'])
   check(label+' one visible masthead',m['headers']==1,m['headers'])
   check(label+' cover loaded',m['image'])
   check(label+' current content',m['feedSource']=='current-feed',m['feedSource'])
   check(label+' populated publication',m['rows']>=7)
   check(label+' canonical preserved',m['canonical'] in (HOME,HOME.rstrip('/')),m['canonical'])
   check(label+' no preview metadata',not m['noindex'] and not m['previewCopy'])
   check(label+' footer follows content',m['footerVisible'] and -2<=m['footerGap']<=100,m['footerGap'])
   check(label+' no duplicate ad loader',m['adLoaders']<=1,m['adLoaders'])
   if width<820:
    check(label+' restrained headline',float(m['leadFont'].replace('px',''))<=36,m['leadFont'])
    page.locator('#gbm-mobile-menu-toggle').click()
    check(label+' menu opens',page.locator('#gbm-mobile-menu-toggle').get_attribute('aria-expanded')=='true')
    page.screenshot(path=str(OUT/(label+'-menu.png')))
    page.locator('#gbm-mobile-drawer-root .gbm-ms-close').click()
    check(label+' menu closes',page.locator('#gbm-mobile-menu-toggle').get_attribute('aria-expanded')=='false')
   page.screenshot(path=str(OUT/(label+'-home.png')),full_page=True)
   page.wait_for_timeout(3000)
   check(label+' stable mount',page.locator('#gbm-live.gbm-gazette').count()==1)
   if engine=='chromium' and width==390:
    page.locator('[data-gbgz-row-link]').first.click();page.wait_for_url('**/post/**',timeout=30000);page.wait_for_timeout(3500)
    check('native article reachable','/post/' in page.url and page.locator('#gbm-live.gbm-gazette').count()==0)
    check('native article present',page.locator('[data-hook="post-page"], [data-hook="post"], article').count()>0)
    page.screenshot(path=str(OUT/'native-article.png'))
    for route in ('account/my-account','pricing-plans'):
     r=page.goto(HOME+route,wait_until='domcontentloaded',timeout=60000);page.wait_for_timeout(3500)
     if r.status==403 and baseline.get(route)==403:
      blocked.append({'route':route,'baselineStatus':403,'candidateStatus':403,'reason':'Unmodified and candidate requests both forbidden. No account or access settings changed. Authenticated account test remains unverified.'})
     else:check(route+' reachable',r.status==200,{'baseline':baseline.get(route),'status':r.status})
     check('Gazette absent on '+route,page.locator('#gbm-live.gbm-gazette').count()==0)
     page.screenshot(path=str(OUT/('native-'+route.split('/')[0]+'.png')))
  except Exception as e:
   failures.append({'viewport':label,'error':str(e),'pageErrors':errors[:8]});check(label+' runtime gate',False,str(e))
   try:page.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True)
   except Exception:pass
  finally:context.close();browser.close()
report={'phase':PHASE,'timestamp':dt.datetime.now(dt.timezone.utc).isoformat(),'scope':'Public Wix runtime. Candidate intercepts only retired presentation assets and substitutes candidate content; live is unmodified. Device emulation is not physical iPhone testing.',
 'baselineHTTP':baseline,'blockedChecks':blocked,'checks':checks,'pages':pages,'failures':failures,'passed':sum(c['passed'] for c in checks),'total':len(checks)}
(OUT/'verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
if report['passed']!=report['total']:raise SystemExit('Runtime gate failed')
