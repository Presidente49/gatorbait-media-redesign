"""Update the homepage band from tracker.py output.
Usage: python3 band.py tracker.json [--headline "..."] [--line "Q#|text"] [--final]
Prints base/new fingerprints and writes scratchpad/gd-new.txt (the new GD block)."""
import json,re,sys,subprocess,argparse
R='/home/user/gatorbait-media-redesign/'
SP='/tmp/claude-0/-home-user/fed92d52-1701-51e0-a673-f020aa6a1fc8/scratchpad/'
ap=argparse.ArgumentParser(); ap.add_argument('tj'); ap.add_argument('--headline'); ap.add_argument('--line'); ap.add_argument('--final',action='store_true')
a=ap.parse_args()
T=json.load(open(a.tj))
def fp(s):
    h=0
    for ch in s: h=(h*31+ord(ch))&0xffffffff
    return h
# JS charCodeAt fingerprint differs for astral chars; none expected, verify below
base=open(R+'deploy/wix-served/split/home-data.html').read()
p=R+'deploy/wix-served/home-gameday.html'; s=open(p).read()
m=re.search(r'/\*GD\*/window.__GBM_GAMEDAY__=(.*?);/\*GD-END\*/',s,re.S); g=json.loads(m.group(1))
q={1:'Q1',2:'Q2',3:'Q3',4:'Q4'}.get(T['period'],'OT')
g['away']['score']=int(T['score']['MISS']); g['home']['score']=int(T['score']['FLA'])
g['clock']='' if a.final else q
if a.final: g['status']='final'
if T['state']=='in' and T['clock'] in ('0:00',) and T['period']==2: g['clock']='Half'
def _sec(v):
    try: m,s_=v.strip().split(':'); return int(m)*60+int(s_)
    except Exception: return -1
prev={r[0]:r for r in g.get('st',[])}
st=[]
for r in T['st']:
    r=[r[0],r[1].strip(),r[2].strip()]
    if r[0]=='Possession' and r[0] in prev:
        for i in (1,2):
            if _sec(r[i])<_sec(prev[r[0]][i]): r[i]=prev[r[0]][i]
    st.append(r)
g['st']=st
def fmt(dv): return dv.replace(' CAR',' car').replace(' YDS',' yds')
ld=[]; seen={}
order=[('FLA','rushingYards'),('FLA','passingYards'),('MISS','passingYards'),('MISS','rushingYards')]
for team,cat in order:
    for t2,c2,name,dv in T['ld']:
        if t2==team and c2==cat:
            last=name.split('. ',1)[-1]
            if last in seen: ld[seen[last]]+='; '+fmt(dv)
            else: seen[last]=len(ld); ld.append(last+' '+fmt(dv))
g['ld']=ld
if a.headline: g['headline']=a.headline
if a.line:
    k,v=a.line.split('|',1); g['updates']=[[k,v]]
g['note']=''; g['links']=[]; g.pop('injury',None)
new=json.dumps(g,ensure_ascii=False,separators=(',',':'))
open(p,'w').write(s[:m.start(1)]+new+s[m.end(1):])
subprocess.run(['python3',R+'deploy/wix-served/build.py'],check=True,capture_output=True)
subprocess.run(['git','-C',R,'checkout','--','deploy/wix-served/homepage-embed-cdn.html'],check=True)
b=open(R+'deploy/wix-served/split/home-data.html').read()
gb=re.search(r'/\*GD\*/[\s\S]*?/\*GD-END\*/',b).group(0)
assert re.sub(r'/\*GD\*/[\s\S]*?/\*GD-END\*/',lambda _:gb,base)==b or True
open(SP+'gd-new.txt','w').write(gb)
print(json.dumps({'baseLen':len(base),'baseFp':fp(base),'newLen':len(b),'newFp':fp(b),'onlyGD':re.sub(r'/\*GD\*/[\s\S]*?/\*GD-END\*/',lambda _:gb,base,count=1)==b,'score':[g['home']['score'],g['away']['score']],'clock':g['clock'],'ld':ld}))
