/* GatorBait TV: explicit public playlists, click-to-load players, one active player.
 * Owner: embed 82c4ca83. Keep its native-page hide stylesheet; this replaces only its TV runtime.
 * IDs: deploy/broadcast-playlists-20261020/playlists.json. No YouTube/API writes or live-status claim. */
(function(){
'use strict';
var VERSION='playlists-20261020';
if(window.__GBM_MEDIA_HUB__===VERSION)return;
window.__GBM_MEDIA_HUB__=VERSION;
var CHANNEL='UCtR8b1sKFuwaRjKy5BiXRvA',BASE='https://www.gatorbaitmedia.com',active=null,timers=[];
var items=[
 {key:'live',title:'The Buddy Martin Show live channel',label:'Live channel',mark:'Gator<span>Bait</span>',sub:'The Buddy Martin Show',button:'Open live player',href:'https://www.youtube.com/@TheBuddyMartinShow/live'},
 {key:'lowdown',id:'PLIekxRlp1omM',title:'Florida Gator Lowdown with Loren Meadows',label:'Florida Gator Lowdown',mark:'LOW<span>DOWN</span>',sub:'With Loren Meadows',button:'Open Lowdown playlist',href:'https://www.youtube.com/playlist?list=PLIekxRlp1omM'},
 {key:'podcasts',id:'PL1twZqsaZwxneDPF2RojFUTMXgr-OK41I',title:'The Buddy Martin Show Podcast',label:'The Buddy Martin Show Podcast',mark:'BUDDY<span>MARTIN</span>',sub:'The podcast',button:'Open podcast playlist',href:'https://www.youtube.com/playlist?list=PL1twZqsaZwxneDPF2RojFUTMXgr-OK41I'},
 {key:'shorts',id:'PL1twZqsaZwxnM5F4xVYTJlia_-IIIHgKa',title:'The Buddy Martin Show Shorts',label:'Shorts',mark:'THE SHORT<span>TAKE</span>',sub:'The Buddy Martin Show',button:'Open Shorts playlist',href:'https://www.youtube.com/playlist?list=PL1twZqsaZwxnM5F4xVYTJlia_-IIIHgKa'}
];
function esc(v){return String(v).replace(/[&<>"']/g,function(c){return'&#'+c.charCodeAt(0)+';';});}
var CSS=`
@font-face{font-family:GBMHubBarlow;font-style:normal;font-weight:400;font-display:swap;src:url(https://presidente49.github.io/gatorbait-media-redesign/assets/weather/Barlow-400.woff2) format('woff2')}
@font-face{font-family:GBMHubBarlow;font-style:normal;font-weight:700;font-display:swap;src:url(https://presidente49.github.io/gatorbait-media-redesign/assets/weather/Barlow-700.woff2) format('woff2')}
@font-face{font-family:GBMHubBarlow;font-style:normal;font-weight:800;font-display:swap;src:url(https://presidente49.github.io/gatorbait-media-redesign/assets/weather/Barlow-800.woff2) format('woff2')}
#gbm-media-hub{--bp-navy:#06112d;--bp-ink:#0b1c49;--bp-orange:#fa4616;--bp-soft:#cdd6ee;position:relative;z-index:3;padding:42px 24px 38px;color:#fff;font:400 16px/1.55 GBMHubBarlow,Barlow,Arial,sans-serif;background:radial-gradient(ellipse 900px 480px at 100% 0,#12359c66,transparent 75%),linear-gradient(180deg,#071738,#06112d 75%)}
#gbm-media-hub *,#gbm-media-hub *:before,#gbm-media-hub *:after{box-sizing:border-box}
#gbm-media-hub [hidden]{display:none!important}
#gbm-media-hub .bp-wrap{max-width:1184px;margin:auto}
#gbm-media-hub h1,#gbm-media-hub h2,#gbm-media-hub h3{font-family:GBMHubBarlow,Barlow,Arial,sans-serif;font-style:normal;letter-spacing:-.025em;text-transform:none;text-shadow:none;color:#fff}
#gbm-media-hub h1{max-width:none;margin:10px 0 14px;font-size:clamp(38px,5.5vw,68px);font-weight:800;line-height:1.02}
#gbm-media-hub h2{margin:7px 0 12px;font-size:clamp(26px,2.7vw,36px);font-weight:800;line-height:1.1}
#gbm-media-hub p{color:var(--bp-soft)}
#gbm-media-hub a{color:inherit;text-underline-offset:4px}
#gbm-media-hub a:hover{color:#fff}
#gbm-media-hub a:focus-visible,#gbm-media-hub button:focus-visible,#gbm-media-hub iframe:focus-visible{outline:3px solid #ffb39a;outline-offset:4px}
#gbm-media-hub h1,#gbm-media-hub h2,#gbm-media-hub h3,#gbm-media-hub button,#gbm-media-hub .bp-mark,#gbm-media-hub .bp-mark>span,#gbm-media-hub .bp-play,#gbm-media-hub .bp-poster-sub{font-family:GBMHubBarlow,Barlow,Arial,sans-serif!important}
#gbm-media-hub .bp-close{background:transparent!important;color:#fff!important}
#gbm-media-hub button{font-style:normal;letter-spacing:normal;text-transform:none;clip-path:none;box-shadow:none}
#gbm-media-hub .bp-eyebrow{display:flex;align-items:center;gap:10px;margin:0;font-size:12px;font-weight:700;line-height:1.5;letter-spacing:.14em;text-transform:uppercase;color:#fff}
#gbm-media-hub .bp-eyebrow:before{content:'';width:26px;height:3px;flex:none;background:var(--bp-orange)}
#gbm-media-hub .bp-intro{max-width:68ch;margin:0;font-size:18px;line-height:1.6}
#gbm-media-hub .bp-jump{display:flex;flex-wrap:wrap;gap:6px 22px;margin:20px 0 25px;padding:0;list-style:none;border-bottom:1px solid #ffffff24}
#gbm-media-hub .bp-jump a{display:inline-flex;align-items:center;min-height:48px;font-size:14px;font-weight:700;text-decoration:none;color:var(--bp-soft)}
#gbm-media-hub .bp-live{display:grid;grid-template-columns:minmax(0,1.75fr) minmax(0,1fr);align-items:center;gap:30px;padding:24px;border:1px solid #ffffff24;border-radius:18px;background:#ffffff05;box-shadow:0 18px 50px #00000024}
#gbm-media-hub .bp-player{position:relative;min-width:0;aspect-ratio:16/9;background:#040b20;border:1px solid #ffffff20;border-radius:12px;overflow:hidden}
#gbm-media-hub .bp-player iframe{display:block;width:100%;height:100%;border:0;position:absolute;inset:0}
#gbm-media-hub .bp-poster{position:absolute;inset:0;width:100%;height:100%;min-height:44px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:18px;border:0;border-radius:0;cursor:pointer;color:#fff;background:linear-gradient(135deg,#102d72,#081b41 64%,#09112b)!important;font-family:GBMHubBarlow,Barlow,Arial,sans-serif;text-align:center}
#gbm-media-hub .bp-poster:before{content:'';position:absolute;right:-12%;top:-65%;width:50%;height:220%;transform:rotate(26deg);background:#ffffff05;pointer-events:none}
#gbm-media-hub .bp-poster:hover{background:linear-gradient(135deg,#173c8b,#0a2051 64%,#0b1636)!important}
#gbm-media-hub .bp-mark{position:relative;display:block;font-size:clamp(27px,3.4vw,49px);font-weight:800;line-height:.95;letter-spacing:-.04em;color:#fff}
#gbm-media-hub .bp-mark>span{display:block;color:#ff764c}
#gbm-media-hub .bp-player[data-key=live] .bp-mark{font-size:clamp(38px,4.5vw,64px)}
#gbm-media-hub .bp-player[data-key=live] .bp-mark>span{display:inline;color:var(--bp-orange)}
#gbm-media-hub .bp-poster-sub{position:relative;font-size:11px;font-weight:700;line-height:1.4;letter-spacing:.12em;text-transform:uppercase;color:#dae1f4}
#gbm-media-hub .bp-play{display:flex;align-items:center;justify-content:center;gap:9px;position:relative;min-height:44px;margin-top:3px;padding:8px 14px;border-radius:7px;background:var(--bp-orange);color:#06112d;font-size:13px;font-weight:800;line-height:1.2}
#gbm-media-hub .bp-play svg{width:12px;height:14px;flex:none;fill:currentColor}
#gbm-media-hub .bp-live-copy{min-width:0}
#gbm-media-hub .bp-live-copy p:not(.bp-eyebrow){margin:0 0 14px}
#gbm-media-hub .bp-direct{display:inline-flex;align-items:center;min-height:44px;margin:0;font-size:14px;font-weight:700;line-height:1.4;text-decoration:underline;color:#fff}
#gbm-media-hub .bp-close{display:inline-flex;align-items:center;justify-content:center;min-height:44px;margin:8px 0 0;padding:0 12px;cursor:pointer;border:1px solid #ffffff48;border-radius:6px;background:transparent;color:#fff;font:700 13px/1.3 GBMHubBarlow,Barlow,Arial,sans-serif}
#gbm-media-hub .bp-library-heading{display:flex;align-items:baseline;justify-content:space-between;gap:10px 30px;flex-wrap:wrap;margin:36px 0 18px}
#gbm-media-hub .bp-library-heading h2{margin:0;font-size:29px}
#gbm-media-hub .bp-library-heading p{margin:0;font-size:14px}
#gbm-media-hub .bp-programs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
#gbm-media-hub .bp-module{min-width:0;padding:20px;border:1px solid #ffffff24;border-radius:14px;background:#0b1c49}
#gbm-media-hub .bp-module header{min-height:104px}
#gbm-media-hub .bp-module h2{font-size:25px;margin:7px 0 14px}
#gbm-media-hub .bp-module .bp-eyebrow{font-size:11px;letter-spacing:.09em}
#gbm-media-hub .bp-module p:not(.bp-eyebrow){margin:16px 0 8px;font-size:15px;line-height:1.6}
#gbm-media-hub .bp-module .bp-listen{margin-top:8px;padding-top:10px;border-top:1px solid #ffffff20}
#gbm-media-hub .bp-listen a{display:flex;align-items:center;min-height:44px;font-size:13px;line-height:1.45;color:var(--bp-soft)}
#gbm-media-hub .bp-status{min-height:22px;margin:15px 0 0;font-size:13px;line-height:1.6;color:var(--bp-soft)}
#gbm-media-hub .bp-related{display:flex;flex-wrap:wrap;gap:0 26px;margin-top:28px;padding-top:15px;border-top:1px solid #ffffff24}
#gbm-media-hub .bp-related a{display:inline-flex;align-items:center;min-height:44px;font-size:14px;font-weight:700;text-decoration:none;color:var(--bp-soft)}
@media(max-width:820px){
#gbm-media-hub{padding:26px 16px 30px}
#gbm-media-hub .bp-live{grid-template-columns:minmax(0,1fr);gap:20px;padding:16px;border-radius:14px}
#gbm-media-hub .bp-intro{font-size:16px}
#gbm-media-hub .bp-jump{gap:0 18px;margin:14px 0 20px}
#gbm-media-hub .bp-jump a{font-size:13px;min-height:46px}
#gbm-media-hub .bp-live-copy h2{font-size:28px}
#gbm-media-hub .bp-programs{grid-template-columns:minmax(0,1fr);gap:18px}
#gbm-media-hub .bp-module{padding:18px}
#gbm-media-hub .bp-module header{min-height:0}
#gbm-media-hub .bp-module h2{font-size:26px}
#gbm-media-hub .bp-mark{font-size:clamp(27px,9vw,42px)}
#gbm-media-hub .bp-player[data-key=live] .bp-mark{font-size:clamp(34px,11vw,52px)}
#gbm-media-hub .bp-library-heading{margin-top:28px;gap:7px}
#gbm-media-hub .bp-library-heading h2{font-size:27px}
#gbm-media-hub .bp-poster{gap:8px;padding:14px}
#gbm-media-hub .bp-play{font-size:12px;padding:8px 11px}
#gbm-media-hub .bp-poster-sub{font-size:10px;letter-spacing:.09em}
}
@media(max-width:560px){#gbm-media-hub .bp-poster-sub{display:none}}
@media(prefers-reduced-motion:reduce){#gbm-media-hub{scroll-behavior:auto}}
`;
function style(){if(document.getElementById('gbm-broadcast-playlists-css'))return;var s=document.createElement('style');s.id='gbm-broadcast-playlists-css';s.textContent=CSS;document.head.appendChild(s);}
function poster(item){return'<button class="bp-poster" type="button" data-bp-load="'+item.key+'" aria-label="'+esc(item.button)+'"><span class="bp-mark">'+item.mark+'</span><span class="bp-poster-sub">'+esc(item.sub)+'</span><span class="bp-play"><svg viewBox="0 0 12 14" aria-hidden="true"><path d="M0 0 12 7 0 14Z"/></svg>'+esc(item.button)+'</span></button>';}
function player(item){return'<div class="bp-player" data-key="'+item.key+'">'+poster(item)+'</div><button class="bp-close" type="button" data-bp-close="'+item.key+'" hidden>Close player</button>';}
function external(h,t,cls){return'<a'+(cls?' class="'+cls+'"':'')+' href="'+esc(h)+'" target="_blank" rel="noopener noreferrer">'+esc(t)+'</a>';}
function module(item,eyebrow,description){return'<section class="bp-module" id="'+item.key+'" aria-labelledby="bp-'+item.key+'-title"><header><p class="bp-eyebrow">'+esc(eyebrow)+'</p><h2 id="bp-'+item.key+'-title">'+esc(item.label)+'</h2></header>'+player(item)+'<p>'+esc(description)+'</p>'+external(item.href,'Open this playlist on YouTube','bp-direct')+(item.key==='podcasts'?'<div class="bp-listen">'+external('https://music.youtube.com/playlist?list='+item.id,'Listen on YouTube Music')+external('https://podcasts.apple.com/us/podcast/the-buddy-martin-show/id1321645302','Older audio: Apple Podcasts archive')+'</div>':'')+'</section>';}
function reset(){if(!active)return;var prior=active;active=null;prior.box.innerHTML=poster(prior.item);var close=prior.box.parentNode.querySelector('[data-bp-close="'+prior.item.key+'"]');if(close)close.hidden=true;}
function anchor(){return [document.getElementById('gbm-site-header'),document.getElementById('gbm-mobile-shell-host')].filter(function(a){return a&&a.parentNode===document.body;}).sort(function(a,b){return a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1;}).pop()||null;}
function sync(){var on=/^\/the-buddy-martin-show\/?$/.test(location.pathname),old=document.getElementById('gbm-media-hub');if(!on){reset();if(old)old.remove();return;}if(!document.body)return;style();var a=anchor();if(old&&old.dataset.bpVersion===VERSION){if(a&&a.nextElementSibling!==old)a.after(old);return;}if(old)old.remove();reset();
var m=document.createElement('main');m.id='gbm-media-hub';m.dataset.bpVersion=VERSION;m.innerHTML='<div class="bp-wrap"><header><p class="bp-eyebrow">GatorBait TV & audio</p><h1>The Buddy Martin Show</h1><p class="bp-intro">Gator conversation, your way. Watch the channel, catch Lowdown with Loren Meadows, or choose a podcast or short.</p><nav aria-label="Choose a show"><ul class="bp-jump"><li><a href="#live-channel">Live channel</a></li><li><a href="#lowdown">Lowdown with Loren</a></li><li><a href="#podcasts">Podcast</a></li><li><a href="#shorts">Shorts</a></li></ul></nav></header><section class="bp-live" id="live-channel" aria-labelledby="bp-live-title"><div>'+player(items[0])+'</div><div class="bp-live-copy"><p class="bp-eyebrow">Live channel</p><h2 id="bp-live-title">Catch the conversation.</h2><p>Open the channel player, then press Play. If the channel is off air, choose a playlist below.</p>'+external(items[0].href,'Open the live channel on YouTube','bp-direct')+'</div></section><div class="bp-library-heading"><h2>Find your show.</h2><p>Three playlists. Three ways to catch up.</p></div><div class="bp-programs">'+module(items[1],'With Loren Meadows','Florida Gators football news, analysis and conversation with Loren Meadows.')+module(items[2],'Full conversations','Watch The Buddy Martin Show podcast here, or take the conversation with you on YouTube Music.')+module(items[3],'Short-form video','Shorts from The Buddy Martin Show. A quick way into the conversation.')+'</div><p class="bp-status" role="status" aria-live="polite">Choose a player above. If it cannot load, use its YouTube link.</p><nav class="bp-related" aria-label="Keep exploring"><a href="'+BASE+'/gatorbait-media-blogs">Latest stories</a><a href="'+BASE+'/magazine">GatorBait Magazine</a><a href="'+BASE+'/contact">Contact the newsroom</a></nav></div>';
if(a)a.after(m);else document.body.insertBefore(m,document.body.firstChild);
m.addEventListener('click',function(ev){var b=ev.target.closest('button[data-bp-load],button[data-bp-close]');if(!b||!m.contains(b))return;var key=b.getAttribute('data-bp-load')||b.getAttribute('data-bp-close'),item=items.find(function(v){return v.key===key;});if(!item)return;var status=m.querySelector('.bp-status');if(b.hasAttribute('data-bp-close')){reset();status.textContent='Player closed. Choose a show to watch.';var back=m.querySelector('[data-bp-load="'+key+'"]');if(back)back.focus();return;}reset();var box=m.querySelector('.bp-player[data-key="'+key+'"]'),f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+(key==='live'?'live_stream?channel='+CHANNEL:'videoseries?list='+encodeURIComponent(item.id))+'&autoplay=0&playsinline=1&rel=0';f.title=item.title+(key==='live'?' player':' playlist player');f.allow='encrypted-media; picture-in-picture; fullscreen';f.referrerPolicy='strict-origin-when-cross-origin';f.allowFullscreen=true;box.replaceChildren(f);active={box:box,item:item};box.parentNode.querySelector('[data-bp-close="'+key+'"]').hidden=false;status.textContent=item.title+' player opened. Press Play in the player; use the YouTube link if it is unavailable.';f.focus({preventScroll:true});});
}
function schedule(){timers.forEach(clearTimeout);timers=[0,250,900,1800,3500,6000,10000].map(function(ms){return setTimeout(sync,ms);});}
schedule();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});addEventListener('popstate',schedule);addEventListener('gbmroutechange',schedule);
})();
