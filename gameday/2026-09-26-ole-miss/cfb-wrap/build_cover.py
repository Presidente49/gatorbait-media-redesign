"""Scoreboard-grid cover v2 with team helmets (original SVG art, design/helmets-v1). Usage: python3 build_cover.py && node render.mjs"""
import sys, pathlib
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[2] / 'design' / 'helmets-v1'))
from helmets import helmet
F = '/tmp/claude-0/-home-user/fed92d52-1701-51e0-a673-f020aa6a1fc8/scratchpad/node_modules/@fontsource'
# (winner rank, winner, abbr, pts, loser rank, loser, abbr, pts, tag)  all ESPN Final, Sept. 26 (Indiana Fri.)
G = [
 ('1','TEXAS','TEX',20,'14','TENNESSEE','TENN',17,''), ('2','GEORGIA','UGA',41,'','OKLAHOMA','OU',13,''),
 ('8','ALABAMA','ALA',49,'','S. CAROLINA','SC',18,''), ('10','LSU','LSU',35,'23','TEXAS A&M','TA&M',6,''),
 ('24','MISS. STATE','MSST',31,'19','MISSOURI','MIZ',24,"UF'S NEXT FOE"), ('','WISCONSIN','WIS',24,'13','PENN STATE','PSU',20,'UPSET'),
 ('20','OREGON','ORE',41,'12','USC','USC',27,''), ('','WAKE FOREST','WAKE',30,'16','LOUISVILLE','LOU',27,'UPSET'),
 ('17','IOWA','IOWA',20,'18','MICHIGAN','MICH',19,''), ('','AUBURN','AUB',21,'','VANDERBILT','VAN',15,''),
 ('3','NOTRE DAME','ND',49,'','PURDUE','PUR',10,''), ('7','OHIO STATE','OSU',42,'','ILLINOIS','ILL',19,''),
]
def row(rk, name, ab, pts, win):
    r = f'<i>{rk}</i>' if rk else ''
    return f'<div class="r{" w" if win else ""}">{helmet(ab, size=62, uid=ab.replace("&","")+"s")}<span>{r}{name.replace("&","&amp;")}</span><s>{pts}</s></div>'
tiles = ''.join(f'<div class="t{" up" if g[8] else ""}">{row(*g[0:4], True)}{row(*g[4:8], False)}{f"<small>{g[8]}</small>" if g[8] else ""}</div>' for g in G)
hero = f'''<div class="t uf"><div class="duel">{helmet("FLA", size=250, uid="FLAh")}{helmet("MISS", flip=True, size=250, uid="MISSh")}</div>
<div class="sc"><div><i>21</i>FLORIDA<b>52</b></div><div class="l"><i>4</i>OLE MISS<b>28</b></div></div><small>THE SWAMP &middot; GATORS 4-0</small></div>'''
css = f'''@font-face{{font-family:BarlowC;font-weight:800;src:url(file://{F}/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2)}}
@font-face{{font-family:BarlowC;font-weight:700;src:url(file://{F}/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2)}}
@font-face{{font-family:Barlow;font-weight:800;src:url(file://{F}/barlow/files/barlow-latin-800-normal.woff2)}}
*{{box-sizing:border-box;margin:0}}body{{background:#000}}
.c{{width:1600px;height:900px;background:#081b35;color:#fff;font-family:BarlowC;padding:40px 52px;display:flex;flex-direction:column;
background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:40px 40px}}
.top{{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:4px solid #fa4616;padding-bottom:12px}}
.k{{font:800 24px Barlow;letter-spacing:.2em;color:#fa4616}}h1{{font-weight:800;font-size:84px;line-height:.9;text-transform:uppercase}}
.wm{{font:800 30px Barlow;letter-spacing:.06em;text-align:right}}.wm b{{color:#fa4616}}.wm span{{display:block;font-size:17px;letter-spacing:.2em;color:#9fb0c8;margin-top:6px}}
.g{{flex:1;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(4,1fr);gap:12px;margin-top:20px}}
.t{{display:flex;flex-direction:column;justify-content:center;gap:2px;background:#0f2a4f;border:1px solid #1d3d69;padding:6px 14px;border-radius:6px}}
.r{{display:flex;align-items:center;gap:8px;font-weight:700;font-size:27px;line-height:1.05;color:#9fb0c8}}.r svg{{flex:none;width:62px;height:50px}}
.r span{{flex:1;white-space:nowrap}}.r.w{{color:#fff}}.r i{{font-style:normal;font-size:17px;color:#fa4616;margin-right:5px;vertical-align:2px}}.r s{{text-decoration:none;font-weight:800}}
.t small{{font:800 12px Barlow;letter-spacing:.16em;color:#fa4616;margin-left:70px}}.t.up{{border-color:#fa4616}}
.t.uf{{grid-column:span 2;grid-row:span 2;background:#fa4616;border-color:#fa4616;padding:14px 26px;align-items:center}}
.duel{{display:flex;justify-content:center;margin-top:-6px}}.duel svg{{width:250px;height:200px;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}}.duel svg+svg{{margin-left:18px}}
.sc{{display:flex;gap:40px;font-weight:800;font-size:44px;color:#fff}}.sc .l{{color:#081b35}}.sc i{{font-style:normal;font-size:22px;margin-right:6px;vertical-align:12px}}.sc b{{font-size:64px;margin-left:14px;vertical-align:-6px}}
.t.uf small{{color:#081b35;font-size:17px;margin:4px 0 0}}'''
html = f'''<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body><div class="c">
<div class="top"><div><div class="k">WEEK 4 &middot; SEPT. 26, 2026 &middot; ALL FINAL</div><h1>Saturday Scoreboard</h1></div><div class="wm">GATOR<b>BAIT</b> MEDIA<span>COLLEGE FOOTBALL WRAP</span></div></div>
<div class="g">{hero}{tiles}</div></div></body></html>'''
(HERE / 'cover.html').write_text(html)
print('ok', len(html))
