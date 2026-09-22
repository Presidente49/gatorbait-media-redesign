(function(){
'use strict';
if(window.__GBM_NEWSROOM_V2__)return;
var qs=new URLSearchParams(location.search||'');
var home=((location.pathname||'').replace(/\/+$/,'')||'/')==='/';
var active=home&&(window.__GBM_V2_PREVIEW__===true||qs.get('gbm_preview')==='masthead-v2'||window.__GBM_NEWSROOM_V2_PRODUCTION__===true);
if(!active)return;
window.__GBM_NEWSROOM_V2__=1;
var LOGO='https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp';
var STORE='https://gatorbait2026.itemorder.com/shop/home/';
var html=document.documentElement;
html.classList.add('gbm-standalone-live','gbm-v2-live');
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});}
function dateShort(d){try{return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});}catch(e){return'';}}
function timeShort(d){try{return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});}catch(e){return'';}}
function age(d){var s=Math.max(0,(Date.now()-d.getTime())/1000),n;if(s<3600){n=Math.max(1,Math.floor(s/60));return n+'m';}if(s<86400){n=Math.floor(s/3600);return n+'h';}n=Math.floor(s/86400);return n+'d';}
function excerpt(p,n){return esc((window.GBMV2Data&&window.GBMV2Data.strip?window.GBMV2Data.strip(p.desc,n):p.desc)||'');}
function media(p,cls,eager){return p&&p.img?'<div class="'+cls+'"><img '+(eager?'loading="eager" fetchpriority="high"':'loading="lazy"')+' decoding="async" src="'+esc(p.img)+'" alt="'+esc(p.title)+'"></div>':'<div class="'+cls+' gbm-v2-noimg" aria-hidden="true"><span>GATORBAIT</span></div>';}
function storyLink(p,cls){return'<a class="'+(cls||'')+'" href="'+esc(p.link)+'">';}
function byline(p){return'<span class="gbm-v2-byline">By '+esc(p.who||'GatorBait Staff')+'</span><span>'+esc(dateShort(p.date))+' · '+esc(age(p.date))+'</span>';}
function categorize(posts,name){return posts.filter(function(p){return(p.category||'').toLowerCase()===name.toLowerCase();});}
function pickWriter(posts,name){var n=name.toLowerCase();for(var i=0;i<posts.length;i++){if((posts[i].who||'').toLowerCase().indexOf(n)>-1)return posts[i];}return null;}
function topStory(p,i){return storyLink(p,'gbm-v2-top-story')+'<span class="gbm-v2-rank">0'+(i+1)+'</span><span><b>'+esc(p.title)+'</b><small>'+esc(p.category)+' · '+esc(age(p.date))+'</small></span></a>';}
function wireItem(p){return'<li>'+storyLink(p,'gbm-v2-wire-link')+'<time>'+esc(timeShort(p.date))+'</time><span class="gbm-v2-wire-cat">'+esc(p.category)+'</span><strong>'+esc(p.title)+'</strong></a></li>';}
function sectionCard(p){return storyLink(p,'gbm-v2-section-card')+media(p,'gbm-v2-section-media',false)+'<span class="gbm-v2-kicker">'+esc(p.category)+'</span><h3>'+esc(p.title)+'</h3><div class="gbm-v2-meta">'+esc(p.who)+' · '+esc(age(p.date))+'</div></a>';}
function render(posts){
 if(!posts||!posts.length)throw new Error('No stories');
 var lead=posts[0],top=posts.slice(1,6),latest=posts.slice(0,10);
 var franz=pickWriter(posts,'franz')||posts[2]||lead;
 var buddy=pickWriter(posts,'buddy')||posts[1]||lead;
 var football=categorize(posts,'Football').filter(function(p){return p!==lead;});
 var recruiting=categorize(posts,'Recruiting');
 var basketball=categorize(posts,'Basketball');
 var baseball=categorize(posts,'Baseball');
 function section(name,arr){var use=(arr&&arr.length?arr:posts.filter(function(p){return p!==lead;})).slice(0,3);return'<section class="gbm-v2-section"><div class="gbm-v2-section-head"><h2>'+name+'</h2><a href="/gatorbait-media-blogs">More '+name+'</a></div><div class="gbm-v2-section-grid">'+use.map(sectionCard).join('')+'</div></section>';}
 var root=document.getElementById('gbm-live');if(root)root.remove();
 root=document.createElement('div');root.id='gbm-live';root.className='gbm-v2';
 root.innerHTML=''+
 '<a class="gbm-v2-skip" href="#gbm-v2-main">Skip to stories</a>'+
 '<header class="gbm-v2-header"><div class="gbm-v2-nameplate"><a href="/" class="gbm-v2-brand"><img src="'+LOGO+'" alt="GatorBait Media"></a><div class="gbm-v2-edition"><strong>Florida Gators Newsroom</strong><span>Independent coverage since 1979</span></div><div class="gbm-v2-actions"><a href="/pricing-plans">Join</a><a href="'+STORE+'">Store</a></div></div><nav class="gbm-v2-nav" aria-label="Sections"><a href="#football">Football</a><a href="#recruiting">Recruiting</a><a href="#basketball">Basketball</a><a href="#baseball">Baseball</a><a href="/the-buddy-martin-show">GatorBait TV</a><a href="/magazine">Magazine</a></nav></header>'+
 '<main id="gbm-v2-main" class="gbm-v2-main">'+
 '<section class="gbm-v2-front"><article class="gbm-v2-lead">'+storyLink(lead,'gbm-v2-lead-link')+media(lead,'gbm-v2-lead-media',true)+'<div class="gbm-v2-lead-copy"><span class="gbm-v2-kicker">'+esc(lead.category)+'</span><h1>'+esc(lead.title)+'</h1><p>'+excerpt(lead,190)+'</p><div class="gbm-v2-meta">'+byline(lead)+'</div></div></a></article><aside class="gbm-v2-top"><div class="gbm-v2-block-title"><h2>Top Stories</h2><span>Right now</span></div>'+top.map(topStory).join('')+'</aside></section>'+
 '<section class="gbm-v2-wire"><div class="gbm-v2-block-title"><h2>Latest</h2><span>News wire</span></div><ol>'+latest.map(wireItem).join('')+'</ol></section>'+
 '<section class="gbm-v2-voices"><article>'+storyLink(franz,'')+'<span class="gbm-v2-kicker">Franz Beard</span><h2>Thoughts of the Day</h2><h3>'+esc(franz.title)+'</h3><p>'+excerpt(franz,125)+'</p><span class="gbm-v2-read">Read Franz →</span></a></article><article>'+storyLink(buddy,'')+'<span class="gbm-v2-kicker">Buddy Martin</span><h2>From the Founder</h2><h3>'+esc(buddy.title)+'</h3><p>'+excerpt(buddy,125)+'</p><span class="gbm-v2-read">Read Buddy →</span></a></article><aside class="gbm-v2-most"><div class="gbm-v2-block-title"><h2>Trending</h2><span>Recent</span></div>'+posts.slice(3,7).map(function(p,i){return'<a href="'+esc(p.link)+'"><b>'+(i+1)+'</b><span>'+esc(p.title)+'</span></a>';}).join('')+'</aside></section>'+
 '<section class="gbm-v2-tv"><div><span class="gbm-v2-kicker">GatorBait TV</span><h2>The Buddy Martin Show</h2><p>Florida football, SEC voices and the people who know the program best.</p></div><a href="/the-buddy-martin-show">Watch GatorBait TV →</a></section>'+
 '<div id="football">'+section('Football',football)+'</div><div id="recruiting">'+section('Recruiting',recruiting)+'</div><div id="basketball">'+section('Basketball',basketball)+'</div><div id="baseball">'+section('Baseball',baseball)+'</div>'+
 '<section class="gbm-v2-utility"><div><strong>GatorBait since 1979.</strong><span>Old-school journalism. Modern delivery.</span></div><div><a href="/pricing-plans">Join GatorBait</a><a href="'+STORE+'">Shop</a><a href="/contact">Contact</a></div></section>'+
 '</main>';
 var shellHost=document.getElementById('gbm-mobile-shell-host');
 if(shellHost&&shellHost.parentNode)shellHost.parentNode.insertBefore(root,shellHost.nextSibling);
 else document.body.insertBefore(root,document.body.firstChild);
 html.classList.add('gbm-v2-ready');
 document.dispatchEvent(new CustomEvent('gbm:v2-ready',{detail:{stories:posts.length}}));
}
function fail(err){console.error('[GBM V2]',err);html.classList.remove('gbm-v2-live','gbm-standalone-live');html.classList.add('gbm-v2-failed');}
function start(){if(!window.GBMV2Data){setTimeout(start,30);return;}window.GBMV2Data.load().then(render).catch(fail);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();