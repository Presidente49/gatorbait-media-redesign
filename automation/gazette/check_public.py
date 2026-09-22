#!/usr/bin/env python3
"""Bounded public Wix tests. Candidate is explicitly simulated; live mode is unmodified."""
from pathlib import Path
import datetime as dt
import json
import sys
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
PHASE = json.loads((ROOT / 'automation/gazette/check-request.json').read_text())['phase']
assert PHASE in ('candidate', 'live')
OUT = ROOT / '.gazette-check'; OUT.mkdir(exist_ok=True)
BUNDLE = (ROOT / 'gazette-live/homepage.js').read_text()
DATA = (ROOT / 'gazette-live/posts.json').read_text()
DATA_URL = 'https://presidente49.github.io/gatorbait-media-redesign/gazette-live/posts.json'
HOME = 'https://www.gatorbaitmedia.com/'
checks, pages, failures = [], [], []

def check(name, ok, detail=None):
    checks.append({'name':name,'passed':bool(ok),'detail':detail})

def install_candidate(context):
    # This is a preview in a disposable browser, not a production mutation.
    context.add_init_script('window.__GBM_EDITORIAL_FILTER_V1__=1;window.__GBM_STANDALONE_NEWSROOM__=1;window.__GBM_UI_LAYER__=1;')
    context.add_init_script(BUNDLE)
    context.route(DATA_URL, lambda route: route.fulfill(status=200, content_type='application/json', body=DATA, headers={'Access-Control-Allow-Origin':'*'}))
    context.route('**/newsroom-preview/wix-live*', lambda route: route.abort() if any(route.request.url.split('?')[0].endswith('/'+n) for n in ('wix-live.js','wix-live.css','wix-live-ui.js','wix-live-ui.css')) else route.continue_())

