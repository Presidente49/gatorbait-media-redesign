import json,re,sys
raw=open(sys.argv[1]).read()
d=json.loads(raw); t=[r for r in d['results'] if 'espn' in r['url']][0]['text']
t=re.sub(r"\\([_*\[\]#()`~>|!+.{}-])", r"\1", t)
j=json.loads(t)
bx={}
for tm in j['boxscore']['teams']:
    ab=tm['team']['abbreviation']; bx[ab]={s['name']:s['displayValue'] for s in tm['statistics']}
A,H='MISS','FLA'
rows=[['Total yards','totalYards'],['Rushing','rushingYards'],['Passing','netPassingYards'],['Turnovers','turnovers'],['Possession','possessionTime']]
st=[[lab,bx[A].get(k,''),bx[H].get(k,'')] for lab,k in rows]
ld=[]
for team in j.get('leaders',[]):
    ab=team['team']['abbreviation']
    for cat in team['leaders']:
        if cat['name'] in ('passingYards','rushingYards') and cat['leaders']:
            L=cat['leaders'][0]; ld.append((ab,cat['name'],L['athlete']['shortName'],L['displayValue']))
comp=j['header']['competitions'][0]; stt=comp['status']
print(json.dumps({'period':stt['period'],'clock':stt['displayClock'],'state':stt['type']['state'],'detail':stt['type']['detail'],
 'score':{c['team']['abbreviation']:c.get('score') for c in comp['competitors']},'st':st,'ld':ld},ensure_ascii=False))
