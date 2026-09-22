"""Read-only live attribution for startup and page-tail defects; no substitutions."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
out=Path(__file__).resolve().parents[2]/'.gazette-check';out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch()
 page=b.new_page(viewport={'width':1440,'height':900})
 page.add_init_script("""window.__gazetteShifts=[];window.__gazetteEvents=[];try{new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__gazetteShifts.push({value:e.value,time:e.startTime,sources:(e.sources||[]).map(s=>({tag:s.node?.tagName,id:s.node?.id,cl:typeof s.node?.className==='string'?s.node.className:'',old:s.previousRect.toJSON(),current:s.currentRect.toJSON()}))})})).observe({type:'layout-shift',buffered:true})}catch(e){};document.addEventListener('DOMContentLoaded',()=>window.__gazetteEvents.push({name:'DOMContentLoaded',time:performance.now()}));document.addEventListener('gbm:gazette-ready',()=>window.__gazetteEvents.push({name:'gazette-ready',time:performance.now()}));""")
 page.goto('https://www.gatorbaitmedia.com/',wait_until='domcontentloaded',timeout=60000)
 page.wait_for_timeout(11000)
 r=page.evaluate("""() => {
 const stat=e=>{if(!e)return null;const s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,id:e.id,cl:typeof e.className==='string'?e.className:'',top:r.top,height:r.height,bottom:r.bottom,width:r.width,minHeight:s.minHeight,cssHeight:s.height,display:s.display,position:s.position,overflow:s.overflow,background:s.backgroundColor}};
 return {url:location.href,events:window.__gazetteEvents,shifts:window.__gazetteShifts,
 resource:performance.getEntriesByType('resource').filter(r=>r.name.includes('gazette-live')).map(r=>({name:r.name,start:r.startTime,duration:r.duration,transfer:r.transferSize})),
 doc:stat(document.documentElement),body:stat(document.body),bodyChildren:[...document.body.children].map(stat).filter(r=>r.height>0),
 nodes:['SITE_CONTAINER','main_MF','site-root','masterPage','SITE_PAGES','PAGES_CONTAINER','SITE_PAGES_TRANSITION_GROUP','gbm-live','gbm-footer','gbm-mobile-shell-host'].map(id=>stat(document.getElementById(id))),
 tail:document.documentElement.scrollHeight-(document.getElementById('gbm-footer')?.getBoundingClientRect().bottom||0)};
 }""")
 (out/'startup-diagnostics.json').write_text(json.dumps(r,indent=2))
 (out/'public-home.html').write_text(page.content())
 print('STARTUP_DIAGNOSTICS',json.dumps(r))
 b.close()
