(function(){"use strict";if(window.__GBM_BC__)return;window.__GBM_BC__=1;
/* S4 pages get the Broadcast frame; S1, S2, S3, magazine and stats pages are left to their owners. */
var X=/^\/(gatorbait-media-blogs|post|magazine|florida-football-stats|latest)(\/|$)/,
L=[[/^\/about/,"About GatorBait"],[/^\/policies/,"Policies"],[/^\/contact/,"Contact"],[/^\/pricing-plans/,"Membership"],[/^\/account/,"Your account"],[/^\/profile/,"Member profile"],[/^\/groups?(\/|$)/,"Community"],[/^\/tags/,"Tags"],[/^\/search/,"Search"],[/^\/cart-page/,"Cart"]];
function go(){var p=location.pathname.replace(/\/+$/,"")||"/",r=document.documentElement,on=p!=="/"&&!X.test(p),b=document.getElementById("gbm-band");
r.classList.toggle("gbm-bc",on);
if(!on||p==="/the-buddy-martin-show"||!document.body){b&&b.remove();return}
var n="GatorBait Media";L.some(function(x){return x[0].test(p)&&(n=x[1])});
if(!b){b=document.createElement("div");b.id="gbm-band";b.innerHTML='<div class="gbm-band-k"><b>GB</b><span>GatorBait Network</span></div><p></p>'}
b.querySelector("p").textContent=n;
var h=document.getElementById("gbm-site-header"),m=document.getElementById("gbm-mobile-shell-host"),a=h;
if(m&&m.parentNode===document.body&&(!a||a.compareDocumentPosition(m)&Node.DOCUMENT_POSITION_FOLLOWING))a=m;
if(!a||a.parentNode!==document.body)return;
if(a.nextSibling!==b)a.after(b)}
function s(){[0,200,800,1800,4e3].forEach(function(t){setTimeout(go,t)})}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",s,{once:!0}):s();
document.addEventListener("gbm:mobile-shell-ready",go);addEventListener("popstate",s);addEventListener("gbmroutechange",s)})();
