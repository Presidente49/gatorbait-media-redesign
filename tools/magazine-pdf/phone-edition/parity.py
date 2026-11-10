import json,re,subprocess,sys
issue,pdf=sys.argv[1:3]
d=json.load(open(issue))
n=int(re.search(r'Pages:\s+(\d+)',subprocess.run(['pdfinfo',pdf],capture_output=True,text=True).stdout).group(1))
norm=lambda s: re.sub(r'\s+','',s.replace('ﬁ','fi').replace('ﬂ','fl')).lower()
pages=[subprocess.run(['pdftotext','-f',str(i),'-l',str(i),'-layout',pdf,'-'],capture_output=True,text=True).stdout for i in range(1,n+1)]
raw=subprocess.run(['pdftotext',pdf,'-'],capture_output=True,text=True).stdout
txt=norm(raw)+norm(''.join(pages))
blank=[i+1 for i,p in enumerate(pages) if len(p.strip())<20]
SKIP={'$comment','id','layout','alt','ext','width','height','uaa','poster','i','points','quarterStarts','us','uf','won','summary','pageTitle','home','url','image'}
miss=[];cnt=0
def walk(o,path=''):
    global cnt
    if isinstance(o,dict):
        for k,v in o.items():
            if k in SKIP and not (k=='url'): continue
            if k=='url':
                u=re.sub(r'^https?://(www\.)?','',v if v.startswith('http') else 'gatorbaitmedia.com'+v); cnt+=1
                if norm(u) not in txt: miss.append((path+'.url',u))
                continue
            walk(v,path+'.'+k)
    elif isinstance(o,list):
        for j,v in enumerate(o): walk(v,path+'[%d]'%j)
    else:
        s=str(o); cnt+=1
        if norm(s) not in txt: miss.append((path,s))
walk(d)
print('pages',n,'blank',blank,'strings checked',cnt,'missing',len(miss))
for m in miss: print(' MISSING',m)
print('quotes:',sum(norm(q['text']) in txt for q in d['quotes']['items']),'/',len(d['quotes']['items']))
print('gator country mentions:',len(re.findall(r'gator\s*country',raw,re.I)))
