import json,re,sys,subprocess
P='/home/user/gatorbait-media-redesign/deploy/wix-served/home-gameday.html'
s=open(P).read()
subs=[
("#gbm-gd .gd-inj{padding-top:12px;font:500 13px/1.45 Barlow,sans-serif;color:#c8d3e3}\n#gbm-gd .gd-inj b{color:#fff}\n",
 "#gbm-gd .gd-st{width:100%;margin-top:12px;border-collapse:collapse;font:800 15px/1.2 Barlow,sans-serif;font-variant-numeric:tabular-nums}#gbm-gd .gd-st td,#gbm-gd .gd-st th{padding:6px 0;border-bottom:1px solid rgba(255,255,255,.12);text-align:center;background:none}#gbm-gd .gd-st td{width:28%;color:#fff}#gbm-gd .gd-st th{font:700 11px/1.2 Barlow,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#aebbd0}#gbm-gd .gd-ld{margin:10px 0 0;font:600 13px/1.45 Barlow,sans-serif;color:#d5dfec}\n"),
("(g.injury?'<p class=\"gd-inj\"><b>Injury watch:</b> '+e(g.injury)+'</p>':'')",
 "(g.st?'<table class=\"gd-st\"><tr><th>'+e(g.away.name)+'</th><th>Game tracker</th><th>'+e(g.home.name)+'</th></tr>'+g.st.map(function(r){return'<tr><td>'+e(r[1])+'</td><th>'+e(r[0])+'</th><td>'+e(r[2])+'</td></tr>';}).join('')+'</table>':'')+(g.ld?'<p class=\"gd-ld\">'+g.ld.map(function(x){return e(x);}).join(' · ')+'</p>':'')"),
]
if 'gd-st{' not in s:
    for a,b in subs:
        assert s.count(a)==1,('MISS',a[:50]); s=s.replace(a,b)
open(P,'w').write(s)
print('code ok')
