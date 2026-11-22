(function(){
if(!/^\/post\//.test(location.pathname)||window.__GBM_SF__)return;window.__GBM_SF__=1;
var D=document,R=D.documentElement;
R.classList.add('gbm-sf');R.setAttribute('data-gbm-sf-hero','');
var HH=0,MO=['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
var CR=/^\s*(cover\s+)?(photos?|images?|illustrations?|graphics?)(\s+(credit|courtesy|by|illustration))?\s*:|^\s*(cover\s+)?photos?\s+(by|courtesy|credit)\b/i;
function meta(s){var m=D.querySelector(s);return m&&m.content?String(m.content).replace(/\s+/g,' ').trim():'';}
function q(t){return '"'+t.replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'"';}
function txt(e){return (e.textContent||'').replace(/\s+/g,' ').trim();}
/* page data that survives Wix's re-render: AP-style date in Eastern time, and whether a cover photo is coming */
function head(){
if(R.hasAttribute('data-gbm-sf-head')||!D.body)return;R.setAttribute('data-gbm-sf-head','');
var d=new Date(meta('meta[property="article:published_time"]'));
if(!isNaN(d))try{var p={};new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(d).forEach(function(x){p[x.type]=x.value;});
if(MO[p.month-1]){R.style.setProperty('--gbm-sf-date',q(MO[p.month-1]+' '+p.day+', '+p.year));R.setAttribute('data-gbm-sf-date','');}}catch(e){}
if(!/media\/[^\/?]+/.test(meta('meta[property="og:image"]')))R.removeAttribute('data-gbm-sf-hero');
}
/* deck: the story's excerpt, unless it is cut off or only repeats the opening lines */
function deck(sec){
if(R.hasAttribute('data-gbm-sf-deckdone'))return;R.setAttribute('data-gbm-sf-deckdone','');
var k=meta('meta[name="description"]'),h=D.querySelector('h1[data-hook="post-title"]'),b=txt(sec).slice(0,320).toLowerCase();
if(k.length<40||k.length>230||/(\.\.\.|…)$/.test(k)||(h&&txt(h).toLowerCase()===k.toLowerCase())||b.indexOf(k.slice(0,48).toLowerCase())>-1)return;
R.style.setProperty('--gbm-sf-deck',q(k));R.setAttribute('data-gbm-sf-deck','');
}
function ital(p){var w=D.createTreeWalker(p,4),n,any=0;while((n=w.nextNode())){if(!/\S/.test(n.nodeValue))continue;any=1;if(getComputedStyle(n.parentElement).fontStyle!=='italic')return 0;}return any;}
/* caption and credit lines a writer typed at the top of the body become a caption under the cover photo */
function caps(sec){
if(sec.hasAttribute('data-gbm-sf-capdone'))return;
var ps=[].slice.call(sec.querySelectorAll('p[id^="viewer-"]')).filter(function(p){return txt(p);});
if(!ps.length||(D.readyState==='loading'&&ps.length<6))return;ps=ps.slice(0,4);sec.setAttribute('data-gbm-sf-capdone','');
var hit=-1,last=null;ps.forEach(function(p,i){if(CR.test(txt(p))&&txt(p).length<=180)hit=i;});
for(var i=0;i<=hit;i++){var t=txt(ps[i]);if(t.length<=180&&(CR.test(t)||ital(ps[i]))){ps[i].setAttribute('data-gbm-sf-cap','');last=ps[i];}}
if(last)last.setAttribute('data-gbm-sf-cap','last');
}
/* the cover block is created with fixed inline margins; close the gap above and below it */
function size(g){var h=g.offsetHeight;if(h>150&&h!==HH){HH=h;R.style.setProperty('--gbm-sf-heroh',h+'px');}}
function hero(){var g=D.getElementById('gbm-hero');if(!g||!g.parentElement||getComputedStyle(g.parentElement).display!=='grid')return;if(g.style.marginTop!=='0px'){g.style.setProperty('margin-top','0','important');g.style.setProperty('margin-bottom','0','important');}
if(!g.__sf){g.__sf=1;try{new ResizeObserver(function(){size(g);}).observe(g);}catch(e){}}size(g);}
/* a reader who already signed up on this device still sees the email block, as a confirmation */
function joined(){
var m=D.querySelector('article[data-hook="post"] aside.gbm-kit-more');if(!m||m.querySelector('.gbc'))return;
var s='';try{s=localStorage.getItem('gbm-capture-joined')?'j':localStorage.getItem('gbm-capture-pending')?'p':'';}catch(e){}
if(!s)return;
var a=D.createElement('aside');a.className='gbc gbc-v2 gbc-end gbm-sf-joined';a.setAttribute('aria-label','GatorBait email updates');
a.innerHTML='<div class="gbc-k">GatorBait email updates</div><h3 class="gbc-h">'+(s==='j'?'You’re on the list.':'Check your inbox.')+'</h3><div class="gbc-v">'+(s==='j'?'GatorBait stories and columns are headed to your inbox.':'Confirm your signup with the link in the GatorBait email we sent you.')+' <a href="https://buddymartinshow.wixforms.com/f/7517931185469654016" target="_blank" rel="noopener">Sign up another email</a></div>';
m.appendChild(a);
}
function sect(){return D.querySelector('article[data-hook="post"] section[data-hook="post-description"]');}
/* runs inside the observer, before the next paint, so re-rendered pieces never flash unstyled */
function quick(){head();hero();var sec=sect();if(!sec)return;if(!sec.hasAttribute('data-gbm-sf-capdone'))caps(sec);
if(!R.hasAttribute('data-gbm-sf-deckdone')&&(D.readyState!=='loading'||txt(sec).length>700))deck(sec);}
function body(){
if(!/^\/post\//.test(location.pathname))return;
quick();
if(D.querySelector('article[data-hook="post"]>div>header>nav.gbm-kit'))R.removeAttribute('data-gbm-sf-nokit');
joined();
}
function ready(){head();body();}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',ready);else ready();
var T=0;new MutationObserver(function(){quick();if(T)return;T=setTimeout(function(){T=0;body();},120);}).observe(R,{childList:true,subtree:true});

setTimeout(function(){if(!D.querySelector('article[data-hook="post"]>div>header>nav.gbm-kit'))R.setAttribute('data-gbm-sf-nokit','');},9000);
})();
