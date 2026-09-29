import json,pathlib
p=pathlib.Path(__file__).parent
D=json.loads((p/'edition-src.json').read_text())
(p/'edition.json').write_text(json.dumps(D,indent=2,ensure_ascii=False))
css='''<style id="gbm-magazine-urban-v1">
.gbm-mq:not(.gbm-magazine-live) #SITE_PAGES,.gbm-mq:not(.gbm-magazine-live) #gbm-footer{opacity:0;animation:gbmr 0s 4s forwards}@keyframes gbmr{to{opacity:1}}
.gbm-magazine-live #SITE_PAGES,html:has(#gbm-magazine-page) #SITE_PAGES,.gbm-magazine-live #pageBackground_nh0hy{display:none!important}
.gbm-magazine-live #SITE_CONTAINER,.gbm-magazine-live #masterPage,.gbm-magazine-live #PAGES_CONTAINER,.gbm-magazine-live #SITE_PAGES_TRANSITION_GROUP{height:auto!important;min-height:0!important;padding-bottom:0!important;margin-bottom:0!important}
#gbm-magazine-page,#gbm-magazine-page *{box-sizing:border-box}
#gbm-magazine-page{--ink:#10264b;--blue:#123dc9;--orange:#f15a24;--paper:#f3efe5;color:var(--ink);background:var(--paper);font:16px/1.5 Barlow,Arial,sans-serif;position:relative;z-index:3;padding:28px 0 44px}
#gbm-magazine-page a{color:inherit;text-decoration:none}
#gbm-magazine-page a:focus-visible{outline:3px solid var(--orange);outline-offset:5px}
#gbm-magazine-page .mz-wrap{max-width:1184px;margin:auto;padding:0 24px}
#gbm-magazine-page .mz-top{display:flex;justify-content:space-between;gap:16px;border-bottom:2px solid var(--ink);padding-bottom:14px;margin-bottom:26px;font:700 11px/1.4 Barlow,Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase}
#gbm-magazine-page .mz-layout{display:grid;grid-template-columns:minmax(0,1.28fr) minmax(0,.82fr);gap:44px;align-items:start}
#gbm-magazine-page .mz-cover{position:relative;display:block;background:var(--ink);border:8px solid var(--ink);box-shadow:10px 10px 0 #c9c3b5;isolation:isolate;overflow:hidden}
#gbm-magazine-page .mz-mast{padding:14px 20px 10px;background:#fffaf0;position:relative;z-index:2}
#gbm-magazine-page .mz-mast img{display:block;width:89%;height:auto;aspect-ratio:900/241;object-fit:contain;margin:0 auto}
#gbm-magazine-page .mz-mast-line{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-top:6px;border-top:2px solid var(--ink);padding-top:8px;font:700 10px/1.3 Barlow,Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}
#gbm-magazine-page .mz-mast-line b{font-size:17px;letter-spacing:.2em}
#gbm-magazine-page .mz-photo{position:relative;background:var(--blue);overflow:hidden;aspect-ratio:1000/625}
#gbm-magazine-page .mz-photo img{display:block;width:100%;height:100%;object-fit:contain}
#gbm-magazine-page .mz-stamp{position:absolute;top:12px;right:12px;background:var(--orange);color:var(--ink);transform:rotate(5deg);padding:10px 13px;font:900 13px/1.03 Barlow,Arial,sans-serif;text-align:center;text-transform:uppercase;box-shadow:3px 3px 0 var(--ink);letter-spacing:-.02em}
#gbm-magazine-page .mz-cover-type{position:relative;padding:14px 20px 19px;color:#fffaf0;background:var(--blue)}
#gbm-magazine-page .mz-cover-type:after{content:'';position:absolute;right:-12px;top:0;width:76px;height:100%;background:repeating-linear-gradient(135deg,transparent 0 8px,#ffffff14 8px 10px);pointer-events:none}
#gbm-magazine-page .mz-cover-type>small{display:block;font:700 10px/1.3 Barlow,Arial,sans-serif;letter-spacing:.19em;margin-bottom:7px;text-transform:uppercase}
#gbm-magazine-page .mz-cover h1{font:900 clamp(44px,6.35vw,88px)/.87 Barlow,'Arial Black',Arial,sans-serif!important;color:#fffaf0!important;letter-spacing:-.065em!important;text-transform:uppercase;margin:0!important;position:relative;z-index:1}
#gbm-magazine-page .mz-cover h1 span{display:block}
#gbm-magazine-page .mz-cover h1 em{font-style:normal;color:#ff864d}
#gbm-magazine-page .mz-cover-deck{max-width:82%;font:500 14px/1.3 Barlow,Arial,sans-serif;margin:14px 0 0}
#gbm-magazine-page .mz-cover-foot{display:grid;grid-template-columns:1fr 1fr;gap:15px;background:var(--orange);color:var(--ink);padding:14px 20px;font:800 13px/1.2 Barlow,Arial,sans-serif;text-transform:uppercase}
#gbm-magazine-page .mz-cover-foot span+span{border-left:1px solid #10264b66;padding-left:15px}
#gbm-magazine-page .mz-credit{margin:16px 0 0;font-size:11px;color:#526075}
#gbm-magazine-page .mz-eyebrow{font:700 11px/1.4 Barlow,Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;margin:0 0 12px;color:#a83511}
#gbm-magazine-page .mz-editor h2{font:800 clamp(32px,3.8vw,52px)/.99 Barlow,Arial,sans-serif!important;letter-spacing:-.04em;color:var(--ink)!important;margin:0 0 18px!important}
#gbm-magazine-page .mz-editor>p:not(.mz-eyebrow){font:17px/1.5 Barlow,Arial,sans-serif;margin:0 0 18px;color:#42506a}
#gbm-magazine-page .mz-open{display:inline-flex;align-items:center;justify-content:space-between;gap:24px;min-height:48px;border-bottom:3px solid var(--orange);font-weight:700;margin:0 0 28px}
#gbm-magazine-page .mz-contents{list-style:none;padding:0;margin:0;border-top:2px solid var(--ink)}
#gbm-magazine-page .mz-contents li{border-bottom:1px solid #b5b7b8}
#gbm-magazine-page .mz-contents a{display:grid;grid-template-columns:38px minmax(0,1fr);gap:14px;padding:19px 0;min-height:80px}
#gbm-magazine-page .mz-num{font:800 29px/1 Barlow,Arial,sans-serif;color:var(--blue);letter-spacing:-.06em}
#gbm-magazine-page .mz-contents small{display:block;font:700 10px/1.3 Barlow,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}
#gbm-magazine-page .mz-contents h3{font:700 23px/1.15 Barlow,Arial,sans-serif!important;letter-spacing:-.025em;margin:0!important;color:var(--ink)!important}
#gbm-magazine-page .mz-divider{display:flex;justify-content:space-between;align-items:end;gap:20px;border-top:3px solid var(--ink);margin-top:54px;padding-top:20px;margin-bottom:24px}
#gbm-magazine-page .mz-divider h2{font:800 40px/1 Barlow,Arial,sans-serif!important;letter-spacing:-.04em;margin:0!important;color:var(--ink)!important}
#gbm-magazine-page .mz-divider p{max-width:250px;margin:0;font-size:13px;color:#526075}
#gbm-magazine-page .mz-features{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px}
#gbm-magazine-page .mz-feature{display:grid;grid-template-columns:145px minmax(0,1fr);gap:20px;align-items:start;border-bottom:1px solid #b5b7b8;padding-bottom:24px}
#gbm-magazine-page .mz-feature img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover}
#gbm-magazine-page .mz-feature small{font:700 10px/1.3 Barlow,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#a83511}
#gbm-magazine-page .mz-feature h3{font:700 25px/1.13 Barlow,Arial,sans-serif!important;letter-spacing:-.025em;color:var(--ink)!important;margin:8px 0 10px!important}
#gbm-magazine-page .mz-gallery{display:grid;grid-template-columns:1.15fr 1fr;background:var(--ink);color:#fffaf0;margin-top:36px}
#gbm-magazine-page .mz-gallery img{width:100%;height:100%;display:block;object-fit:cover;min-height:280px}
#gbm-magazine-page .mz-gallery-copy{padding:35px}
#gbm-magazine-page .mz-gallery small{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#ff986c}
#gbm-magazine-page .mz-gallery h2{font:800 39px/1 Barlow,Arial,sans-serif!important;letter-spacing:-.04em;color:#fffaf0!important;margin:16px 0!important}
#gbm-magazine-page .mz-gallery p{font-size:15px;line-height:1.5;color:#d3dbe9}
#gbm-magazine-page .mz-gallery strong{display:inline-block;padding-top:10px;border-bottom:2px solid var(--orange)}
#gbm-magazine-page .mz-footer{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;border-top:2px solid var(--ink);margin-top:36px;padding-top:14px;font-size:13px;font-weight:700}
#gbm-magazine-page .mz-footer a{padding:10px 0;min-height:44px}
@media(hover:hover){#gbm-magazine-page .mz-contents a:hover h3,#gbm-magazine-page .mz-feature:hover h3{text-decoration:underline;text-decoration-color:var(--orange);text-underline-offset:4px}#gbm-magazine-page .mz-open:hover{color:var(--blue)}}
@media(max-width:820px){#gbm-magazine-page .mz-layout{grid-template-columns:1fr;gap:32px}#gbm-magazine-page .mz-cover-wrap{max-width:620px;width:100%;margin:auto}#gbm-magazine-page .mz-cover h1{font-size:clamp(42px,10.6vw,84px)!important}#gbm-magazine-page .mz-editor{max-width:620px;margin:auto;width:100%}#gbm-magazine-page .mz-features{grid-template-columns:1fr}#gbm-magazine-page .mz-gallery{grid-template-columns:1fr}#gbm-magazine-page .mz-gallery img{min-height:0;aspect-ratio:16/10}#gbm-magazine-page .mz-divider{margin-top:36px}}
@media(max-width:480px){#gbm-magazine-page{padding-top:18px}#gbm-magazine-page .mz-wrap{padding:0 16px}#gbm-magazine-page .mz-top{font-size:9px;letter-spacing:.06em;margin-bottom:20px}#gbm-magazine-page .mz-cover{border-width:5px;box-shadow:6px 6px 0 #c9c3b5}#gbm-magazine-page .mz-mast{padding:10px 12px 8px}#gbm-magazine-page .mz-mast-line{font-size:8px}#gbm-magazine-page .mz-mast-line b{font-size:12px}#gbm-magazine-page .mz-cover-type{padding:13px 14px 16px}#gbm-magazine-page .mz-cover-type>small{font-size:9px}#gbm-magazine-page .mz-cover-deck{font-size:12px;max-width:94%;margin-top:10px}#gbm-magazine-page .mz-cover-foot{padding:12px 14px;font-size:10px;gap:12px}#gbm-magazine-page .mz-stamp{font-size:10px;right:9px;top:9px;padding:7px 9px}#gbm-magazine-page .mz-feature{grid-template-columns:100px minmax(0,1fr);gap:15px}#gbm-magazine-page .mz-feature h3{font-size:21px!important}#gbm-magazine-page .mz-divider{align-items:start;flex-direction:column;gap:10px}#gbm-magazine-page .mz-divider h2{font-size:34px!important}#gbm-magazine-page .mz-gallery-copy{padding:24px}#gbm-magazine-page .mz-gallery h2{font-size:32px!important}}
</style>'''
import copy,re
def _slim(o):
 if isinstance(o,dict):return {k:_slim(v) for k,v in o.items()}
 if isinstance(o,list):return [_slim(v) for v in o]
 if isinstance(o,str):
  o=o.replace('https://www.gatorbaitmedia.com/post/','/post/')
  m=re.match(r'https://static\.wixstatic\.com/media/([^/]+)/v1/fit/',o)
  return m.group(1) if m else o
 return o
