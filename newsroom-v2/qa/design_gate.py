#!/usr/bin/env python3
"""In-memory browser checks of V2 components, not live Wix or iPhone certification.
Requires playwright for Python and an installed browser. No external requests.
"""
import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def fixtures(sparse=False):
    rows = []
    for i in range(10):
        rows.append(dict(
            title=('QA long headline testing Florida coverage and mobile wrapping across narrow phone screens'
                   if i == 0 else f'QA story {i} for layout testing'),
            desc='Synthetic test content, not a published GatorBait story.',
            link=f'/post/qa-story-{i}', img='',
            who='GatorBait Staff' if sparse else ['Buddy Martin', 'Franz Beard', 'GatorBait Staff'][i % 3],
            category='Football' if sparse else ['Football', 'Recruiting', 'Basketball', 'Baseball'][i % 4],
            date=f'2026-09-22T{20-i:02}:00:00Z'))
    return list(reversed(rows))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--source', type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument('--out', type=Path, default=Path('.qa-output'))
    ap.add_argument('--browser', choices=['chromium', 'webkit'], default='chromium')
    ap.add_argument('--executable', help='Path to an already installed browser')
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    report = dict(status='BLOCKED', checked_at_utc=datetime.now(timezone.utc).isoformat(),
                  scope='In-memory source-component fixtures. Homepage activation simulated because browser navigation is blocked. Excludes real routing, network, Wix, menus, ads, accounts and physical iPhone.', checks=[])
    def check(name, ok, evidence):
        report['checks'].append(dict(name=name, passed=bool(ok), evidence=evidence))
    try:
        from playwright.sync_api import sync_playwright
        files = {n: (args.source / n).read_text() for n in ['masthead.css', 'masthead.js', 'data-adapter.js']}
        report['source_sha256'] = {n: hashlib.sha256(v.encode()).hexdigest() for n, v in files.items()}
        with sync_playwright() as p:
            opts = dict(headless=True, timeout=15000)
            if args.executable:
                opts['executable_path'] = args.executable
            browser = getattr(p, args.browser).launch(**opts)
            report['browser'] = args.browser
            report['browser_version'] = browser.version
            def page_for(width, rows, path='/', adapter=True):
                ctx = browser.new_context(viewport=dict(width=width, height=900),
                                          timezone_id='America/New_York', locale='en-US', reduced_motion='reduce')
                pg = ctx.new_page()
                errors = []
                pg.on('pageerror', lambda e: errors.append(str(e)))
                pg.route('**/*', lambda r: r.abort())
                pg.set_content('<!doctype html><html><head><meta charset="utf-8">'
                    '<meta name="viewport" content="width=device-width,initial-scale=1">'
                    '<style>body{margin:0}#gbm-mobile-shell-host{display:none}'
                    '@media(max-width:820px){#gbm-mobile-shell-host{display:block;height:60px}}</style>'
                    '</head><body><div id="gbm-mobile-shell-host" aria-label="Test header slot"></div>'
                    '<div id="SITE_HEADER">Native test header</div><div id="SITE_PAGES">Native test content</div></body></html>')
                pg.add_style_tag(content=files['masthead.css'])
                pg.evaluate('(rows)=>{window.__GBM_V2_PREVIEW__=true;window.__GBM_V2_FIXTURE__=rows}', rows)
                if adapter:
                    pg.add_script_tag(content=files['data-adapter.js'])
                # about:blank has no homepage path. Simulate ONLY the activation line.
                # No navigation or browser-policy changes; route integration stays unverified.
                guard = "var home=((location.pathname||'').replace(/\\/+$/,'')||'/')==='/';"
                if files['masthead.js'].count(guard) != 1:
                    raise ValueError('Activation guard changed; review fixture harness before testing.')
                renderer = files['masthead.js'].replace(guard, 'var home=' + ('true;' if path == '/' else 'false;'))
                pg.add_script_tag(content=renderer)
                return ctx, pg, errors
            for w in [360, 390, 430, 768, 1440]:
                ctx, pg, errors = page_for(w, fixtures())
                pg.wait_for_selector('#gbm-live.gbm-v2', timeout=5000)
                result = pg.evaluate('''() => {
                    const root=document.querySelector('#gbm-live.gbm-v2');
                    const outside=[...root.querySelectorAll('*')].filter(e=>{
                      if(e.classList.contains('gbm-v2-skip'))return false;
                      const r=e.getBoundingClientRect();return r.width>0&&(r.left < -1||r.right > innerWidth+1);
                    }).map(e=>e.className).slice(0,10);
                    return {width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
                      leadFont:parseFloat(getComputedStyle(root.querySelector('h1')).fontSize), outside,
                      lead:root.querySelector('.gbm-v2-lead a').getAttribute('href'),top:root.getBoundingClientRect().top};
                }''')
                cap = 36 if w <= 430 else (42 if w <= 820 else 66)
                check(f'viewport-{w}', not result['outside'] and result['scrollWidth'] <= w
                      and result['leadFont'] <= cap and not errors, dict(**result, errors=errors))
                check(f'chronology-{w}', result['lead'] == '/post/qa-story-0', result['lead'])
                pg.add_script_tag(content=files['masthead.js'])
                check(f'single-mount-{w}', pg.locator('#gbm-live').count() == 1, pg.locator('#gbm-live').count())
                if w <= 820:
                    check(f'header-order-{w}', result['top'] >= 60, result['top'])
                pg.screenshot(path=str(args.out / f'{args.browser}-{w}.png'))
                ctx.close()
            ctx, pg, _ = page_for(390, fixtures(True))
            pg.wait_for_selector('#gbm-live.gbm-v2', timeout=5000)
            count = pg.locator('.gbm-v2-voices > article').count()
            check('no-false-writer-attribution', count == 0, count)
            labels = pg.locator('.gbm-v2-section-head h2').all_text_contents()
            check('no-false-sport-sections', labels == ['Football'], labels)
            headings = pg.locator('h2').all_text_contents()
            check('no-unmeasured-popularity', not any(x in headings for x in ['Trending', 'Most Read']), headings)
            ctx.close()
            for name, path, rows, adapter in [('empty-feed', '/', [], True),
                                             ('missing-adapter', '/', fixtures(), False),
                                             ('simulated-non-home', '/post/qa-only', fixtures(), True)]:
                ctx, pg, _ = page_for(390, rows, path, adapter)
                pg.wait_for_timeout(100)
                result = pg.evaluate('''() => ({mounts:document.querySelectorAll('#gbm-live').length,
                  hidden:document.documentElement.classList.contains('gbm-v2-live'),
                  nativeVisible:getComputedStyle(document.querySelector('#SITE_PAGES')).display!=='none'})''')
                check(name, result['mounts'] == 0 and not result['hidden'] and result['nativeVisible'], result)
                ctx.close()
            browser.close()
        report['status'] = 'PASS' if all(x['passed'] for x in report['checks']) else 'FAIL'
    except Exception as err:
        report['error'] = str(err)
    report['passed'] = sum(x['passed'] for x in report['checks'])
    report['total'] = len(report['checks'])
    (args.out / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
    return dict(PASS=0, FAIL=1, BLOCKED=2)[report['status']]


if __name__ == '__main__':
    sys.exit(main())
