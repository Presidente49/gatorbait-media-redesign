import json, html
def roster(t):
    rows=json.load(open(f'/tmp/roster{t}.json'))
    def k(r):
        try: return (0,int(r[0]))
        except: return (1,999)
    rows=sorted(rows,key=k)
    return rows
def rtable(rows):
    out=[]
    for j,n,p,y,h,w in rows:
        out.append(f'<tr><td class="n">{html.escape(j or "")}</td><td>{html.escape(n)}</td><td>{html.escape(p)}</td><td>{html.escape(y)}</td></tr>')
    return ''.join(out)
fl=roster('57'); sc=roster('2579')
def cols(rows,ncol=3):
    per=-(-len(rows)//ncol)
    return ''.join(f'<table class="ros"><thead><tr><th>No.</th><th>Name</th><th>Pos.</th><th>Yr.</th></tr></thead><tbody>{rtable(rows[i*per:(i+1)*per])}</tbody></table>' for i in range(ncol))
tape=[["Points per game",46.2,37.6,1],["Rushing yards per game",216.4,256.0,1],["Passing yards per game",274.8,235.0,1],["Points allowed per game",27.2,26.8,0],["Rushing yards allowed per game",126.4,100.4,0],["Passing yards allowed per game",266.6,231.2,0]]
def tapehtml():
    o=[]
    for lab,a,b,hi in tape:
        top=max(a,b); win_a = (a>=b) if hi else (a<=b)
        o.append(f'<div class="tp"><p>{lab}</p><div class="tb"><b>UF</b><span class="bar{" w" if win_a else ""}" style="width:{a/top*100:.0f}%"></span><em>{a:.1f}</em></div><div class="tb"><b>SC</b><span class="bar{" w" if not win_a else ""}" style="width:{b/top*100:.0f}%"></span><em>{b:.1f}</em></div></div>')
    return ''.join(o)
tpl=open('tpl.html').read()
out=tpl.replace('%%FLROSTER%%',cols(fl)).replace('%%SCROSTER%%',cols(sc)).replace('%%TAPE%%',tapehtml())
open('program.html','w').write(out)
print(len(fl),len(sc))
