(function(){
if(window.__GBM_GCX_E__)return;window.__GBM_GCX_E__=1;
var EV='401856708',B='/apis/site/v2/sports/football/college-football/',H=['https://site.web.api.espn.com','https://site.api.espn.com'],S={},T={},run=false;
function e(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function gj(p,i){i=i||0;return fetch(H[i]+B+p+(p.indexOf('?')<0?'?':'&')+'_='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return i<H.length-1?gj(p,i+1):null})}
function ld(k,p,ms){clearTimeout(T[k]);if(!run)return;gj(p).then(function(j){if(j){S[k]=j;window.__GBM_GC_RENDER__&&window.__GBM_GC_RENDER__()}}).then(function(){T[k]=setTimeout(function(){ld(k,p,ms)},ms)})}
function et(){return new Date().toLocaleDateString('en-CA',{timeZone:'America/New_York'}).replace(/-/g,'')}
function startAll(){ld('sb','scoreboard?groups=8&limit=60&dates='+et(),20000);ld('rk','rankings',600000);ld('nw','news?team=57&limit=8',180000)}
function stopAll(){for(var k in T)clearTimeout(T[k]);S={}}
setInterval(function(){var o=!!document.getElementById('gbm-gc');if(o&&!run){run=true;startAll()}else if(!o&&run){run=false;stopAll()}},1500);
function sit(p,d){var s=d.situation||p.h.situation||{};
if(!s.downDistanceText&&!s.possessionText){var c=d.drives&&d.drives.current,pl=c&&c.plays&&c.plays[c.plays.length-1];if(pl&&pl.end)s={downDistanceText:pl.end.downDistanceText,possessionText:pl.end.possessionText,yardLine:pl.end.yardLine,possession:pl.end.team&&pl.end.team.id,distance:pl.end.distance,lastPlay:{text:pl.text}}}
return s}
function yds(s,p){var m=String(s.possessionText||s.downDistanceText||'').match(/\b(FLA|MIZ|MIZZ?)\s+(\d{1,2})\b/i);
if(m)return/^F/i.test(m[1])?+m[2]:100-m[2];
if(/\b50\b/.test(String(s.possessionText||'')))return 50;
if(s.yardLine!=null&&s.possession!=null)return String(s.possession)===String(p.tid.a)?+s.yardLine:100-s.yardLine;return null}
function X(y){return 100+y*10}
function field(p,d){var s=p.state==='in'?sit(p,d):{},y=yds(s,p),dir=1;
if(p.H.possession)dir=-1;else if(!p.A.possession&&s.possession!=null)dir=String(s.possession)===String(p.tid.a)?1:-1;
var g='<rect width="1200" height="300" fill="#0b3a22"/>',i;
for(i=0;i<10;i++)g+='<rect x="'+(100+i*100)+'" width="100" height="300" fill="'+(i%2?'#0e472a':'#0b3a22')+'"/>';
g+='<rect width="100" height="300" fill="#fa4616"/><rect x="1100" width="100" height="300" fill="#c99a1b"/>';
g+='<text x="50" y="150" transform="rotate(-90 50 150)" text-anchor="middle" fill="#fff" font-size="46" letter-spacing="8" font-family="Bebas Neue,Impact,sans-serif">FLORIDA</text><text x="1150" y="150" transform="rotate(90 1150 150)" text-anchor="middle" fill="#fff" font-size="46" letter-spacing="8" font-family="Bebas Neue,Impact,sans-serif">MISSOURI</text>';
for(i=0;i<=20;i++){var x=100+i*50,big=i%2===0;g+='<line x1="'+x+'" x2="'+x+'" y1="0" y2="300" stroke="#fff" stroke-opacity="'+(big?.55:.22)+'" stroke-width="'+(big?3:1.5)+'"/>';
if(big&&i>0&&i<20){var n=i/2*10;n=n>50?100-n:n;g+='<text x="'+x+'" y="48" text-anchor="middle" fill="#fff" fill-opacity=".5" font-size="30" font-family="Bebas Neue,Impact,sans-serif">'+n+'</text><text x="'+x+'" y="276" text-anchor="middle" fill="#fff" fill-opacity=".5" font-size="30" font-family="Bebas Neue,Impact,sans-serif" transform="rotate(180 '+x+' 266)">'+n+'</text>'}}
if(y!=null){var bx=X(y),dist=num(s.distance||(String(s.downDistanceText||'').match(/&\s*(\d+)/)||[])[1]),fd=Math.max(0,Math.min(100,y+dir*(/goal/i.test(String(s.downDistanceText||''))?100:dist||10)));
g+='<line x1="'+X(fd)+'" x2="'+X(fd)+'" y1="0" y2="300" stroke="#f2e21b" stroke-width="6"/><line x1="'+bx+'" x2="'+bx+'" y1="0" y2="300" stroke="#4aa3ff" stroke-width="6"/>';
g+='<path d="M'+(bx+dir*30)+' 150 L'+(bx+dir*84)+' 118 L'+(bx+dir*84)+' 182Z" fill="#fa4616" fill-opacity=".9"/><ellipse cx="'+bx+'" cy="150" rx="24" ry="14" fill="#8a4a1f" stroke="#fff" stroke-width="3"/><path d="M'+(bx-10)+' 150h20" stroke="#fff" stroke-width="3"/>'}
var cap=p.state==='in'?'<div class="gx-dd D">'+e(s.downDistanceText||s.shortDownDistanceText||'Waiting on the next snap')+'</div>'+((s.homeTimeouts!=null||s.awayTimeouts!=null)?'<span class="gx-to" title="Timeouts left">'+to(s.awayTimeouts)+'</span><span class="gx-to">'+to(s.homeTimeouts)+'</span>':'')+'<div class="gx-lp">'+e(s.lastPlay&&s.lastPlay.text||(d.drives&&d.drives.current&&d.drives.current.description)||'')+'</div>':'<div class="gx-dd D">'+(p.state==='pre'?'Kickoff '+e(p.detail.replace(/^.*? at /,'')):'Final')+'</div><div class="gx-lp">'+(p.state==='pre'?'The ball is placed here the moment the game starts. FLA drives right, MIZ drives left.':'Thanks for riding along.')+'</div>';
return'<div class="gc-c"><h2 class="D">Field Tracker</h2><svg class="gx-fd" viewBox="0 0 1200 300" role="img" aria-label="Football field with ball position">'+g+'</svg><div class="gx-cap">'+cap+'</div></div>'}
function to(n){n=Math.max(0,Math.min(3,+n||0));var o='',k;for(k=0;k<3;k++)o+='<i class="'+(k<n?'':'o')+'"></i>';return o}
function num(v){var m=String(v==null?'':v).match(/\d+/);return m?+m[0]:0}
function rk(c){var r=c.curatedRank&&c.curatedRank.current;return r&&r<=25?'#'+r+' ':''}
function evs(){return((S.sb&&S.sb.events)||[]).filter(function(v){return String(v.id)!==EV})}
function lines(){return evs().map(function(v){var c=v.competitions[0].competitors,a=c.filter(function(x){return x.homeAway==='away'})[0],h=c.filter(function(x){return x.homeAway==='home'})[0],t=v.status.type;return{a:a,h:h,st:t.state,s:t.state==='pre'?new Date(v.date).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}):t.shortDetail,d:v.date}}).sort(function(x,y){var o={in:0,pre:1,post:2};return o[x.st]-o[y.st]||(x.d<y.d?-1:1)})}
function sec(){var L=lines();if(!L.length)return'';return'<div class="gc-c"><h2 class="D">Around the SEC</h2><div class="gx-sc">'+L.map(function(g){var sc=g.st!=='pre';return'<div class="gx-g '+g.st+'"><div class="t">'+e(rk(g.a)+g.a.team.abbreviation)+(sc?'<b>'+e(g.a.score)+'</b>':'')+'</div><div class="st">'+e(g.s)+'</div><div class="t">'+e(rk(g.h)+g.h.team.abbreviation)+(sc?'<b>'+e(g.h.score)+'</b>':'')+'</div></div>'}).join('')+'</div><div class="gc-cap">Live from ESPN · refreshes every 20 seconds</div></div>'}
function ranks(){var R=S.rk&&S.rk.rankings,r=R&&(R.filter(function(x){return/AP/i.test(x.name||x.shortName||'')})[0]||R[0]);if(!r||!r.ranks)return'';
return'<div class="gc-c"><h2 class="D">'+e(r.shortName||r.name||'Top 25')+'</h2><ul class="gx-rk">'+r.ranks.slice(0,25).map(function(k){var t=k.team||{},a=t.abbreviation||t.nickname||'';return'<li class="'+(/^(FLA|MIZ)$/.test(a)?'me':'')+'"><b>'+e(k.current)+'</b>'+e(t.location||a)+'<small>'+e(k.recordSummary||'')+'</small></li>'}).join('')+'</ul></div>'}
function heads(d){var a=[],seen={};((d.news&&d.news.articles)||[]).concat((S.nw&&S.nw.articles)||[]).forEach(function(x){var h=x.headline;if(!h||seen[h]||x.type==='Media')return;seen[h]=1;a.push({t:h,l:(x.links&&x.links.web&&x.links.web.href)||'',d:x.published})});return a.slice(0,6)}
function news(d){var A=heads(d);if(!A.length)return'';return'<div class="gc-c gx-nw"><h2 class="D">Breaking &amp; Around The Gators</h2>'+A.map(function(x){return'<a target="_blank" rel="noopener" href="'+e(x.l)+'">'+e(x.t)+'<small>ESPN'+(x.d?' · '+e(new Date(x.d).toLocaleString([],{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})):'')+'</small></a>'}).join('')+'</div>'}
function board(){return'<div class="gc-c"><h2 class="D">Fan Board</h2><p style="margin:0 0 12px">Talk the game live with other Gator fans. Pick a room.</p><div class="gx-ln"><a class="o" href="/groups/game-day-threads">Game Day Threads <span>&rarr;</span></a><a href="/groups/gator-football-talk">Gator Football Talk <span>&rarr;</span></a><a href="/groups/the-swamp-lounge">The Swamp Lounge <span>&rarr;</span></a></div></div>'}
function track(){return'<div class="gc-c"><h2 class="D">More Ways To Follow</h2><div class="gx-ln"><a target="_blank" rel="noopener" href="https://www.espn.com/college-football/game/_/gameId/'+EV+'">ESPN Gamecast <span>&rarr;</span></a><a target="_blank" rel="noopener" href="https://floridagators.com/game-center/27907">UF Live Stats <span>&rarr;</span></a><a target="_blank" rel="noopener" href="https://www.espn.com/college-football/scoreboard">Nationwide Scoreboard <span>&rarr;</span></a><a target="_blank" rel="noopener" href="https://www.espn.com/college-football/rankings">Full Rankings <span>&rarr;</span></a></div></div>'}
function tick(p,d){var r=document.getElementById('gbm-gc'),b=r&&r.querySelector('.gc-bar');if(!b)return;var it=lines().filter(function(g){return g.st!=='pre'}).map(function(g){return(g.st==='in'?'LIVE · ':'FINAL · ')+rk(g.a)+g.a.team.abbreviation+' '+g.a.score+', '+rk(g.h)+g.h.team.abbreviation+' '+g.h.score+(g.st==='in'?' ('+g.s+')':'')}).concat(heads(d).map(function(x){return x.t})),
txt=it.map(function(t){return'<span>'+e(t)+'</span>'}).join(''),k=r.querySelector('.gx-tk');
if(!it.length){if(k)k.remove();return}
if(!k){k=document.createElement('div');k.className='gx-tk';b.insertAdjacentElement('afterend',k)}
if(k.getAttribute('data-k')!==txt){k.setAttribute('data-k',txt);k.innerHTML='<div class="gx-tr" style="animation-duration:'+Math.max(45,Math.round(txt.length*.045))+'s">'+txt+txt+'</div>'}}
window.__GBM_GCX__=window.__GBM_GCX__||{};window.__GBM_GCX__.field=field;window.__GBM_GCX__.more=function(p,d){return sec()+ranks()+news(d)+board()+track()};window.__GBM_GCX__.tick=tick;
window.__GBM_GC_RENDER__&&window.__GBM_GC_RENDER__();
})();
