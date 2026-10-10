(function(){
if(window.__GBM_GCX_B__)return;window.__GBM_GCX_B__=1;
function e(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function T(x,y,s,fs,fill,o){return'<text x="'+x+'" y="'+y+'" font-size="'+fs+'" fill="'+fill+'" font-family="Bebas Neue,Barlow Condensed,Impact,sans-serif" text-anchor="'+((o&&o.a)||'middle')+'" letter-spacing="'+((o&&o.ls)||2)+'"'+((o&&o.x)||'')+'>'+e(s)+'</text>'}
function bg(c1,c2){var g='<defs><linearGradient id="gb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d2160"/><stop offset="1" stop-color="#060b1c"/></linearGradient><radialGradient id="gb2" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="'+c1+'" stop-opacity=".55"/><stop offset="1" stop-color="'+c1+'" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="380" fill="url(#gb1)"/><rect width="1200" height="380" fill="url(#gb2)"/>',i;
for(i=0;i<9;i++)g+='<rect x="'+(-200+i*190)+'" y="-40" width="70" height="500" fill="'+(i%2?c1:c2)+'" fill-opacity=".10" transform="skewX(-22)"/>';
g+='<polygon points="0,0 380,0 120,380 0,380" fill="#fff" fill-opacity=".05"/><polygon points="1200,0 820,0 1080,380 1200,380" fill="#fff" fill-opacity=".05"/>';
for(i=0;i<40;i++)g+='<circle cx="'+((i*97)%1200)+'" cy="'+(300+((i*53)%70))+'" r="'+(2+i%3)+'" fill="'+c1+'" fill-opacity=".35"/>';
return g}
function nm(c){var t=c.team;return(t.name==='Gators'?'FLORIDA':t.displayName.replace(/ Tigers$/,'').toUpperCase())}
function banner(p,d){
if(p.state==='pre'){var dt=new Date(p.date),tm=dt.toLocaleTimeString([],{hour:'numeric',minute:'2-digit',timeZone:'America/New_York'}).replace(' ',' ')+' ET';
return'<div class="gb-bn"><svg viewBox="0 0 1200 380" role="img" aria-label="Game day: Florida at Missouri">'+bg('#fa4616','#2b57ff')+T(600,118,'GAME DAY',140,'#fa4616',{ls:6})+T(250,235,nm(p.A),88,'#fff')+T(600,225,'AT',44,'#ff8a57',{ls:8})+T(950,235,nm(p.H),88,'#fff')+T(250,275,'NO. '+(p.A.rank||'')+' · '+(((p.A.record||[])[0]||{}).displayValue||''),30,'#9eacd0',{ls:3})+T(950,275,'NO. '+(p.H.rank||'')+' · '+(((p.H.record||[])[0]||{}).displayValue||''),30,'#9eacd0',{ls:3})+'<rect x="0" y="318" width="1200" height="62" fill="#fa4616"/>'+T(600,362,'SAT OCT 3 · '+tm+' · ABC · FAUROT FIELD · SEC',34,'#fff',{ls:4})+'</svg></div>'}
if(p.state==='post'){var a=+p.A.score||0,h=+p.H.score||0,win=a>h?p.A:p.H,fl=win===p.A,c1=fl?'#fa4616':'#f1b82d';
return'<div class="gb-bn"><svg viewBox="0 0 1200 380" role="img" aria-label="Final score">'+bg(c1,'#2b57ff')+T(600,80,'FINAL',54,'#9eacd0',{ls:14})+T(600,205,(fl?'GATORS WIN':nm(win)+' WINS'),150,'#fff',{ls:4})+T(600,300,nm(p.A)+' '+a+'  –  '+nm(p.H)+' '+h,60,c1,{ls:4})+'<rect x="0" y="330" width="1200" height="50" fill="'+c1+'"/>'+T(600,368,'GATORBAIT GAME CENTER · FLORIDA AT MISSOURI · OCT 3',28,fl?'#fff':'#081b35',{ls:4})+'</svg></div>'+pg(p)}
return''}
function pg(p){var a=+p.A.score||0,h=+p.H.score||0,tx=encodeURIComponent('FINAL: '+nm(p.A)+' '+a+', '+nm(p.H)+' '+h+'. Full recap, scoring plays and stats on GatorBait #Gators #GoGators'),u=encodeURIComponent('https://www.gatorbaitmedia.com/#gameday'),u2=window.__GBM_GC_UPDATE__||{},st=(window.__GBM_GC_ST__&&window.__GBM_GC_ST__()||[])[0],link=u2.story||(st&&st.l);
return'<div class="gb-sh"><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text='+tx+'&url='+u+'">Share the final</a><a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u='+u+'">Facebook</a>'+(link?'<a href="'+e(link)+'">Read the story</a>':'')+'</div>'}
function ls(p){if(p.state==='pre')return'';var A=p.A.linescores||[],H=p.H.linescores||[],n=Math.max(A.length,H.length,4),i,hd='<th></th>',ra='',rh='';
if(!A.length&&!H.length)return'';
for(i=0;i<n;i++){hd+='<th>'+(i<4?i+1:'OT')+'</th>';ra+='<td>'+e(A[i]?A[i].displayValue:'-')+'</td>';rh+='<td>'+e(H[i]?H[i].displayValue:'-')+'</td>'}
return'<div class="gc-c"><h2 class="D">Score By Quarter</h2><table class="gb-ls"><tr>'+hd+'<th>T</th></tr><tr><td>FLA</td>'+ra+'<td>'+e(p.A.score||0)+'</td></tr><tr><td>MIZ</td>'+rh+'<td>'+e(p.H.score||0)+'</td></tr></table></div>'}
function update(p){var u=window.__GBM_GC_UPDATE__;if(!u||!u.head)return'';
return'<div class="gb-up"><small>Game update'+(u.at?' · '+e(u.at):'')+'</small><h2 class="D">'+e(u.head)+'</h2>'+(u.lines&&u.lines.length?'<ul>'+u.lines.map(function(l){return'<li>'+e(l)+'</li>'}).join('')+'</ul>':'')+(u.story&&p.state!=='post'?'<a href="'+e(u.story)+'">Read the story</a>':'')+'</div>'}
var X=window.__GBM_GCX__=window.__GBM_GCX__||{};X.update=update;X.banner=banner;X.ls=ls;
window.__GBM_GC_RENDER__&&window.__GBM_GC_RENDER__();
})();
