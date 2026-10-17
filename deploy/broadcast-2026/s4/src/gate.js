(function(){"use strict";if(window.__GBM_GATE__)return;window.__GBM_GATE__=1;
/* Paywalled story: Wix renders the teaser heading and paragraph, then (after injected story-end blocks) its Subscribe Now link.
   Build one members card right after the teaser, using Wix's own subscribe URL; the original pieces are hidden by CSS only while the card exists. */
function run(){if(!/^\/post\//.test(location.pathname)){var o=document.getElementById("gbm-gate");o&&o.remove();return}
if(document.getElementById("gbm-gate"))return;
var go=document.querySelector('a[href*="referral=blog-post-paywall"]'),h=document.querySelector('h3 > span[id^="want-to-read-more"]');
if(!go||!h)return;h=h.parentNode;
var p=h.nextElementSibling;while(p&&p.tagName!=="P")p=p.nextElementSibling;
var c=document.createElement("section");c.id="gbm-gate";c.setAttribute("aria-label","Members only");
c.innerHTML='<div class="gg-k"><b>Members only</b><span>GatorBait All Access</span></div><div class="gg-h" role="heading" aria-level="2"></div><div class="gg-p"></div><div class="gg-row"><a class="gg-go"><span></span></a><a class="gg-in" href="/account/my-account">Already a member? Sign in</a></div>';
c.querySelector(".gg-h").textContent=h.textContent.trim();
c.querySelector(".gg-p").textContent=p?p.textContent.trim():"";
var a=c.querySelector(".gg-go");a.href=go.href;a.querySelector("span").textContent=(go.textContent.trim()||"Subscribe now")+" →";
(p||h).insertAdjacentElement("afterend",c)}
function s(){[300,1200,3000,6000,10000].forEach(function(t){setTimeout(run,t)})}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",s,{once:!0}):s();
addEventListener("popstate",s);addEventListener("gbmroutechange",s)})();
