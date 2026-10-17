(function(){"use strict";if(window.__GBM_SHARED_SITE_HEADER__)return;window.__GBM_SHARED_SITE_HEADER__=1;
var S="https://gatorbait2026.itemorder.com/shop/home/",G="/post/florida-gators-2026-roster-and-schedule-update-auburn-opens-sec-play",
F=' target="_blank" rel="noopener" aria-label="Shop GatorBait gear (opens in a new tab)"',
M=[["Front Page","/"],["Latest","/gatorbait-media-blogs"],["Magazine","/magazine"],["TV &amp; Podcasts","/the-buddy-martin-show"],["Scores &amp; Schedule",G+"#schedule"],["Roster",G+"#roster"],["Community","/groups"]],
T=[["GatorBait TV","The Buddy Martin Show, Mon., Wed. and Thurs., 9 p.m. ET","/the-buddy-martin-show"],["GatorBait TV","Florida Gator Lowdown, Tues., 9 p.m. ET","/the-buddy-martin-show"],["Magazine","This week's GatorBait Magazine","/magazine"],["Football","2026 roster and schedule",G+"#schedule"]],
N=null;
/* inner pages load no Barlow files today (the homepage loader is S1's); load the faces this shell uses */
location.pathname.replace(/\/+$/,"")&&!document.getElementById("gbm-bc-fonts")&&document.head.appendChild(Object.assign(document.createElement("style"),{id:"gbm-bc-fonts",textContent:[["barlow",400,"normal"],["barlow",700,"normal"],["barlow-condensed",700,"normal"],["barlow-condensed",800,"normal"],["barlow-condensed",800,"italic"],["barlow-condensed",900,"italic"]].map(function(f){return'@font-face{font-family:"'+(f[0]=="barlow"?"Barlow":"Barlow Condensed")+'";font-weight:'+f[1]+";font-style:"+f[2]+";font-display:swap;src:url(https://cdn.jsdelivr.net/npm/@fontsource/"+f[0]+"@5.3.0/files/"+f[0]+"-latin-"+f[1]+"-"+f[2]+'.woff2) format("woff2")}'}).join("")}));
function shop(c,t){return'<a class="'+c+'" href="'+S+'"'+F+">"+t+' <span aria-hidden="true">↗</span></a>'}
/* phone bar shop button and drawer menu (markup from fdc2127a) */
function mob(){var e=document.getElementById("gbm-mobile-shell"),t=document.getElementById("gbm-mobile-menu-toggle"),a=document.querySelector("#gbm-mobile-drawer-root .gbm-ms-nav"),o={};
e&&t&&!e.querySelector(".gbm-ms-shop")&&t.insertAdjacentHTML("beforebegin",shop("gbm-ms-shop",'Shop<span class="gbm-x">&nbsp;Gear</span>'));
document.querySelectorAll(".gbm-ms-logo,.gbm-ms-head a").forEach(function(l){l.setAttribute("aria-label","GatorBait Media home")});
if(!a||a.getAttribute("data-gbm-menu"))return;a.setAttribute("data-gbm-menu","5");
a.querySelectorAll("a").forEach(function(n){o[n.getAttribute("href")]=n;n.style.display="none"});
M.concat([[0,S],[0,"/pricing-plans"],[0,"/account/my-account"],[0,"/contact"]]).forEach(function(n){var r=o[n[1]];if(n[1]===S)return a.insertAdjacentHTML("beforeend",shop("gbm-ms-shop","Shop GatorBait Gear"));if(!r){if(!n[0])return;r=document.createElement("a");r.setAttribute("data-gbm-route","");r.setAttribute("href",n[1])}n[0]&&(r.innerHTML=n[0]);r.style.display="";a.appendChild(r)})}
addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("a[href]"),a;if(!t||e.button||e.metaKey||e.ctrlKey||e.shiftKey||t.target==="_blank")return;a=t.href;if(a.indexOf("itemorder.com")<0){if(!/^\/category\/all-products\/?$/.test(t.pathname))return;a=S}e.preventDefault();e.stopPropagation();open(a,"_blank","noopener")},!0);
document.addEventListener("gbm:mobile-shell-ready",function(){mob();place()});
/* ticker: newest headlines from the blog feed, then standing items */
function run(h){var r=document.querySelector("#gbm-site-header .sh-run");if(!r)return;var L=(N||[]).concat(T);r.textContent="";
[0,1].forEach(function(k){L.forEach(function(x){var a=document.createElement("a"),m=document.createElement("em");a.href=x[2];m.textContent=x[0];a.appendChild(m);a.appendChild(document.createTextNode(x[1]));if(k){a.tabIndex=-1;a.setAttribute("aria-hidden","true")}r.appendChild(a)})})}
function feed(){try{var c=JSON.parse(sessionStorage.getItem("gbmTick")||"0");if(c&&Date.now()-c.t<6e5){N=c.n;return run()}}catch(e){}
fetch("/blog-feed.xml",{cache:"no-cache"}).then(function(r){return r.ok?r.text():""}).then(function(x){if(!x)return;var d=new DOMParser().parseFromString(x,"text/xml"),I=[].slice.call(d.querySelectorAll("item")).map(function(i){var q=function(s){var n=i.querySelector(s);return n?n.textContent.trim():""},u;try{u=new URL(q("link"),location.href);if(u.host!==location.host)return 0}catch(e){return 0}return[Date.parse(q("pubDate"))||0,q("title"),u.pathname]}).filter(function(i){return i&&i[1]}).sort(function(a,b){return b[0]-a[0]}).slice(0,4);
if(!I.length)return;N=I.map(function(i){return["Latest",i[1],i[2]]});try{sessionStorage.setItem("gbmTick",JSON.stringify({t:Date.now(),n:N}))}catch(e){}run()}).catch(function(){})}
/* keep the header (ticker) above the phone bar */
function place(){var t=document.getElementById("gbm-site-header"),m=document.getElementById("gbm-mobile-shell-host");t&&m&&m.parentNode===t.parentNode&&t.compareDocumentPosition(m)&Node.DOCUMENT_POSITION_PRECEDING&&m.before(t)}
function d(){mob();var e=location.pathname.replace(/\/+$/,"")||"/",t=document.getElementById("gbm-site-header");if(e==="/"){t&&t.remove();return}if(!document.body)return;
if(e==="/contact"){var b=document.querySelector("#comp-lii7mqe42 button[data-testid=buttonElement]");if(b){b.setAttribute("aria-label","Send message");var o=b.querySelector("span");o&&o.textContent.trim()===">"&&(o.textContent="Send message")}}
if(!t){t=document.createElement("header");t.id="gbm-site-header";
t.innerHTML='<div class="sh-tick"><span class="sh-bug" aria-hidden="true">GB</span><div class="sh-track" role="region" aria-label="GatorBait ticker"><div class="sh-run"></div></div><div class="sh-util"><a href="/gatorbait-media-blogs#gbm-lp-search">Search</a><a href="/account/my-account">Sign in</a>'+shop("sh-shop","Shop Gear")+'</div></div><div class="sh-bar"><div class="sh-inner"><a class="sh-logo" href="/" aria-label="GatorBait Media home">Gator<b>Bait</b><small>Media</small></a><nav aria-label="GatorBait sections">'+M.map(function(n){return'<a href="'+n[1]+'">'+n[0]+"</a>"}).join("")+'</nav><a class="sh-cta" href="/pricing-plans"><span>Join GatorBait →</span></a></div></div>';
document.body.insertBefore(t,document.body.firstChild);run()}
place();
t.querySelectorAll("nav a").forEach(function(n){var r=new URL(n.href).pathname,p=!n.hash&&(r===e||r==="/gatorbait-media-blogs"&&(e.indexOf("/gatorbait-media-blogs/")===0||e.indexOf("/post/")===0));p?n.setAttribute("aria-current","page"):n.removeAttribute("aria-current")})}
function s(){[0,200,800,1800,4e3,8e3].forEach(function(e){setTimeout(d,e)})}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",s,{once:!0}):s();
document.body||new MutationObserver(function(e,t){document.body&&(t.disconnect(),d())}).observe(document.documentElement,{childList:!0});
document.readyState==="complete"?setTimeout(feed,1200):addEventListener("load",function(){setTimeout(feed,1200)},{once:!0});
function l(){if(location.pathname!=="/contact")return;var e=0,t=new MutationObserver(function(){e||(e=requestAnimationFrame(function(){e=0;var a=document.querySelector("#comp-lii7mqe42 button[data-testid=buttonElement]");a&&a.getAttribute("aria-label")!=="Send message"&&d()}))});t.observe(document.body,{childList:!0,subtree:!0});setTimeout(function(){t.disconnect()},15e3)}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",l,{once:!0}):l();
addEventListener("popstate",s);addEventListener("gbmroutechange",s)})();
