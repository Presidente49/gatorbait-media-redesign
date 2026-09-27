(function(){
'use strict';
if(window.__GBM_POST_TPL__)return;window.__GBM_POST_TPL__=1;
// Edit this block for the next game. The strip hides itself after `until`.
var NEXT={opp:'at Missouri',when:'Sat., Oct. 3 \u00b7 3:30 p.m. ET',where:'Faurot Field, Columbia, Mo.',href:'/',cta:'Latest news',until:'2026-10-03T22:00:00Z'};
var KICK=[[/commit|recruit|signee|signing/,'Recruiting'],[/basketball|hoops/,'Basketball'],[/baseball|softball/,'Diamond Gators'],[/press-conference|presser|postgame/,'Postgame'],[/column|reese-|buddy-martin/,'Column']];
function isPost(){return /^\/post\//.test(location.pathname||'');}
function vars(){
 if(!isPost())return;
 var k='Gators Football',s=location.pathname,i,hero='';
 try{var ld=document.querySelectorAll('script[type="application/ld+json"]');for(i=0;i<ld.length;i++){var j=JSON.parse(ld[i].textContent||'{}');var sec=j.articleSection||(j['@graph']&&j['@graph'][0]&&j['@graph'][0].articleSection);if(sec){k=String(Array.isArray(sec)?sec[0]:sec);s='';break;}}}catch(e){}
 for(i=0;s&&i<KICK.length;i++)if(KICK[i][0].test(s)){k=KICK[i][1];break;}
 var m=document.querySelector('meta[property="og:image"]');
 if(m&&m.content)hero=m.content.replace(/w_\d+,h_\d+/,'w_1600,h_900').replace(/["\\]/g,function(c){return '%'+c.charCodeAt(0).toString(16);});
 var css=':root{--gbm-kicker:'+JSON.stringify(k.slice(0,40))+(hero?';--gbm-hero:url("'+hero+'")':'')+'}';
 var st=document.getElementById('gbm-post-vars');
 if(!st){st=document.createElement('style');st.id='gbm-post-vars';(document.head||document.documentElement).appendChild(st);}
 if(st.textContent!==css)st.textContent=css;
}
function stats(){
 var hs=document.querySelectorAll('[data-hook=post-page] [data-hook=post-description] h2');
 for(var i=0;i<hs.length;i++){
  if(!/^\s*by the numbers/i.test(hs[i].textContent))continue;
  var box=hs[i].closest('[data-breakout]');if(!box||box.hasAttribute('data-gbm-stat-head'))continue;
  var n=box.nextElementSibling,last=null;
  while(n){
   if(n.hasAttribute('data-breakout')){
    var b=n.querySelector('p>span>strong:first-child');
    if(!b||!/^[\s$#+\-.\d]/.test(b.textContent)||!/\d/.test(b.textContent))break;
    n.setAttribute('data-gbm-stat','1');last=n;
   }else if(!/^rcv-block/.test(n.getAttribute('data-hook')||''))break;
   n=n.nextElementSibling;
  }
  if(last){last.setAttribute('data-gbm-stat','last');box.setAttribute('data-gbm-stat-head','1');}
 }
}
function upnext(){
 if(!NEXT||Date.now()>Date.parse(NEXT.until))return;
 var d=document.querySelector('[data-hook=post-page] article[data-hook=post] [data-hook=post-description]');
 if(!d||!d.parentNode||d.parentNode.querySelector('.gbm-upnext'))return;
 var a=document.createElement('a');a.className='gbm-upnext';a.href=NEXT.href;
 a.innerHTML='<span class="gu-l">Up next</span><span><b></b><small></small></span><span class="gu-c">'+NEXT.cta+' \u2192</span>';
 a.querySelector('b').textContent=NEXT.opp;a.querySelector('small').textContent=NEXT.when+' \u00b7 '+NEXT.where;
 d.parentNode.insertBefore(a,d.nextSibling);
}
function run(){if(!isPost())return;vars();try{stats();upnext();}catch(e){console.warn('[GatorBait] post template',e);}}
run();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
window.addEventListener('load',run,{once:true});
[600,1800,4000].forEach(function(t){setTimeout(run,t);});
function soon(){setTimeout(run,300);setTimeout(run,1200);}
window.addEventListener('popstate',soon);window.addEventListener('gbmroutechange',soon);
})();
