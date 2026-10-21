"""Local before/after harness using the read-only captured live core/base styles and current RSS.

Run: python deploy/homepage-story-rhythm-20261021/qc.py
Only local request interception; no Wix writes or site publishing.
"""
import asyncio
import json
import re
import subprocess
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
OUT = HERE / 'qc'
FIX = HERE / 'fixtures'
PIN = '8e72526ea341dd1eb77d88e74539ae9359628af8'
SKINS = {
    'before': subprocess.check_output(['git', 'show', PIN + ':sports-live/broadcast-home-color.js'], cwd=ROOT).decode(),
    'candidate': (ROOT / 'sports-live/broadcast-home-color.js').read_text(),
}
CORE = json.loads((FIX / 'core-rev63.json').read_text())['embedData']['html']
BASE = json.loads((FIX / 'base-styles.json').read_text())['embedData']['html']
RSS = (FIX / 'current-rss.xml').read_text()
CONFIG = json.loads((FIX / 'current-config.json').read_text())

def page_html(mode):
    return ('<!doctype html><html><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            + BASE + '</head><body><script>window.__GBM_HOME_FALLBACK__={posts:[]};</script>'
            + CORE + '<script>window.__GBM_HOME_JS__();</script><script>'
            + SKINS[mode].replace('</script', '<\\/script') + '</script></body></html>')

PROBE = r'''() => {
  const root = document.querySelector('#gbm-live');
  const visible = el => !!(el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
  const rows = [...root.querySelectorAll('.bc-row')].filter(visible);
  const lead = root.querySelector('.bc-hero .sh-lead');
  const metadata = [...root.querySelectorAll('article .sh-meta,.bc-by,.bc-hero .sh-kicker')].filter(visible);
  return {
    width: innerWidth, documentWidth: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    lead: new URL(lead.querySelector('a[href]').href).pathname,
    leadTitle: lead.querySelector('h1').textContent,
    rows: rows.map(row => {
      const im = row.querySelector('img'), title = row.querySelector('h3');
      return {path: new URL(row.querySelector('a[href]').href).pathname,
        title: title.textContent, published: row.dataset.published,
        photo: !!im, loaded: !!(im && im.complete && im.naturalWidth),
        alt: im?.alt, credit: row.querySelector('.bc-credit')?.textContent,
        headlineBelowPhoto: !im || title.getBoundingClientRect().top >= im.getBoundingClientRect().bottom,
        brief: row.classList.contains('bc-brief')};
    }),
    metadata: metadata.map(el => el.textContent),
    duplicatePools: [...root.querySelectorAll('.sh-support,.sh-coverage,.sh-voices,.bc-shots')].filter(visible).map(el => el.className),
    magazine: !!root.querySelector('.sh-magazine a[href^="/magazine"]'),
    show: !!root.querySelector('a[href^="/the-buddy-martin-show"]'),
    football: !!root.querySelector('.bc-nx'),
    sourceLinks: [...root.querySelectorAll('.bc-photo-sources a')].map(el => el.href),
    nestedAnchors: root.querySelectorAll('.bc-run a a').length,
    colors: Object.fromEntries(['--n','--b','--o','--ink','--mu'].map(k => [k,getComputedStyle(root).getPropertyValue(k)])),
    fonts: [...new Set([...root.querySelectorAll('h1,h3,.bc-credit')].map(el => getComputedStyle(el).fontFamily))],
  };
}'''

