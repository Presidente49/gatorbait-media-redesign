"""Build the Wix-served roster lookup embed (deploy/wix-served/gameday-rosters.html)."""
import json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parents[1] / 'deploy' / 'wix-served' / 'gameday-rosters.html'
d = json.loads((HERE / 'rosters-raw.json').read_text())['teams']
def team(name):
    return [[p[0], p[1], p[2], p[3]] for p in sorted(d[name], key=lambda p: (int(p[0]), p[1]))]
R = {
  'pdf': 'https://www.gatorbaitmedia.com/_files/ugd/d3cfa5_1b3f65361c8c4af8894dc763a678acd0.pdf',
  'src': 'Official 2026 rosters from FloridaGators.com and OleMissSports.com, Sept. 26. OUT/GTD tags from the SEC availability report. Numbers can change on game day.',
  'names': ['Florida', 'Ole Miss'],
  # Game-day availability, keyed by exact roster name (numbers repeat within a team).
  # Source: SEC final availability report, Sept. 26 (via On3, 18:07Z).
  'st': {'Eric Singleton Jr.': 'GTD', 'Kewan Lacy': 'OUT', 'Cedrick Beavers': 'OUT', 'Dorian Barney': 'OUT',
         'MJ Preston': 'OUT', 'Ant Davis Jr.': 'OUT', 'JaMichael Garrett': 'OUT', 'Victor Lincoln Jr.': 'OUT',
         'Craig Tutt': 'OUT', 'Jalan Chapman': 'OUT', 'Emanuel Faulkner': 'OUT'},
  't': [team('Florida'), team('Ole Miss')],
}
CSS = '''<style id="gbm-roster-css">
#gbm-rp{margin-top:14px;padding:14px;background:#fff;color:#10233f}
#gbm-rp .rp-find{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
#gbm-rp label{font:800 12px/1.2 Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#081b35}
#gbm-rp input{width:92px;min-height:48px;padding:0 8px;border:2px solid #081b35;border-radius:0;font:900 24px/1 Barlow,sans-serif;text-align:center;color:#081b35;background:#fff}
#gbm-rp .rp-hit{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#gbm-rp .rp-hit:not(:empty){margin-top:10px}
#gbm-rp .rp-hit div{padding:7px 10px;border-left:5px solid #fa4616;background:#f4f6f9;font:600 15px/1.35 Barlow,sans-serif}
#gbm-rp .rp-hit .om{border-left-color:#ce1126}
#gbm-rp .rp-hit b{display:block;font:800 11px/1.3 Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#4b586a}
#gbm-rp .rp-tabs{display:flex;gap:6px;margin:14px 0 8px}
#gbm-rp .rp-tabs button{flex:1;min-height:44px;border:2px solid #081b35;background:#fff;color:#081b35;font:800 12px/1 Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
#gbm-rp .rp-tabs button[aria-selected=true]{background:#081b35;color:#fff}
#gbm-rp ol{list-style:none;margin:0;padding:0 4px 0 0;max-height:340px;overflow:auto;columns:2;column-gap:16px}
#gbm-rp li{display:flex;gap:8px;padding:5px 0;border-bottom:1px solid #eef1f5;font:500 13px/1.3 Barlow,sans-serif;break-inside:avoid}
#gbm-rp li b{min-width:22px;text-align:right;font-weight:900;color:#081b35}
#gbm-rp li i{margin-left:auto;padding-left:6px;font-style:normal;font-size:11px;color:#6d7888;white-space:nowrap}
#gbm-rp .rp-st{display:inline-block;margin-left:6px;padding:1px 5px;background:#ce1126;color:#fff;font:800 10px/1.3 Barlow,sans-serif;font-style:normal;letter-spacing:.06em;vertical-align:1px}#gbm-rp .rp-st.g{background:#a15c00}
#gbm-rp .rp-dl{display:flex;align-items:center;justify-content:center;min-height:46px;margin-top:12px;background:#fa4616;color:#fff!important;font:800 12px/1 Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;text-decoration:none!important}
#gbm-rp .rp-src{padding-top:8px;font:500 11px/1.4 Barlow,sans-serif;color:#6d7888}
@media(max-width:600px){#gbm-rp{margin-inline:-4px}#gbm-rp ol{columns:1;max-height:300px}#gbm-rp .rp-hit{grid-template-columns:1fr}}
</style>'''
JS = r'''<script id="gbm-rosters-v1">window.__GBM_ROSTERS__=__DATA__;
(function(){
if(window.__GBM_ROSTER_UI__)return;
function e(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function tg(R,x){var s=R.st&&R.st[x[1]];return s?'<em class="rp-st'+(s==='OUT'?'':' g')+'">'+e(s)+'</em>':'';}
function list(R,t){return'<ol>'+R.t[t].map(function(x){return'<li><b>'+e(x[0])+'</b><span>'+e(x[1])+tg(R,x)+'</span><i>'+e(x[2])+' · '+e(x[3])+'</i></li>';}).join('')+'</ol>';}
window.__GBM_ROSTER_UI__=function(p){var R=window.__GBM_ROSTERS__;if(!R||!p)return false;
p.innerHTML='<div class="rp-find"><label for="gbm-rp-n">Who’s wearing No.</label><input id="gbm-rp-n" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" placeholder="#" aria-describedby="gbm-rp-hit"></div><div class="rp-hit" id="gbm-rp-hit" aria-live="polite"></div><div class="rp-tabs" role="tablist" aria-label="Team rosters"><button type="button" role="tab" aria-selected="true" data-t="0">'+e(R.names[0])+'</button><button type="button" role="tab" aria-selected="false" data-t="1">'+e(R.names[1])+'</button></div><div class="rp-list" role="tabpanel">'+list(R,0)+'</div><a class="rp-dl" href="'+e(R.pdf)+'" target="_blank" rel="noopener">Download the printable roster (PDF)</a><p class="rp-src">'+e(R.src)+'</p>';
var inp=p.querySelector('input'),hit=p.querySelector('.rp-hit'),lst=p.querySelector('.rp-list');
inp.addEventListener('input',function(){var n=inp.value.replace(/\D/g,'').slice(0,2);inp.value=n;if(n===''){hit.innerHTML='';return;}n=String(+n);
hit.innerHTML=[0,1].map(function(t){var m=R.t[t].filter(function(x){return x[0]===n;});return'<div class="'+(t?'om':'uf')+'"><b>'+e(R.names[t])+' · No. '+e(n)+'</b>'+(m.length?m.map(function(x){return e(x[1])+' · '+e(x[2])+' · '+e(x[3])+tg(R,x);}).join('<br>'):'No player listed')+'</div>';}).join('');});
p.querySelector('.rp-tabs').addEventListener('click',function(ev){var b=ev.target.closest('button');if(!b)return;[].forEach.call(this.children,function(c){c.setAttribute('aria-selected',c===b?'true':'false');});lst.innerHTML=list(R,+b.getAttribute('data-t'));});
return true;};
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('#gbm-gd .gd-rbtn');if(!b)return;var p=document.getElementById('gbm-rp');if(!p||!window.__GBM_ROSTERS__)return;ev.preventDefault();var open=p.hidden;
if(open&&p.getAttribute('data-ready')!=='1'){if(window.__GBM_ROSTER_UI__(p))p.setAttribute('data-ready','1');}
p.hidden=!open;b.setAttribute('aria-expanded',String(open));if(open){var i=p.querySelector('input');if(i)i.focus({preventScroll:true});}});
})();</script>'''
html = '<!-- GBM_GAMEDAY_ROSTERS_V1 2026-09-26 ole-miss-at-florida -->' + CSS + JS.replace('__DATA__', json.dumps(R, ensure_ascii=False, separators=(',', ':')))
assert html.lower().count('<script') == html.lower().count('</script'), 'script balance'
assert '</script' not in json.dumps(R).lower()
assert len(html) <= 15000, len(html)
OUT.write_text(html)
print('roster embed', len(html))