with sync_playwright() as p:
    for engine, width in [('chromium',390),('chromium',430),('chromium',1440),('webkit',390)]:
        label = engine+'-'+str(width)
        browser = getattr(p, engine).launch()
        context = browser.new_context(viewport={'width':width,'height':900},device_scale_factor=1,reduced_motion='reduce')
        if PHASE == 'candidate': install_candidate(context)
        context.add_init_script("window.__gbgzCLS=0;try{new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__gbgzCLS+=e.value})).observe({type:'layout-shift',buffered:true})}catch(e){}")
        page = context.new_page()
        errors, network = [], []
        page.on('pageerror', lambda err: errors.append(str(err)))
        page.on('requestfailed', lambda req: network.append({'url':req.url.split('?')[0],'error':req.failure}))
        try:
            response = page.goto(HOME,wait_until='domcontentloaded',timeout=60000)
            check(label+' homepage HTTP', response.status==200, response.status)
            page.wait_for_selector('#gbm-live.gbm-gazette',timeout=25000)
            page.wait_for_timeout(6500)
            m = page.evaluate("""() => {
              const root=document.querySelector('#gbm-live.gbm-gazette');
              const visible=e=>!!e&&e.getBoundingClientRect().height>0&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden';
              const rr=root.getBoundingClientRect();
              const foot=document.getElementById('gbm-footer');
              const image=root.querySelector('[data-gbgz-image]');
              return {client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
                rootCount:document.querySelectorAll('#gbm-live').length,rootTop:rr.top,rootHeight:rr.height,
                overflow:[...root.querySelectorAll('*')].filter(visible).filter(e=>{let r=e.getBoundingClientRect();return r.left<-.5||r.right>innerWidth+.5}).slice(0,8).map(e=>({tag:e.tagName,cl:e.className})),
                headers:[document.getElementById('SITE_HEADER'),document.getElementById('gbm-mobile-shell'),root.querySelector('.gbm-header')].filter(visible).length,
                footerVisible:visible(foot),footerGap:foot?foot.getBoundingClientRect().top-rr.bottom:null,
                image:!!image&&image.complete&&image.naturalWidth>0,
                rows:root.querySelectorAll('[data-gbgz-row-link]').length,
                leadFont:getComputedStyle(root.querySelector('[data-gbgz-title]')).fontSize,
                feedSource:root.getAttribute('data-gazette-source'), newest:root.getAttribute('data-gazette-newest'),
                cls:window.__gbgzCLS,canonical:document.querySelector('link[rel=canonical]')?.href,
                noindex:[...document.querySelectorAll('meta[name=robots]')].some(n=>n.content.includes('noindex')),
                previewCopy:/Design preview|Public story excerpts/.test(root.innerText),
                adLoaders:document.querySelectorAll('script[src*="adsbygoogle.js"]').length,
                title:root.querySelector('[data-gbgz-title]').textContent,
                topArticle:root.querySelector('[data-gbgz-row-link]').href};
            }""")
            pages.append({'viewport':label,**m,'pageErrors':errors,'failedRequests':network[:15]})
            check(label+' single root',m['rootCount']==1)
            check(label+' no horizontal overflow',m['scroll']<=m['client'] and not m['overflow'],m['overflow'])
            check(label+' one visible masthead',m['headers']==1,m['headers'])
            check(label+' cover loaded',m['image'])
            check(label+' current content source',m['feedSource']=='current-feed',m['feedSource'])
            check(label+' populated publication',m['rows']>=7)
            check(label+' native canonical kept',m['canonical'] in (HOME, HOME.rstrip('/')),m['canonical'])
            check(label+' no preview metadata',not m['noindex'] and not m['previewCopy'])
            check(label+' footer follows content',m['footerVisible'] and -2 <= m['footerGap'] <= 100,m['footerGap'])
            check(label+' no duplicate ad loader',m['adLoaders']<=1,m['adLoaders'])
            if width < 820:
                check(label+' compact headline',float(m['leadFont'].replace('px',''))<=36,m['leadFont'])
                page.locator('#gbm-mobile-menu-toggle').click()
                check(label+' menu opens',page.locator('#gbm-mobile-menu-toggle').get_attribute('aria-expanded')=='true')
                page.screenshot(path=str(OUT/(label+'-menu.png')))
                page.locator('#gbm-mobile-drawer-root .gbm-ms-close').click()
                check(label+' menu closes',page.locator('#gbm-mobile-menu-toggle').get_attribute('aria-expanded')=='false')
            page.screenshot(path=str(OUT/(label+'-home.png')),full_page=True)
            # After reader interaction and idle, no second mount or late disappearance.
            page.wait_for_timeout(3000)
            check(label+' remains mounted',page.locator('#gbm-live.gbm-gazette').count()==1)
            if engine=='chromium' and width==390:
                article=m['topArticle']
                page.locator('[data-gbgz-row-link]').first.click()
                page.wait_for_url('**/post/**',timeout=30000)
                page.wait_for_timeout(3500)
                check('native article reachable','/post/' in page.url and page.locator('#gbm-live.gbm-gazette').count()==0)
                check('article content visible',page.locator('[data-hook="post-page"], [data-hook="post"], article').count()>0)
                page.screenshot(path=str(OUT/'native-article.png'))
                r=page.goto(HOME+'account/my-account',wait_until='domcontentloaded',timeout=60000)
                page.wait_for_timeout(4500)
                check('native account HTTP',r.status==200,r.status)
                check('Gazette absent on account',page.locator('#gbm-live.gbm-gazette').count()==0)
                check('account content not hidden',page.evaluate("() => [...document.querySelectorAll('input[type=password],input[type=email],[role=dialog],#PAGES_CONTAINER')].some(e=>e.getBoundingClientRect().height>0&&getComputedStyle(e).visibility!=='hidden')"))
                page.screenshot(path=str(OUT/'native-account.png'))
                r=page.goto(HOME+'pricing-plans',wait_until='domcontentloaded',timeout=60000)
                page.wait_for_timeout(3500)
                check('native membership HTTP',r.status==200,r.status)
                check('Gazette absent on membership',page.locator('#gbm-live.gbm-gazette').count()==0)
        except Exception as exc:
            failures.append({'viewport':label,'error':str(exc),'pageErrors':errors,'failedRequests':network[:15]})
            check(label+' completed runtime gate',False,str(exc))
            try: page.screenshot(path=str(OUT/(label+'-failure.png')),full_page=True)
            except Exception: pass
        finally:
            context.close(); browser.close()

report={'phase':PHASE,'timestamp':dt.datetime.now(dt.timezone.utc).isoformat(),
 'scope':'Actual public Wix pages. Candidate has explicitly isolated stylesheet/script replacement in disposable browser; live has no resource interception.',
 'checks':checks,'pages':pages,'failures':failures,'passed':sum(c['passed'] for c in checks),'total':len(checks)}
(OUT/'verification.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
if report['passed']!=report['total']: raise SystemExit('Runtime gate failed')
