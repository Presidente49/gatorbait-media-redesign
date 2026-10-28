from pathlib import Path
import json,re,hashlib,subprocess,os
r=Path(__file__).resolve().parent
s=(r/'rollback-v27.html').read_text()
assert len(s)==14935
assert hashlib.sha256(s.encode()).hexdigest()=="ad2489b7e180a2e1a5ce8a9ccad8ca694bc36a8ed74037c8979072c4ee9a35c2"
assert hashlib.sha256(s.encode()).hexdigest()=='ad2489b7e180a2e1a5ce8a9ccad8ca694bc36a8ed74037c8979072c4ee9a35c2'
assert 'until:"2026-10-17T16:00:00Z"' in s
s,n=re.subn(r'var r=\{opp:.*?\},c=', 'var c=', s);assert n==1
s,n=re.subn(r'function w\(\)\{if\(location.pathname.*?(?=function i\(\))','',s);assert n==1
s=s.replace('v(),w()','v()')
s,n=re.subn(r'#SITE_PAGES \.gbm-upnext[^{}]*\{[^{}]*\}','',s);assert n>=6
assert 'gbm-upnext' not in s
covers=json.loads((r/'approved-covers.json').read_text())
for v in covers.values():
 v[1]=v[1].split('. Photo')[0].split('. GatorBait')[0]+'.'
 if v[1].startswith('Illustration'):v[1]='AI-assisted illustration'+v[1][len('Illustration'):]
 v[2:]=[v[3]]
 if v[0].startswith('16b519_3bed'):v[1]='Todd Golden and Florida assistants at the Stetson exhibition, Oct. 27, 2026.'
 if v[0].startswith('d3cfa5_394a'):v[1]="Urban Klavzar drives against Stetson at the O'Connell Center, Oct. 27, 2026."
 if v[0].startswith('d3cfa5_97d2'):v[1]="AI-assisted illustration of Tampa Bay's 12-inning World Series Game 4 win over Milwaukee."
A=json.dumps(covers,separators=(',',':'))
s=s.replace('var d=document,h=d.documentElement,m,t,c;function f()', 'var d=document,h=d.documentElement,m,t,c,A='+A+';'+(r/'cover.js').read_text().strip()+'function f()')
s=s.replace('function f(){if(!/^\\/post\\//.test(location.pathname))', 'function f(){k();if(!/^\\/post\\//.test(location.pathname))')
s=s.replace('!/^(photo|image|source|statistics|stats|tags?)\\b/i.test(s)', '!/^(?:archive\\s+)?(?:photo|image|source|statistics|stats|tags?)\\b|\\bphoto\\s+(?:by|courtesy)\\b|pseudo\\s+Ted\\s+Lasso/i.test(s)')
s=s.replace('m.observe(h,{childList:1,subtree:1})','m.observe(h,{childList:1,subtree:1,attributes:1,attributeFilter:["href","content","src"]})')
s=s.replace('</style><script id="gbm-week-rich-js">', '[data-hook=post-hero-image]:has(>img[data-gbm-cover]){display:block!important;width:100%;max-width:min(100%,calc(100vw - 40px))!important;min-width:0;box-sizing:border-box}img[data-gbm-cover]{display:block;width:100%;max-width:100%;min-width:0;height:auto;object-fit:contain}</style><script id="gbm-week-rich-js">')
assert 'function f(){k();' in s
assert 'pseudo\\s+Ted' in s
rich='var d=document,h=d.documentElement,m,t,c,A='+A+';'+(r/'cover.js').read_text().strip()+'''function f(){k();var e=d.querySelector('[data-hook=time-ago]'),v=(e?.textContent||'').toLowerCase(),a=v.match(/(\\d+)\\s*day/);if(!location.pathname.startsWith('/post/')||!(/just now|minute|hour|today|yesterday/.test(v)||a&&+a[1]<=7)){h.removeAttribute('data-gbm-week-rich');return}h.setAttribute('data-gbm-week-rich','');d.querySelectorAll('.gbm-dropcap-letter,.gbm-dropcap').forEach(e=>e.classList.remove('gbm-dropcap-letter','gbm-dropcap'));for(var p of d.querySelectorAll('[data-hook=post-description] p')){var s=p.textContent.replace(/\\s+/g,' ').trim();if(s.length>=80&&!/^by\\s+|^(?:archive )?(?:photo|image|source|stat(?:istics|s)?|tags?)\\b|\\bphoto (?:by|courtesy)\\b|pseudo Ted Lasso/i.test(s)){p.classList.add('gbm-dropcap');var l=p.firstElementChild;(l&&getComputedStyle(l).display==='block'?l:p).classList.add('gbm-dropcap-letter');break}}}function w(){clearTimeout(c);clearTimeout(t);m?.disconnect();f();if(!location.pathname.startsWith('/post/'))return;m=new MutationObserver(()=>{clearTimeout(t);t=setTimeout(f,80)});m.observe(h,{childList:1,subtree:1,attributes:1,attributeFilter:['href','content','src','srcset']});c=setTimeout(()=>{m.disconnect();clearTimeout(t)},30000)}w();if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',w,{once:1});['load','popstate','gbmroutechange'].forEach(e=>addEventListener(e,w,{once:e==='load'}));'''
s=re.sub(r'(?<=<script id="gbm-week-rich-js">).*?(?=</script>)',lambda m:'(function(){'+rich+'})();',s,flags=re.S)
a,b=s.index('<script id="gbm-post-template-js">'),s.index('</script>',s.index('<script id="gbm-post-template-js">'))
z=s[a:b].replace('var c=', 'var D=document,E=D.documentElement,Q=s=>D.querySelector(s),c=').replace('document.querySelector(', 'Q(').replace('document.documentElement','E').replace('document.','D.')
z=z.replace('function(l){return"%"+l.charCodeAt(0).toString(16)}','l=>"%"+l.charCodeAt(0).toString(16)').replace('function(t){setTimeout(i,t)}','t=>setTimeout(i,t)')
s=s[:a]+z+s[b:]
s=s.replace('data-gbm-cover','data-gbm-c').replace('gbmCover','gbmC').replace('[data-hook=post-hero-image]:has(>img[data-gbm-c])','[data-hook]:has(>img[data-gbm-c])')
scripts=re.findall(r'<script[^>]*>(.*?)</script>',s,re.S)
code="const fs=require('fs'),e=require(process.env.ESBUILD_MODULE||'esbuild');process.stdout.write(JSON.stringify(JSON.parse(fs.readFileSync(0,'utf8')).map(s=>e.transformSync(s,{loader:'js',minify:true,charset:'utf8',target:'es2020',legalComments:'none'}).code.trim())))"
minified=json.loads(subprocess.run(['node','-e',code],input=json.dumps(scripts),text=True,capture_output=True,check=True).stdout)
print('script_sizes',[(len(a),len(b)) for a,b in zip(scripts,minified)])
for old,new in zip(scripts,minified):s=s.replace(old,new,1)
assert len(s)<=15000, len(s)
assert len(s.encode())<=15000, len(s.encode())
(r/'candidate.html').write_text(s)
print(json.dumps({'characters':len(s),'bytes':len(s.encode()),'sha256':hashlib.sha256(s.encode()).hexdigest(),'expired_css_blocks_removed':n}))
