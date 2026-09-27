(function(){
'use strict';
if(window.__GBM_LP__)return;window.__GBM_LP__=1;
var H=document.documentElement,timer=0,sig='';
function isFeed(){return !!document.querySelector('[data-hook=feed-page-root]');}
function txt(el){return el?(el.textContent||'').replace(/\s+/g,' ').trim():'';}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function size(u,w,h){return u?u.replace(/w_\d+,h_\d+/,'w_'+w+',h_'+h):'';}
function items(){
 var out=[],seen={},ws=document.querySelectorAll('[data-hook=feed-page-root] [data-hook=post-list-item]');
 for(var i=0;i<ws.length;i++){
  var w=ws[i],t=w.querySelector('[data-hook=post-title]'),a=t&&t.closest('a')||w.querySelector('a[href*="/post/"]');
  var href=a&&a.getAttribute('href');if(!href||seen[href])continue;seen[href]=1;
  var box=w.closest('[data-hook=item-container]')||w.closest('.item-link-wrapper'),img=box&&(box.querySelector('img[data-hook=gallery-item-image-img]')||box.querySelector('img'));
  out.push({href:href,title:txt(t),img:img&&(img.currentSrc||img.getAttribute('src'))||'',cat:txt(w.querySelector('[data-hook=post-category-label]')),by:txt(w.querySelector('[data-hook=user-name]')),ago:txt(w.querySelector('[data-hook=time-ago]')),read:txt(w.querySelector('[data-hook=time-to-read]'))});
 }
 return out;
}
function pageTitle(){
 var m=location.pathname.match(/\/categories\/([^/]+)/);
 if(m){var n=document.querySelector('[data-hook="header-navigation__/categories/'+m[1]+'"]');return txt(n)||m[1].replace(/-/g,' ');}
 return 'Latest';
}
function by(s){return '<span class="lp-by">'+(s.by?'<b>'+esc(s.by)+'</b>':'')+(s.ago?'<span>'+esc(s.ago)+'</span>':'')+(s.read?'<span>'+esc(s.read)+'</span>':'')+'</span>';}
function pic(s,w,h,eager){return '<span class="lp-img">'+(s.img?'<img alt="" src="'+esc(size(s.img,w,h))+'"'+(eager?' fetchpriority="high"':' loading="lazy"')+' decoding="async">':'')+'</span>';}
function cat(s){return s.cat?'<span class="lp-cat">'+esc(s.cat)+'</span>':'';}
function build(list){
 var lead=list[0],rail=list.slice(1,4),grid=list.slice(4),d=new Date();
 var date=d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
 var h='<header class="lp-mast"><div><span class="lp-kick">GatorBait Media</span><h1>'+esc(pageTitle())+'</h1></div><div class="lp-date"><b>'+esc(date)+'</b>'+(lead&&lead.ago?'Updated '+esc(lead.ago):'')+'</div></header>';
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
function mount(){
 if(!isFeed())return false;
 var list=items(),g=document.querySelector('[data-hook=feed-page-root] [data-hook=post-list-pro-gallery-container]');
 if(!g||!list.length||!list[0].title)return false;
 var s=location.pathname+'|'+list.map(function(x){return x.href;}).join(',')+'|'+pager();
 var root=document.getElementById('gbm-lp');
 if(root&&s===sig&&root.isConnected&&root.nextSibling===g)return true;
 if(!root){root=document.createElement('section');root.id='gbm-lp';root.setAttribute('aria-label','Latest stories');}
 root.innerHTML=build(list);
 var host=g.parentNode;if(root.parentNode!==host||root.nextSibling!==g)host.insertBefore(root,g);
 sig=s;H.classList.add('gbm-lp-on');return true;
}
function tryMount(){try{return mount();}catch(e){console.warn('[GatorBait] latest page',e);H.classList.remove('gbm-lp-on');return false;}}
function onFeedPath(){return /^\/gatorbait-media-blogs(\/|$)/.test(location.pathname);}
function start(){
 clearInterval(timer);
 if(!onFeedPath()&&!isFeed()){H.classList.remove('gbm-lp-on','gbm-lp-wait');mo.disconnect();watching=0;return;}
 H.classList.add('gbm-lp-wait');var t0=Date.now();watch();
 timer=setInterval(function(){var ok=tryMount();if(ok||Date.now()-t0>4000){clearInterval(timer);H.classList.remove('gbm-lp-wait');}},60);
}
// Wix hydrates/re-renders the blog React tree after first paint and can drop nodes it doesn't own.
// On feed pages, watch the body and re-mount (debounced) whenever our section is missing or the list changed.
var watching=0,mo=new MutationObserver(function(){clearTimeout(mo.t);mo.t=setTimeout(function(){if(isFeed())tryMount();else if(!onFeedPath()){mo.disconnect();watching=0;}},150);});
function watch(){if(watching||!document.body){if(!document.body)document.addEventListener('DOMContentLoaded',watch,{once:true});return;}watching=1;mo.observe(document.body,{childList:true,subtree:true});}
function soon(){setTimeout(start,250);setTimeout(start,1200);}
start();
window.addEventListener('popstate',soon);window.addEventListener('gbmroutechange',soon);
document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(a&&/gatorbait-media-blogs/.test(a.getAttribute('href')||''))soon();},true);
})();
