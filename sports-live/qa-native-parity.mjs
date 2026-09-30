// Isolated real-origin browser checks; never fetches or mutates production.
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {buildWriterArchive,renderWriterArchive,archiveCss} from './lib/writer-archive.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const kit=readFileSync(new URL('./src/story-kit.js',import.meta.url),'utf8');
const site='https://www.gatorbaitmedia.com';
const guide='/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play';
const content=`<p>QA fixture only. See the <a href="${guide}#roster">Florida roster</a>, <a href="${guide}#schedule">2026 schedule</a> and <a href="/florida-football-stats">Florida statistics</a>.</p><p>The roster, depth chart, schedule and stats are useful context. This is synthetic text, not reporting.</p>`;
const html=body=>`<!doctype html><html><head><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}main{max-width:740px;margin:auto;padding:24px 16px;font:18px/1.6 Barlow,sans-serif}a{overflow-wrap:anywhere}${archiveCss}</style></head><body>${body}</body></html>`;
const article=html(`<main><h1>Native links QA fixture</h1><div data-hook="post-description">${content}</div></main>`);
const posts=Array.from({length:13},(_,i)=>({title:`Synthetic writer archive fixture ${i+1}`,url:`/post/qa-story-${i}`,visibleAuthor:'Eddie Gilley',creditVerified:true,creditEvidence:'synthetic QA fixture',firstPublishedDate:`2026-09-${String(28-i).padStart(2,'0')}T12:00:00Z`}));
const archive=html(renderWriterArchive(buildWriterArchive({writer:{name:'Eddie Gilley',kind:'person'},posts,expectedUrls:posts.map(p=>p.url),complete:true,windowLabel:'Synthetic QA window — not a live writer archive'})));
mkdirSync('build/native-parity',{recursive:true});
const browser=await chromium.launch();
const results=[];
try {
  for(const width of [320,390,430,1024,1365]) for(const mode of ['off','blocked','on','archive']) {
    const ctx=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:mode!=='off'});
    await ctx.route('**/*',r=>r.request().isNavigationRequest()?r.fulfill({contentType:'text/html',body:mode==='archive'?archive:article}):r.abort());
    const page=await ctx.newPage();
    await page.goto(site+'/post/qa-native-parity');
    const body=page.locator('[data-hook="post-description"]');
    if(mode!=='archive') {
      const before=await body.textContent();
      if(mode==='on') {
        await page.addScriptTag({content:'window.__GBM_KIT__={scoreboard:{}};'+kit});
        await page.evaluate(()=>{window.__GBM_KIT_RUNTIME__.mount();window.__GBM_KIT_RUNTIME__.mount()});
      } else if(mode==='blocked') {
        await page.addScriptTag({url:site+'/blocked-story-kit.js'}).catch(()=>{});
      }
      const read=()=>body.locator('a:not([data-story-kit="more"] a)').evaluateAll(nodes=>nodes.filter(a=>!a.closest('[data-story-kit="more"]')).map(a=>a.pathname+a.hash));
      assert.deepEqual(await read(),[guide+'#roster',guide+'#schedule','/florida-football-stats']);
      if(mode==='on') {
        assert.equal(await body.locator('a.gbm-kit-link').count(),0);
        assert.equal(await body.evaluate(b=>{const c=b.cloneNode(true);c.querySelectorAll('[data-story-kit="more"]').forEach(n=>n.remove());return c.textContent}),before);
        // Simulate Wix replacing the body after hydration.
        await body.evaluate((b,c)=>{b.innerHTML=c;b.removeAttribute('data-story-kit-linked')},content);
        await page.evaluate(()=>window.__GBM_KIT_RUNTIME__.mount());
        assert.deepEqual(await read(),[guide+'#roster',guide+'#schedule','/florida-football-stats']);
      }
      await body.locator('a').first().focus();
      assert.equal(await body.locator('a').first().evaluate(a=>a===document.activeElement),true);
    } else {
      assert.equal(await page.locator('.wa-card:visible').count(),12);
      await page.locator('summary').click();
      assert.equal(await page.locator('.wa-card:visible').count(),13);
    }
    const geometry=()=>page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    let g=await geometry();assert.ok(g.scroll<=g.width,JSON.stringify(g));
    await page.screenshot({path:`build/native-parity/${mode}-${width}.png`,fullPage:true});
    await page.addStyleTag({content:'main,.wa{font-size:36px}.wa h2{font-size:38px}'});
    g=await geometry();assert.ok(g.scroll<=g.width,'200% text-size check overflow');
    results.push({width,mode,passed:true});
    await ctx.close();
  }
  console.log(`${results.length} same-build viewport/mode checks passed`);
} finally {await browser.close();writeFileSync('build/native-parity/results.json',JSON.stringify(results,null,2));}
