(function(){
'use strict';
if(window.__GBM_STANDALONE_NEWSROOM__)return;
window.__GBM_STANDALONE_NEWSROOM__=1;

var LOGO='https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp';
var FEATURE_SLUGS=[
'welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast',
'florida-auburn-grudge-match-the-only-thing-missing-is-gordon-solie',
'laura-rutledge-returns-to-the-buddy-martin-show-carlton-reese-remembers-14-days-in-gainesville'
];
var HIDE_HOME_SLUGS=[
'live-now-best-friday-in-football-september-18-2026',
'watch-live-the-buddy-martin-show-florida-heads-to-auburn-and-the-road-gets-real',
'welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast-1'
];
var LIVE_GAME_SLUG='live-florida-auburn-game-tracker-score-updates';
var PREGAME_SLUGS=[
'welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast',
'florida-auburn-grudge-match-the-only-thing-missing-is-gordon-solie',
'week-3-preview-florida-gators-2-0-0-0-v-auburn-tigers-2-0-0-0',
'florida-at-auburn-ryan-urquhart-says-the-gators-must-embrace-the-villain-role',
'florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play'
];
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
var IMAGE_FALLBACKS={
'live-florida-auburn-game-tracker-score-updates':'https://static.wixstatic.com/media/d3cfa5_fba223d163154615a34f00db0411ffcb~mv2.png',
'welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast':'https://static.wixstatic.com/media/d3cfa5_e0a5961689134b0bbf2f320bd82f6e7a~mv2.png',
'florida-auburn-grudge-match-the-only-thing-missing-is-gordon-solie':'https://static.wixstatic.com/media/a99769_f422e2b2eb0c4fccb5400143f80a1a8e~mv2.jpeg',
'laura-rutledge-returns-to-the-buddy-martin-show-carlton-reese-remembers-14-days-in-gainesville':'https://static.wixstatic.com/media/d3cfa5_66ca0317b876431b8cfcb910becc6376~mv2.png',
'week-3-preview-florida-gators-2-0-0-0-v-auburn-tigers-2-0-0-0':'https://static.wixstatic.com/media/d3cfa5_77949cc88d0e4fb39c78f7f1c2a60728~mv2.png',
'florida-at-auburn-ryan-urquhart-says-the-gators-must-embrace-the-villain-role':'https://static.wixstatic.com/media/ae876a_5a44257742a9441dbadef605f65b541f~mv2.jpeg'
};
var DISPLAY_TITLES={
'welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast':'Welcome to the Killing Fields',
'florida-auburn-grudge-match-the-only-thing-missing-is-gordon-solie':'Florida-Auburn Grudge Match',
'laura-rutledge-returns-to-the-buddy-martin-show-carlton-reese-remembers-14-days-in-gainesville':'Carlton Reese Remembers 14 Days in Gainesville'
};
var FEATURE_LABELS={
'live-florida-auburn-game-tracker-score-updates':'LIVE GAME TRACKER',
'welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast':'Buddy Martin',
'florida-auburn-grudge-match-the-only-thing-missing-is-gordon-solie':'Franz Beard',
'laura-rutledge-returns-to-the-buddy-martin-show-carlton-reese-remembers-14-days-in-gainesville':'Carlton Reese'
};
var lastPath='';

function home(){var p=(location.pathname||'').replace(/\/+$/,'');return p===''||p==='/';}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});}
function clean(raw,max){var d=document.createElement('div');d.innerHTML=raw||'';var s=(d.textContent||'').replace(/\s+/g,' ').trim();if(s.length>max)s=s.slice(0,max).replace(/[\s,;:.!—-]+$/,'')+'…';return s;}
function local(url){if(!url)return'#';return url.replace(/^https?:\/\/[^/]+/i,'');}
function slug(link){return(link||'').replace(/^\/post\//,'').replace(/\/+$/,'');}
function isMagazine(link){return MAGAZINE_SLUGS.indexOf(slug(link))>-1;}
function isFeature(link){return FEATURE_SLUGS.indexOf(slug(link))>-1;}
function isPerformance(link){return PERFORMANCE_SLUGS.indexOf(slug(link))>-1;}
function isHiddenHome(link){return HIDE_HOME_SLUGS.indexOf(slug(link))>-1;}
function isPregame(link){return PREGAME_SLUGS.indexOf(slug(link))>-1;}
function isStaleBuddyLivePromo(p){var t=((p&&p.title)||'').toLowerCase();return t.indexOf('buddy martin')>-1&&(t.indexOf('live')>-1||t.indexOf('watch')>-1||t.indexOf('tonight')>-1||t.indexOf('9 p')>-1||t.indexOf('9pm')>-1);}
function dateText(d){try{return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}catch(e){return'';}}
function creator(item){var all=item.getElementsByTagNameNS?item.getElementsByTagNameNS('*','creator'):[];if(all&&all[0])return(all[0].textContent||'GatorBait Staff').trim();var plain=item.querySelector('creator');return plain?(plain.textContent||'GatorBait Staff').trim():'GatorBait Staff';}
function image(item){var e=item.querySelector('enclosure');if(e&&e.getAttribute('url'))return e.getAttribute('url');var nodes=item.getElementsByTagName('*');for(var i=0;i<nodes.length;i++){var n=nodes[i],name=(n.localName||n.nodeName||'').toLowerCase();if((name==='content'||name==='thumbnail')&&n.getAttribute&&n.getAttribute('url')){var u=n.getAttribute('url');if(/^https?:/i.test(u))return u;}}return'';}

function feed(){
return fetch('/blog-feed.xml?gbm='+Date.now(),{credentials:'same-origin',cache:'no-store'})
.then(function(r){if(!r.ok)throw new Error('feed '+r.status);return r.text();})
.then(function(xml){
var doc=new DOMParser().parseFromString(xml,'application/xml');
var items=Array.prototype.slice.call(doc.querySelectorAll('item'));
return items.map(function(item){
function t(tag){var n=item.querySelector(tag);return n?n.textContent:'';}
var raw=t('pubDate'),d=raw?new Date(raw):new Date(0),link=local(t('link').trim()),s=slug(link),pic=image(item)||IMAGE_FALLBACKS[s]||'';
return{title:t('title').trim(),desc:t('description'),link:link,img:pic,who:creator(item),date:d};
}).filter(function(p){
return p.title&&/^\/post\//.test(p.link)&&!isHiddenHome(p.link)&&!isStaleBuddyLivePromo(p)&&(!isMagazine(p.link)||isFeature(p.link)||isPerformance(p.link));
}).sort(function(a,b){return b.date.getTime()-a.date.getTime();}).slice(0,40);
});
}

function media(p,cls,eager,safe){
if(!p||!p.img)return'<div class="'+cls+' no-image" aria-hidden="true"></div>';
return'<div class="'+cls+(safe?' safe-art':'')+'"><img '+(eager?'fetchpriority="high" loading="eager"':'loading="lazy"')+' decoding="async" src="'+esc(p.img)+'" alt="'+esc(p.title)+'"></div>';
}
function meta(p){return esc(dateText(p.date));}
function byline(p){return esc(p.who||'GatorBait Staff')+' · '+esc(dateText(p.date));}
function findPost(posts,s){for(var i=0;i<posts.length;i++){if(slug(posts[i].link)===s)return posts[i];}return null;}
function titleFor(p){var s=slug(p.link);return s===LIVE_GAME_SLUG?p.title:(DISPLAY_TITLES[s]||p.title);}
function labelFor(p){return FEATURE_LABELS[slug(p.link)]||p.who||'GatorBait';}

function featureLead(p){
var s=slug(p.link);
return'<article class="feature-lead"><a href="'+esc(p.link)+'">'+media(p,'feature-lead-media',true,s==='welcome-to-the-killing-fields-why-jordan-hare-eats-gators-for-breakfast'||s===LIVE_GAME_SLUG)+'<div class="feature-caption"><span class="feature-label">'+esc(labelFor(p))+'</span><h1>'+esc(titleFor(p))+'</h1><p>'+esc(clean(p.desc,170))+'</p><div class="meta">'+byline(p)+'</div></div></a></article>';
}
function featureSide(p){
var s=slug(p.link);
return'<article class="feature-side"><a href="'+esc(p.link)+'">'+media(p,'feature-side-media',false,s==='laura-rutledge-returns-to-the-buddy-martin-show-carlton-reese-remembers-14-days-in-gainesville')+'<div class="feature-side-copy"><span class="feature-label">'+esc(labelFor(p))+'</span><h2>'+esc(titleFor(p))+'</h2><p>'+esc(clean(p.desc,100))+'</p></div></a></article>';
}
function newsCard(p){
return'<a class="news-card" href="'+esc(p.link)+'">'+media(p,'news-card-media',false,false)+'<div class="news-card-copy"><span class="kicker">'+esc(p.who||'GatorBait')+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(clean(p.desc,118))+'</p><div class="meta">'+meta(p)+'</div></div></a>';
}
function trendItem(p,i){
return'<a class="trend-item" href="'+esc(p.link)+'"><span class="trend-num">'+(i+1)+'</span><span><strong>'+esc(titleFor(p))+'</strong><em>'+esc(clean(p.desc,88))+'</em></span></a>';
}

function build(posts){
var ordered=posts.slice().sort(function(a,b){return b.date.getTime()-a.date.getTime();});
var buddy=ordered[0];
var franz=ordered[1];
var carlton=ordered[2];
var latest=ordered.slice(3,7);
var trending=ordered.slice(7,12);

var subscribe='mailto:brenden@gatorbaitmedia.com?subject=Subscribe%20me%20to%20GatorBait%20Magazine&body=Please%20add%20me%20to%20GatorBait%20Magazine.%20I%20consent%20to%20receive%20marketing%20emails%20and%20understand%20I%20can%20unsubscribe%20at%20any%20time.';
var featureStage='<section class="feature-stage" aria-label="Featured stories">'+featureLead(buddy)+((franz||carlton)?'<div class="feature-stack">'+(franz?featureSide(franz):'')+(carlton?featureSide(carlton):'')+'</div>':'')+'</section>';

return''+
'<a class="skip" href="#gbm-main">Skip to stories</a>'+
'<header class="site-header"><div class="mast"><a class="brand" href="/" aria-label="GatorBait Media home"><img src="'+LOGO+'" alt="GatorBait Media" width="900" height="241" decoding="async"></a><div class="brand-promise"><strong>OLD SCHOOL JOURNALISM</strong><span>+</span><strong>NEW TECH</strong></div><a class="support" href="/pricing-plans">JOIN GATORBAIT</a></div><nav class="primary" aria-label="Primary navigation"><a href="/" aria-current="page">News</a><a href="/magazine">Magazine</a><a href="/the-buddy-martin-show">GatorBait TV</a><a href="/the-buddy-martin-show">Buddy Martin Show</a><a href="https://gatorbait2026.itemorder.com/shop/home/">Shop</a><a class="join" href="/pricing-plans">Join</a></nav></header>'+
'<main id="gbm-main">'+
featureStage+
'<section class="news-zone"><div class="latest-news"><div class="section-head"><h2>Latest News</h2><a href="/gatorbait-media-blogs">More news →</a></div><div class="latest-grid">'+latest.map(newsCard).join('')+'</div></div><aside class="trending" aria-labelledby="gbm-trending"><div class="section-head"><h2 id="gbm-trending">Trending Now</h2></div>'+trending.map(trendItem).join('')+'</aside></section>'+
'<section class="tv-band"><div><span>GATORBAIT TV</span><h2>Watch the conversation behind the stories.</h2><p>The Buddy Martin Show, Florida Gator Lowdown, Best Friday in Football and SEC coverage.</p></div><a href="/the-buddy-martin-show">WATCH GATORBAIT TV →</a></section>'+
'<section class="destinations" aria-label="GatorBait destinations"><a href="/the-buddy-martin-show"><span>SHOW</span><strong>The Buddy Martin Show</strong><em>Full episodes and interviews.</em></a><a href="/magazine"><span>READ</span><strong>GatorBait Magazine</strong><em>Features, history and people.</em></a><a href="https://gatorbait2026.itemorder.com/shop/home/"><span>SHOP</span><strong>Rep the Gators</strong><em>Hats, visors, shirts and more.</em></a></section>'+
'<section class="newsletter" aria-labelledby="gbm-newsletter"><div><span>THE EMAIL EDITION</span><h2 id="gbm-newsletter">GatorBait Magazine</h2><p>Get the strongest GatorBait stories and game-week coverage in your inbox.</p></div><a href="'+subscribe+'">Get GatorBait Magazine</a></section>'+
'</main>'+
'<footer aria-label="GatorBait Media footer"><div class="footer-inner"><div class="footer-brand"><img src="'+LOGO+'" alt="GatorBait Media" width="900" height="241" loading="lazy" decoding="async"><p>Independent Florida Gators coverage.</p></div><div class="footer-contact"><strong>Contact</strong><a href="mailto:brenden@gatorbaitmedia.com">brenden@gatorbaitmedia.com</a><br><span>1524 SE 22nd Ave<br>Ocala, FL 34471</span></div><nav class="footer-links" aria-label="Footer links"><a href="https://www.facebook.com/gatorbaitmedia">Facebook</a><a href="https://www.youtube.com/@GatorBaitMedia?sub_confirmation=1">YouTube</a><a href="/contact">Contact</a><a href="/policies">Privacy &amp; Terms</a></nav></div><div class="footer-bottom"><div class="compliance-note">Email communications include a clear unsubscribe option. Privacy and site-use terms are available in our policies.</div><div>© 2026 GatorBait Media. All rights reserved.</div></div></footer>';
}

function removeAppInvite(){
var nodes=document.querySelectorAll('body *');
for(var i=0;i<nodes.length;i++){
var el=nodes[i];
if(el.id==='gbm-live'||el.closest&&el.closest('#gbm-live'))continue;
var txt=(el.innerText||'').replace(/\s+/g,' ').trim().toLowerCase();
if(!txt||txt.length>220)continue;
var hit=txt.indexOf('join us in our app')>-1||txt.indexOf('join us on the app')>-1||txt.indexOf('join our app')>-1||txt.indexOf('open in app')>-1||(txt.indexOf('spaces by wix')>-1&&txt.indexOf('join')>-1);
if(!hit)continue;
var box=el;
for(var j=0;j<4&&box.parentElement&&box.parentElement!==document.body;j++){var p=box.parentElement,pt=(p.innerText||'').replace(/\s+/g,' ').trim();if(pt.length<=320)box=p;else break;}
box.style.setProperty('display','none','important');
box.setAttribute('aria-hidden','true');
}
}

function unmount(){document.documentElement.classList.remove('gbm-standalone-live');var old=document.getElementById('gbm-live');if(old)old.remove();}
function mount(posts){if(!home()||!posts||posts.length<4)return;var root=document.getElementById('gbm-live');if(!root){root=document.createElement('div');root.id='gbm-live';document.body.insertBefore(root,document.body.firstChild);}root.innerHTML=build(posts);document.documentElement.classList.add('gbm-standalone-live');removeAppInvite();}
function refresh(){if(!home()){unmount();return;}feed().then(mount).catch(function(e){console.error('GatorBait newsroom feed',e);});}
function routeCheck(){var p=location.pathname;if(p!==lastPath){lastPath=p;refresh();}removeAppInvite();}
function installRouteWatch(){
if(window.__GBM_ROUTE_WATCH__)return;window.__GBM_ROUTE_WATCH__=1;
['pushState','replaceState'].forEach(function(k){var orig=history[k];if(typeof orig!=='function')return;history[k]=function(){var r=orig.apply(this,arguments);try{window.dispatchEvent(new Event('gbmroutechange'));}catch(e){}return r;};});
}
installRouteWatch();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){lastPath=location.pathname;refresh();removeAppInvite();},{once:true});else{lastPath=location.pathname;refresh();removeAppInvite();}
window.addEventListener('popstate',routeCheck);
window.addEventListener('gbmroutechange',routeCheck);
try{var inviteObs=new MutationObserver(function(){removeAppInvite();});inviteObs.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){inviteObs.disconnect();},20000);}catch(e){}
})();