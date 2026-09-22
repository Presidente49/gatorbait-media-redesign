#!/usr/bin/env python3
"""Package the actual compiled MIT Gazette for the existing Wix homepage."""
from pathlib import Path
import importlib.util
import json
import re
import hashlib
import tinycss2
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'flagship/gazette-preview'
OUT=ROOT/'gazette-live'
SCOPE='#gbm-live.gbm-gazette'
HOST='https://presidente49.github.io'
source_manifest=json.loads((SOURCE/'build-manifest.json').read_text())
assert source_manifest['upstream']=='cee215fd3ec0b78bba6f99d3a59a033b0a5f0b48'
soup=BeautifulSoup((SOURCE/'index.html').read_text(),'html.parser')
def selectors(tokens):
 groups,current=[],[]
 for token in tokens:
  if token.type=='literal' and token.value==',':groups.append(tinycss2.serialize(current).strip());current=[]
  else:current.append(token)
 groups.append(tinycss2.serialize(current).strip())
 out=[]
 for selector in groups:
  selector=selector.replace('#main','#gbgz-main')
  if re.match(r'^(?:html|body|:root|:host)(?=[\s.\[:#>+~]|$)',selector):selector=re.sub(r'^(?:html|body|:root|:host)',SCOPE,selector,count=1)
  else:selector=SCOPE+' '+selector
  out.append(selector)
 return ','.join(out)
def scoped_css(text):
 result=[]
 for rule in tinycss2.parse_stylesheet(text,skip_comments=True,skip_whitespace=True):
  if rule.type=='qualified-rule':result.append(selectors(rule.prelude)+'{'+tinycss2.serialize(rule.content)+'}')
  elif rule.type=='at-rule':
   prelude=tinycss2.serialize(rule.prelude)
   # Wix resets are unlayered. Flatten source layers in their original order so
   # the scoped original utilities are not silently defeated by those resets.
   if rule.lower_at_keyword=='layer':
    if rule.content is not None:result.append(scoped_css(tinycss2.serialize(rule.content)))
   elif rule.content is None:result.append('@'+rule.at_keyword+prelude+';')
   elif rule.lower_at_keyword in ('media','supports','container'):result.append('@'+rule.at_keyword+prelude+'{'+scoped_css(tinycss2.serialize(rule.content))+'}')
   else:result.append('@'+rule.at_keyword+prelude+'{'+tinycss2.serialize(rule.content)+'}')
 return ''.join(result)
css=''.join(scoped_css(s.text) for s in soup.head.select('style'))
for link in soup.head.select('link[rel=stylesheet]'):css+=scoped_css((SOURCE/'_astro'/Path(link['href']).name).read_text())
css=css.replace('--tw-','--gbgz-tw-').replace('font-display:swap','font-display:optional')
css=css.replace('url("/gatorbait-media-redesign/','url("'+HOST+'/gatorbait-media-redesign/')
css+='\n'+(ROOT/'automation/gazette/wix_bridge.css').read_text()
header=soup.select_one('header').extract()
header.select_one('details').decompose()
for a in header.select('a'):
 if a.text.strip()=='This edition':a.string='Front Page';a['href']='/'
 elif a.text.strip()=='Editions':a.string='Magazine';a['href']='/magazine'
main=soup.select_one('main').extract();main['id']='gbgz-main'
main.select_one('h1 img')['src']='https://static.wixstatic.com/media/d3cfa5_95dd8a25863b4556b7ba6398fcfd0316~mv2.webp'
nameplate=main.select_one('h1').parent
nameplate.select_one('p span').string='Florida Gators coverage'
nameplate.select('p span')[-1]['data-gbgz-date']=''
cover=main.select_one('section[aria-labelledby=cover-line]')
cover.select_one('img')['data-gbgz-image']=''
cover.select_one('#cover-line')['data-gbgz-title']=''
cover.select_one('a')['data-gbgz-cover-link']=''
cover.select_one('span')['data-gbgz-byline']=''
contents=main.select_one('section[aria-labelledby=contents-heading]')
contents.select_one('h2').clear();contents.select_one('h2').string='Inside GatorBait'
rows=contents.select_one('ol');row=rows.select_one('li').extract()
row.select_one('a')['data-gbgz-row-link']=''
row.select('span')[-1]['data-gbgz-row-meta']=''
row.select_one('span')['data-gbgz-row-number']=''
rows.clear();rows['data-gbgz-rows']=''
for comment in main.find_all(string=lambda text:text.__class__.__name__=='Comment'):comment.extract()
spec=importlib.util.spec_from_file_location('existing_feed',ROOT/'automation/update_newsroom_feed.py')
feed=importlib.util.module_from_spec(spec);spec.loader.exec_module(feed)
feed.MAX_POSTS=30
raw=feed.fetch_feed();posts=feed.parse_feed(raw);feed.validate(posts)
data={'source':'Wix Blog RSS','posts':posts}
OUT.mkdir(exist_ok=True)
(OUT/'posts.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
payload={'css':css,'layout':str(header)+str(main),'row':str(row),'fallback':data}
script=(ROOT/'automation/gazette/runtime.js').read_text()
assert script.count('__GAZETTE_PAYLOAD__')==1
script=script.replace('__GAZETTE_PAYLOAD__',json.dumps(payload,ensure_ascii=False).replace('</script','<\\/script'))
(OUT/'homepage.js').write_text(script)
(OUT/'GAZETTE-LICENSE.txt').write_text((SOURCE/'GAZETTE-LICENSE.txt').read_text())
manifest={'source_upstream':source_manifest['upstream'],'source_build':'39abf31576280c881206df625b888ba7ed91b6e7','bundle_sha256':hashlib.sha256(script.encode()).hexdigest(),'feed_sha256':hashlib.sha256(raw).hexdigest(),'stories':len(posts),'newest':posts[0]['url'],'scope':'homepage only; native Wix article, member, payment and consent owners preserved'}
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2));print(json.dumps(manifest,indent=2))
