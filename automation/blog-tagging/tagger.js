async () => {
const OFFSET=0, LIMIT=35, APPLY=true;
const ROSTER=["Aaron Chiles", "Aaron Philo", "Aaron Williams", "Ace Ciongoli", "Aidan Warner", "Alec Clark", "Alfonzo Allen Jr.", "Amir Jackson", "Anthony Rubio", "Bailey Stockton", "Ben Hanks III", "Brandon Rabasco", "Brayden Slade", "Brendan Bett", "Brian Case", "Bryce Lovett", "Bryce Thornton", "Byron Louis", "CJ Bronaugh", "CJ Hester", "Caden Jones", "Cam Dooley", "Carter Milliron", "Chancellor Campbell", "Charles Emanuel III", "Corey Brown", "Cormani McClain", "DJ Coleman", "DK Kalu", "Dallas Wilson", "Daniel Pierre Louis", "Davian Groce", "Desmond Green", "Dijon Johnson", "Drake Stubbs", "Duke Clark", "Dylan Leighton", "Dylan Purter", "Eagan Boyer", "Elijah Owens", "Emeka Ugorji", "Emmanuel Oyebadejo", "Eric Parks", "Eric Singleton Jr.", "Erich Seager", "Evan Chieca", "Evan Pryor", "Fletcher Westphal", "G'Nivre Carr", "Harrison Moore", "Heze Kent", "Hunter Solwold", "J'Vari Flowers", "JaReylan McCoy", "Jadan Baugh", "Jaden Edgecombe", "Jaden Robinson", "Jahari Medlock", "Jalen Wiggins", "Jamari Lyons", "Jason Zandamela", "Javarii Luckas", "Javier Jones", "Javion Toombs", "Jayden Gross", "Jayden Woods", "Jaylen Jordon", "Jaylen Lloyd", "Jeramiah McCloud", "Jordy Lowery", "Joseph Mbatchou", "Justin Williams", "KJ Ford", "Kahleil Jackson", "Kaiden Hall", "Kamran James", "Kanye Clark", "Kelvin Jimenez", "Kendall Guervil", "Knijeah Harris", "Kofi Asare", "LJ McCray", "Lacota Dippre", "Lagonza Hayward", "Liam Padron", "Lincoln Anderson", "London Montgomery", "Luke Harpring", "Malik Morris", "Mark Faircloth", "Marquez Daniel", "Mason Clinton", "Mason Jordan", "Matthew Kade", "Micah Jones", "Micah Mays Jr.", "Miller Fealy", "Myles Graham", "Myles Johnson", "Nicholas Inglis", "Onis Konanbanny", "Patrick Durkin", "Roderick Kearney", "Sebastian Scott", "Stive-Bentley Keumajou-Yondui", "TJ Abrams", "TJ Bullard", "TJ Dice Jr.", "TJ Shanahan Jr.", "Titus Bullard", "Tramell Jones Jr.", "Tripp Brown Jr.", "Ty Jackson", "Tyler Chukuyem", "Vernell Brown III", "Vincent Brown Jr.", "Will Griffin"];
const PEOPLE=["Jon Sumrall","Todd Golden","Scott Stricklin","Steve Spurrier","Kevin O'Sullivan","Tim Tebow","Danny Wuerffel","Emmitt Smith","Urban Meyer"];
const OPP=["Ole Miss","Missouri","Auburn","LSU","Georgia","Tennessee","Kentucky","Florida State","Texas A&M","Texas","Alabama","South Carolina","Arkansas","Mississippi State","Vanderbilt","Oklahoma"];
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const base=n=>n.replace(/\s+(Jr\.|III|II|IV)$/,'');
const reName=n=>new RegExp('(^|[^A-Za-z])'+esc(base(n)).replace(/'/g,"['’]")+'(?![A-Za-z])');
const text=nodes=>{let o=[];const w=a=>(a||[]).forEach(n=>{if(n.textData&&n.textData.text)o.push(n.textData.text);w(n.nodes);});w(nodes);return o.join(' ');};
const R=(method,url,body)=>wix.request({scope:"site",method,url,body}).then(r=>r.data||r);
// posts (newest first), season only
let posts=[],cursor=null;
for(let k=0;k<3;k++){const q=cursor?{query:{cursorPaging:{cursor,limit:100}},fieldsets:['RICH_CONTENT']}:{query:{filter:{firstPublishedDate:{$gte:'2026-10-01T12:17:55Z'}},paging:{limit:100}},fieldsets:['RICH_CONTENT']};
 const d=await R('POST','https://www.wixapis.com/blog/v3/posts/query',q);posts=posts.concat(d.posts||[]);cursor=d.pagingMetadata&&d.pagingMetadata.cursors&&d.pagingMetadata.cursors.next;if(!cursor||!(d.posts||[]).length)break;}
posts=posts.slice(OFFSET,OFFSET+LIMIT);
let tags=[];for(let k=0;k<6;k++){const d=await R('POST','https://www.wixapis.com/blog/v3/tags/query',{query:{paging:{limit:100,offset:k*100}}});tags=tags.concat(d.tags||[]);if(!(d.pagingMetadata||{}).hasNext)break;}
const byLabel={};tags.forEach(t=>{const k=t.label.toLowerCase();if(!byLabel[k]||t.postCount>byLabel[k].postCount)byLabel[k]=t;});
const byId={};tags.forEach(t=>byId[t.id]=t.label);
async function tagId(label){const k=label.toLowerCase();if(byLabel[k])return byLabel[k].id;
 if(!APPLY)return 'NEW:'+label;
 try{const d=await R('POST','https://www.wixapis.com/blog/v3/tags',{label});byLabel[k]=d.tag;return d.tag.id;}
 catch(e){const d=await R('POST','https://www.wixapis.com/blog/v3/tags/query',{query:{filter:{label:{$eq:label}}}});const t=(d.tags||[])[0];if(t){byLabel[k]=t;return t.id;}throw e;}}
const log=[];
for(const p of posts){
 const body=text((p.richContent||{}).nodes),all=p.title+' \n '+body,head=p.title+' '+body.slice(0,700);
 const hoops=/basketball|hoops|todd golden|aberdeen|final four|ncaa tournament/i.test(p.title+' '+body.slice(0,400));
 const want=[],players=[];
 ROSTER.forEach(n=>{if(reName(n).test(all))players.push(n);});
 PEOPLE.forEach(n=>{if(reName(n).test(all))want.push(n);});
 OPP.forEach(o=>{const re=o==='Texas'?/(^|[^A-Za-z])Texas(?! A&M)(?![A-Za-z])/:new RegExp('(^|[^A-Za-z])'+esc(o)+'(?![A-Za-z])');if(re.test(head))want.push(o);});
 if(!hoops&&(players.length||/sumrall|football|touchdown|quarterback|kickoff/i.test(head)))want.push('Florida Gators Football');
 players.forEach(n=>want.push(n));
 const have=(p.tagIds||[]).map(i=>(byId[i]||'').toLowerCase());
 const add=[...new Set(want)].filter(l=>!have.includes(l.toLowerCase())).slice(0,Math.max(0,Math.min(30-(p.tagIds||[]).length,15)));
 if(!add.length){log.push({t:p.title.slice(0,40),skip:'nothing new'});continue;}
 const dr=await R('GET','https://www.wixapis.com/blog/v3/draft-posts/'+p.id);
 const draft=dr.draftPost||{};
 if(draft.hasUnpublishedChanges){log.push({t:p.title.slice(0,40),skip:'unpublished edits in progress',add});continue;}
 const ids=[];for(const l of add)ids.push(await tagId(l));
 const tagIds=[...new Set([...(draft.tagIds||p.tagIds||[]),...ids])].slice(0,30);
 if(APPLY){await R('PATCH','https://www.wixapis.com/blog/v3/draft-posts/'+p.id,{draftPost:{id:p.id,tagIds},action:'UPDATE_PUBLISH'});}
 log.push({t:p.title.slice(0,40),added:add.length,total:tagIds.length});
}
return {apply:APPLY,offset:OFFSET,count:posts.length,log};
}
