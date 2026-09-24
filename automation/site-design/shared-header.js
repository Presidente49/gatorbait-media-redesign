(function(){
 'use strict';
 if(window.__GBM_SHARED_SITE_HEADER__)return;window.__GBM_SHARED_SITE_HEADER__=true;
 var links=[['Front Page','/'],['Latest','/gatorbait-media-blogs'],['Magazine','/magazine'],['GatorBait TV','/the-buddy-martin-show'],['Podcasts','/the-buddy-martin-show#podcasts'],['Message Board','/#community'],['Store','https://gatorbait2026.itemorder.com/shop/home/'],['Sign in','/account/my-account']];
 function sync(){
  var p=location.pathname.replace(/\/+$/,'')||'/',old=document.getElementById('gbm-site-header');
  if(p==='/'){if(old)old.remove();return;}
  if(!document.body)return;
  if(p==='/contact'){var submit=document.querySelector('#comp-lii7mqe42 button[data-testid=buttonElement]');if(submit){submit.setAttribute('aria-label','Send message');var label=submit.querySelector('span');if(label&&label.textContent.trim()==='>')label.textContent='Send message';}}
  if(!old){old=document.createElement('header');old.id='gbm-site-header';old.innerHTML='<div class="sh-inner"><div class="sh-brand"><a href="/" aria-label="GatorBait home"><img width="900" height="241" src="https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp" alt="GatorBait"></a><p>Independent voices.<br><strong>Unmistakably GatorBait.</strong></p><a class="sh-join" href="/pricing-plans">Join GatorBait →</a></div><nav aria-label="GatorBait sections">'+links.map(function(l){return'<a href="'+l[1]+'">'+l[0]+'</a>'}).join('')+'</nav></div>';document.body.insertBefore(old,document.body.firstChild);}
  old.querySelectorAll('nav a').forEach(function(a){var dest=new URL(a.href).pathname;var current=dest===p||(dest==='/gatorbait-media-blogs'&&(p.indexOf('/gatorbait-media-blogs/')===0||p.indexOf('/post/')===0));if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 }
 function schedule(){[0,200,800,1800,4000,8000].forEach(function(ms){setTimeout(sync,ms);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 function watchContact(){if(location.pathname!=='/contact')return;var observer=new MutationObserver(function(){var b=document.querySelector('#comp-lii7mqe42 button[data-testid=buttonElement]');if(b&&b.getAttribute('aria-label')!=='Send message')sync();});observer.observe(document.body,{childList:true,subtree:true});setTimeout(function(){observer.disconnect();},15000);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watchContact,{once:true});else watchContact();
 window.addEventListener('popstate',schedule);window.addEventListener('gbmroutechange',schedule);
})();
