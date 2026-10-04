import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const P = JSON.parse(fs.readFileSync('wp-miz.json','utf8'));
const W=1600,H=900,L=150,R=1500,T=250,B=740;
const x=i=>L+(R-L)*i/(P.length-1), y=v=>B-(B-T)*v/100;
const line=P.map((p,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(p.fla).toFixed(1)}`).join('');
const area=line+`L${x(P.length-1)},${y(50)}L${x(0)},${y(50)}Z`;
// quarter boundaries
const qs=[2,3,4].map(q=>P.findIndex(p=>p.q===q)).filter(i=>i>0);
const peak=P.reduce((a,b)=>b.fla>a.fla?b:a);
const notes=[
 {i:peak.i, t:`${Math.round(peak.fla)}%`, s:'Florida’s high point, 1st quarter', up:true},
 {i:69, t:'10-10', s:'Tied with 4:26 left in the 2nd', up:true},
 {i:75, t:'Goodie Sr. 31-yd TD', s:'Missouri leads the rest of the way', up:false},
 {i:136, t:'Roberts 80-yd TD', s:'45-10 with 13:33 left', up:true},
];
const ann=notes.map(n=>{const px=x(n.i),py=y(P[n.i].fla),ty=n.up?py-(n.i>120?150:70):py+70;return `<circle cx="${px}" cy="${py}" r="9" fill="#FA4616" stroke="#fff" stroke-width="3"/><line x1="${px}" y1="${py}" x2="${px}" y2="${ty+(n.up?18:-38)}" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><text x="${px}" y="${ty}" text-anchor="${n.i>120||n.i===75?'end':'middle'}" class="at">${n.t}</text><text x="${px}" y="${ty+30}" text-anchor="${n.i>120||n.i===75?'end':'middle'}" class="as">${n.s}</text>`}).join('');
const html=`<!doctype html><html><head><meta charset=utf-8>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
<style>body{margin:0;width:${W}px;height:${H}px;background:#0021A5;color:#fff;font-family:Barlow,sans-serif;overflow:hidden}
.k{position:absolute;left:96px;top:70px;font:800 34px/1 'Barlow Condensed';letter-spacing:.2em;text-transform:uppercase}.k b{color:#FA4616}
.h{position:absolute;left:96px;top:115px;font:800 92px/1 'Barlow Condensed'}
.at{font:800 34px 'Barlow Condensed';fill:#fff}.as{font:600 22px Barlow;fill:#dfe6ff}
.ax{font:700 22px Barlow;fill:#b9c6ff;letter-spacing:.08em}
.f{position:absolute;left:96px;right:96px;bottom:44px;display:flex;justify-content:space-between;font:700 22px/1 Barlow;letter-spacing:.12em;text-transform:uppercase;color:#dfe6ff}
.wm{font:800 44px/.9 'Barlow Condensed';letter-spacing:.08em;color:#fff}.wm em{font-style:normal;color:#FA4616}</style></head><body>
<div class="k">Game flow · <b>Missouri 45, Florida 17</b></div>
<div class="h">How the win slipped away</div>
<svg width="${W}" height="${H}" style="position:absolute;inset:0">
<defs><clipPath id="up"><rect x="0" y="0" width="${W}" height="${y(50)}"/></clipPath><clipPath id="dn"><rect x="0" y="${y(50)}" width="${W}" height="${H}"/></clipPath></defs>
${[0,25,50,75,100].map(v=>`<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" stroke="#fff" stroke-opacity="${v===50?.6:.15}" stroke-dasharray="${v===50?'8 8':''}"/><text x="${L-16}" y="${y(v)+8}" text-anchor="end" class="ax">${v}%</text>`).join('')}
${qs.map((i,k)=>`<line x1="${x(i)}" x2="${x(i)}" y1="${T}" y2="${B}" stroke="#fff" stroke-opacity=".15"/>`).join('')}
${[1,2,3,4].map(q=>{const a=q===1?0:qs[q-2],b=q===4?P.length-1:qs[q-1];return `<text x="${(x(a)+x(b))/2}" y="${B+40}" text-anchor="middle" class="ax">Q${q}</text>`}).join('')}
<path d="${area}" fill="#ffffff" fill-opacity=".22" clip-path="url(#up)"/><path d="${area}" fill="#FA4616" fill-opacity=".55" clip-path="url(#dn)"/>
<path d="${line}" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
${ann}
<text x="${R}" y="${T-18}" text-anchor="end" class="ax">Florida’s chance to win</text>
</svg>
<div class="f"><div class="wm">Gator<em>Bait</em> Media</div><div>Win probability: ESPN · gatorbaitmedia.com</div></div>
</body></html>`;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:W,height:H}});
await p.setContent(html,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:'miz-game-flow-1600x900.jpg',type:'jpeg',quality:92});await b.close();console.log('ok');
