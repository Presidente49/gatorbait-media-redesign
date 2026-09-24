(function(){
'use strict';
if(window.__GBM_UI_LAYER__)return;window.__GBM_UI_LAYER__=1;
var SUPPORT='brenden@gatorbaitmedia.com';
var AUTHORS={
'buddy martin':{name:'Buddy Martin',slug:'buddymartinshow'},
'franz beard':{name:'Franz Beard',slug:'franz'},
'loren meadows':{name:'Loren Meadows',slug:'coachmeadows'},
'eddie gilley':{name:'Eddie Gilley',slug:'eddie-gilley75145'}
};
function norm(s){return String(s||'').replace(/\s+/g,' ').trim().toLowerCase();}
function home(){var p=(location.pathname||'').replace(/\/+$/,'');return p===''||p==='/';}
function post(){return /^\/post\//.test(location.pathname||'');}
function profile(a){return '/profile/'+a.slug+'/profile';}
function mail(subject,body){return 'mailto:'+SUPPORT+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body||'');}

function close(id){var e=document.getElementById(id);if(e)e.remove();}
function modal(id,html){close(id);var w=document.createElement('div');w.id=id;w.className='gbm-modal';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.innerHTML=html;document.body.appendChild(w);var x=w.querySelector('.gbm-modal-close');if(x)x.focus();w.addEventListener('click',function(e){if(e.target===w)close(id)});return w;}
function likelySignedIn(){var h=document.getElementById('SITE_HEADER');if(!h)return false;var btns=h.querySelectorAll('[data-testid="handle-button"],.wixui-login-social-bar button,.login-social-bar button');for(var i=0;i<btns.length;i++){var t=norm(btns[i].innerText||btns[i].getAttribute('aria-label'));if(t&&!/(log in|login|sign in|sign up|join)/.test(t))return true;}return false;}
function suppressNativeNewsletter(){var boxes=document.querySelectorAll('[role="dialog"],[aria-modal="true"],[data-hook*="popup" i],[class*="lightbox" i],[class*="modal" i]');for(var i=0;i<boxes.length;i++){var b=boxes[i];if(b.id==='gbm-news-modal'||(b.closest&&b.closest('.gbm-modal')))continue;var t=norm(b.textContent);if(!t||!/(newsletter|subscribe|email address|gatorbait magazine|gatorbait weekly|today'?s edition|todays edition)/.test(t))continue;b.style.setProperty('display','none','important');b.setAttribute('aria-hidden','true');}}
function showAccount(){
 var cancel=mail('Cancel my GatorBait membership','Please help me cancel my GatorBait membership/subscription at the end of the current billing period.\n\nName on account:\nEmail on account:');
 var unsub=mail('Unsubscribe me from GatorBait Magazine','Please unsubscribe this email address from GatorBait marketing/newsletter emails.\n\nEmail to remove:');
 var w=modal('gbm-account-modal','<div class="gbm-modal-card"><button class="gbm-modal-close" type="button" aria-label="Close">×</button><span class="gbm-modal-eyebrow">ACCOUNT & PREFERENCES</span><h2>Manage your GatorBait account</h2><p>Membership, cancellation and communication choices in one place.</p><div class="gbm-modal-actions"><a class="gbm-modal-btn" href="/login">Open member account</a><a class="gbm-modal-btn alt" href="'+cancel+'">Cancel membership / stop renewal</a><a class="gbm-modal-btn alt" href="'+unsub+'">Unsubscribe from newsletter</a><a class="gbm-modal-btn alt" href="/policies">Privacy & terms</a></div><p class="gbm-modal-note">Eligible recurring plans are configured to allow cancellation. Cancellation does not automatically create a refund.</p></div>');
 w.querySelector('.gbm-modal-close').onclick=function(){close('gbm-account-modal')};
}
function showWriter(a){
 var email=mail('Email alerts for '+a.name,'I want email alerts when '+a.name+' publishes new GatorBait stories. I consent to receive these author alert emails and understand I can unsubscribe later.\n\nMy email:');
 var text=mail('Text alerts for '+a.name,'I want text/SMS alerts when '+a.name+' publishes new GatorBait stories. Please send me the opt-in instructions.\n\nMy mobile number:');
 var w=modal('gbm-writer-modal','<div class="gbm-modal-card"><button class="gbm-modal-close" type="button" aria-label="Close">×</button><span class="gbm-modal-eyebrow">FOLLOW A WRITER</span><h2>'+a.name+'</h2><p>Choose how you want to keep up with this writer. Following is separate from email and text marketing consent.</p><div class="gbm-modal-actions"><a class="gbm-modal-btn" href="'+profile(a)+'">Follow on GatorBait</a><a class="gbm-modal-btn alt" href="'+email+'">Email alerts</a><a class="gbm-modal-btn alt" href="'+text+'">Text alert opt-in</a></div></div>');
 w.querySelector('.gbm-modal-close').onclick=function(){close('gbm-writer-modal')};
}
function authorFromText(t){var n=norm(t).replace(/^by\s+/,'');return AUTHORS[n]||null;}
function decorateHome(){if(!home())return;var ks=document.querySelectorAll('#gbm-live .kicker');for(var i=0;i<ks.length;i++){var k=ks[i];if(k.dataset.gbmAuthor==='1')continue;var a=authorFromText(k.textContent);if(!a)continue;k.dataset.gbmAuthor='1';k.innerHTML='<a class="gbm-author-link" href="'+profile(a)+'">'+a.name+'</a>';}}
function decoratePost(){if(!post())return;var links=document.querySelectorAll('a[href*="/profile/"]');for(var i=0;i<links.length;i++){var l=links[i];if(l.dataset.gbmWriterDone==='1')continue;var a=authorFromText(l.textContent);if(!a)continue;l.dataset.gbmWriterDone='1';l.insertAdjacentHTML('afterend','<button type="button" class="gbm-writer-alerts" data-gbm-writer="'+norm(a.name)+'">Follow / alerts</button>');break;}}
function accountControls(){
 var tools=document.querySelector('.gbm-account-tools'),fab=document.getElementById('gbm-account-fab'),old=document.querySelector('.gbm-account-menu-item');
 if(tools)tools.remove();if(fab)fab.remove();
 var mobile=!!(window.matchMedia&&window.matchMedia('(max-width:750px)').matches);
 if(!mobile){if(old)old.remove();return;}
 var nav=document.querySelector('#SITE_HEADER nav');if(!nav)return;
 var ul=nav.querySelector('ul');if(!ul)return;
 if(!old){var li=document.createElement('li');li.className='gbm-account-menu-item';li.innerHTML='<div><button type="button" data-gbm-account>Account & preferences</button></div>';ul.appendChild(li);}
}
var gbmInviteHidden=false;
function suppressAppInvite(){
 if(gbmInviteHidden)return;
 /* Walk text nodes instead of reading innerText on every element.
    innerText is layout-dependent, so the old body-* scan forced a synchronous
    reflow per element, thousands of times per pass. textContent and a
    TreeWalker read the same strings without touching layout. */
 var hit=null,n,w;
 try{w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);}catch(e){return;}
 while((n=w.nextNode())){
  var pe=n.parentElement;if(!pe)continue;
  var tag=pe.nodeName;if(tag==='SCRIPT'||tag==='STYLE'||tag==='NOSCRIPT')continue;
  var t=norm(n.nodeValue);if(!t||t.length>220)continue;
  if(t.indexOf('join us in our app')>-1||t.indexOf('join our app')>-1||t.indexOf('open in app')>-1||(t.indexOf('spaces by wix')>-1&&t.indexOf('join')>-1)){hit=pe;break;}
 }
 if(!hit)return;
 if(hit.closest&&hit.closest('#gbm-live,.gbm-modal'))return;
 var box=hit;
 for(var j=0;j<3&&box.parentElement&&box.parentElement!==document.body;j++){
  var p=box.parentElement;
  if(norm(p.textContent).length<=320)box=p;else break;
 }
 box.style.setProperty('display','none','important');
 box.setAttribute('aria-hidden','true');
 gbmInviteHidden=true;
}
function route(){if(!home())document.documentElement.classList.remove('gbm-newsroom-boot','gbm-standalone-live');decorateHome();decoratePost();accountControls();suppressAppInvite();suppressNativeNewsletter();}
document.addEventListener('click',function(e){var acc=e.target.closest&&e.target.closest('[data-gbm-account]');if(acc){e.preventDefault();showAccount();return}var w=e.target.closest&&e.target.closest('[data-gbm-writer]');if(w){e.preventDefault();var a=AUTHORS[w.getAttribute('data-gbm-writer')];if(a)showWriter(a);}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){close('gbm-news-modal');close('gbm-account-modal');close('gbm-writer-modal')}});
function installRouteWatch(){
if(!window.__GBM_ROUTE_WATCH__){window.__GBM_ROUTE_WATCH__=1;['pushState','replaceState'].forEach(function(k){var orig=history[k];if(typeof orig!=='function')return;history[k]=function(){var r=orig.apply(this,arguments);try{window.dispatchEvent(new Event('gbmroutechange'));}catch(e){}return r;};});}
}
function routeSoon(){setTimeout(route,0);setTimeout(route,250);}
installRouteWatch();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',route,{once:true});else route();
window.addEventListener('popstate',routeSoon);
window.addEventListener('gbmroutechange',routeSoon);
/* Suppression passes stop at 3s. Hiding an element at 30s, 45s or 60s
   reflows the page under a reader who has already started reading - that is
   the jump, not a rendering bug. */
[400,1200,3000].forEach(function(ms){setTimeout(function(){suppressAppInvite();suppressNativeNewsletter();},ms);});
try{var pending=false;var o=new MutationObserver(function(){if(pending)return;pending=true;setTimeout(function(){pending=false;suppressAppInvite();suppressNativeNewsletter();},80);});o.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){o.disconnect();},8000);}catch(e){}
})();
