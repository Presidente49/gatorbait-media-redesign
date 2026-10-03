import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const css = readFileSync('gc.css','utf8')+readFileSync('gcx.css','utf8'), js = readFileSync('gc.js','utf8'), jsx = readFileSync('gcx.js','utf8');
const pre = JSON.parse(readFileSync('/tmp/claude-0/-home-user/fed92d52-1701-51e0-a673-f020aa6a1fc8/scratchpad/espn_pre.json','utf8'));
const live = JSON.parse(JSON.stringify(pre));
const comp = live.header.competitions[0];
comp.status = {type:{state:'in',detail:'8:42 - 2nd Quarter',shortDetail:'8:42 - 2nd',completed:false}};
comp.competitors.forEach(c=>{c.score = c.homeAway==='away'?'21':'14'; c.possession = c.homeAway==='away'});
comp.situation={downDistanceText:'2nd & 6 at MIZ 41',possessionText:'MIZ 41',possession:'57',distance:6,homeTimeouts:2,awayTimeouts:3,lastPlay:{text:'Aaron Philo pass complete to Dallas Wilson for 4 yds to the MIZ 41'}};
live.winprobability=[{homeWinPercentage:0.5},{homeWinPercentage:0.31}];
live.scoringPlays=[
 {text:'Jadan Baugh 3 Yd Run (Trey Smith Kick)',period:{number:1},clock:{displayValue:'11:02'},team:{id:'57'},awayScore:7,homeScore:0},
 {text:'Cayden Lee 22 Yd pass from Austin Simmons (Kick)',period:{number:1},clock:{displayValue:'4:15'},team:{id:'142'},awayScore:7,homeScore:7},
 {text:'Aaron Philo 31 Yd pass to Dallas Wilson (Kick)',period:{number:2},clock:{displayValue:'13:40'},team:{id:'57'},awayScore:14,homeScore:7}];