P=_slim(copy.deepcopy(D))
js='''<script id="gbm-magazine-urban-runtime-v1">(function(){
if(window.__GBMM_URBAN_V1__)return;window.__GBMM_URBAN_V1__=1;
var D=__DATA__;
function on(){return /^\\/magazine\\/?$/.test(location.pathname||'')}
var H=document.documentElement.classList;if(on())H.add('gbm-mq');
function im(i){return 'https://static.wixstatic.com/media/'+i+'/v1/fit/w_1000,h_1000,al_c,q_80/file.png'}
function e(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function feature(p){return '<a class="mz-feature" href="'+e(p.url)+'"><img src="'+e(im(p.image))+'" alt="'+e(p.title)+'" width="300" height="375" loading="lazy" decoding="async"><div><small>'+e(p.label)+'</small><h3>'+e(p.title)+'</h3>'+(p.credit?'<div class="mz-credit">Photo: '+e(p.credit)+'</div>':'')+'</div></a>'}
function mount(){if(!on()||document.getElementById('gbm-magazine-page'))return;
var L=D.lead,m=document.createElement('main');m.id='gbm-magazine-page';m.setAttribute('data-edition',D.id);
m.innerHTML='<div class="mz-wrap"><div class="mz-top"><span>The long read. The bigger picture.</span><span>September 2026</span></div><section class="mz-layout" aria-label="Current magazine edition"><div class="mz-cover-wrap"><a class="mz-cover" href="'+e(L.url)+'" aria-label="Read the cover story: '+e(L.title)+'"><div class="mz-mast"><img width="900" height="241" src="https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp" alt="GatorBait"><div class="mz-mast-line"><b>MAGAZINE</b><span>'+e(D.date)+'</span></div></div><div class="mz-photo"><img src="'+e(im(L.image))+'" alt="'+e(L.alt)+'" width="1000" height="625" fetchpriority="high" decoding="async"><span class="mz-stamp">'+D.cover.stamp.map(e).join('<br>')+'</span></div><div class="mz-cover-type"><small>'+e(D.cover.kicker)+'</small><h1><span>'+e(D.cover.h1[0])+'</span><span>'+e(D.cover.h1[1])+' <em>'+e(D.cover.h1[2])+'</em></span></h1><p class="mz-cover-deck">'+e(D.cover.deck)+'</p></div><div class="mz-cover-foot">'+D.cover.foot.map(function(f){return '<span>'+e(f[0])+'<br>'+e(f[1])+'</span>'}).join('')+'</div></a><p class="mz-credit">'+e(D.cover.credit)+' · Tap the cover to read</p></div><div class="mz-editor"><p class="mz-eyebrow">Inside '+e(D.edition)+'</p><h2>'+e(D.cover.headline)+'</h2><p>'+e(L.deck)+'</p><a class="mz-open" href="'+e(L.url)+'">Read the cover story <span aria-hidden="true">↗</span></a><ol class="mz-contents" aria-label="In this edition">'+D.stories.map(function(p,i){return '<li><a href="'+e(p.url)+'"><span class="mz-num" aria-hidden="true">0'+(i+1)+'</span><div><small>'+e(p.label)+'</small><h3>'+e(p.short)+'</h3></div></a></li>'}).join('')+'</ol></div></section><section aria-labelledby="mz-features-title"><div class="mz-divider"><h2 id="mz-features-title">More than the score.</h2><p>Columns, perspective and the moments that stay with you.</p></div><div class="mz-features">'+D.stories.map(feature).join('')+'</div></section><a class="mz-gallery" href="'+e(D.gallery.url)+'"><img src="'+e(im(D.gallery.image))+'" width="800" height="534" loading="lazy" decoding="async" alt="'+e(D.gallery.title)+'"><div class="mz-gallery-copy"><small>'+e(D.gallery.label)+'</small><h2>'+e(D.gallery.short)+'</h2><p>'+e(D.gallery.deck)+'</p><strong>Open the photo essay ↗</strong></div></a><nav class="mz-footer" aria-label="More from GatorBait"><a href="/gatorbait-media-blogs">Latest news →</a><a href="/the-buddy-martin-show">GatorBait TV →</a><a href="/pricing-plans">Support GatorBait →</a><a href="https://gatorbait2026.itemorder.com/shop/home/" target="_blank" rel="noopener" aria-label="Store (opens in a new tab)">Shop GatorBait ↗</a></nav></div>';
var anchor=document.getElementById('gbm-mobile-shell-host')||document.getElementById('gbm-site-header');if(anchor&&anchor.parentNode===document.body)document.body.insertBefore(m,anchor.nextSibling);else document.body.insertBefore(m,document.body.firstChild);
H.add('gbm-magazine-live');document.title='GatorBait Magazine | '+D.edition;
}
function sync(){if(on()){H.add('gbm-mq');mount();return}H.remove('gbm-magazine-live','gbm-mq');var m=document.getElementById('gbm-magazine-page');if(m)m.remove()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();window.addEventListener('popstate',sync);window.addEventListener('gbmroutechange',sync);
})();</script>'''.replace('__DATA__',json.dumps(P,separators=(',',':'),ensure_ascii=False))
css=css.replace('#gbm-magazine-page','.mz').replace(',Arial,sans-serif',',sans-serif')
html=css+'\n'+js.replace("m.id='gbm-magazine-page';","m.id='gbm-magazine-page';m.className='mz';")
for old,new in {'mz-gallery-copy':'mz-gc','mz-cover-wrap':'mz-cw','mz-cover-type':'mz-ct','mz-cover-deck':'mz-cd','mz-cover-foot':'mz-cf','mz-mast-line':'mz-ml','mz-layout':'mz-l','mz-editor':'mz-ed','mz-contents':'mz-toc','mz-divider':'mz-div','mz-features':'mz-grid','mz-feature':'mz-card','mz-eyebrow':'mz-ey','mz-gallery':'mz-gal','mz-footer':'mz-ft','mz-credit':'mz-cr'}.items(): html=html.replace(old,new)
print('Payload size',len(html)); assert len(html)<15000,len(html)
b=json.loads((p/'before.json').read_text());b['embedData']['html']=html
(p/'after.json').write_text(json.dumps(b,indent=2,ensure_ascii=False));(p/'magazine.html').write_text(html)
print('HTML characters',len(html),'bytes',len(html.encode()))
