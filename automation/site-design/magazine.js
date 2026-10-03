(function(){
if(window.__GBMM_V70_INLINE__)return;window.__GBMM_V70_INLINE__=1;
var D={"lead":{"title":"Coaches and Fans Have Different Playbooks. So Have Another Round, Thirsty Gators.","excerpt":"Florida is 4-0 and No. 8, and the bandwagon's paint is still wet. Buddy Martin on why the coach's playbook and the fans' playbook are both right this week.","url":"https://www.gatorbaitmedia.com/post/coaches-and-fans-have-different-playbooks-so-have-another-round-thirsty-gators","image":"https://static.wixstatic.com/media/d3cfa5_408fa442a2d54309aa66050fb0f4d35e~mv2.jpg/v1/fit/w_1000,h_1000,al_c,q_80/file.png","author":"Buddy Martin","credit":"Photo: Chris Spears, GatorBait Media","quote":"The coach’s playbook says one game at a time, eyes on the ball, stay where your feet are planted. The fan’s playbook says, “We’re back, baby!” Two things can’t be true at the same time. Both are correct."},"toc":[{"title":"When It Came to Finding a Quarterback, Sumrall Trusted Buster. It Paid Off.","url":"https://www.gatorbaitmedia.com/post/when-it-came-to-finding-a-quarterback-sumrall-trusted-buster-and-it-paid-off","author":"Franz Beard"},{"title":"Jayden Woods Added To Chuck Bednarik Award Watch List","url":"https://www.gatorbaitmedia.com/post/jayden-woods-added-to-chuck-bednarik-award-watch-list","author":"GatorBait Staff"},{"title":"Denzel Aberdeen Cleared to Play for Florida Under Temporary Injunction","url":"https://www.gatorbaitmedia.com/post/denzel-aberdeen-florida-temporary-injunction-2026","author":"GatorBait Staff"},{"title":"Put Down the Poll, Gators. Missouri Is Waiting.","url":"https://www.gatorbaitmedia.com/post/put-down-the-poll-gators-missouri-is-waiting-and-there-s-a-new-definition-for-one-game-at-a-time","author":"Buddy Martin"}],"depts":[{"tag":"Buddy's Blog","title":"The Looming Brilliance of Buster Faulkner","text":"Buddy Martin considers how far Florida's new offensive ringmaster has come.","url":"https://www.gatorbaitmedia.com/post/the-looming-brilliance-of-buster-faulkner-if-it-works-one-time-we-retire-it"},{"tag":"Franz's Desk","title":"Thoughts of the Day","text":"Franz Beard's running notebook from Gainesville, filed most mornings.","url":"https://www.gatorbaitmedia.com/post/thoughts-of-the-day-september-30-2026"},{"tag":"Game Week","title":"Florida at Missouri","text":"3:30 p.m. Saturday, Faurot Field. The trip to Columbia, previewed."}]};
function on(){return /^\/magazine\/?$/.test(location.pathname||'')}
var H=document.documentElement.classList;on()&&H.add('gbm-mq');
function e(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function tocRow(p,n,i){return'<a class="toc-row'+(i%2?' gd':'')+'" href="'+e(p.url)+'"><span class="tn">0'+n+'</span><span><span class="th">'+e(p.title)+'</span><span class="tm">'+e(p.author)+'</span></span></a>'}
function dept(d,i){var t=d.url?('<a class="dt" href="'+e(d.url)+'">'+e(d.title)+'</a>'):('<span class="dt">'+e(d.title)+'</span>');return'<div><div class="dg c'+(i+1)+'">'+e(d.tag)+'</div>'+t+'<p>'+e(d.text)+'</p></div>'}
function mount(){
 if(!on())return;
 if(document.getElementById('gbm-magazine-page'))return;
 var L=D.lead,m=document.createElement('main');m.id='gbm-magazine-page';
 m.innerHTML='<div class="wrap"><div class="mast"><div class="nm"><b>GatorBait</b><i>Magazine</i></div><div class="ed">Issue &middot; '+e(new Date().toLocaleString('en-US',{month:'long',year:'numeric'}))+'</div></div><div class="grid"><div class="toc"><div class="lbl">In This Issue</div><a class="toc-row" href="'+e(L.url)+'"><span class="tn">01</span><span><span class="th">'+e(L.title)+'</span><span class="tm">'+e(L.author)+' &middot; Cover story</span></span></a>'+D.toc.map(function(p,i){return tocRow(p,i+2,i)}).join('')+'</div><div class="cov"><div class="lbl">The '+e(L.author)+' Column</div><h1>'+e(L.title)+'</h1><p class="dk">'+e(L.excerpt)+'</p><div class="art"><img src="'+e(L.image)+'" alt="'+e(L.title)+'"></div><div class="cr">'+e(L.credit||'')+'</div>'+(L.quote?'<blockquote>“'+e(L.quote)+'”</blockquote>':'')+'<a class="rd" href="'+e(L.url)+'">Read the story &rarr;</a></div></div><div class="depts">'+D.depts.map(dept).join('')+'</div></div>';
 var anchor=document.getElementById('gbm-mobile-shell-host')||document.getElementById('gbm-site-header');if(anchor&&anchor.parentNode===document.body)document.body.insertBefore(m,anchor.nextSibling);else document.body.insertBefore(m,document.body.firstChild);
 H.add('gbm-magazine-live');document.title='GatorBait Magazine | Florida Gators';
}
var started=false, generation=0, activeController=null;
function begin(){
 if(!on()||started)return;started=true;var current=++generation;
 var controller=new AbortController();activeController=controller;var timer=setTimeout(function(){controller.abort();if(current===generation&&on())mount()},1500);
 fetch('/blog-feed.xml',{signal:controller.signal,credentials:'omit',cache:'no-cache'}).then(function(r){if(!r.ok)throw Error('RSS unavailable');return r.text()}).then(function(xml){
  clearTimeout(timer); if(current!==generation||!on()||document.getElementById('gbm-magazine-page'))return;
  var doc=new DOMParser().parseFromString(xml,'text/xml');
  function text(node,name){var n=Array.from(node.children).find(function(c){return c.localName===name});return n?n.textContent.trim():''}
  var posts=Array.from(doc.querySelectorAll('item')).map(function(n){var enc=n.querySelector('enclosure');return{title:text(n,'title'),excerpt:text(n,'description'),url:text(n,'link'),author:text(n,'creator'),date:Date.parse(text(n,'pubDate')),image:enc?enc.getAttribute('url'):''}}).filter(function(p){return /^https:\/\/www\.gatorbaitmedia\.com\/post\//.test(p.url)&&/^https:\/\/static\.wixstatic\.com\//.test(p.image)&&Number.isFinite(p.date)&&/buddy martin|franz beard|eddie gilley|loren meadows|carlton reese/i.test(p.author)}).sort(function(a,b){return b.date-a.date});
  var lead=posts.find(function(p){return /buddy martin/i.test(p.author)});
  if(lead&&posts.length>=5){
   var other=posts.filter(function(p){return p.url!==lead.url});
   D={lead:{title:lead.title,excerpt:lead.excerpt,url:lead.url,image:lead.image,author:'Buddy Martin',credit:'',quote:''},toc:other.slice(0,4).map(function(p){return{title:p.title,url:p.url,author:p.author}}),depts:D.depts};
   var byAuthor=function(re){return other.find(function(p){return re.test(p.author)})};
   var franz=byAuthor(/franz beard/i),buddyNext=other.find(function(p){return /buddy martin/i.test(p.author)});
   if(buddyNext)D.depts[0]={tag:"Buddy's Blog",title:buddyNext.title,text:buddyNext.excerpt,url:buddyNext.url};
   if(franz)D.depts[1]={tag:"Franz's Desk",title:franz.title,text:franz.excerpt,url:franz.url};
  }
  mount();
 }).catch(function(){clearTimeout(timer);if(current===generation&&on())mount()});
}
function sync(){if(on()){H.add('gbm-mq');begin();return}started=false;generation++;if(activeController){activeController.abort();activeController=null}H.remove('gbm-magazine-live','gbm-mq');var m=document.getElementById('gbm-magazine-page');if(m)m.remove()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',begin,{once:true});else begin();
window.addEventListener('popstate',sync);window.addEventListener('gbmroutechange',sync);
})();
