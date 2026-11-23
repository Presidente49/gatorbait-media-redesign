/* GBM_CLIPS_FSU_WEEK_V1 two press-conference clips, Nov. 23, 2026. Runs only when the address carries ?watch=fsu-week. */
(function(){
var KEY='fsu-week',ID='gbm-clips',V='https://video.wixstatic.com/video/';
var CLIPS=[{a:'rivalry',t:'On the Florida-Florida State rivalry',len:'0:53',id:'d3cfa5_8f48c050071e4ec180f8f9a6b88e48af'},{a:'seven-wins',t:'On seven wins',len:'0:42',id:'d3cfa5_cbfc9996eec44acaa95619a3072af160'}];
function want(){try{return new URLSearchParams(location.search).get('watch')===KEY}catch(e){return false}}
var CSS='#gbm-clips{position:fixed;inset:0;z-index:2147483000;background:#061444;color:#fff;overflow:auto;-webkit-overflow-scrolling:touch;font-family:Barlow,Arial,Helvetica,sans-serif}'
+'#gbm-clips *{box-sizing:border-box}#gbm-clips .w{max-width:760px;margin:0 auto;padding:8px 16px 64px}'
+'#gbm-clips .top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:0 60px 6px 0;border-bottom:1px solid rgba(255,255,255,.22)}'
+'#gbm-clips .top a,#gbm-clips .nav a{color:#fff;font-weight:700;font-size:15px;text-decoration:none;min-height:44px;display:inline-flex;align-items:center}'
+'#gbm-clips .mark{font-weight:800;font-size:22px;letter-spacing:.5px}#gbm-clips .mark b{color:#FA4616}'
+'#gbm-clips .ey{color:#FF8A5C;font-weight:800;font-size:12px;letter-spacing:1.2px;margin:14px 0 6px}'
+'#gbm-clips h1{font-size:30px;line-height:1.05;font-weight:800;margin:0 0 8px;color:#fff}'
+'#gbm-clips p{font-size:16px;line-height:1.45;margin:0 0 10px;color:#fff}#gbm-clips .sm{font-size:14px;color:#D5DCEC}'
+'#gbm-clips article{margin:18px 0 0;scroll-margin-top:12px}#gbm-clips h2{font-size:21px;line-height:1.2;font-weight:800;margin:0 0 8px;color:#fff}#gbm-clips h2 span{color:#D5DCEC;font-weight:600;font-size:15px;margin-left:8px}'
+'#gbm-clips video{display:block;width:100%;height:auto;aspect-ratio:16/9;background:#000;border-top:4px solid #FA4616}'
+'#gbm-clips .nav{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}'
+'#gbm-clips .nav a{background:#fff;color:#061444;padding:0 16px;font-weight:800;min-height:48px}#gbm-clips .nav a.o{background:#FA4616;color:#fff}'
+'#gbm-clips :focus-visible{outline:3px solid #FF8A5C;outline-offset:2px}@media(min-width:820px){#gbm-clips h1{font-size:44px}#gbm-clips .w{padding-top:18px}}';
function open(){if(document.getElementById(ID)||!document.body)return;
if(!document.getElementById(ID+'-css')){var st=document.createElement('style');st.id=ID+'-css';st.textContent=CSS;document.head.appendChild(st)}
var d=document.createElement('div');d.id=ID;d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Florida State week press conference clips');
var h='<div class="w"><div class="top"><span class="mark">GATOR<b>BAIT</b></span><a href="/">GatorBait Media home &rarr;</a></div>'
+'<p class="ey">FLORIDA STATE WEEK &middot; MONDAY, NOV. 23, 2026</p><h1>Jon Sumrall&rsquo;s Monday press conference: two clips</h1>'
+'<p>Florida plays at Florida State on Friday, Nov. 27, at 3:30 p.m. ET on ABC.</p>';
CLIPS.forEach(function(c){h+='<article id="'+c.a+'"><h2>'+c.t+'<span>'+c.len+'</span></h2><video controls playsinline preload="metadata" src="'+V+c.id+'/file#t=0.1" aria-label="'+c.t+', '+c.len+'"></video></article>'});
h+='<p class="sm" style="margin-top:14px">Video courtesy of Florida Gators Football / University Athletic Association. <a href="https://www.youtube.com/watch?v=3BPiF6o7kQI" target="_blank" rel="noopener" style="color:#fff;font-weight:700">Watch the full press conference</a>.</p>'
+'<div class="nav"><a class="o" href="/magazine">Read the magazine</a><a href="/?book=sumrall-year-one">Free book: Sumrall, Year One</a></div></div>';
d.innerHTML=h;document.body.appendChild(d);document.documentElement.style.overflow='hidden';
var vs=d.querySelectorAll('video');for(var i=0;i<vs.length;i++)(function(v){v.addEventListener('play',function(){for(var j=0;j<vs.length;j++)if(vs[j]!==v)vs[j].pause()})})(vs[i]);
var a=(location.hash||'').slice(1);if(a){var el=document.getElementById(a);if(el&&d.contains(el))setTimeout(function(){el.scrollIntoView()},300)}}
function shut(){var d=document.getElementById(ID);if(d){d.parentNode.removeChild(d);document.documentElement.style.overflow=''}}
function sync(){if(want())open();else shut()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
window.addEventListener('popstate',sync);window.addEventListener('gbmroutechange',sync);setInterval(sync,1500);
})();
