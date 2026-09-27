import json,sys
d=json.load(open('polls.json'))
def ladder(title,p,sub):
    rows=''
    for i,(t,rec,pts,fpv) in enumerate(p['top'],1):
        fl=t=='Florida'
        rows+=f'<div class="row{" fl" if fl else ""}"><span class="rk">{i}</span><span class="tm">{t}{f" <em>({fpv})</em>" if fpv else ""}</span><span class="rec">{rec}</span><span class="pts">{pts:,}</span></div>'
    return f'<section class="poll"><h3>{title}</h3><p class="sub">{sub}</p>{rows}</section>'
c=d['coaches']; f=c['florida']; ap=d['ap']
polls=ladder('Coaches Poll' if ap else 'AFCA Coaches Poll',c,'Top 10 · points · (first-place votes)')
if ap: polls=ladder('AP Top 25',ap,'Top 10 · points · (first-place votes)')+polls
hero_ap=f'<div class="big"><span class="n">No. {ap["florida"]["rank"]}</span><span class="l">AP Top 25</span><span class="m">up {ap["florida"]["prev"]-ap["florida"]["rank"]} · {ap["florida"]["points"]:,} pts</span></div>' if ap else ''
html=f'''<!doctype html><meta charset="utf-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@500;700&display=swap');
*{{box-sizing:border-box;margin:0}}body{{width:1600px;height:{1000 if ap else 900}px;background:#081b35;color:#fff;font-family:Barlow,'DejaVu Sans','Liberation Sans',Arial,sans-serif;display:flex}}
.left{{width:{620 if ap else 700}px;padding:64px 56px;background:linear-gradient(160deg,#0a2450,#081b35 70%);border-right:6px solid #fa4616;display:flex;flex-direction:column}}
.kick{{font:800 22px/1 'Barlow Condensed','DejaVu Sans Condensed','Liberation Sans Narrow',sans-serif;letter-spacing:.18em;color:#ffad86}}
.wm{{font:800 44px/1 'Barlow Condensed','DejaVu Sans Condensed','Liberation Sans Narrow',sans-serif;letter-spacing:-.01em;margin:14px 0 36px}}.wm b{{color:#fa4616}}
.big{{display:flex;flex-direction:column;margin-bottom:34px}}.big .n{{font:800 {150 if ap else 190}px/0.9 'Barlow Condensed','DejaVu Sans Condensed','Liberation Sans Narrow',sans-serif;color:#fff}}
.big .l{{font:800 30px/1.2 'Barlow Condensed','DejaVu Sans Condensed','Liberation Sans Narrow',sans-serif;letter-spacing:.08em;color:#ffad86;text-transform:uppercase;margin-top:6px}}.big .m{{font:700 24px/1.3 Barlow,'DejaVu Sans',sans-serif;color:#d5dfec}}
.foot{{margin-top:auto;font:500 19px/1.45 Barlow,'DejaVu Sans',sans-serif;color:#9eadc1}}.foot b{{color:#fff}}
.right{{flex:1;padding:56px 56px;display:flex;gap:44px}}.poll{{flex:1}}
h3{{font:800 36px/1 'Barlow Condensed','DejaVu Sans Condensed','Liberation Sans Narrow',sans-serif;text-transform:uppercase;letter-spacing:.04em}}.sub{{font:500 16px Barlow,'DejaVu Sans',sans-serif;color:#9eadc1;margin:8px 0 18px}}
.row{{display:grid;grid-template-columns:{'46px 1fr 56px 78px' if ap else '52px 1fr 70px 90px'};align-items:center;height:{64 if ap else 66}px;border-bottom:1px solid rgba(255,255,255,.14);font:700 {23 if ap else 26}px/1 Barlow,'DejaVu Sans',sans-serif}}
.rk{{font:800 34px 'Barlow Condensed','DejaVu Sans Condensed','Liberation Sans Narrow',sans-serif;color:#9eadc1}}.rec{{color:#9eadc1;font-size:20px}}.pts{{text-align:right;color:#d5dfec;font-size:22px}}.tm{{white-space:nowrap;overflow:hidden}}.tm em{{font-style:normal;color:#9eadc1;font-size:18px}}
.row.fl{{background:#fa4616;margin:0 -14px;padding:0 14px;border:0}}.row.fl .rk,.row.fl .rec,.row.fl .pts{{color:#fff}}
</style><div class="left"><div class="kick">CHOMP UP THE CHARTS · WEEK 5</div><div class="wm">GATOR<b>BAIT</b> MEDIA</div>
{hero_ap}<div class="big"><span class="n">No. {f['rank']}</span><span class="l">Coaches Poll</span><span class="m">up {f['prev']-f['rank']} spots · {f['points']:,} pts</span></div>
<div class="foot">Florida ({f['record']}) was No. 21 in the AP poll and No. 22 in the Coaches Poll before beating No. 4 Ole Miss 52&#8209;28.<br>Next: <b>at Missouri</b> ({'No. 25 in both polls' if ap else 'No. '+str(c['missouri'])+' Coaches'}), Sat., Oct. 3, 3:30 p.m. ET.<br><span style="font-size:15px">Sources: {ap['source']+'; ' if ap else ''}{c['source']}.</span></div></div>
<div class="right">{polls}</div>'''
open('poll-graphic.html','w').write(html); print('ok', 'with AP' if ap else 'coaches only')
