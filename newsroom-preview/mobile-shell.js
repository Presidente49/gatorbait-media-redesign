(function(){
'use strict';
if(window.__GBM_MOBILE_SHELL__)return;window.__GBM_MOBILE_SHELL__=1;
var LOGO='https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp';
var SHOP='https://gatorbait2026.itemorder.com/shop/home/';
var mq=window.matchMedia('(max-width:820px)');
var lastFocus=null;
function path(){return (location.pathname||'/').replace(/\/+$/,'')||'/';}
function current(href){var p=path();if(href==='/')return p==='/';return p===href||p.indexOf(href+'/')===0;}
function close(){document.documentElement.classList.remove('gbm-mobile-menu-open');var t=document.getElementById('gbm-mobile-menu-toggle');if(t)t.setAttribute('aria-expanded','false');if(lastFocus&&lastFocus.focus)try{lastFocus.focus()}catch(e){};}
function open(){lastFocus=document.activeElement;document.documentElement.classList.add('gbm-mobile-menu-open');var t=document.getElementById('gbm-mobile-menu-toggle');if(t)t.setAttribute('aria-expanded','true');var x=document.querySelector('#gbm-mobile-drawer-root .gbm-ms-close');if(x)setTimeout(function(){x.focus()},20);}
function active(){var links=document.querySelectorAll('#gbm-mobile-drawer-root [data-gbm-route]');for(var i=0;i<links.length;i++){var a=links[i],href=a.getAttribute('href');if(current(href))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}}
function markup(){return ''+
'<header id="gbm-mobile-shell" aria-label="GatorBait mobile masthead">'+
'<a class="gbm-ms-logo" href="/" aria-label="GatorBait Media front page"><img src="'+LOGO+'" width="900" height="241" alt="GatorBait Media"></a>'+
'<button id="gbm-mobile-menu-toggle" class="gbm-ms-trigger" type="button" aria-expanded="false" aria-controls="gbm-mobile-drawer"><span>Menu</span><span class="gbm-ms-bars" aria-hidden="true"><i></i><i></i><i></i></span></button>'+
'</header>'+
'<div id="gbm-mobile-drawer-root"><div class="gbm-ms-backdrop" data-gbm-close></div><aside id="gbm-mobile-drawer" class="gbm-ms-panel" aria-label="GatorBait navigation">'+
'<div class="gbm-ms-head"><a href="/" aria-label="GatorBait Media front page"><img src="'+LOGO+'" width="900" height="241" alt="GatorBait Media"></a><button class="gbm-ms-close" type="button" aria-label="Close menu">×</button></div>'+
'<nav class="gbm-ms-nav" aria-label="Primary mobile navigation">'+
'<a data-gbm-route href="/">Front Page</a>'+
'<a data-gbm-route href="/magazine">Magazine</a>'+
'<a data-gbm-route href="/the-buddy-martin-show">GatorBait TV</a>'+
'<a data-gbm-route href="/podcasts">Podcasts</a>'+
'<a data-gbm-route href="/message-board">Message Board</a>'+
'<a href="'+SHOP+'" target="_blank" rel="noopener">Shop</a>'+
'<a data-gbm-route class="gbm-ms-join" href="/pricing-plans">Join GatorBait</a>'+
'<button type="button" class="gbm-ms-account" data-gbm-account>Account &amp; preferences</button>'+
'<a data-gbm-route href="/contact">Contact</a>'+
'</nav>'+
'<div class="gbm-ms-foot">Independent Florida coverage since 1979.<br><a href="/policies">Privacy &amp; terms</a></div>'+
'</aside></div>';}
function build(){
 if(document.getElementById('gbm-mobile-shell')){active();return;}
 if(!document.body)return;
 var w=document.createElement('div');w.id='gbm-mobile-shell-host';w.innerHTML=markup();
 document.body.insertBefore(w,document.body.firstChild);
 var toggle=document.getElementById('gbm-mobile-menu-toggle');if(toggle)toggle.addEventListener('click',function(){document.documentElement.classList.contains('gbm-mobile-menu-open')?close():open()});
 var root=document.getElementById('gbm-mobile-drawer-root');if(root){root.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-gbm-close],.gbm-ms-close')){e.preventDefault();close();return}var a=e.target.closest&&e.target.closest('a');if(a)close();var acc=e.target.closest&&e.target.closest('[data-gbm-account]');if(acc){setTimeout(function(){if(!document.getElementById('gbm-account-modal'))location.href='/account/my-account';},180);close();}});}
 active();
}
function sync(){if(!mq.matches)close();active();}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.documentElement.classList.contains('gbm-mobile-menu-open'))close();});
window.addEventListener('popstate',function(){setTimeout(sync,0)});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(a)setTimeout(sync,80);});
if(mq.addEventListener)mq.addEventListener('change',sync);else if(mq.addListener)mq.addListener(sync);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
