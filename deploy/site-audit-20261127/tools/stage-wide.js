/* STAGING ONLY (GB_INIT): renders the page at the phone's real width instead of Wix's forced 320.
   Mirrors the planned production approach: write a device-width viewport string that is NOT the exact
   constant used by the homepage core embed, so that embed adopts it instead of fighting it.
   Adds html.gbm-wide so candidate CSS can be scoped to widened pages. */
(function(){var W='width=device-width, initial-scale=1',CORE='width=device-width, initial-scale=1, viewport-fit=cover';
function sync(){var m=document.querySelector('meta[name="viewport"]');if(m){var c=m.getAttribute('content');if(c!==W&&c!==CORE)m.setAttribute('content',W);}if(document.documentElement)document.documentElement.classList.add('gbm-wide');}
try{new MutationObserver(sync).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:['content']});}catch(e){}
sync();})();
