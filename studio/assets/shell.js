/* GatorBait Studio — shared shell: nav, footer, data loading helpers.
   Single feed source: reuses newsroom-preview/data + editorial-routing.json
   (the same live Wix Blog RSS pipeline already refreshed every 5 min by
   .github/workflows/refresh-newsroom-feed.yml) instead of a second copy. */
(function(){
'use strict';

var NAV_LINKS=[
  {href:'index.html',label:'News'},
  {href:'pages/recruiting.html',label:'Recruiting'},
  {href:'pages/tv.html',label:'GatorBait TV'},
  {href:'pages/magazine.html',label:'Magazine'},
  {href:'pages/gatorbait-net.html',label:'GatorBait.net'},
  {href:'https://gatorbait2026.itemorder.com/shop/home/',label:'Shop'}
];

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function dateText(iso){ if(!iso) return ''; try{ return new Date(iso).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }catch(e){ return ''; } }
function slugOf(url){ return (url||'').replace(/^https?:\/\/[^/]+/i,'').replace(/^\/post\//,'').replace(/\/+$/,''); }
function articleHref(slug){ return 'pages/article.html?slug='+encodeURIComponent(slug); }

function renderMasthead(active){
  var links=NAV_LINKS.map(function(l){
    var current=l.label.toLowerCase()===active ? ' aria-current="page"' : '';
    return '<a href="'+l.href+'"'+current+'>'+esc(l.label)+'</a>';
  }).join('');
  var html=
  '<a class="gb-skip-link" href="#gb-main">Skip to stories</a>'+
  '<header class="gb-masthead">'+
    '<div class="gb-masthead-bar">'+
      '<a class="gb-logo" href="index.html"><span>GATORBAIT</span></a>'+
      '<nav class="gb-primary-nav" aria-label="Primary">'+links+'</nav>'+
      '<div class="gb-utility-nav">'+
        '<button type="button" aria-label="Search">Search</button>'+
        '<a href="pages/account.html">Saved</a>'+
        '<a class="gb-join-btn" href="pages/join.html">Join</a>'+
        '<button type="button" class="gb-menu-toggle" id="gb-menu-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="gb-drawer">Menu</button>'+
      '</div>'+
    '</div>'+
  '</header>'+
  '<div class="gb-drawer" id="gb-drawer" data-open="false">'+
    '<div class="gb-drawer-scrim" data-drawer-close></div>'+
    '<nav class="gb-drawer-panel" aria-label="Mobile">'+
      '<button type="button" class="gb-drawer-close" data-drawer-close aria-label="Close menu">&times;</button>'+
      links+
      '<a href="pages/account.html">Saved / Watchlist</a>'+
      '<a href="pages/join.html">Join / Account</a>'+
    '</nav>'+
  '</div>';
  document.body.insertAdjacentHTML('afterbegin',html);

  var toggle=document.getElementById('gb-menu-toggle');
  var drawer=document.getElementById('gb-drawer');
  function open(){ drawer.setAttribute('data-open','true'); toggle.setAttribute('aria-expanded','true'); }
  function close(){ drawer.setAttribute('data-open','false'); toggle.setAttribute('aria-expanded','false'); }
  if(toggle) toggle.addEventListener('click',open);
  drawer.querySelectorAll('[data-drawer-close]').forEach(function(el){ el.addEventListener('click',close); });
  drawer.querySelectorAll('a').forEach(function(el){ el.addEventListener('click',close); });
}

function renderFooter(){
  var html=
  '<footer class="gb-footer">'+
    '<div class="gb-footer-grid">'+
      '<div class="gb-footer-brand"><h3>GatorBait Media</h3><p>Florida Gators news, recruiting, GatorBait TV and Magazine coverage since 1998. This preview reads real GatorBait journalism through the same canonical /post/ URLs as production.</p></div>'+
      '<div><h3>Coverage</h3><ul>'+
        '<li><a href="index.html">Front Page</a></li>'+
        '<li><a href="pages/recruiting.html">Recruiting</a></li>'+
        '<li><a href="pages/magazine.html">Magazine</a></li>'+
      '</ul></div>'+
      '<div><h3>Watch / Listen</h3><ul>'+
        '<li><a href="pages/tv.html">GatorBait TV</a></li>'+
        '<li><a href="https://www.youtube.com/@GatorBaitMedia?sub_confirmation=1">YouTube</a></li>'+
      '</ul></div>'+
      '<div><h3>Community</h3><ul>'+
        '<li><a href="pages/gatorbait-net.html">GatorBait.net</a></li>'+
        '<li><a href="pages/join.html">Membership</a></li>'+
      '</ul></div>'+
      '<div><h3>More</h3><ul>'+
        '<li><a href="https://www.facebook.com/gatorbaitmedia">Facebook</a></li>'+
        '<li><a href="https://gatorbait2026.itemorder.com/shop/home/">Shop</a></li>'+
        '<li><a href="mailto:info@gatorbaitmedia.com">Contact</a></li>'+
      '</ul></div>'+
    '</div>'+
    '<div class="gb-footer-bottom">&copy; '+new Date().getFullYear()+' GatorBait Media. Studio preview build — not the production site.</div>'+
  '</footer>';
  document.body.insertAdjacentHTML('beforeend',html);
}

function loadData(dataBase){
  // dataBase: path from the CALLING page to newsroom-preview/, e.g.
  // '../newsroom-preview/' from studio/index.html, '../../newsroom-preview/' from studio/pages/*.html.
  if(!dataBase) throw new Error('GBStudio.loadData requires an explicit dataBase relative to the calling page');
  function fromSnapshot(){
    var snap=window.__GB_STUDIO_SNAPSHOT__;
    if(!snap) throw new Error('live feed unreachable and no offline snapshot loaded');
    return {posts:(snap.posts&&snap.posts.posts)||[],routing:snap.routing||{}};
  }
  return Promise.all([
    fetch(dataBase+'data/posts.json').then(function(r){ if(!r.ok) throw new Error('posts '+r.status); return r.json(); }),
    fetch(dataBase+'editorial-routing.json').then(function(r){ if(!r.ok) throw new Error('routing '+r.status); return r.json(); })
  ]).then(function(res){
    return {posts:res[0].posts||[],routing:res[1]||{}};
  }).catch(function(err){
    console.warn('GBStudio.loadData: live fetch failed, using offline snapshot —',err.message);
    return fromSnapshot();
  }).then(function(d){
    d.posts.forEach(function(p){ p.slug=slugOf(p.url); });
    return d;
  });
}

function findPost(posts,slug){
  for(var i=0;i<posts.length;i++){ if(posts[i].slug===slug) return posts[i]; }
  return null;
}

window.GBStudio={
  esc:esc, dateText:dateText, slugOf:slugOf, articleHref:articleHref,
  renderMasthead:renderMasthead, renderFooter:renderFooter,
  loadData:loadData, findPost:findPost
};
})();
