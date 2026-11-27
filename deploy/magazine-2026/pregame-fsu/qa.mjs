#!/usr/bin/env node
// Read-only responsive QC for the FSU pregame issue. Uses the actual candidate bundle,
// actual Wix images/fonts; unavailable assets are failures, never fixture stand-ins.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const variant = 'fsu';
const out = process.argv[2] || '/workspace/fsu-magazine-qc';
mkdirSync(out, { recursive: true });
const issue = JSON.parse(readFileSync(`sports-live/magazine-issue-${variant}.json`, 'utf8'));
const bundle = readFileSync(`sports-live/magazine-${variant}.js`, 'utf8');
const frame = readFileSync(`sports-live/magazine-${variant}-frame.html`, 'utf8');
const stories = [
  ...(issue.lead?.html ? [{ selector: '#pg-lead', ...issue.lead }] : []),
  ...(issue.feature?.html ? [{ selector: '#pg-feature', ...issue.feature }] : []),
  ...(issue.features?.items || []).map((s, i) => ({ selector: `#pg-feat-${i+1}`, ...s })),
  ...(issue.exclusives?.items || []).map((s, i) => ({ selector: `#pg-excl-${i+1}`, ...s })),
];
const expected = {
  teams: issue.game.teams.map(t => t.name),
  schedules: issue.teamSchedules.teams,
  rosters: issue.teamRosters.teams,
  stories,
  picks: (issue.slate?.games || []).filter(g => g.pick).length,
  cards: (issue.cards?.items || []).length,
  cover: issue.cover.headline,
  videos: issue.videos?.items || [],
};
const results = [], problems = [];
const browser = await chromium.launch({headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox']});
for (const width of [320, 390, 430, 1366]) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 500 ? 844 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [], assets = { photos: 0, fonts: 0, nativeVideos: 0, youtubeRequests: [], failures: [], unexpected: [] };
  page.on('pageerror', e => errors.push(String(e)));
  page.on('response', response => {const u=response.url();if(/wixstatic|fonts\.(googleapis|gstatic)/.test(u)){if(!response.ok() && response.status()!==206)assets.failures.push({url:u,status:response.status()});else if(u.includes('static.wixstatic'))assets.photos++;else if(u.includes('fonts.'))assets.fonts++;}});
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (url === 'https://qa.local/magazine') return route.fulfill({contentType: 'text/html', body: frame});
    if (url === 'https://qa.local/favicon.ico') return route.fulfill({status: 204, body: ''});
    if (/cdn\.jsdelivr\.net\/gh\/.*sports-live\/magazine/.test(url)) return route.fulfill({contentType: 'application/javascript', body: bundle});
    if (/^https:\/\/static\.wixstatic\.com\//.test(url) || /^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(url)) {
return route.continue();
    }
    if (/^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}\?rel=0&autoplay=1$/.test(url)) { assets.youtubeRequests.push(url); return route.fulfill({contentType: 'text/html', body: '<!doctype html><title>Embed configuration check; playback unverified</title>'}); }
    if (/^https:\/\/video\.wixstatic\.com\/video\/[0-9a-f]+_[0-9a-f]{32}\/file/.test(url)) { assets.nativeVideos++; return route.continue(); }
    if (/site\.web\.api\.espn\.com|presidente49\.github\.io/.test(url)) return route.fulfill({contentType: 'application/json', body: '{"events":[]}'});
    if (/^data:|^about:/.test(url)) return route.continue();
    assets.unexpected.push(url); return route.abort();
  });
  await page.goto('https://qa.local/magazine', {waitUntil: 'load', timeout: 60000});
  await page.locator('#gbm-magazine-page.pg').waitFor({timeout: 10000});
  await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('#gbm-magazine-page img')];
    imgs.forEach(i => i.loading = 'eager');
    await Promise.all(imgs.map(i => i.decode().catch(() => {})));
    await document.fonts.ready;
  });
  const info = await page.evaluate(expected => {
    const root = document.querySelector('#gbm-magazine-page'), doc = document.documentElement;
    const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
    const parseText = h => norm(new DOMParser().parseFromString(h, 'text/html').body.textContent);
    const over = [...root.querySelectorAll('*')].filter(e => {
      const r=e.getBoundingClientRect(); return r.width > 0 && (r.left < -1 || r.right > doc.clientWidth+1);
    }).slice(0,10).map(e => e.tagName+'.'+String(e.className));
    function standard(selector, expectedTeams, type) {
      const el = root.querySelector(selector);
      if (!el) return {present: false};
      const hidden = [...el.querySelectorAll('*')].filter(e => {
        const c=getComputedStyle(e); return e.textContent.trim() && (c.display==='none'||c.visibility==='hidden'||+c.opacity===0);
      }).map(e=>e.tagName+'.'+e.className);
      const tables = [...el.querySelectorAll('.pg-std-team')];
      return {
        present: true,
        height: el.getBoundingClientRect().height,
        collapsed: !!el.closest('details') || !!el.querySelector('details'),
        hidden,
        teams: expectedTeams.map(t => {
          const panel=tables.find(p => p.querySelector('h3').firstChild.textContent.trim()===t.name);
          if (!panel) return {name:t.name,missing:true};
          const rows=[...panel.querySelectorAll(type==='roster'?'tbody tr:not(.pg-rt-g)':'tbody tr')];
          const expectedRows=type==='roster'?t.groups.flatMap(g=>g[1]):t.games;
          const missing=[];
          expectedRows.forEach((r,i) => {
            const row=rows[i];
            if (!row) {missing.push(i);return;}
            const text=norm(row.textContent);
            const fields=type==='roster'?r:[r[0],r[2],r[3],r[4],r[5]];
            fields.filter(v=>v!==''&&v!==null&&v!==undefined).forEach(v=>{if(!text.includes(norm(v))) missing.push(`${i}:${v}`);});
          });
          return {
            name:t.name, rows:rows.length,expectedRows:expectedRows.length,missing,
            zeroHeight:rows.filter(r=>r.getBoundingClientRect().height<8).length,
            clipped:panel.scrollWidth>panel.clientWidth+1,
            groups:type==='roster'?[...panel.querySelectorAll('.pg-rt-g')].map(g=>norm(g.textContent)):[],
          };
        }),
      };
    }
    const fullStories=expected.stories.map(s=>{
      const el=root.querySelector(s.selector), prose=el?.querySelector('.pg-prose');
      const intended=parseText(s.html);
      return {selector:s.selector,title:s.title,author:s.author,present:!!el,
        byline:el?.querySelector('.pg-by')?.textContent,
        exact:!!prose&&norm(prose.textContent)===intended,
        difference:(()=>{const a=norm(prose?.textContent);let i=0;while(i<a.length&&i<intended.length&&a[i]===intended[i])i++;return a===intended?'':{at:i,expected:intended.slice(Math.max(0,i-40),i+100),observed:a.slice(Math.max(0,i-40),i+100)}})(),
        expectedChars:intended.length,observedChars:norm(prose?.textContent).length,
        ending:!!prose&&norm(prose.textContent).endsWith(intended.slice(-140)),
      };
    });
    const imgs=[...root.querySelectorAll('img')];
    const ids=imgs.map(i=>(i.currentSrc||i.src).match(/\/media\/([^/]+)/)?.[1]).filter(Boolean);
    const duplicateIds=ids.filter((id,i)=>ids.indexOf(id)!==i);
    const fonts={};
    [...root.querySelectorAll('*')].forEach(e=>{
      if (![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())) return;
      const f=getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g,'').trim(); fonts[f]=(fonts[f]||0)+1;
    });
    const links=[...root.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'));
    const jump=[...root.querySelectorAll('.pg-jump a')].map(a=>a.getAttribute('href'));
    const names=[...root.querySelectorAll('.pg-teams .pg-team b')].map(e=>({name:e.textContent,rect:e.getBoundingClientRect().toJSON(),lineHeight:parseFloat(getComputedStyle(e).lineHeight)}));
    return {build:root.dataset.mzBuild,scrollW:doc.scrollWidth,clientW:doc.clientWidth,over,
      cover:root.querySelector('h1')?.textContent,h1:root.querySelectorAll('h1').length,
      schedule:standard('#pg-team-schedules',expected.schedules,'schedule'),roster:standard('#pg-team-rosters',expected.rosters,'roster'),
      stories:fullStories,fonts,photos:imgs.map(i=>({src:i.currentSrc||i.src,alt:i.alt,decoded:i.complete&&i.naturalWidth>0})),duplicateIds,
      picks:root.querySelectorAll('#pg-slate .pg-pick').length,cards:root.querySelectorAll('#pg-more .pg-card').length,
      badLinks:links.filter(h=>!h||!(/^(\/|#|https:\/\/www\.youtube\.com\/)/).test(h)),
      badJump:jump.filter(h=>!root.querySelector(h)),jump,names,height:root.scrollHeight,
      videos: {count:root.querySelectorAll('.pg-video').length, iframeBefore:root.querySelectorAll('#pg-videos iframe').length, buttons:root.querySelectorAll('[data-pg-youtube]').length, jump:jump.includes('#pg-videos'),items:[...root.querySelectorAll('.pg-video')].map(v=>({title:v.querySelector('h3')?.textContent,source:v.querySelector('.pg-video-credit')?.textContent,date:v.querySelector('.pg-video-date')?.textContent,note:v.querySelector('.pg-video-note')?.textContent})),native:[...root.querySelectorAll('#pg-videos video')].map(v=>({src:v.getAttribute('src'),controls:v.controls,preload:v.preload,autoplay:v.autoplay,playsInline:v.playsInline,title:v.getAttribute('aria-label'),readyState:v.readyState,duration:v.duration,paused:v.paused,currentTime:v.currentTime,poster:v.poster}))},
    };
  }, expected);
  const fail = (cond,msg) => {if(cond) problems.push(`${width}: ${msg}`);};
  fail(info.scrollW > width+1 || info.over.length,'horizontal overflow '+JSON.stringify(info.over));
  fail(info.h1!==1 || info.cover!==expected.cover,'cover/h1 mismatch');
  for (const [label,standard] of [['schedule',info.schedule],['roster',info.roster]]) {
    fail(!standard.present,`missing ${label}`); if(!standard.present)continue;
    fail(standard.height<200||standard.collapsed||standard.hidden.length,`hidden or collapsed ${label}`);
    for(const t of standard.teams) fail(t.missing===true||t.rows!==t.expectedRows||t.missing.length||t.zeroHeight||t.clipped,`${label} ${t.name} ${JSON.stringify(t)}`);
  }
  for(const s of info.stories) fail(!s.present||!s.exact||!s.ending||!s.byline?.includes(s.author),`story body/byline ${JSON.stringify(s)}`);
  fail(info.photos.some(i=>!i.decoded||!i.alt),'broken photo or missing alt');
  fail(info.duplicateIds.length,'duplicate photo '+info.duplicateIds.join(','));
  fail(Object.keys(info.fonts).some(f=>!/^Barlow( Condensed)?$/.test(f)),'non-Barlow fonts');
  fail(info.badLinks.length||info.badJump.length,'bad links/jump targets');
  fail(info.picks!==expected.picks||info.cards!==expected.cards,'picks/cards count mismatch');
  fail(info.videos.count!==expected.videos.length||info.videos.iframeBefore||!info.videos.jump,'video count, eager iframe or jump');
  fail(info.videos.native.some(v=>!v.controls||v.preload!=='metadata'||v.autoplay||!v.playsInline||!v.title||v.readyState<1||!v.duration||!v.paused||v.currentTime>0),'native video controls/configuration/metadata');
  fail(info.videos.items.some((v,i)=>v.title!==expected.videos[i].title||v.source!==expected.videos[i].source||v.date!==expected.videos[i].date||((expected.videos[i].note||'')!==(v.note||''))),'video titles/credits/dates/notes');
  info.videos.noYouTubeBeforeInteraction=assets.youtubeRequests.length===0;
  fail(!info.videos.noYouTubeBeforeInteraction,'YouTube requested before interaction');
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:`${out}/fsu-${width}-top.png`,animations:'disabled'});
  for(const [key,selector] of [['game','#pg-game'],['videos','#pg-videos'],['schedules','#pg-team-schedules'],['rosters','#pg-team-rosters'],['featured','#pg-feature'],['first-story','#pg-feat-1'],['last-story',stories.at(-1)?.selector]]) {
    if(!selector||!await page.locator(selector).count()) continue;
    await page.locator(selector).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
    await page.screenshot({path:`${out}/fsu-${width}-${key}.png`,animations:'disabled'});
  }
  const youtube=expected.videos.filter(v=>v.youtubeId);
  for(const v of youtube){
    await page.locator('[data-pg-youtube="'+v.youtubeId+'"]').click();
    const found=await page.locator('#pg-videos iframe').evaluateAll(fs=>fs.map(f=>({src:f.src,title:f.title,loading:f.loading,allowfullscreen:f.allowFullscreen})));
    const hit=found.find(f=>f.src==='https://www.youtube-nocookie.com/embed/'+v.youtubeId+'?rel=0&autoplay=1');
    fail(!hit||hit.title!==v.title||hit.loading!=='lazy'||!hit.allowfullscreen,'click-to-load iframe '+v.youtubeId);
  }
  info.videos.iframesAfter=await page.locator('#pg-videos iframe').count();
  fail(info.videos.iframesAfter!==youtube.length,'YouTube click count');
  fail(errors.length||assets.failures.length||assets.unexpected.length,'runtime/network errors');

  results.push({width,...info,errors,assets});
  await ctx.close();
}
await browser.close();
const report={at:new Date().toISOString(),mode:'candidate fixture, real images/fonts',issue:issue.id,problems,results};
writeFileSync(`${out}/metrics.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({issue:issue.id,problems,widths:results.map(r=>({width:r.width,build:r.build,photos:r.photos.length,rows:r.roster.teams.map(t=>t.rows),stories:r.stories.length,photosFetched:r.assets.photos,fontsFetched:r.assets.fonts}))},null,2));
if(problems.length)process.exitCode=1;
