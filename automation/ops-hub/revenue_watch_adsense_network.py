#!/usr/bin/env python3
"""Read-only consent-aware AdSense network diagnostic for GatorBait Revenue Watch."""
from pathlib import Path
from urllib.parse import urlparse
import json, re
from playwright.sync_api import sync_playwright

OUT = Path('.revenue-watch-adsense')
OUT.mkdir(exist_ok=True)
URL = 'https://www.gatorbaitmedia.com/post/jon-sumrall-postgame-florida-auburn'
PUBLISHER = 'ca-pub-6592453291626199'

def related(url):
    host = urlparse(url).hostname or ''
    return any(x in host for x in ('googlesyndication.com','doubleclick.net','googleadservices.com'))

def is_loader(url):
    return 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js' in url and PUBLISHER in url

def is_ad_request(url):
    u = url.lower()
    return (
        ('googlesyndication.com/pagead/ads' in u) or
        ('googleads.g.doubleclick.net/pagead/ads' in u) or
        ('securepubads.g.doubleclick.net/gampad/ads' in u)
    )

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
    page = context.new_page()
    events, console_errors, page_errors = [], [], []
    phase = {'name':'before-consent'}

    def on_request(req):
        if related(req.url):
            events.append({'type':'request','phase':phase['name'],'method':req.method,'url':req.url})
    def on_response(resp):
        if related(resp.url):
            events.append({'type':'response','phase':phase['name'],'status':resp.status,'url':resp.url})
    page.on('request', on_request)
    page.on('response', on_response)
    page.on('console', lambda msg: console_errors.append({'type':msg.type,'text':msg.text}) if msg.type in ('error','warning') else None)
    page.on('pageerror', lambda err: page_errors.append(str(err)))

    response = page.goto(URL, wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(4000)
    page.screenshot(path=str(OUT/'before-consent.png'), full_page=True)

    button_texts = []
    try:
        buttons = page.locator('button:visible')
        for i in range(min(buttons.count(), 30)):
            try:
                t = buttons.nth(i).inner_text(timeout=1000).strip()
                if t: button_texts.append(t)
            except Exception:
                pass
    except Exception:
        pass

    clicked = None
    for pattern in (r'^accept all$', r'^accept$', r'^allow all$', r'^agree$', r'^allow$'):
        candidate = page.get_by_role('button', name=re.compile(pattern, re.I))
        try:
            if candidate.count() and candidate.first.is_visible():
                clicked = candidate.first.inner_text().strip()
                phase['name'] = 'after-consent'
                candidate.first.click(timeout=5000)
                break
        except Exception:
            pass

    page.wait_for_timeout(12000)
    page.screenshot(path=str(OUT/'after-consent.png'), full_page=True)

    loader_responses = [e for e in events if e['type']=='response' and is_loader(e['url'])]
    ad_requests = [e for e in events if e['type']=='request' and is_ad_request(e['url'])]
    ad_responses = [e for e in events if e['type']=='response' and is_ad_request(e['url'])]
    dom = page.evaluate("""() => ({
      adsbygoogleScripts:[...document.scripts].filter(s => (s.src||'').includes('adsbygoogle.js')).map(s=>s.src),
      insAds:document.querySelectorAll('ins.adsbygoogle').length,
      googleAdFrames:[...document.querySelectorAll('iframe')].filter(f => /google|doubleclick|googlesyndication/i.test(f.src||'')).map(f=>f.src).slice(0,20),
      cookieButtons:[...document.querySelectorAll('button')].filter(b=>b.offsetParent!==null).map(b=>(b.innerText||'').trim()).filter(Boolean).slice(0,30)
    })""")

    report = {
      'url':page.url,
      'httpStatus': response.status if response else None,
      'publisher':PUBLISHER,
      'visibleButtonsBeforeConsent':button_texts,
      'consentButtonClicked':clicked,
      'loaderResponseSeen':bool(loader_responses),
      'loaderResponses':loader_responses,
      'downstreamAdRequestSeen':bool(ad_requests),
      'downstreamAdRequests':ad_requests,
      'downstreamAdResponses':ad_responses,
      'relatedNetwork':events,
      'dom':dom,
      'pageErrors':page_errors,
      'consoleWarningsErrors':console_errors[:50]
    }
    (OUT/'report.json').write_text(json.dumps(report, indent=2))
    print('REVENUE_WATCH_ADSENSE_NETWORK', json.dumps(report))
    browser.close()
