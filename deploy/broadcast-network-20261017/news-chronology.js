(function(){
'use strict';
if(window.__GBM_LP__)return;window.__GBM_LP__=1;
var H=document.documentElement,timer=0,sig='',cache={};
function isFeed(){return !!document.querySelector('[data-hook=feed-page-root]');}
function txt(el){return el?(el.textContent||'').replace(/\s+/g,' ').trim():'';}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function size(u,w,h){return u?u.replace(/w_\d+,h_\d+/,'w_'+w+',h_'+h):'';}

/* Publication order comes from the same Wix response; a publisher pin does not outrank it. */
var LP_DATE_SEED = {"/post/aberdeen-will-be-in-the-lineup-against-baylor-on-sunday": "2026-10-17T10:30:02.154Z", "/post/is-the-sec-undergoing-a-drain-of-excellence": "2026-10-16T20:08:54.995Z", "/post/the-soothsayer-texas-big-unless-the-uf-defense-finds-an-exorcist": "2026-10-16T11:06:34.785Z", "/post/buddy-martin-show-live-tonight-philo-jones-texas": "2026-10-16T00:31:58.002Z", "/post/qb1-philo-hurt-qb2-jones-to-start-explained-by-that-great-football-mind-ted-lasso": "2026-10-15T14:31:03Z", "/post/so-you-re-saying-there-s-a-chance-1": "2026-10-15T11:52:43.840Z", "/post/philo-s-injury-could-give-tramell-jones-jr-his-opening": "2026-10-14T23:41:40.972Z", "/post/report-aaron-philo-s-status-uncertain-for-florida-s-trip-to-texas": "2026-10-14T19:15:39Z", "/post/thoughts-of-the-day-october-14-2026": "2026-10-14T13:18:24.923Z", "/post/buddy-blog-a-gator-ass-whipping-with-bowl-projections-in-the-ashes": "2026-10-13T15:36:00.173Z", "/post/philo-is-the-florida-quarterback-at-least-for-now": "2026-10-13T12:51:07Z", "/post/numbers-don-t-lie": "2026-10-12T22:22:23Z", "/post/gators-picked-to-win-sec-basketball-title": "2026-10-12T21:19:22Z", "/post/an-anatomy-of-total-gator-collapse-a-swamp-strewn-with-broken-dreams": "2026-10-12T19:06:37Z", "/post/texas-opens-as-a-10-point-favorite-against-florida": "2026-10-12T11:34:38.201Z", "/post/gators-drop-out-ap-top-25-october-11-2026": "2026-10-11T18:35:56Z", "/post/buddy-blog-can-sumrall-swim-in-the-deep-end-of-this-cesspool": "2026-10-11T16:27:39Z", "/post/from-the-sideline-chris-spears-on-the-500th-game-in-the-swamp": "2026-10-11T16:22:47.149Z", "/post/members-read-the-texas-pregame-magazine": "2026-10-11T16:00:00Z", "/post/members-download-the-postgame-magazine-pdf": "2026-10-11T13:37:37.127Z", "/post/after-a-second-sobering-loss-can-florida-s-season-still-be-salvaged": "2026-10-11T10:34:55.254Z", "/post/chris-spears-best-shots-south-carolina-38-florida-19": "2026-10-11T04:44:19.522Z"},lpDates=null,lpDatesStamp=-1;
function publicationDates(){
var warm=document.getElementById('wix-warmup-data'),stamp=warm?warm.textContent.length:0;if(lpDates&&lpDatesStamp===stamp)return lpDates;lpDatesStamp=stamp;lpDates={};Object.keys(LP_DATE_SEED).forEach(function(k){lpDates[k]=Date.parse(LP_DATE_SEED[k])||0;});
function visit(o,depth){if(!o||depth>28)return;if(typeof o==='string'){if(o.indexOf('firstPublishedDate')>=0&&/^[\s]*[\[{]/.test(o)){try{visit(JSON.parse(o),depth+1);}catch(_){}}return;}if(typeof o!=='object')return;
if(o.firstPublishedDate){var path=o.url&&o.url.path||o.path||'',stamp=Date.parse(o.firstPublishedDate);if(!path&&typeof o.url==='string'){try{path=new URL(o.url,location.href).pathname;}catch(_){}}if(!path&&o.slug)path='/post/'+o.slug;if(path.indexOf('/post/')===0&&stamp)lpDates[path]=stamp;}
Object.keys(o).forEach(function(k){if(k!=='richContent'&&k!=='seoData')visit(o[k],depth+1);});}
if(warm){try{visit(JSON.parse(warm.textContent),0);}catch(_){}}return lpDates;
}
function published(href,w){var path;try{path=new URL(href,location.href).pathname;}catch(_){return 0;}var exact=publicationDates()[path];if(exact)return exact;var time=w.querySelector('time[datetime],[data-published-date]'),stamp=time&&Date.parse(time.getAttribute('datetime')||time.getAttribute('data-published-date'));return stamp||0;}

function items(){
var out=[],seen={},ws=document.querySelectorAll('[data-hook=feed-page-root] [data-hook=post-list-item]');
for(var i=0;i<ws.length;i++){
var w=ws[i],t=w.querySelector('[data-hook=post-title]')||w.querySelector('h2,h3'),a=t&&t.closest('a')||w.querySelector('a[href*="/post/"]');
var href=a&&a.getAttribute('href');if(!href||seen[href])continue;seen[href]=1;
var box=w.closest('[data-hook=item-container]')||w.closest('.item-link-wrapper')||w,img=box&&(box.querySelector('img[data-hook=gallery-item-image-img]')||box.querySelector('img'));
var ix=img&&img.getAttribute('data-idx');
var src=img&&(img.currentSrc||img.getAttribute('src'))||'';if(!src){var wi=w.querySelector('wow-image[data-image-info]');try{var ii=wi&&JSON.parse(wi.getAttribute('data-image-info')).imageData;if(ii&&ii.uri)src='https://static.wixstatic.com/media/'+ii.uri+'/v1/fill/w_640,h_360,al_c,q_80,enc_auto/'+ii.uri;}catch(_){}}
out.push({published:published(href,w),i:ix!=null&&ix!==''?+ix:i,href:href,title:txt(t),img:src,cat:txt(w.querySelector('[data-hook=post-category-label]')),by:txt(w.querySelector('[data-hook=user-name]')),ago:txt(w.querySelector('[data-hook=time-ago]')),read:txt(w.querySelector('[data-hook=time-to-read]'))});
}
if(cache.key!==location.pathname)cache={key:location.pathname,by:{}};
out.forEach(function(x){var o=cache.by[x.href];if(!o||(!o.img&&x.img)||o.published!==x.published||o.title!==x.title)cache.by[x.href]=x;});
return Object.keys(cache.by).map(function(k){return cache.by[k];}).sort(function(a,b){return a.published&&b.published?b.published-a.published||a.i-b.i:a.i-b.i;});
}
function pageTitle(){
var m=location.pathname.match(/\/categories\/([^/]+)/);
if(m){var n=document.querySelector('[data-hook="header-navigation__/categories/'+m[1]+'"]');return txt(n)||m[1].replace(/-/g,' ');}
var tg=location.pathname.match(/\/tags\/([^/]+)/);
if(tg){var dt=(document.title||'').split('|')[0].trim();return dt&&!/gatorbait/i.test(dt)?dt:decodeURIComponent(tg[1]).replace(/-+$/,'').replace(/-/g,' ');}
return 'Latest';
}
function by(s){return '<span class="lp-by">'+(s.by?'<b>'+esc(s.by)+'</b>':'')+(s.ago?'<span>'+esc(s.ago)+'</span>':'')+(s.read?'<span>'+esc(s.read)+'</span>':'')+'</span>';}
function pic(s,w,h,eager){return '<span class="lp-img">'+(s.img?'<img alt="" src="'+esc(size(s.img,w,h))+'"'+(eager?' fetchpriority="high"':' loading="lazy"')+' decoding="async">':'')+'</span>';}
function cat(s){return '';}
function build(list){
var lead=list[0],rail=list.slice(1,4),grid=list.slice(4),d=new Date();
var date=d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'America/New_York'});
var h='<header class="lp-mast"><div><span class="lp-kick">GatorBait Media</span><h1>'+esc(pageTitle())+'</h1></div><div class="lp-date"><b>'+esc(date)+'</b>'+'</div></header>';
h+='<form id="gbm-lp-search" role="search" action="https://www.google.com/search" method="get"><label for="gbm-lp-query">Search the GatorBait archive</label><input id="gbm-lp-query" name="q" type="search" placeholder="Player, writer or topic" required><input type="hidden" name="as_sitesearch" value="gatorbaitmedia.com"><button type="submit">Search</button><small>Results open on Google, limited to GatorBaitMedia.com.</small></form>';
h+='<div class="lp-top"><a class="lp-lead" href="'+esc(lead.href)+'">'+pic(lead,1280,720,1)+cat(lead)+'<h2 class="lp-hd">'+esc(lead.title)+'</h2>'+by(lead)+'</a>';
if(rail.length){h+='<div class="lp-rail"><h2>Just in</h2>';rail.forEach(function(s){h+='<a class="lp-row" href="'+esc(s.href)+'">'+pic(s,240,135)+'<span>'+cat(s)+'<h3 class="lp-hd">'+esc(s.title)+'</h3>'+by(s)+'</span></a>';});h+='</div>';}
h+='</div>';
if(grid.length){h+='<h2 class="lp-sec">More stories</h2><div class="lp-grid">';grid.forEach(function(s){h+='<a class="lp-card" href="'+esc(s.href)+'">'+pic(s,640,360)+'<span>'+cat(s)+'<h3 class="lp-hd">'+esc(s.title)+'</h3>'+by(s)+'</span></a>';});h+='</div>';}
h+=pager();
return h;
}
function pager(){
var q=function(k){var e=document.querySelector('[data-hook=feed-page-root] a[data-hook="pagination__'+k+'"]');return e&&e.getAttribute('href');};
var nx=q('next'),pv=q('previous'),last=q('last'),m=location.pathname.match(/\/page\/(\d+)/),cur=m?+m[1]:1,tot=last&&(last.match(/\/page\/(\d+)/)||[])[1];
if(!nx&&!pv)return '';
return '<nav class="lp-pager" aria-label="More pages">'+(pv?'<a href="'+esc(pv)+'">&larr; Newer stories</a>':'<i></i>')+'<span>Page '+cur+(tot?' of '+tot:'')+'</span>'+(nx?'<a href="'+esc(nx)+'">Older stories &rarr;</a>':'<i></i>')+'</nav>';
}
function gal(){return document.querySelector('[data-hook=feed-page-root] [data-hook=post-list-pro-gallery-container]')||document.querySelector('[data-hook=feed-page-root] [data-hook=post-list]');}
function mount(){
if(!isFeed())return false;
var list=items(),g=gal();
if(!g||!list.length||!list[0].title)return false;
var s=location.pathname+'|'+list.map(function(x){return x.href+'@'+x.published+'@'+x.title;}).join(',')+'|'+pager();
var root=mount.root;
if(!root){root=document.createElement('section');root.id='gbm-lp';root.setAttribute('aria-label','Latest stories');mount.root=root;}
if(s!==sig){root.innerHTML=build(list);sig=s;}      // rebuild only when the content really changed
if(root.parentNode!==g.parentNode||root.nextSibling!==g)g.parentNode.insertBefore(root,g); // re-insert same node: no image reload
H.classList.add('gbm-lp-on','gbm-lp-hold');return true;
}
function tryMount(){try{return mount();}catch(e){console.warn('[GatorBait] latest page',e);H.classList.remove('gbm-lp-hold');return false;}}
function onFeedPath(){return /^\/gatorbait-media-blogs(\/|$)/.test(location.pathname);}
function start(){
clearInterval(timer);
if(!onFeedPath()&&!isFeed()){H.classList.remove('gbm-lp-on','gbm-lp-wait','gbm-lp-hold');mo.disconnect();watching=0;return;}
H.classList.add('gbm-lp-wait');var t0=Date.now();watch();
timer=setInterval(function(){var ok=tryMount();if(ok||Date.now()-t0>4000){clearInterval(timer);H.classList.remove('gbm-lp-wait');}},60);
}
var watching=0,lastN=-1,dog=0,mo=new MutationObserver(function(){
if(!isFeed()){if(!onFeedPath()){mo.disconnect();watching=0;H.classList.remove('gbm-lp-hold');}return;}
var r=mount.root,g=gal(),n=document.querySelectorAll('[data-hook=feed-page-root] [data-hook=post-list-item]').length;
if(r&&g&&r.nextSibling===g&&n===lastN&&cache.key===location.pathname)return;
lastN=n;
if(tryMount()){clearTimeout(dog);dog=0;}
else if(!dog)dog=setTimeout(function(){dog=0;if(!(mount.root&&mount.root.isConnected))H.classList.remove('gbm-lp-hold');},1000);
});
function watch(){if(watching||!document.body){if(!document.body)document.addEventListener('DOMContentLoaded',watch,{once:true});return;}watching=1;mo.observe(document.body,{childList:true,subtree:true});}
function soon(){setTimeout(start,250);setTimeout(start,1200);}
start();
window.addEventListener('popstate',soon);window.addEventListener('gbmroutechange',soon);
document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(a&&/gatorbait-media-blogs/.test(a.getAttribute('href')||''))soon();},true);
})();