(function(){
'use strict';
if(window.__GBM_NORM__)return;window.__GBM_NORM__=1;
function txt(e){return (e.textContent||'').replace(/ /g,' ').replace(/\s+/g,' ').trim();}
// A paragraph is "all bold" when every non-blank text node sits inside strong/b or a 600+ weight style.
function allBold(p){
 var w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT),n,any=0;
 while((n=w.nextNode())){if(!n.nodeValue.trim())continue;any=1;var e=n.parentElement,b=0;
  while(e&&e!==p){if(/^(STRONG|B)$/.test(e.tagName)||+((e.style&&e.style.fontWeight)||0)>=600){b=1;break;}e=e.parentElement;}
  if(!b)return false;}
 return !!any;
}
function maxSize(p){var m=0;p.querySelectorAll('[style*="font-size"]').forEach(function(e){var v=parseFloat(e.style.fontSize);if(v>m)m=v;});return m;}
function run(){
 if(!/^\/post\//.test(location.pathname))return;
 var d=document.querySelector('[data-hook=post-page] [data-hook=post-description]');
 if(!d)return;
 var blocks=d.querySelectorAll('[data-breakout]');if(!blocks.length)return;
 // Fast path: same blocks and all our tags still present -> nothing to do.
 var sig=blocks.length+':'+d.querySelectorAll('[data-gbm-empty],[data-gbm-h],[data-gbm-meta],[data-gbm-dek],[data-gbm-lede]').length;if(d.__gbmSig===sig)return;
 var paras=[],bold=0;
 blocks.forEach(function(b){
  var el=b.firstElementChild;if(!el)return;
  if(el.matches('p,div')&&!el.querySelector('img,iframe,video,figure,[data-hook]')&&!txt(el)){b.setAttribute('data-gbm-empty','');return;}
  var p=b.querySelector(':scope>p');if(!p)return;
  var t=txt(p);if(!t)return;
  paras.push(p);if(allBold(p))bold++;
 });
 if(paras.length<3){d.__gbmSig=sig;return;}
 var unbold=paras.length>=5&&bold/paras.length>=.6;
 // Post-level switch lives on <html>: Wix re-renders the article DOM but never touches <html> attributes.
 if(unbold)document.documentElement.setAttribute('data-gbm-unbold','');else document.documentElement.removeAttribute('data-gbm-unbold');
 var metaEnd=null;
 paras.forEach(function(p,i){
  var t=txt(p),sz=maxSize(p),b=allBold(p);
  if(/^by [a-z][a-z .'\-]{2,40}$/i.test(t)){p.setAttribute('data-gbm-meta','');metaEnd=p;
   var nx=paras[i+1];if(nx&&/^(www\.)?gatorbaitmedia\.com$/i.test(txt(nx))){nx.setAttribute('data-gbm-meta','');metaEnd=nx;}return;}
  if(p.hasAttribute('data-gbm-meta'))return;
  if(sz>=30&&t.length<=120){p.setAttribute('data-gbm-dek','');return;}
  if(sz>=22){p.setAttribute('data-gbm-lede','');return;}
  // Short bold line with no sentence punctuation = a subhead the writer made by hand.
  if(b&&unbold!==null&&t.length<=60&&t.split(' ').length<=9&&!/[.!?,;:"”’)]$/.test(t)&&!/^\d/.test(t))p.setAttribute('data-gbm-h','');
 });
 if(metaEnd)metaEnd.setAttribute('data-gbm-meta-last','');
 d.__gbmSig=blocks.length+':'+d.querySelectorAll('[data-gbm-empty],[data-gbm-h],[data-gbm-meta],[data-gbm-dek],[data-gbm-lede]').length;
}
function go(){try{run();}catch(e){console.warn('[GatorBait] post normalizer',e);}}
// Wix hydrates/re-renders the article after first paint and drops attributes we added. Re-tag inside the
// mutation callback (runs before paint, so no flash). Tagging only sets attributes, so it can't re-trigger childList.
var mo=new MutationObserver(function(){if(/^\/post\//.test(location.pathname))go();else document.documentElement.removeAttribute('data-gbm-unbold');});
function watch(){if(document.body)mo.observe(document.body,{childList:true,subtree:true});else document.addEventListener('DOMContentLoaded',watch,{once:true});}
go();watch();
window.addEventListener('load',go,{once:true});
})();
