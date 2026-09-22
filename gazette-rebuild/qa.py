#!/usr/bin/env python3
"""Actual compiled-Gazette localhost QA; never a synthetic Wix/phone certification."""
from __future__ import annotations
import datetime as dt
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

base_url = sys.argv[1].rstrip('/')
dist = Path(sys.argv[2]).resolve()
out = Path(sys.argv[3]).resolve(); out.mkdir(parents=True, exist_ok=True)
manifest = json.loads((dist / 'build-manifest.json').read_text())
first = manifest['stories'][0]['id']
checks, measurements = [], []
def check(name, value, detail=None):
    checks.append({'check': name, 'passed': bool(value), 'detail': detail})

with sync_playwright() as p:
    for engine in ('chromium', 'webkit'):
        browser = getattr(p, engine).launch()
        widths = (360, 390, 430, 768, 1440) if engine == 'chromium' else (390, 430)
        for width in widths:
            page = browser.new_page(viewport={'width': width, 'height': 900}, device_scale_factor=1, reduced_motion='reduce')
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.add_init_script("window.__shifts=[]; try{new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__shifts.push(e.value)})).observe({type:'layout-shift',buffered:true})}catch(e){}")
            response = page.goto(base_url + '/', wait_until='networkidle', timeout=60000)
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(1000)
            metrics = page.evaluate("""() => ({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
              h1:getComputedStyle(document.querySelector('h1')).fontSize,
              cls:(window.__shifts||[]).reduce((a,b)=>a+b,0),
              brokenImages:[...document.images].filter(i=>i.getBoundingClientRect().top<900&&(!i.complete||!i.naturalWidth)).length,
              sourceRequests:performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(location.origin)&&!r.name.startsWith('data:')).map(r=>r.name)})""")
            measurements.append({'engine': engine, 'width': width, **metrics})
            check(f'{engine}-{width} HTTP', response.status == 200)
            check(f'{engine}-{width} no horizontal overflow', metrics['scroll'] <= metrics['client'])
            check(f'{engine}-{width} media loaded', metrics['brokenImages'] == 0)
            check(f'{engine}-{width} no external runtime dependencies', not metrics['sourceRequests'], metrics['sourceRequests'])
            check(f'{engine}-{width} no JS errors', not errors, errors)
            check(f'{engine}-{width} noindex', page.locator('meta[name="robots"][content*="noindex"]').count() == 1)
            if engine == 'chromium': check(f'{engine}-{width} CLS <= 0.1', metrics['cls'] <= .1, metrics['cls'])
            if width < 820:
                page.locator('.gbm-menu summary').click()
                check(f'{engine}-{width} menu opens', page.locator('.gbm-menu').get_attribute('open') is not None)
                page.keyboard.press('Escape')
                check(f'{engine}-{width} menu closes', page.locator('.gbm-menu').get_attribute('open') is None)
            if engine == 'chromium' and width in (390, 430, 1440):
                page.screenshot(path=str(out / f'gazette-{width}.png'), full_page=True)
            page.close()
        page = browser.new_page(viewport={'width':390,'height':900})
        for route in ('/issues/', '/issues/1/', f'/issues/1/{first}/', '/about/'):
            r = page.goto(base_url + route, wait_until='networkidle')
            check(f'{engine} route {route}', r.status == 200)
            check(f'{engine} route fits {route}', page.evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth'))
        page.goto(base_url + f'/issues/1/{first}/', wait_until='networkidle')
        check(f'{engine} original Wix article preserved', page.locator('a.gbm-read-original').get_attribute('href') == manifest['stories'][0]['source'])
        check(f'{engine} no fake checkout or login', page.locator('input[type=password],input[autocomplete=cc-number],form').count() == 0)
        page.close(); browser.close()

check('public excerpts only', manifest['full_articles_on_wix'] and all(len(r['excerpt']) <= 361 for r in manifest['stories']))
check('chronological contents', [r['published'] for r in manifest['stories']] == sorted([r['published'] for r in manifest['stories']], reverse=True))
report = {'tested_at': dt.datetime.now(dt.timezone.utc).isoformat(), 'upstream': manifest['upstream'],
          'scope':'Compiled original Gazette served on localhost. Not live Wix or physical iPhone verification.',
          'measurements':measurements, 'checks': checks, 'passed':sum(c['passed'] for c in checks), 'total':len(checks)}
(out / 'verification.json').write_text(json.dumps(report, indent=2))
print(json.dumps(report, indent=2))
if report['passed'] != report['total']: raise SystemExit('QA gate failed; no promotion')
