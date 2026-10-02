#!/usr/bin/env python3
"""Fail closed on stale canonical versions or changed full article text.
Refresh magazine-canonical.json from six current Wix GETs before every release.
This frozen payload proves comparison, not freshness of a future live post.
"""
import json, re, html, sys
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).parent
class Plain(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]
    def handle_data(self,data): self.parts.append(data)
def walk(n):
    if n.get('type') in ('IMAGE','CAPTION'): return ''
    if n.get('type')=='TEXT': return n['textData']['text']
    return ''.join(walk(x) for x in n.get('nodes',[]))
def norm(s): return re.sub(r'\s+',' ',html.unescape(s)).strip()
def validate(issue,posts):
    indexed={p['id']:p for p in posts}; failures=[]
    for s in issue['stories']:
        p=indexed.get(s['id'])
        if not p: failures.append(s['id']+': missing canonical'); continue
        raw=s['html']
        # Figure captions are verified image metadata, not article-body copy.
        captions=re.findall(r'<figcaption[^>]*>(.*?)</figcaption>',raw,re.S)
        raw=re.sub(r'<figure\b[^>]*>.*?</figure>','',raw,flags=re.S)
        parser=Plain();parser.feed(raw);packaged=norm(' '.join(parser.parts))
        canonical=norm(' '.join(walk(n) for n in p['richContent']['nodes']))
        for c in captions:
            cp=Plain();cp.feed(c); credit=norm(' '.join(cp.parts))
            # A credit already supplied as a canonical paragraph may move into figcaption.
            if credit and canonical.startswith(credit):canonical=canonical[len(credit):].strip()
        if norm(s['title'])!=norm(p['title']) or s.get('canonicalLastPublishedDate')!=p['lastPublishedDate'] or canonical!=packaged:
            failures.append(s['id']+': title/version/body differs')
    return failures
if __name__=='__main__':
    issue=json.loads((root/'magazine-issue.json').read_text());posts=json.loads((root/'magazine-canonical.json').read_text())
    failures=validate(issue,posts)
    if '--self-test' in sys.argv:
        import copy
        seeded=copy.deepcopy(posts);seeded[0]['richContent']['nodes'].append({'type':'PARAGRAPH','nodes':[{'type':'TEXT','textData':{'text':'Seeded factual correction.'}}]})
        assert validate(issue,seeded), 'A canonical correction passed silently'
        print('Seeded correction rejected.')
    if failures:sys.exit('\n'.join(failures))
    print(f'Canonical article copy/version parity: {len(issue["stories"])} of {len(issue["stories"])}.')
