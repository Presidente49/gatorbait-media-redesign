(function(){
'use strict';
if(window.__GBM_STANDALONE_NEWSROOM__)return;
window.__GBM_STANDALONE_NEWSROOM__=1;
var LOGO='https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp';
var IMAGE_FALLBACKS={
'laura-rutledge-returns-to-the-buddy-martin-show-carlton-reese-remembers-14-days-in-gainesville':'https://static.wixstatic.com/media/d3cfa5_fc87899bd1064becb413c13d3f407d93~mv2.jpg',
'florida-at-auburn-ryan-urquhart-says-the-gators-must-embrace-the-villain-role':'https://static.wixstatic.com/media/ae876a_5a44257742a9441dbadef605f65b541f~mv2.jpeg'
};
var PERFORMANCE_SLUGS=[
'no-sugar-coating-from-sumrall-gators-have-to-get-better-in-a-hurry',
'florida-auburn-by-the-numbers-2026',
'baugh-game-really-it-was-a-brown-game-gators-flatten-campbell-52-3'
];
var MAGAZINE_SLUGS=[
'welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast-1',
'welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast',
'before-laura-rutledge-was-laura-rutledge-a-flip-phone-an-ifb-and-the-gator-country-days',
'personal-recollections-of-14-days-in-gainesville-and-the-espn-documentary',
'blood-noise-and-the-plains-the-florida-auburn-story-we-need-it-every-year',
'the-tale-of-two-gainesvilles',
'light-up-a-camel-nostalgia-the-gators-and-a-game-with-campbell-university'
];
var lastPath='';
function home(){var p=(location.pathname||'').replace(/\/+$/,'');return p===''||p==='/';}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});}
function clean(raw,max){var d=document.createElement('div');d.innerHTML=raw||'';var s=(d.textContent||'').replace(/\s+/g,' ').trim();if(s.length>max)s=s.slice(0,max).replace(/[\s,;:.!—-]+$/,'')+'…';return s;}
function local(url){if(!url)return'#';return url.replace(/^https?:\/\/[^/]+/i,'');}
function slug(link){return(link||'').replace(/^\/post\//,'').replace(/\/+$/,'');}
function magazinePost(link){return MAGAZINE_SLUGS.indexOf(slug(link))>-1;}
function performancePost(link){return PERFORMANCE_SLUGS.indexOf(slug(link))>-1;}
function leadEligible(p){var t=(p&&p.title||'').trim();return !!(p&&p.img)&&!/^WATCH\s+(LIVE|NOW)\b/i.test(t)&&!/^LIVE\b/i.test(t);}
function dateText(d){try{return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}catch(e){return'';}}
function creator(item){var all=item.getElementsByTagNameNS?item.getElementsByTagNameNS('*','creator'):[];if(all&&all[0])return(all[0].textContent||'GatorBait Staff').trim();var plain=item.querySelector('creator');return plain?(plain.textContent||'GatorBait Staff').trim():'GatorBait Staff';}
function image(item){var e=item.querySelector('enclosure');if(e&&e.getAttribute('url'))return e.getAttribute('url');var nodes=item.getElementsByTagName('*');for(var i=0;i<nodes.length;i++){var n=nodes[i],name=(n.localName||n.nodeName||'').toLowerCase();if((name==='content'||name==='thumbnail')&&n.getAttribute&&n.getAttribute('url')){var u=n.getAttribute('url');if(/^https?:/i.test(u))return u;}}return'';}
function feed(){return fetch('/blog-feed.xml?gbm='+Date.now(),{credentials:'same-origin',cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('feed '+r.status);return r.text();}).then(function(xml){var doc=new DOMParser().parseFromString(xml,'application/xml');var items=Array.prototype.slice.call(doc.querySelectorAll('item'));return items.map(function(item){function t(tag){var n=item.querySelector(tag);return n?n.textContent:'';}var raw=t('pubDate'),d=raw?new Date(raw):new Date(0),link=local(t('link').trim()),pic=image(item)||IMAGE_FALLBACKS[slug(link)]||'';return{title:t('title').trim(),desc:t('description'),link:link,img:pic,who:creator(item),date:d};}).filter(function(p){return p.title&&/^\/post\//.test(p.link)&&(!magazinePost(p.link)||performancePost(p.link));}).sort(function(a,b){return b.date.getTime()-a.date.getTime();}).slice(0,30);});}
function img(p,cls,lead){if(!p.img)return'<div class="'+cls+' no-image" aria-hidden="true"></div>';return'<div class="'+cls+'"><img '+(lead?'fetchpriority="high" loading="eager"':'loading="lazy"')+' decoding="async" src="'+esc(p.img)+'" alt="'+esc(p.title)+'"></div>';}
function meta(p){return esc(dateText(p.date));}
function leadMeta(p){return esc(p.who||'GatorBait Staff')+' · '+esc(dateText(p.date));}
function card(p){return'<a class="card" href="'+esc(p.link)+'">'+img(p,'card-media',false)+'<span class="kicker">'+esc(p.who||'GatorBait')+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(clean(p.desc,170))+'</p><div class="meta">'+meta(p)+'</div></a>';}
function compact(p){return'<a class="compact" href="'+esc(p.link)+'">'+img(p,'compact-media',false)+'<div><span class="kicker">'+esc(p.who||'GatorBait')+'</span><h3>'+esc(p.title)+'</h3><div class="meta">'+meta(p)+'</div></div></a>';}
function build(posts){var leadIndex=-1;for(var i=0;i<posts.length;i++){if(leadEligible(posts[i])){leadIndex=i;break;}}if(leadIndex<0)leadIndex=0;var lead=posts[leadIndex],rest=posts.filter(function(_,idx){return idx!==leadIndex;}),latest=rest.slice(0,4),inside=rest.slice(4,7),used={};used[slug(lead.link)]=1;latest.concat(inside).forEach(function(p){used[slug(p.link)]=1;});var trending=posts.filter(function(p){return performancePost(p.link)&&!used[slug(p.link)];}).slice(0,3);var subscribe='mailto:brenden@gatorbaitmedia.com?subject=Subscribe%20me%20to%20GatorBait%20Weekly&body=Please%20add%20me%20to%20GatorBait%20Magazine.%20I%20consent%20to%20receive%20marketing%20emails%20and%20understand%20I%20can%20unsubscribe%20at%20any%20time.';return ''+
'<a class="skip" href="#gbm-main">Skip to stories</a>'+
'<header class="site-header"><div class="mast"><a class="brand" href="/" aria-label="GatorBait Media home"><img src="'+LOGO+'" alt="GatorBait Media" width="900" height="241" decoding="async"></a><a class="support" href="/pricing-plans">JOIN GATORBAIT</a></div><nav class="primary" aria-label="Primary navigation"><a href="/" aria-current="page">Home</a><a href="/gatorbait-media-blogs">Latest</a><a href="/the-buddy-martin-show">GatorBait TV</a><a href="/magazine">Magazine</a><a href="https://gatorbait2026.itemorder.com/shop/home/">Shop</a><a class="join" href="/pricing-plans">Join</a></nav></header>'+
'<main id="gbm-main"><section class="top" aria-label="Top stories"><article class="lead"><a class="lead-link" href="'+esc(lead.link)+'">'+img(lead,'lead-media',true)+'<div class="leadcopy"><span class="kicker">Top Story</span><h1>'+esc(lead.title)+'</h1><p>'+esc(clean(lead.desc,220))+'</p><div class="meta">'+leadMeta(lead)+'</div></div></a></article><aside class="latest" aria-labelledby="gbm-latest"><div class="rule"><h2 id="gbm-latest">Latest</h2></div>'+latest.map(compact).join('')+'</aside></section>'+
'<section class="block" aria-labelledby="gbm-inside"><div class="rule rule-wide"><h2 id="gbm-inside">Inside GatorBait</h2><a href="/gatorbait-media-blogs">All stories</a></div><div class="grid">'+inside.map(card).join('')+'</div></section>'+
(trending.length?'<section class="block" aria-labelledby="gbm-trending"><div class="rule rule-wide"><h2 id="gbm-trending">Trending Now</h2><span>Most-read current stories</span></div><div class="grid">'+trending.map(card).join('')+'</div></section>':'')+
'<section class="destinations" aria-label="GatorBait destinations"><a href="/the-buddy-martin-show"><span>WATCH</span><strong>GatorBait TV</strong><em>The Buddy Martin Show, interviews and video coverage.</em></a><a href="/magazine"><span>READ</span><strong>GatorBait Magazine</strong><em>The digital home of GatorBait\'s magazine tradition.</em></a><a href="/pricing-plans"><span>SUPPORT</span><strong>Join GatorBait</strong><em>Support independent Florida Gators journalism.</em></a></section>'+
'<section class="newsletter" aria-labelledby="gbm-newsletter"><div><span>THE EMAIL EDITION</span><h2 id="gbm-newsletter">GatorBait Magazine</h2><p>Request the newsletter by email. Your request is your consent to receive GatorBait emails, and every campaign includes an unsubscribe option.</p></div><a href="'+subscribe+'">Get GatorBait Magazine</a></section></main>'+
'<footer aria-label="GatorBait Media footer"><div class="footer-inner"><div class="footer-brand"><img src="'+LOGO+'" alt="GatorBait Media" width="900" height="241" loading="lazy" decoding="async"><p>Independent Florida Gators coverage.</p></div><div class="footer-contact"><strong>Contact</strong><a href="mailto:brenden@gatorbaitmedia.com">brenden@gatorbaitmedia.com</a><br><span>1524 SE 22nd Ave<br>Ocala, FL 34471</span></div><nav class="footer-links" aria-label="Footer links"><a href="https://www.facebook.com/gatorbaitmedia">Facebook</a><a href="https://www.youtube.com/@GatorBaitMedia?sub_confirmation=1">YouTube</a><a href="/contact">Contact</a><a href="/policies">Privacy &amp; Terms</a></nav></div><div class="footer-bottom"><div class="compliance-note">Email communications include a clear unsubscribe option. Privacy and site-use terms are available in our policies.</div><nav aria-label="Legal links"><a href="/policies">Policies</a><a href="mailto:brenden@gatorbaitmedia.com">Email us</a></nav><div>© 2026 GatorBait Media. All rights reserved.</div></div></footer>';
}
function removeAppInvite(){var nodes=document.querySelectorAll('body *');for(var i=0;i<nodes.length;i++){var el=nodes[i];if(el.id==='gbm-live'||el.closest&&el.closest('#gbm-live'))continue;var txt=(el.innerText||'').replace(/\s+/g,' ').trim().toLowerCase();if(!txt||txt.length>220)continue;var hit=txt.indexOf('join us in our app')>-1||txt.indexOf('join us on the app')>-1||txt.indexOf('join our app')>-1||txt.indexOf('open in app')>-1||(txt.indexOf('spaces by wix')>-1&&txt.indexOf('join')>-1);if(!hit)continue;var box=el;for(var j=0;j<4&&box.parentElement&&box.parentElement!==document.body;j++){var p=box.parentElement,pt=(p.innerText||'').replace(/\s+/g,' ').trim();if(pt.length<=320)box=p;else break;}box.style.setProperty('display','none','important');box.setAttribute('aria-hidden','true');}}
function unmount(){document.documentElement.classList.remove('gbm-standalone-live');var old=document.getElementById('gbm-live');if(old)old.remove();}
function mount(posts){if(!home()||!posts||posts.length<4)return;var root=document.getElementById('gbm-live');if(!root){root=document.createElement('div');root.id='gbm-live';document.body.insertBefore(root,document.body.firstChild);}root.innerHTML=build(posts);document.documentElement.classList.add('gbm-standalone-live');document.documentElement.setAttribute('data-gbm-latest',posts[0].link);removeAppInvite();}
function refresh(){if(!home()){unmount();return;}feed().then(mount).catch(function(e){console.error('GatorBait newsroom feed',e);});}
function routeCheck(){var p=location.pathname;if(p!==lastPath){lastPath=p;refresh();}removeAppInvite();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){lastPath=location.pathname;refresh();removeAppInvite();},{once:true});else{lastPath=location.pathname;refresh();removeAppInvite();}
setInterval(routeCheck,500);
setInterval(function(){if(home())refresh();},300000);
window.addEventListener('popstate',routeCheck);
try{var inviteObs=new MutationObserver(function(){removeAppInvite();});inviteObs.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){inviteObs.disconnect();},20000);}catch(e){}
})();