async def main():
    OUT.mkdir(exist_ok=True)
    all_results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        async def capture(width, mode, case='current'):
            ctx = await browser.new_context(viewport={'width': width, 'height': 1000}, device_scale_factor=1)
            page = await ctx.new_page()
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            config = json.loads(json.dumps(CONFIG)) if mode == 'before' else json.loads((ROOT / 'sports-live/front-page.config.json').read_text())
            rss = RSS
            if case == 'missing-credit':
                # Remove one newest support's attribution from RSS only; titles/order must survive.
                import xml.etree.ElementTree as ET
                doc = ET.fromstring(rss)
                item = list(doc.find('channel').findall('item'))[1]
                photo_id = re.search(r'/media/([^/~]+)', item.find('enclosure').get('url'))[1]
                config['credits'].pop(photo_id, None)
                for child in item:
                    if child.tag.rsplit('}', 1)[-1] in ('credit','description'):
                        child.text = ''
                rss = ET.tostring(doc, encoding='unicode')
            async def route(request):
                url = request.request.url
                if url.startswith('https://www.gatorbaitmedia.com/?harness='):
                    return await request.fulfill(content_type='text/html', body=page_html(mode))
                if '/blog-feed.xml' in url:
                    return await request.fulfill(content_type='application/xml', body=rss)
                if 'front-page.config.json' in url:
                    return await request.fulfill(content_type='application/json', body=json.dumps(config))
                if 'scoreboard.json' in url:
                    return await request.fulfill(content_type='application/json', body=(ROOT / 'sports-live/scoreboard.json').read_text())
                if case == 'failed-photo' and 'static.wixstatic.com/media/' in url and '/w_480,h_320' in url:
                    return await request.abort()
                if 'static.wixstatic.com/media/' in url or url.endswith('.woff2'):
                    return await request.continue_()
                return await request.abort()
            await page.route('**/*', route)
            await page.goto(f'https://www.gatorbaitmedia.com/?harness={mode}-{case}-{width}', wait_until='domcontentloaded')
            await page.wait_for_selector('#gbm-live .bc-rows', timeout=15000)
            if mode == 'candidate':
                await page.wait_for_selector('#gbm-live.bc-story-rhythm', timeout=15000)
            await page.evaluate('document.fonts.ready')
            for im in await page.locator('.bc-rows img').all():
                await im.scroll_into_view_if_needed()
            await page.wait_for_timeout(1800)
            result = await page.evaluate(PROBE)
            result.update(mode=mode, case=case, errors=errors)
            if mode == 'candidate':
                paths = [result['lead']] + [r['path'] for r in result['rows']]
                result['checks'] = {
                    'five_stories': len(paths) == 5,
                    'unique': len(paths) == len(set(paths)),
                    'four_newest_supports': [r['path'] for r in result['rows']] == expected_paths,
                    'chronological': [r['published'] for r in result['rows']] == sorted([r['published'] for r in result['rows']], reverse=True),
                    'mixed_rhythm': not any(r['photo'] for r in result['rows'][2:]),
                    'expected_photo_count': sum(r['photo'] for r in result['rows']) == (2 if case == 'current' else 1 if case == 'missing-credit' else 0),
                    'photos_loaded': all(r['loaded'] for r in result['rows'] if r['photo']),
                    'headlines_below_photos': all(r['headlineBelowPhoto'] for r in result['rows']),
                    'credited_photos': all(r['credit'] and r['credit'] in r['alt'] for r in result['rows'] if r['photo']),
                    'no_article_metadata': not result['metadata'],
                    'no_duplicate_pools': not result['duplicatePools'],
                    'no_overflow': result['documentWidth'] <= width,
                    'preserved_context': result['magazine'] and result['show'] and result['football'],
                    'no_nested_links': not result['nestedAnchors'],
                    'no_js_errors': not errors,
                }
            await page.evaluate('scrollTo(0,0)')
            await page.screenshot(path=str(OUT / f'{mode}-{case}-{width}-top.png'))
            await page.locator('.bc-run').screenshot(path=str(OUT / f'{mode}-{case}-{width}-stories.png'))
            await ctx.close()
            all_results.append(result)
            print(json.dumps({'width':width,'mode':mode,'case':case,'photos':sum(r['photo'] for r in result['rows']),'checks':result.get('checks')}), flush=True)
        import xml.etree.ElementTree as ET
        doc = ET.fromstring(RSS)
        items = list(doc.find('channel').findall('item'))
        from urllib.parse import urlparse
        expected_paths = [urlparse(item.find('link').text).path.rstrip('/') for item in items[1:5]]
        for width in (390, 430, 1366, 1920):
            for mode in ('before', 'candidate'):
                await capture(width, mode)
        for case in ('missing-credit','failed-photo'):
            await capture(390, 'candidate', case)
        await browser.close()
    (OUT / 'results.json').write_text(json.dumps(all_results, indent=2))
    for width in (390, 430, 1366, 1920):
        before = next(r for r in all_results if r['width']==width and r['mode']=='before')
        candidate = next(r for r in all_results if r['width']==width and r['mode']=='candidate' and r['case']=='current')
        assert before['lead'] == candidate['lead']
        assert before['colors'] == candidate['colors']
    assert all(all(r.get('checks',{}).values()) for r in all_results if r['mode']=='candidate')

if __name__ == '__main__':
    asyncio.run(main())
