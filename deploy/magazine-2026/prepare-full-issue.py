"""Freeze current Wix bodies into the reusable magazine issue; never send mail."""
import json, pathlib, re, html
root=pathlib.Path(__file__).resolve().parents[2]
source=root.parent/'gatorbait-implementation/deploy/oct1-recovery/full-posts.json'
posts=json.loads(source.read_text())
issue=json.loads((root/'sports-live/magazine-issue.json').read_text())
def plain(n):
    return n.get('t','')+''.join(plain(x) for x in n.get('n',[]))
def safe(u):
    return u if re.match(r'^(https?://|mailto:|/|#)',u or '') else ''
def node(n):
    if 't' in n:
        s=html.escape(n['t'])
        for d in n.get('d',[]):
            if d['type']=='BOLD': s='<strong>'+s+'</strong>'
            elif d['type']=='ITALIC': s='<em>'+s+'</em>'
            elif d['type']=='LINK':
                u=safe(d.get('linkData',{}).get('link',{}).get('url',''))
                if u:s='<a href="'+html.escape(u,quote=True)+'">'+s+'</a>'
        return s
    body=''.join(node(x) for x in n.get('n',[])); t=n.get('type')
    if t=='IMAGE':
        im=n.get('image',{});mid=im.get('image',{}).get('src',{}).get('id','')
        if not mid:return ''
        cap=im.get('caption') or plain(n)
        return '<figure class="mz-body-photo"><img loading="lazy" src="https://static.wixstatic.com/media/'+html.escape(mid,quote=True)+'/v1/fit/w_1200,h_1200,al_c,q_80/file.jpg" alt="'+html.escape(im.get('altText') or cap,quote=True)+'">'+('<figcaption>'+html.escape(cap)+'</figcaption>' if cap else '')+'</figure>'
    if not body.strip():return ''
    tag='h3' if t=='HEADING' else 'blockquote' if t=='BLOCKQUOTE' else 'p'
    return '<'+tag+'>'+body+'</'+tag+'>'
authors=['Buddy Martin','GatorBait Media Staff','Franz Beard','GatorBait Media Staff','Buddy Martin','Franz Beard']
stories=[]
for i in [0,2,1,4,5,3]:
    p=posts[i]
    assert not p.get('paid'), 'Do not reproduce restricted articles'
    ns=p['n']; img=p.get('media',{}).get('wixMedia',{}).get('image',{})
    # The lead photograph is already in the cover package; its original caption remains in the body.
    selected=[n for j,n in enumerate(ns) if not(i==0 and j==0 and n.get('type')=='IMAGE')]
    body=''.join(node(n) for n in selected)
    if i!=0 and not any(n.get('type')=='IMAGE' for n in ns) and img:
        alt=p.get('media',{}).get('altText') or img.get('altText') or p['title']
        body='<figure class="mz-body-photo"><img loading="lazy" src="'+html.escape(img['url'],quote=True)+'" alt="'+html.escape(alt,quote=True)+'"></figure>'+body
    stories.append(dict(id=p['id'],title=p['title'],author=authors[i],date=p['date'][:10],url=p['url']['base']+p['url']['path'],html=body,sourceCharacters=sum(len(plain(n)) for n in ns)))
lead=posts[0];im=lead['media']['wixMedia']['image'];mid,ext=im['id'].split('~mv2.')
issue['id']='2026-10-01-full-issue'
issue['issue'].update(name='Different Playbooks',date='October 1, 2026',pageTitle='GatorBait Magazine | October 1, 2026')
issue['cover']=dict(kicker='The Buddy Martin column',headline=lead['title'],dek='The complete issue. Six articles, three editorial voices, one place to read.',byline='By Buddy Martin',url=lead['url']['path'],image=dict(id=mid,ext=ext,width=im['width'],height=im['height'],alt=lead['media']['altText'],credit='Chris Spears Photography'))
issue['stories']=stories
issue['labels']['read']='Start reading'
# Draft department statistics are not reprinted without a fresh source check.
for key in ['columns','feature','pregame','departments','bestShots']:issue.pop(key,None)
(root/'sports-live/magazine-issue.json').write_text(json.dumps(issue,ensure_ascii=False,indent=2))
print([(s['author'],s['title'],s['sourceCharacters']) for s in stories])