live.boxscore.teams.forEach(t=>t.statistics.forEach(s=>{s.displayValue = String(Math.round(num(s.displayValue)/3*10)/10)}));
function num(v){return parseFloat(String(v).replace(/[^\d.]/g,''))||0}
const ev=(id,date,a,ar,as,h,hr,hs,state,short)=>({id,date,status:{type:{state,shortDetail:short}},competitions:[{competitors:[{homeAway:'away',score:as,curatedRank:{current:ar},team:{abbreviation:a}},{homeAway:'home',score:hs,curatedRank:{current:hr},team:{abbreviation:h}}]}]});
const sb={events:[ev('1','2026-10-03T19:50Z','FLA',8,'0','MIZ',25,'0','pre','x'),ev('2','2026-10-03T16:00Z','ALA',3,'28','TENN',99,'14','in','5:12 - 3rd'),ev('3','2026-10-03T16:00Z','LSU',12,'31','ARK',99,'10','post','Final'),ev('4','2026-10-03T23:30Z','UGA',2,'0','AUB',99,'0','pre','x')]};
const rk={rankings:[{name:'AP Top 25',shortName:'AP Top 25',ranks:Array.from({length:25},(_,i)=>({current:i+1,recordSummary:'4-0',team:{abbreviation:['TEX','UGA','ALA','FLA','LSU'][i%5],location:['Texas','Georgia','Alabama','Florida','LSU'][i%5]}}))}]};
const nw={articles:[{headline:'Gators QB Aaron Philo named SEC offensive player of the week',type:'Story',links:{web:{href:'https://www.espn.com/x'}},published:'2026-10-03T15:00Z'}]};
const rss = `<?xml version="1.0"?><rss><channel>`+[['Baby Chomp, Big Grudge: Florida Goes to Columbia With a Photo to Settle','baby-chomp','Sat, 03 Oct 2026 18:45:42 GMT'],['Jon Sumrall Named Inaugural Dodd Trophy Coach of the Month','dodd','Sat, 03 Oct 2026 12:00:00 GMT'],['Older story','old','Thu, 01 Oct 2026 12:00:00 GMT']].map(([t,s,d])=>`<item><title>${t}</title><link>https://www.gatorbaitmedia.com/post/${s}</link><pubDate>${d}</pubDate></item>`).join('')+`</channel></rss>`;
const browser = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const out = '/tmp/claude-0/-home-user/fed92d52-1701-51e0-a673-f020aa6a1fc8/scratchpad/';
const res = [];
for (const [mode, data] of [['pre',pre],['live',live]]) for (const [w,h] of [[390,844],[1366,900]]) {
  const ctx = await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  const page = await ctx.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(String(e)));
  await page.route('**/*', r => { const u=r.request().url();
    if (u==='https://qa.local/') return r.fulfill({contentType:'text/html',body:`<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><link rel=stylesheet href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;700;800&family=Bebas+Neue&display=swap"><style>body{margin:0;font-family:Arial}${css}</style></head><body><div id="SITE_HEADER">hdr</div><h1>homepage stub</h1><script>${js}</script><script>${jsx}</script></body></html>`});
    if (/espn\.com\/apis\/site\/v2\/.*summary/.test(u)) return r.fulfill({contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(data)});
    if (/scoreboard/.test(u)) return r.fulfill({contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(sb)});
    if (/rankings/.test(u)) return r.fulfill({contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(rk)});
    if (/news\?team/.test(u)) return r.fulfill({contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(nw)});
    if (u.startsWith('https://qa.local/blog-feed.xml')) return r.fulfill({contentType:'text/xml',body:rss});
    if (/fonts\.g/.test(u)) return r.abort();
    if (/^data:|^about:/.test(u)) return r.continue(); return r.abort(); });
  await page.goto('https://qa.local/#gameday'); await page.waitForSelector('#gbm-gc .gc-hero',{timeout:6000}); await page.waitForSelector('#gbm-gc .gx-sc',{timeout:6000}); await page.waitForTimeout(600);
  const info = await page.evaluate(()=>{const r=document.getElementById('gbm-gc');return{sw:r.scrollWidth,cw:r.clientWidth,pill:r.querySelector('.gc-pill').textContent,scores:[...r.querySelectorAll('.gc-s')].map(x=>x.textContent),wp:r.querySelector('.gc-bar2').textContent,plays:r.querySelectorAll('.gc-sp li').length,rows:r.querySelectorAll('.gc-r').length,news:[...r.querySelectorAll('.gc-nw a')].map(a=>a.firstChild.textContent.slice(0,30)),h:r.scrollHeight,field:!!r.querySelector('.gx-fd'),dd:(r.querySelector('.gx-dd')||{}).textContent,ball:!!r.querySelector('.gx-fd ellipse'),sec:r.querySelectorAll('.gx-g').length,ranks:r.querySelectorAll('.gx-rk li').length,heads:r.querySelectorAll('.gx-nw a').length,ticker:!!r.querySelector('.gx-tk'),tkText:((r.querySelector('.gx-tr')||{}).textContent||'').slice(0,120),shellHidden:getComputedStyle(document.getElementById('SITE_HEADER')).display}});
  await page.evaluate(()=>{document.querySelector('[data-gc=x]').click()}); await page.waitForTimeout(200);
  const closed = await page.evaluate(()=>!document.getElementById('gbm-gc')&&location.hash==='');
  await page.goto('https://qa.local/#gameday'); await page.waitForSelector('#gbm-gc .gc-hero');await page.waitForTimeout(300);
  await page.screenshot({path:`${out}gc2-${mode}-${w}.png`,fullPage:false}); await page.evaluate(()=>{const r=document.getElementById('gbm-gc');r.scrollTo(0,r.querySelector('.gx-fd').closest('.gc-c').offsetTop-70)}); await page.waitForTimeout(200); await page.screenshot({path:`${out}gc2f-${mode}-${w}.png`,fullPage:false});
  res.push({mode,w,errs,closed,...info}); await ctx.close();
}
await browser.close(); console.log(JSON.stringify(res,null,1));
