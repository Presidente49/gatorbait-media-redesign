(function(){
'use strict';
if(window.__GBM_UI_LAYER__)return;window.__GBM_UI_LAYER__=1;
var SUPPORT='brenden@gatorademedia.com';
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
function storeGet(k){try{return parseInt(localStorage.getItem(k)||'0',10)||0}catch(e){return 0}}
function storeSet(k,v){try{localStorage.setItem(k,String(v))}catch(e){}}
function close(id){var e=document.getElementById(id);if(e)e.remove();}
function modal(id,html){close(id);var w=document.createElement('div');w.id=id;w.className='gbm-modal';w.setAttribute('role','dialog');w.setAttribute('aria-modal','true');w.innerHTML=html;document.body.appendChild(w);var x=w.querySelector('.gbm-modal-close');if(x)x.focus();w.addEventListener('click',function(e){if(e.target===w)close(id)});return w;}
function showNewsletter(){
 if(document.getElementById('gbm-news-modal'))return;
 var last=storeGet('gbmNewsletterPromptAt');if(last&&Date.now()-last<14*86400000)return;
 var href=mail('Subscribe me to GatorBait Weekly','Please add me to GatorBait Weekly. I consent to receive marketing emails from GatorBait Media and understand I can unsubscribe at any time.\n\nMy name: ');
 var w=modal('gbm-news-modal','<div class="gbm-modal-card"><button class="gbm-modal-close" type="button" aria-label="Close">×</button><span class="gbm-modal-eyebrow">GATORBAIT WEEKLY</span><h2>Get the latest Gators stories</h2><p>Join the GatorBait email list for new stories, show updates and breaking news. You can unsubscribe at any time.</p><div class="gbm-modal-actions"><a class="gbm-modal-btn orange" href="'+href+'">Sign up for GatorBait Weekly</a><button class="gbm-modal-btn alt gbm-no-thanks" type="button">No thanks</button></div><p class="gbm-modal-note">We will never add you to marketing email or text alerts without your choice.</p></div>');
 function dismiss(){storeSet('gbmNewsletterPromptAt',Date.now());close('gbm-news-modal');}
 w.querySelector('.gbm-modal-close').onclick=dismiss;w.querySelector('.gbm-no-thanks').onclick=dismiss;var a=w.querySelector('a');a.onclick=function(){storeSet('gbmNewsletterPromptAt',Date.now())};
}
function showAccount(){
 var cancel=mail('Cancel my GatorBait membership','Please help me cancel my GatorBait membership/subscription at the end of the current billing period.\n\nName on account:\nEmail on account:');
 var unsub=mail('Unsubscribe me from GatorBait Weekly','Please unsubscribe this email address from GatorBait marketing/newsletter emails.\n\nEmail to remove:');
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
function decorateHome(){if(!home())return;var ks=document.querySelectorAll('#gbm-live .kicker');for(var i=0;i<ks.length;i++){var k=ks[i];if(k.dataset.gbmAuthor==='1')continue;var a=authorFromText(k.textContent);if(!a)continue;k.dataset.gbmAuthor='1';k.innerHTML='<a class="gbm-author-link" href="'+profile(a)+'">'+a.name+'</a>';k.insertAdjacentHTML('afterend','<button type="button" class="gbm-writer-alerts" data-gbm-writer="'+norm(a.name)+'">Follow / alerts</button>');}}
function decoratePost(){if(!post())return;var links=document.querySelectorAll('a[href*="/profile/"]');for(var i=0;i<links.length;i++){var l=links[i];if(l.dataset.gbmWriterDone==='1')continue;var a=authorFromText(l.textContent);if(!a)continue;l.dataset.gbmWriterDone='1';l.insertAdjacentHTML('afterend','<button type="button" class="gbm-writer-alerts" data-gbm-writer="'+norm(a.name)+'">Follow / alerts</button>');break;}}
function accountControls(){
 var tools=document.querySelector('.gbm-account-tools'),fab=document.getElementById('gbm-account-fab');
 if(home()){
   if(fab)fab.remove();
   if(!tools){var root=document.getElementById('gbm-live');if(root){tools=document.createElement('div');tools.className='gbm-account-tools';tools.innerHTML='<button type="button" data-gbm-account>Manage membership / cancel</button><a href="'+mail('Unsubscribe me from GatorBait Weekly','Please unsubscribe this email address from GatorBait marketing/newsletter emails.\n\nEmail to remove:')+'">Newsletter unsubscribe</a>';var f=root.querySelector('footer');if(f)root.insertBefore(tools,f);}}
 }else{
   if(tools)tools.remove();
   if(post()){if(!fab){fab=document.createElement('button');fab.id='gbm-account-fab';fab.type='button';fab.textContent='Account & preferences';document.body.appendChild(fab);}}
   else if(fab)fab.remove();
 }
}
function suppressAppInvite(){var all=document.querySelectorAll('body *');for(var i=0;i<all.length;i++){var e=all[i];if(e.closest&&e.closest('#gbm-live,.gbm-modal'))continue;var t=norm(e.innerText);if(!t||t.length>220)continue;if(t.indexOf('join us in our app')>-1||t.indexOf('join our app')>-1||t.indexOf('open in app')>-1||(t.indexOf('spaces by wix')>-1&&t.indexOf('join')>-1)){var box=e;for(var j=0;j<3&&box.parentElement&&box.parentElement!==document.body;j++){var p=box.parentElement;if(norm(p.innerText).length<=320)box=p;else break;}box.style.setProperty('display','none','important');box.setAttribute('aria-hidden','true');}}}
function route(){if(!home())document.documentElement.classList.remove('gbm-newsroom-boot','gbm-standalone-live');decorateHome();decoratePost();accountControls();suppressAppInvite();}
document.addEventListener('click',function(e){var acc=e.target.closest&&e.target.closest('[data-gbm-account],#gbm-account-fab');if(acc){e.preventDefault();showAccount();return}var w=e.target.closest&&e.target.closest('[data-gbm-writer]');if(w){e.preventDefault();var a=AUTHORS[w.getAttribute('data-gbm-writer')];if(a)showWriter(a);}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){close('gbm-news-modal');close('gbm-account-modal');close('gbm-writer-modal')}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){route();setTimeout(showNewsletter,30000)},{once:true});else{route();setTimeout(showNewsletter,30000)}
setInterval(route,1200);
try{var o=new MutationObserver(function(){decorateHome();decoratePost();suppressAppInvite()});o.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
