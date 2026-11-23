/* GBM_BOOK_SUMRALL_V1 free ebook signup and download. Runs only when the address carries ?book=sumrall-year-one. Reuses the GatorBait Email List form (6babfee8) and its consent text. */
(function(){
var KEY='sumrall-year-one',ID='gbm-book';
var PDF='https://18fb3a4e-d7f6-414a-aeb9-3047db3ea115.usrfiles.com/ugd/d3cfa5_6dd223d6392246348d9c55c433359096.pdf';
var COVER='https://static.wixstatic.com/media/d3cfa5_ce973aad32e542d485fb6ce432a8f773~mv2.jpg/v1/fit/w_720,h_1080,q_85/sumrall-year-one-cover.jpg';
var API='https://www.wixapis.com',CLIENT='1565816d-bbbc-45c1-b82a-31f10d3e2c71',FORM='6babfee8-147f-428a-9e14-6b72f6225835';
function want(){try{return new URLSearchParams(location.search).get('book')===KEY}catch(e){return false}}
function got(){try{return !!localStorage.getItem('gbm-book-'+KEY)}catch(e){return false}}
function mark(){try{localStorage.setItem('gbm-book-'+KEY,String(Date.now()));localStorage.setItem('gbm-capture-joined',String(Date.now()))}catch(e){}}
function track(o){try{(window.dataLayer=window.dataLayer||[]).push({event:'gbm_capture',gbm_capture_source:'ebook-'+KEY,gbm_capture_outcome:o})}catch(e){}}
var CSS='#gbm-book{position:fixed;inset:0;z-index:2147483000;background:#061444;color:#fff;overflow:auto;-webkit-overflow-scrolling:touch;font-family:Barlow,Arial,Helvetica,sans-serif}'
+'#gbm-book *{box-sizing:border-box}#gbm-book .w{max-width:980px;margin:0 auto;padding:18px 16px 56px}'
+'#gbm-book .top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:0 60px 14px 0;border-bottom:1px solid rgba(255,255,255,.22)}'
+'#gbm-book .top a{color:#fff;font-weight:700;font-size:15px;text-decoration:none;min-height:44px;display:inline-flex;align-items:center}'
+'#gbm-book .mark{font-weight:800;font-size:22px;letter-spacing:.5px}#gbm-book .mark b{color:#FA4616}'
+'#gbm-book .g{display:grid;grid-template-columns:1fr;gap:22px;margin-top:22px}'
+'@media(min-width:820px){#gbm-book .g{grid-template-columns:340px 1fr;gap:44px;align-items:start}}'
+'#gbm-book .cv{display:block;width:100%;max-width:190px;height:auto;margin:0 auto;box-shadow:0 14px 40px rgba(0,0,0,.5)}'
+'@media(min-width:820px){#gbm-book .cv{max-width:340px}}'
+'#gbm-book .ey{color:#FF8A5C;font-weight:800;font-size:13px;letter-spacing:1.6px;margin:0 0 8px}'
+'#gbm-book h1{font-size:40px;line-height:1.02;font-weight:800;margin:0 0 12px;color:#fff}'
+'@media(min-width:820px){#gbm-book h1{font-size:56px}}'
+'#gbm-book p{font-size:18px;line-height:1.5;margin:0 0 14px;color:#fff}#gbm-book .sm{font-size:15px;color:#D5DCEC}'
+'#gbm-book .card{background:#fff;color:#061444;padding:18px;margin-top:18px;border-top:4px solid #FA4616}'
+'#gbm-book .card h2{font-size:22px;line-height:1.2;font-weight:800;margin:0 0 6px;color:#061444}'
+'#gbm-book .card p,#gbm-book .card label{color:#27364F;font-size:16px;line-height:1.45}'
+'#gbm-book input[type=email]{width:100%;height:50px;border:2px solid #061444;padding:0 12px;font:inherit;font-size:17px;color:#061444;background:#fff;margin:6px 0 12px;border-radius:0}'
+'#gbm-book .ck{display:flex;gap:10px;align-items:flex-start;margin:0 0 14px;cursor:pointer}'
+'#gbm-book .ck input{width:22px;height:22px;margin:2px 0 0;flex:0 0 22px}'
+'#gbm-book .btn{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:52px;background:#FA4616;color:#fff;border:0;font:inherit;font-size:17px;font-weight:800;letter-spacing:.6px;text-decoration:none;cursor:pointer;padding:0 18px}'
+'#gbm-book .btn[disabled]{opacity:.6}#gbm-book .msg{min-height:22px;margin:10px 0 0;font-weight:700;font-size:15px;color:#B3261E}'
+'#gbm-book .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}'
+'#gbm-book .card a.lk{color:#061444;font-weight:700}#gbm-book :focus-visible{outline:3px solid #FF8A5C;outline-offset:2px}';
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function formHtml(){return '<h2>Get the free book</h2><p>Enter your email and the book opens right here. No charge.</p>'
+'<form novalidate><label for="gbm-book-em"><b>Email address</b></label><input id="gbm-book-em" type="email" name="email" autocomplete="email" inputmode="email" required>'
+'<label class="ck"><input type="checkbox" name="consent" value="yes"><span>Yes, email me GatorBait Magazine and GatorBait Media news about the Florida Gators. I can unsubscribe anytime.</span></label>'
+'<div class="hp" aria-hidden="true"><label>Company<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>'
+'<button class="btn" type="submit">GET THE FREE BOOK</button><p class="msg" role="alert"></p>'
+'<p class="sm" style="color:#5F6B7A;margin:8px 0 0">We&rsquo;ll email you a link to confirm. <a class="lk" href="/policies">Privacy policy</a></p></form>'}
function doneHtml(fresh){return '<h2>'+(fresh?'You&rsquo;re in. Here&rsquo;s your book.':'Welcome back. Here&rsquo;s your book.')+'</h2>'
+(fresh?'<p>Check your inbox for a link from GatorBait to confirm your emails.</p>':'')
+'<a class="btn" href="'+PDF+'" target="_blank" rel="noopener">OPEN THE BOOK (PDF, 27 PAGES, 5.6 MB)</a>'
+'<p class="sm" style="color:#5F6B7A;margin:10px 0 0">It opens in a new tab. Save it from there to keep it.</p>'}
function token(){var t=null;try{t=JSON.parse(sessionStorage.getItem('gbm-book-tok')||'null')}catch(e){}
if(t&&t.x>Date.now())return Promise.resolve(t.a);
return fetch(API+'/oauth2/token',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({clientId:CLIENT,grantType:'anonymous'})}).then(function(r){if(!r.ok)throw new Error('token');return r.json()}).then(function(j){try{sessionStorage.setItem('gbm-book-tok',JSON.stringify({a:j.access_token,x:Date.now()+3.5*36e5}))}catch(e){}return j.access_token})}
function send(email){return token().then(function(a){return fetch(API+'/form-submission-service/v4/submissions',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json',Authorization:a},body:JSON.stringify({submission:{formId:FORM,submissions:{email_gatorbait:email,subscribe_gatorbait:true}}})})}).then(function(r){if(!r.ok)throw new Error('submit');return true})}
function wire(card){var f=card.querySelector('form');if(!f)return;var msg=f.querySelector('.msg'),btn=f.querySelector('button');
f.addEventListener('submit',function(ev){ev.preventDefault();msg.textContent='';
if(f.company.value){card.innerHTML=doneHtml(true);return}
var em=(f.email.value||'').trim();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){msg.textContent='Enter a valid email address.';f.email.focus();return}
if(!f.consent.checked){msg.textContent='Check the box to say yes to GatorBait emails.';f.consent.focus();return}
btn.disabled=true;btn.textContent='ONE MOMENT...';
send(em).then(function(){mark();track('submitted');card.innerHTML=doneHtml(true);var b=card.querySelector('.btn');if(b)b.focus()},function(){track('failed');btn.disabled=false;btn.textContent='GET THE FREE BOOK';msg.textContent='That didn’t go through. Try again in a minute.'})})}
function open(){if(document.getElementById(ID)||!document.body)return;
if(!document.getElementById(ID+'-css')){var st=document.createElement('style');st.id=ID+'-css';st.textContent=CSS;document.head.appendChild(st)}
var d=document.createElement('div');d.id=ID;d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Jon Sumrall: Year One, free ebook');
d.innerHTML='<div class="w"><div class="top"><span class="mark">GATOR<b>BAIT</b></span><a href="/">GatorBait Media home &rarr;</a></div><div class="g">'
+'<img class="cv" src="'+COVER+'" width="720" height="1080" alt="Cover of the GatorBait Media book Sumrall: Year One, showing a coach in a gray pullover and cap pointing during a Florida practice. Cover photo by Chris Spears.">'
+'<div><p class="ey">FREE EBOOK &middot; 2026 RIVALRY-WEEK EDITION</p><h1>Jon Sumrall: Year One</h1>'
+'<p>Jon Sumrall&rsquo;s first season at Florida, as it unfolded in the pages of GatorBait Media. This edition runs from fall camp through the win over Vanderbilt. Florida State is next.</p>'
+'<p class="sm">27 pages. Stories, photographs and voices from GatorBait&rsquo;s writers. Free to read and keep.</p>'
+'<div class="card">'+(got()?doneHtml(false):formHtml())+'</div></div></div></div>';
document.body.appendChild(d);document.documentElement.style.overflow='hidden';wire(d.querySelector('.card'));track('shown')}
function shut(){var d=document.getElementById(ID);if(d){d.parentNode.removeChild(d);document.documentElement.style.overflow=''}}
function sync(){if(want())open();else shut()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
window.addEventListener('popstate',sync);window.addEventListener('gbmroutechange',sync);setInterval(sync,1500);
})();
